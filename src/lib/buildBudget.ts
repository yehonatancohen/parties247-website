/**
 * Caps backend waits during `next build` only.
 *
 * Static generation gives each page 60s, and the Render backend sometimes answers
 * far slower than that (measured 2026-09-16: /api/parties 80s, /api/carousels 21s),
 * which failed the whole Vercel build. During the build, a slow fetch rejects after
 * the budget so the page's own error handling renders its empty state; ISR then
 * regenerates it with real data on the first requests after deploy.
 *
 * At runtime nothing changes: the promise is returned as-is, so a slow backend
 * never replaces a good cached page with an empty one.
 */
// Leaves headroom under Next's 60s-per-page limit while waiting out most slow spells.
export const BUILD_FETCH_BUDGET_MS = 40_000;

export const isBuildPhase = () => process.env.NEXT_PHASE === 'phase-production-build';


/**
 * Runtime cap for backend reads. On 2026-09-17 the backend stopped answering
 * entirely and on-demand pages (/all-parties, first visits to city pages) sat on
 * the fetch until Vercel's 300s function timeout. A cached Data Cache entry
 * returns immediately and never hits this; only a truly cold, hung fetch does,
 * and then the page fails fast (ISR keeps serving its last good copy) while the
 * original fetch keeps running and fills the cache if the backend recovers.
 */
export const RUNTIME_FETCH_BUDGET_MS = 12_000;

export function withFetchBudget<T>(promise: Promise<T>, label: string): Promise<T> {
  const ms = isBuildPhase() ? BUILD_FETCH_BUDGET_MS : RUNTIME_FETCH_BUDGET_MS;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} exceeded ${ms}ms`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}


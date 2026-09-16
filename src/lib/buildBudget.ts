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

export function withBuildBudget<T>(promise: Promise<T>, label: string, ms = BUILD_FETCH_BUDGET_MS): Promise<T> {
  if (!isBuildPhase()) return promise;
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} exceeded the ${ms}ms build budget`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

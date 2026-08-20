import { NextRequest, NextResponse } from 'next/server';
import { getCache } from '@vercel/functions';

const API_URL = (process.env.NEXT_PUBLIC_API_URL || 'https://parties247-backend.onrender.com/').replace(/\/$/, '');

// Keeps exactly one canonical, indexed URL per event: /event/[slug] while
// upcoming, /archive/[slug] once its date has passed — in either direction.
//
// This lives in middleware (NextResponse.redirect) rather than
// redirect()/permanentRedirect() inside the page components, because that
// App Router API does not produce a real HTTP redirect on this project's
// Next.js version (16.1.1): reproduced with a minimal isolated test page,
// in both `next dev` and a production `next start` build — the thrown
// NEXT_REDIRECT signal leaks into the rendered HTML instead of becoming a
// 3xx response. Middleware's redirect mechanism is unaffected.
export async function proxy(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/(event|archive)\/([^/]+)\/?$/);
  if (!match) return NextResponse.next();

  const [, section, slug] = match;

  try {
    const res = await fetchEventCached(slug);

    if (!res.ok) {
      // The party for this slug may have been deleted as a duplicate (see
      // goout-scraper's dedupe_parties.py) and merged into a surviving
      // party under a different slug. Check for a recorded redirect before
      // falling through to a 404, so the old URL's SEO/traffic signal isn't
      // just lost.
      if (res.status === 404) {
        const redirected = await tryRedirectSlug(section, slug, request);
        if (redirected) return redirected;
      }
      return NextResponse.next();
    }

    const isPast = res.data?.event?.status === 'past';

    if (section === 'event' && isPast) {
      return NextResponse.redirect(new URL(`/archive/${slug}`, request.url), 308);
    }
    if (section === 'archive' && !isPast) {
      return NextResponse.redirect(new URL(`/event/${slug}`, request.url), 308);
    }
  } catch {
    // On any error, fall through to normal rendering — the page component's
    // own not-found handling is the fallback of last resort.
  }

  return NextResponse.next();
}

async function tryRedirectSlug(
  section: string,
  slug: string,
  request: NextRequest
): Promise<NextResponse | null> {
  try {
    const res = await fetchJsonCached(`${API_URL}/api/redirects/${slug}`, `redirect:${slug}`);
    if (!res.ok) return null;

    const toSlug = res.data?.toSlug;
    if (!toSlug || toSlug === slug) return null;

    return NextResponse.redirect(new URL(`/${section}/${toSlug}`, request.url), 308);
  } catch {
    return null;
  }
}

type EventPayload = { event?: { status?: string } };
type RedirectPayload = { toSlug?: string };
type CachedResponse<T = EventPayload & RedirectPayload> = {
  ok: boolean;
  status: number;
  data: T | null;
};

// The `next: { revalidate }` fetch option does NOT work in middleware — the
// Next.js Data Cache isn't available in this runtime, so every request paid a
// full uncached round-trip to the backend. That backend has a flat ~5s latency
// floor on every endpoint regardless of payload size, and because middleware
// runs ahead of the CDN/ISR layer it put those 5 seconds in front of every
// /event/* and /archive/* page view, cached page or not. Measured 2026-08-20:
// 5.41s TTFB on a slug that takes this path vs 0.68s on one that hits the same
// middleware but skips the fetch.
//
// Vercel's Runtime Cache is available in Routing Middleware, so use it
// explicitly. TTL matches the 60s the original `revalidate` asked for, so
// redirect freshness is unchanged. Any failure of the cache itself falls back
// to a direct fetch — worst case is the old behaviour, never worse.
async function fetchJsonCached(url: string, key: string): Promise<CachedResponse> {
  const cacheKey = `proxy:${key}`;

  try {
    const cached = (await getCache().get(cacheKey)) as CachedResponse | undefined;
    if (cached) return cached;
  } catch {
    // Cache unavailable — fall through and fetch directly.
  }

  const res = await fetch(url);
  const result: CachedResponse = {
    ok: res.ok,
    status: res.status,
    data: res.ok ? await res.json().catch(() => null) : null,
  };

  try {
    await getCache().set(cacheKey, result, { ttl: 60, tags: ['proxy-events'] });
  } catch {
    // Best-effort — a failed write just means the next request refetches.
  }

  return result;
}

function fetchEventCached(slug: string): Promise<CachedResponse> {
  return fetchJsonCached(`${API_URL}/api/events/${slug}`, `event:${slug}`);
}

export const config = {
  matcher: ['/event/:slug*', '/archive/:slug*'],
};

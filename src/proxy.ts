import { NextRequest, NextResponse } from 'next/server';

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
    const res = await fetch(`${API_URL}/api/events/${slug}`, {
      next: { revalidate: 60 },
    });

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

    const data = await res.json();
    const isPast = data?.event?.status === 'past';

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
    const res = await fetch(`${API_URL}/api/redirects/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;

    const data = await res.json();
    const toSlug = data?.toSlug;
    if (!toSlug || toSlug === slug) return null;

    return NextResponse.redirect(new URL(`/${section}/${toSlug}`, request.url), 308);
  } catch {
    return null;
  }
}

export const config = {
  matcher: ['/event/:slug*', '/archive/:slug*'],
};

import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ path: string[] }>;
};

const SITE_NAME = "Parties 24/7";
const DEFAULT_TITLE = "כרטיסים למסיבות ופסטיבלים";
const DEFAULT_DESCRIPTION = "פורטל המסיבות והבילויים הגדול בישראל. הזמנת כרטיסים לאירועים הכי שווים.";

// process.env.API_URL doesn't exist anywhere else in this app (every other caller uses
// NEXT_PUBLIC_API_URL, see src/services/api.ts) — it was always undefined here, so every
// hit to this catch-all (any URL that doesn't match a real route, e.g. a stale/incorrect
// link) fetched the literal string "undefined/page?path=...", which throws before res.ok
// can even be checked. That uncaught throw in the page component (not just generateMetadata,
// which already had a try/catch) is what surfaced as "Application error: a server-side
// exception has occurred" instead of a normal 404.
const API_BASE = (process.env.NEXT_PUBLIC_API_URL || 'https://parties247-backend.onrender.com/').replace(/\/$/, '');

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = ((await params).path ?? []).join('/');

  try {
    const res = await fetch(
      `${API_BASE}/page?path=${slug}`,
      { cache: 'no-store' }
    );

    if (!res.ok) {
      return {
        title: `${DEFAULT_TITLE} | ${SITE_NAME}`,
        description: DEFAULT_DESCRIPTION,
      };
    }

    const data = await res.json();

    const pageTitle = data.h1 ? `${data.h1} | ${SITE_NAME}` : `${DEFAULT_TITLE} | ${SITE_NAME}`;
    const pageDescription = DEFAULT_DESCRIPTION;

    return {
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `https://www.parties247.co.il/${slug}`,
        siteName: SITE_NAME,
        locale: 'he_IL',
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: `${DEFAULT_TITLE} | ${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
    };
  }
}

export default async function Page({ params }: Props) {
  const slug = ((await params).path ?? []).join('/');

  // Never let a fetch/network/shape error here throw uncaught — this route catches
  // every unmatched URL on the site, so a raw exception means any dead or malformed
  // link renders the generic Next.js error page instead of a normal 404.
  let data: { h1?: string; html?: string } | null = null;
  try {
    const res = await fetch(
      `${API_BASE}/page?path=${slug}`,
      { cache: 'no-store' }
    );
    if (res.ok) {
      data = await res.json();
    }
  } catch (error) {
    console.error(`[catch-all] Failed to fetch page for path "${slug}":`, error);
  }

  if (!data) notFound();

  return (
    <main>
      <h1>{data.h1}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.html ?? '' }} />
    </main>
  );
}
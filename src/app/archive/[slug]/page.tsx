import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import Image from "next/image";
import RelatedPartyCard from "@/components/RelatedPartyCard";
import { notFound } from "next/navigation";
import { getPartyBySlug, getAllPartiesIncludingPast } from "@/services/api";
import { Party } from "@/data/types";
import { BRAND_LOGO_URL, BASE_URL } from "@/data/constants";
import { CalendarIcon, LocationIcon } from "@/components/Icons";
import FlyerToRelatedLink from "@/components/FlyerToRelatedLink";
import { toIsraelISO } from "@/lib/dates";

export const revalidate = 3600;

// Same non-interactive-div dead-click pattern already fixed on the live event page
// (Quick Info Strip + Event Details location blocks) — Clarity session recording
// (2026-08-15, archive/after-glow-bayz-rooftop) showed 5 dead clicks + 3 rage clicks
// on the venue-name text here. Reuses the event page's Maps-search-URL approach.
function buildGoogleMapsUrl(party: Party): string {
  const query = party.location.address || party.location.name;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

const CITY_SLUG_MAP: Record<string, string> = {
  'תל אביב': 'tel-aviv', 'תל-אביב': 'tel-aviv',
  'חיפה': 'haifa', 'ירושלים': 'jerusalem',
  'אילת': 'eilat', 'באר שבע': 'beer-sheva',
  'הרצליה': 'herzliya', 'נתניה': 'netanya',
  'ראשון לציון': 'rishon-lezion',
};
const MUSIC_GENRE_SLUG_MAP: Record<string, string> = {
  'טכנו': 'techno-music', 'טראנס': 'trance-music',
  'האוס': 'house-music', 'מיינסטרים': 'mainstream-music',
};

async function fetchArchivedPartyData(slug: string) {
  try {
    const [party, allParties] = await Promise.all([
      getPartyBySlug(slug).catch(() => null),
      getAllPartiesIncludingPast().catch(() => []),
    ]);

    if (!party) return null;

    // Upcoming events at the same venue or with a shared tag/genre — the
    // whole point of an archive page is to route residual interest forward.
    const upcomingRelated = allParties.filter((p: Party) => {
      if (p.id === party.id) return false;
      if (new Date(p.date).getTime() < Date.now()) return false;
      const inSameCity = p.location.name === party.location.name;
      const hasSharedTag = p.tags.some(tag => party.tags.includes(tag));
      return inSameCity || hasSharedTag;
    }).slice(0, 4);

    return { party, upcomingRelated };
  } catch (error) {
    console.error("Failed to load archived party", error);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchArchivedPartyData(slug);

  if (!data?.party) return { title: "אירוע לא נמצא" };
  const { party } = data;
  const ogImage = party.imageUrl || BRAND_LOGO_URL;
  const plainDescription = party.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const eventDate = new Date(party.date);
  const heDate = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jerusalem' }).format(eventDate);
  const heCity = party.location.name;
  const titleStr = `${party.name} - ${heCity}, ${heDate} | ארכיון מסיבות`;
  const descStr = (plainDescription.substring(0, 140) || `${party.name} ב${heCity}`) + ` — סיכום האירוע שהתקיים ב-${heDate}.`;

  return {
    title: titleStr,
    description: descStr,
    alternates: {
      canonical: `/archive/${party.slug}`,
      languages: { 'he-IL': `/archive/${party.slug}` },
    },
    openGraph: {
      title: party.name,
      description: plainDescription.substring(0, 300),
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [{ url: BRAND_LOGO_URL }],
      type: "website",
      locale: "he_IL",
    },
  };
}

export default async function ArchivedEventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await fetchArchivedPartyData(slug);

  if (!data || !data.party) {
    notFound();
  }

  const { party, upcomingRelated } = data;

  // The reverse redirect (an /archive URL for a still-upcoming event, back
  // to /event) is handled in middleware.ts — see the note in
  // app/event/[slug]/page.tsx for why this can't be done here.

  const partyDate = new Date(party.date);
  const formattedDate = new Intl.DateTimeFormat('he-IL', { dateStyle: 'full', timeZone: 'UTC' }).format(partyDate);
  const formattedTime = new Intl.DateTimeFormat('he-IL', { timeStyle: 'short', timeZone: 'UTC' }).format(partyDate);

  const plainDescriptionForLd = party.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  // Standard Event schema with the real (past) date — schema.org has no
  // "EventCompleted" status, and Google's own guidance is that rich results
  // are dropped for past events based on the date field alone, not a status
  // value. No `offers` block: nothing is purchasable for a concluded event.
  const eventJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    'name': party.name,
    'startDate': toIsraelISO(party.date),
    'eventStatus': `https://schema.org/${party.eventStatus ?? 'EventScheduled'}`,
    'eventAttendanceMode': `https://schema.org/${party.eventAttendanceMode ?? 'OfflineEventAttendanceMode'}`,
    'location': {
      '@type': 'Place',
      'name': party.location.name,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': party.location.address || party.location.name,
        ...(party.region && party.region !== 'לא ידוע' ? { 'addressRegion': party.region } : {}),
        'addressCountry': 'IL',
      },
      ...(party.location.geo ? {
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': party.location.geo.latitude,
          'longitude': party.location.geo.longitude,
        },
      } : {}),
    },
    'image': [party.imageUrl].filter(Boolean),
    'description': plainDescriptionForLd.substring(0, 500),
    'organizer': party.organizer
      ? { '@type': 'Organization', 'name': party.organizer.name, ...(party.organizer.url ? { 'url': party.organizer.url } : {}) }
      : { '@type': 'Organization', 'name': 'Parties 24/7', 'url': BASE_URL },
  };
  if (party.performer?.name) {
    eventJsonLd['performer'] = { '@type': 'PerformingGroup', 'name': party.performer.name };
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'בית', 'item': { '@type': 'Thing', '@id': BASE_URL, 'name': 'בית' } },
      { '@type': 'ListItem', 'position': 2, 'name': 'ארכיון מסיבות', 'item': { '@type': 'Thing', '@id': `${BASE_URL}/archive`, 'name': 'ארכיון מסיבות' } },
      { '@type': 'ListItem', 'position': 3, 'name': party.name },
    ],
  };

  const citySlug = CITY_SLUG_MAP[party.location.name] || null;
  const genreSlug = MUSIC_GENRE_SLUG_MAP[party.musicType] || null;

  return (
    <div className="font-apple min-h-screen overflow-x-hidden bg-stage pb-24 text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="mx-auto max-w-[860px] px-4 pb-8 pt-6 sm:px-6 sm:pt-10">
        <div className="mb-5">
          <Link
            className="inline-flex items-center gap-1 text-[15px] text-link hover:underline underline-offset-4"
            href="/archive"
          >
            לארכיון המסיבות <svg viewBox="0 0 24 24" className="h-[0.8em] w-[0.8em]" fill="none" stroke="currentColor" strokeWidth={2.6} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" /></svg>
          </Link>
        </div>

        {upcomingRelated.length > 0 ? (
          <FlyerToRelatedLink
            ariaLabel={`מסיבות קרובות שדומות ל${party.name}`}
            targetId="upcoming-related"
            className="block rounded-[22px] overflow-hidden border border-hairline mb-8 relative transition-transform duration-300 active:scale-[0.98]"
          >
            <Image
              src={party.imageUrl}
              alt={party.name}
              title={party.name}
              className="w-full h-auto object-contain bg-black opacity-80"
              width={800}
              height={1000}
              priority
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </FlyerToRelatedLink>
        ) : (
          <div className="block rounded-[22px] overflow-hidden border border-hairline mb-8 relative">
            <Image
              src={party.imageUrl}
              alt={party.name}
              title={party.name}
              className="w-full h-auto object-contain bg-black opacity-80"
              width={800}
              height={1000}
              priority
              sizes="(max-width: 768px) 100vw, 720px"
            />
          </div>
        )}

        <div className="mb-8">
          <span className="mb-3 inline-block rounded-full border border-hairline px-3 py-1 text-[13px] text-ink-3">
            אירוע שהתקיים
          </span>
          <h1 className="mb-3 text-balance text-[34px] font-bold leading-[1.1] sm:text-[48px]" dir="auto">
            {party.name}
          </h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-6" dir="rtl">
          <div className="flex items-center gap-2 rounded-full bg-tile px-4 py-2.5 text-[15px]">
            <CalendarIcon className="h-4 w-4 flex-shrink-0 text-action" />
            <span className="text-ink font-semibold">{formattedDate}</span>
            <span className="text-ink-3">·</span>
            <span className="text-ink-3">{formattedTime}</span>
          </div>
          <a
            href={buildGoogleMapsUrl(party)}
            target="_blank"
            rel="noopener noreferrer"
            title="פתחו במפות Google"
            className="flex items-center gap-2 rounded-full bg-tile px-4 py-2.5 text-[15px] transition-colors hover:bg-tile-hover"
          >
            <LocationIcon className="h-4 w-4 flex-shrink-0 text-action" />
            <span className="text-ink font-semibold">{party.location.name}</span>
          </a>
        </div>

        {party.description && (
          <div className="mb-4 rounded-[28px] bg-tile p-6 sm:p-8">
            <h2 className="text-[19px] font-bold text-ink mb-4">על האירוע</h2>
            <div
              className="text-ink-2 leading-relaxed [&_h2]:text-ink [&_h2]:font-bold [&_h2]:text-[21px] [&_h2]:tracking-tight [&_h2]:mb-3 [&_h2]:mt-6 [&_h2:first-child]:mt-0 [&_h3]:text-ink [&_h3]:font-bold [&_h3]:text-[19px] [&_h3]:tracking-tight [&_h3]:mb-2 [&_h3]:mt-4 [&_h3:first-child]:mt-0 [&_p]:mb-3 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: party.description }}
            />
          </div>
        )}

        {(citySlug || genreSlug) && (
          <div className="mb-8 rounded-[28px] bg-tile p-6 sm:p-8">
            <h2 className="text-[19px] font-bold text-ink mb-4">מחפשים את המסיבה הבאה?</h2>
            <div className="flex flex-wrap gap-3">
              {citySlug && (
                <Link
                  href={`/cities/${citySlug}`}
                  className="inline-flex items-center gap-1 rounded-full bg-action px-4 py-2 text-[15px] font-medium text-on-action transition-colors hover:bg-action-hover"
                >
                  מסיבות קרובות ב{party.location.name}
                </Link>
              )}
              {genreSlug && (
                <Link
                  href={`/genre/${genreSlug}`}
                  className="inline-flex items-center gap-1 rounded-full border border-hairline px-4 py-2 text-[15px] text-ink transition-colors hover:bg-tile-hover"
                >
                  מסיבות {party.musicType} קרובות
                </Link>
              )}
            </div>
          </div>
        )}

        {upcomingRelated.length > 0 && (
          <div className="mb-8" id="upcoming-related">
            <h2 className="mb-2 text-center text-[28px] font-bold sm:text-[36px]">מסיבות קרובות שאולי תאהבו</h2>
            <p className="text-ink-3 text-sm text-center mb-6">אירועים דומים שעדיין ניתן לקנות להם כרטיסים</p>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-4">
              {upcomingRelated.map(relatedParty => (
                <RelatedPartyCard key={relatedParty.id} party={relatedParty} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

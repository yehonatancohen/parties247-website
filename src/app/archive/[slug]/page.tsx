import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPartyBySlug, getAllPartiesIncludingPast } from "@/services/api";
import { Party } from "@/data/types";
import { BRAND_LOGO_URL, BASE_URL } from "@/data/constants";
import { CalendarIcon, LocationIcon } from "@/components/Icons";

export const revalidate = 3600;

// Converts a UTC date string to a proper ISO 8601 string in Israel local time (Asia/Jerusalem).
function toIsraelISO(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const localStr = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).format(d);
  const [datePart, timePart] = localStr.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, min, sec] = timePart.split(':').map(Number);
  const localAsUtcMs = Date.UTC(year, month - 1, day, hour, min, sec);
  const offsetMinutes = Math.round((localAsUtcMs - d.getTime()) / 60000);
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${datePart}T${timePart}${sign}${hh}:${mm}`;
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
    <div className="min-h-screen bg-jungle-deep text-white overflow-x-hidden pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 pt-6 pb-8">
        <div className="mb-5">
          <Link
            className="inline-flex items-center gap-2 text-jungle-accent hover:text-white text-sm font-semibold transition-colors"
            href="/archive"
          >
            ← חזרה לארכיון המסיבות
          </Link>
        </div>

        <div className="block rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-8 relative">
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

        <div className="mb-8">
          <span className="inline-block bg-white/5 text-white/60 border border-white/10 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            אירוע שהתקיים
          </span>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-3 leading-tight">
            {party.name}
          </h1>
        </div>

        <div className="flex flex-wrap gap-3 mb-6" dir="rtl">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-jungle-surface/60 px-4 py-2.5 text-sm">
            <CalendarIcon className="w-4 h-4 text-jungle-lime flex-shrink-0" />
            <span className="text-white font-semibold">{formattedDate}</span>
            <span className="text-jungle-text/60">·</span>
            <span className="text-jungle-text/70">{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-jungle-surface/60 px-4 py-2.5 text-sm">
            <LocationIcon className="w-4 h-4 text-jungle-lime flex-shrink-0" />
            <span className="text-white font-semibold">{party.location.name}</span>
          </div>
        </div>

        {party.description && (
          <div className="rounded-2xl border border-white/10 bg-jungle-surface/50 p-6 md:p-8 mb-8">
            <h2 className="text-lg font-display text-white mb-4">על האירוע</h2>
            <div
              className="text-jungle-text/85 leading-relaxed
                [&_h2]:text-white [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:tracking-tight [&_h2]:mb-3 [&_h2]:mt-6 [&_h2:first-child]:mt-0
                [&_h3]:text-white [&_h3]:font-black [&_h3]:text-xl [&_h3]:tracking-tight [&_h3]:mb-2 [&_h3]:mt-4 [&_h3:first-child]:mt-0
                [&_p]:mb-3 [&_p:last-child]:mb-0"
              dangerouslySetInnerHTML={{ __html: party.description }}
            />
          </div>
        )}

        {(citySlug || genreSlug) && (
          <div className="rounded-2xl border border-white/10 bg-jungle-surface/50 p-6 mb-8">
            <h2 className="text-lg font-display text-white mb-4">מחפשים את המסיבה הבאה?</h2>
            <div className="flex flex-wrap gap-3">
              {citySlug && (
                <Link
                  href={`/cities/${citySlug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-jungle-lime/30 bg-jungle-lime/10 px-4 py-2.5 text-sm font-semibold text-jungle-lime hover:bg-jungle-lime/20 transition-colors"
                >
                  מסיבות קרובות ב{party.location.name} ←
                </Link>
              )}
              {genreSlug && (
                <Link
                  href={`/genre/${genreSlug}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-jungle-accent/30 bg-jungle-accent/10 px-4 py-2.5 text-sm font-semibold text-jungle-accent hover:bg-jungle-accent/20 transition-colors"
                >
                  מסיבות {party.musicType} קרובות ←
                </Link>
              )}
            </div>
          </div>
        )}

        {upcomingRelated.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-display text-white text-center mb-2">מסיבות קרובות שאולי תאהבו</h2>
            <p className="text-jungle-text/50 text-sm text-center mb-6">אירועים דומים שעדיין ניתן לקנות להם כרטיסים</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {upcomingRelated.map(relatedParty => (
                <Link
                  key={relatedParty.id}
                  href={`/event/${relatedParty.slug}`}
                  className="group relative bg-jungle-surface rounded-2xl overflow-hidden border border-white/5 hover:border-jungle-accent/30 transition-colors"
                >
                  <Image
                    src={relatedParty.imageUrl}
                    alt={relatedParty.name}
                    className="w-full aspect-[3/4] object-cover"
                    width={300}
                    height={400}
                  />
                  <div className="p-2.5">
                    <p className="text-white text-sm font-semibold truncate">{relatedParty.name}</p>
                    <p className="text-jungle-text/60 text-xs">{relatedParty.location.name}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

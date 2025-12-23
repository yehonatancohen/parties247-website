import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchPartyBySlug } from '../../../lib/api';
import { BASE_URL } from '../../../constants';

type Props = { params: { slug: string } };

export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const party = await fetchPartyBySlug(params.slug);
  if (!party) {
    return {
      title: 'האירוע לא נמצא | Parties 24/7',
      description: 'לא מצאנו את האירוע שחיפשתם.',
    };
  }

  const title = `${party.name} | Parties 24/7`;
  const description =
    party.description?.slice(0, 150) || `כל הפרטים על ${party.name} – מסיבות, מיקום וכרטיסים מעודכנים.`;
  const canonicalUrl = `${BASE_URL}/event/${party.slug}`;
  const imageUrl = party.imageUrl.startsWith('http') ? party.imageUrl : `${BASE_URL}${party.imageUrl}`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: 'article',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: party.name,
        },
      ],
    },
  };
}

export default async function EventPage({ params }: Props) {
  const party = await fetchPartyBySlug(params.slug);
  if (!party) {
    notFound();
  }

  const partyDate = new Date(party.date);
  const formattedDate = new Intl.DateTimeFormat('he-IL', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(partyDate);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: party.name,
    startDate: party.date,
    eventAttendanceMode: party.eventAttendanceMode || 'OfflineEventAttendanceMode',
    eventStatus: party.eventStatus || 'EventScheduled',
    location: {
      '@type': 'Place',
      name: party.location.name,
      address: party.location.address,
      geo: party.location.geo && {
        '@type': 'GeoCoordinates',
        latitude: party.location.geo.latitude,
        longitude: party.location.geo.longitude,
      },
    },
    image: [party.imageUrl],
    description: party.description,
    offers: {
      '@type': 'Offer',
      url: party.originalUrl,
      availability: 'https://schema.org/InStock',
    },
    performer: party.performer ? { '@type': 'Person', name: party.performer.name } : undefined,
    organizer: party.organizer ? { '@type': 'Organization', name: party.organizer.name, url: party.organizer.url } : undefined,
  };

  return (
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-jungle-text/90 space-y-6">
        <header className="space-y-3">
          <p className="text-sm text-jungle-accent/80">{formattedDate}</p>
          <h1 className="text-4xl font-display text-white">{party.name}</h1>
          <p className="text-jungle-text/80">{party.location.name}</p>
        </header>

        <img
          src={party.imageUrl}
          alt={party.name}
          className="w-full aspect-video object-cover rounded-lg shadow-xl border border-wood-brown/50"
          loading="lazy"
        />

        <div className="space-y-4 bg-jungle-surface/70 border border-wood-brown/50 rounded-xl p-6">
          <p className="leading-relaxed whitespace-pre-line">{party.description}</p>
          <div className="flex flex-wrap gap-2">
            {party.tags.map((tag) => (
              <span key={tag} className="bg-jungle-accent/80 text-jungle-deep text-xs font-semibold px-2 py-1 rounded-full">
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={party.originalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 text-center bg-gradient-to-r from-jungle-lime to-jungle-accent text-jungle-deep font-display text-xl py-3 rounded-lg hover:from-jungle-lime/80 hover:to-jungle-accent/80"
          >
            מעבר לרכישת כרטיסים
          </Link>
          <Link
            href="/all-parties"
            className="flex-1 text-center bg-jungle-surface text-white border border-wood-brown/60 rounded-lg font-semibold py-3 hover:bg-jungle-surface/80"
          >
            חזרה לכל המסיבות
          </Link>
        </div>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </div>
  );
}

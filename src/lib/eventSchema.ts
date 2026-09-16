import { Party } from '@/data/types';
import { toIsraelISO } from './dates';
import { BASE_URL } from '@/data/constants';

function getReferralUrl(originalUrl: string, partyReferral?: string, defaultReferral?: string): string {
  try {
    const referralCode = partyReferral || defaultReferral;
    if (!referralCode || !originalUrl) return originalUrl;
    const url = new URL(originalUrl);
    url.searchParams.delete('aff');
    url.searchParams.delete('referrer');
    url.searchParams.set('ref', referralCode);
    return url.toString();
  } catch {
    return originalUrl;
  }
}

/**
 * schema.org `Event` JSON-LD for a party — the same shape `event/[slug]/page.tsx`
 * builds inline, factored out so listing pages (holiday pages, etc.) that embed
 * multiple events per page don't hand-roll a second copy of this shape.
 */
export function buildEventJsonLd(party: Party, defaultReferral?: string): Record<string, unknown> {
  const referralUrl = getReferralUrl(party.originalUrl, party.referralCode, defaultReferral);
  const hasLastTickets = party.tags?.includes('כרטיסים אחרונים');
  const plainDescription = (party.description || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const jsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    name: party.name,
    url: `${BASE_URL}/event/${party.slug}`,
    startDate: toIsraelISO(party.date),
    eventStatus: `https://schema.org/${party.eventStatus ?? 'EventScheduled'}`,
    eventAttendanceMode: `https://schema.org/${party.eventAttendanceMode ?? 'OfflineEventAttendanceMode'}`,
    location: {
      '@type': 'Place',
      name: party.location.name,
      address: {
        '@type': 'PostalAddress',
        streetAddress: party.location.address || party.location.name,
        ...(party.region && party.region !== 'לא ידוע' ? { addressRegion: party.region } : {}),
        addressCountry: 'IL',
      },
      ...(party.location.geo
        ? {
            geo: {
              '@type': 'GeoCoordinates',
              latitude: party.location.geo.latitude,
              longitude: party.location.geo.longitude,
            },
          }
        : {}),
    },
    image: [party.imageUrl].filter(Boolean),
    description: plainDescription.substring(0, 500),
    organizer: party.organizer
      ? { '@type': 'Organization', name: party.organizer.name, ...(party.organizer.url ? { url: party.organizer.url } : {}) }
      : { '@type': 'Organization', name: 'Parties 24/7', url: BASE_URL },
    offers: {
      '@type': 'Offer',
      url: referralUrl,
      ...(party.ticketPrice != null ? { price: String(party.ticketPrice), priceCurrency: 'ILS' } : {}),
      availability: hasLastTickets
        ? 'https://schema.org/LimitedAvailability'
        : party.soldOut
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
    },
  };
  if (party.performer?.name) {
    jsonLd.performer = { '@type': 'PerformingGroup', name: party.performer.name };
  }
  return jsonLd;
}

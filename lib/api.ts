import { Party, Carousel } from '../types';

const API_URL = 'https://parties247-backend.onrender.com/api';
const ANALYTICS_API_BASE = `${API_URL}/%61nalytics`;

const mapPartyToFrontend = (backendParty: any): Party => {
  if (!backendParty) {
    throw new Error('Invalid party payload');
  }

  let slug = backendParty.slug;
  const urlForSlug = backendParty.goOutUrl || backendParty.originalUrl;

  if (!slug && urlForSlug && typeof urlForSlug === 'string') {
    const match = urlForSlug.match(/\/event\/([^/?#]+)/);
    if (match?.[1]) {
      slug = match[1];
    }
  }

  const name =
    typeof backendParty.title === 'object' && backendParty.title?.he
      ? backendParty.title.he
      : backendParty.name;

  const description =
    typeof backendParty.description === 'object' && backendParty.description?.he
      ? backendParty.description.he
      : typeof backendParty.summary === 'object' && backendParty.summary?.he
        ? backendParty.summary.he
        : backendParty.description;

  const locationName =
    backendParty.geo?.address ||
    (backendParty.venue && typeof backendParty.venue === 'object' ? backendParty.venue?.name?.he : backendParty.venue) ||
    (backendParty.city && typeof backendParty.city === 'object' ? backendParty.city?.name?.he : backendParty.city) ||
    (backendParty.location && typeof backendParty.location === 'string' ? backendParty.location : backendParty.location?.name) ||
    'Location not specified';

  const locationAddress =
    backendParty.geo?.address ||
    (backendParty.venue && typeof backendParty.venue === 'object' ? backendParty.venue?.geo?.address : undefined) ||
    backendParty.location?.address;

  const locationGeo = backendParty.geo || backendParty.location?.geo;
  const geo =
    locationGeo && locationGeo.lat && locationGeo.lon
      ? { latitude: String(locationGeo.lat), longitude: String(locationGeo.lon) }
      : undefined;

  const rawImageUrl =
    (typeof backendParty.images?.[0] === 'string' ? backendParty.images[0] : backendParty.images?.[0]?.url) ||
    backendParty.imageUrl ||
    '';
  let finalImageUrl = rawImageUrl;

  if (finalImageUrl && !finalImageUrl.startsWith('http')) {
    const coverImagePath = finalImageUrl.replace('_whatsappImage.jpg', '_coverImage.jpg');
    finalImageUrl = `https://d15q6k8l9pfut7.cloudfront.net/${
      coverImagePath.startsWith('/') ? coverImagePath.substring(1) : coverImagePath
    }`;
  } else if (finalImageUrl) {
    finalImageUrl = finalImageUrl.replace('_whatsappImage.jpg', '_coverImage.jpg');
  }

  let eventStatus: Party['eventStatus'] = backendParty.eventStatus;
  if (backendParty.status) {
    switch (backendParty.status) {
      case 'scheduled':
        eventStatus = 'EventScheduled';
        break;
      case 'cancelled':
        eventStatus = 'EventCancelled';
        break;
      case 'postponed':
        eventStatus = 'EventPostponed';
        break;
      case 'rescheduled':
        eventStatus = 'EventRescheduled';
        break;
      default:
        break;
    }
  }

  return {
    id: backendParty._id,
    slug,
    name: name || 'Untitled Event',
    imageUrl: finalImageUrl,
    date: backendParty.startsAt || backendParty.date,
    location: {
      name: locationName,
      address: locationAddress,
      geo,
    },
    description: description || 'No description available.',
    originalUrl: backendParty.purchaseUrl || backendParty.originalUrl || backendParty.goOutUrl,
    region: backendParty.region || 'לא ידוע',
    musicType: backendParty.musicType || 'אחר',
    eventType: backendParty.eventType || 'אחר',
    age: backendParty.age || 'כל הגילאים',
    tags: backendParty.tags || backendParty.genres || [],
    referralCode: backendParty.referralCode,
    eventStatus,
    eventAttendanceMode: backendParty.eventAttendanceMode,
    organizer: backendParty.organizer,
    performer: backendParty.performer,
  };
};

const mapCarouselToFrontend = (backendCarousel: any): Carousel => ({
  id: backendCarousel._id || backendCarousel.id,
  title: backendCarousel.title,
  partyIds: backendCarousel.partyIds || [],
  order: backendCarousel.order ?? 0,
});

export const fetchParties = async (): Promise<Party[]> => {
  const response = await fetch(`${API_URL}/parties`, { next: { revalidate: 3600 } });
  if (!response.ok) {
    throw new Error('Failed to fetch parties');
  }
  const data = await response.json();
  return data
    .map(mapPartyToFrontend)
    .filter((party: Party) => Boolean(party.slug))
    .sort((a: Party, b: Party) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const fetchCarousels = async (): Promise<Carousel[]> => {
  const response = await fetch(`${API_URL}/carousels`, { next: { revalidate: 3600 } });
  if (!response.ok) {
    throw new Error('Failed to fetch carousels');
  }
  const data = await response.json();
  return data.map(mapCarouselToFrontend).sort((a: Carousel, b: Carousel) => a.order - b.order);
};

export const fetchPartyBySlug = async (slug: string): Promise<Party | null> => {
  const response = await fetch(`${API_URL}/events/${slug}`, { next: { revalidate: 3600 } });
  if (!response.ok) {
    return null;
  }
  const data = await response.json();
  if (!data?.event) return null;
  return mapPartyToFrontend(data.event);
};

export const fetchAnalyticsSummary = async () => {
  const response = await fetch(`${ANALYTICS_API_BASE}/summary`, { cache: 'no-store' });
  if (!response.ok) return null;
  return response.json();
};

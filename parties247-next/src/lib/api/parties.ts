// lib/api/parties.ts
import { Party, Carousel } from '../../data/types'; // Adjust path based on your folder structure

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://parties247-backend.onrender.com/api';

// --- Shared Helpers (Preserved from your original code) ---

/**
 * Maps a party object from the backend schema to the frontend schema.
 * This logic is identical to your original service to ensure consistency.
 */
const mapPartyToFrontend = (backendParty: any): Party => {
  if (!backendParty) {
    throw new Error("Received invalid party data from backend.");
  }
    
  let slug = backendParty.slug;
  const urlForSlug = backendParty.goOutUrl || backendParty.originalUrl;

  // Fallback for missing slug
  if (!slug && urlForSlug && typeof urlForSlug === 'string') {
    try {
      const match = urlForSlug.match(/\/event\/([^/?#]+)/);
      if (match && match[1]) {
        slug = match[1];
      }
    } catch (e) {
      console.error('Could not parse URL to derive slug:', urlForSlug);
    }
  }
  
  const name = (typeof backendParty.title === 'object' && backendParty.title?.he) ? backendParty.title.he : backendParty.name;
  
  const description = (typeof backendParty.description === 'object' && backendParty.description?.he) 
                      ? backendParty.description.he 
                      : (typeof backendParty.summary === 'object' && backendParty.summary?.he) 
                        ? backendParty.summary.he
                        : backendParty.description;

  const locationName = backendParty.geo?.address 
                       || (backendParty.venue && typeof backendParty.venue === 'object' ? backendParty.venue?.name?.he : backendParty.venue)
                       || (backendParty.city && typeof backendParty.city === 'object' ? backendParty.city?.name?.he : backendParty.city)
                       || (backendParty.location && typeof backendParty.location === 'string' ? backendParty.location : backendParty.location?.name) 
                       || 'Location not specified';

  const locationAddress = backendParty.geo?.address 
                          || (backendParty.venue && typeof backendParty.venue === 'object' ? backendParty.venue?.geo?.address : undefined)
                          || backendParty.location?.address;

  const locationGeo = backendParty.geo || backendParty.location?.geo;
  const geo = locationGeo && locationGeo.lat && locationGeo.lon 
      ? { latitude: String(locationGeo.lat), longitude: String(locationGeo.lon) } 
      : undefined;

  const rawImageUrl = (typeof backendParty.images?.[0] === 'string' ? backendParty.images[0] : backendParty.images?.[0]?.url) || backendParty.imageUrl || '';
  let finalImageUrl = rawImageUrl;
  
  if (finalImageUrl && !finalImageUrl.startsWith('http')) {
      const coverImagePath = finalImageUrl.replace('_whatsappImage.jpg', '_coverImage.jpg');
      finalImageUrl = `https://d15q6k8l9pfut7.cloudfront.net/${coverImagePath.startsWith('/') ? coverImagePath.substring(1) : coverImagePath}`;
  } else if (finalImageUrl) {
      finalImageUrl = finalImageUrl.replace('_whatsappImage.jpg', '_coverImage.jpg');
  }

  let eventStatus: Party['eventStatus'] = backendParty.eventStatus;
  if(backendParty.status) {
      switch(backendParty.status) {
          case 'scheduled': eventStatus = 'EventScheduled'; break;
          case 'cancelled': eventStatus = 'EventCancelled'; break;
          case 'postponed': eventStatus = 'EventPostponed'; break;
          case 'rescheduled': eventStatus = 'EventRescheduled'; break;
      }
  }

  return {
    id: backendParty._id,
    slug: slug,
    name: name || 'Untitled Event',
    imageUrl: finalImageUrl,
    date: backendParty.startsAt || backendParty.date,
    location: {
      name: locationName,
      address: locationAddress,
      geo: geo,
    },
    description: description || 'No description available.',
    originalUrl: backendParty.purchaseUrl || backendParty.originalUrl || backendParty.goOutUrl,
    region: backendParty.region || 'לא ידוע',
    musicType: backendParty.musicType || 'אחר',
    eventType: backendParty.eventType || 'אחר',
    age: backendParty.age || 'כל הגילאים',
    tags: backendParty.tags || backendParty.genres || [],
    referralCode: backendParty.referralCode,
    eventStatus: eventStatus,
    eventAttendanceMode: backendParty.eventAttendanceMode,
    organizer: backendParty.organizer,
    performer: backendParty.performer,
  };
};

const mapCarouselToFrontend = (backendCarousel: any): Carousel => {
  return {
    id: backendCarousel._id || backendCarousel.id,
    title: backendCarousel.title,
    partyIds: backendCarousel.partyIds || [],
    order: backendCarousel.order ?? 0,
  };
};

// --- Server-Side Fetching Functions ---

/**
 * Fetches Carousels for SSR.
 * Usage: await getCarouselsData() inside a Server Component.
 */
export async function getCarouselsData(): Promise<Carousel[]> {
  try {
    // cache: 'no-store' ensures we always get the latest order/titles on refresh.
    // You can change to { next: { revalidate: 60 } } to cache for 60 seconds.
    const response = await fetch(`${API_URL}/carousels`, { cache: 'no-store' });
    
    if (!response.ok) {
      console.error('Error fetching carousels:', response.statusText);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data) ? data.map(mapCarouselToFrontend) : [];
  } catch (error) {
    console.error('Failed to fetch carousels:', error);
    return [];
  }
}

/**
 * Fetches All Parties for SSR.
 */
export async function getPartiesData(): Promise<Party[]> {
  try {
    const response = await fetch(`${API_URL}/parties`, { cache: 'no-store' });
    
    if (!response.ok) {
      throw new Error('Failed to fetch parties');
    }

    const data = await response.json();
    
    // Use the same filtering logic as your original code
    return data.map(mapPartyToFrontend).filter((party: Party) => {
      if (!party.slug) {
        return false;
      }
      return true;
    });
  } catch (error) {
    console.error('Failed to fetch parties:', error);
    return [];
  }
}

/**
 * Fetches a single party by slug for SSR.
 */
export async function getPartyBySlugData(slug: string): Promise<Party | null> {
  try {
    const response = await fetch(`${API_URL}/events/${slug}`, { cache: 'no-store' });
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    if (!data.event) return null;

    return mapPartyToFrontend(data.event);
  } catch (error) {
    console.error(`Failed to fetch party ${slug}:`, error);
    return null;
  }
}
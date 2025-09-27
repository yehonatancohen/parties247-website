
import { Party, Carousel } from '../types';

const API_URL = 'https://parties247-backend.onrender.com/api';
const JWT_TOKEN_STORAGE = 'jwtAuthToken';

// --- Helper Functions ---

/**
 * Retrieves the JWT from session storage and builds the Authorization header.
 * @returns An object containing the Authorization header, or an empty object.
 */
const getAuthHeader = (): { [key: string]: string } => {
  const token = sessionStorage.getItem(JWT_TOKEN_STORAGE);
  if (token) {
    return { 'Authorization': `Bearer ${token}` };
  }
  return {};
};

/**
 * Maps a party object from the backend schema to the frontend schema.
 * @param backendParty - The party object received from the API.
 * @returns A party object compliant with the frontend's `Party` type.
 */
const mapPartyToFrontend = (backendParty: any): Party => {
  let slug = backendParty.slug;
  const urlForSlug = backendParty.goOutUrl || backendParty.originalUrl;

  // Fallback for missing slug: attempt to extract it from a URL
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
  
  const locationName = backendParty.venue || backendParty.city || (typeof backendParty.location === 'string' ? backendParty.location : backendParty.location?.name) || 'Location not specified';

  return {
    id: backendParty._id,
    slug: slug,
    name: backendParty.name,
    imageUrl: backendParty.imageUrl,
    date: backendParty.startsAt || backendParty.date, // Prioritize new `startsAt` field
    location: {
      name: locationName,
      address: backendParty.venue || backendParty.location?.address,
      geo: backendParty.location?.geo,
    },
    description: backendParty.description,
    originalUrl: backendParty.originalUrl || backendParty.goOutUrl,
    region: backendParty.region,
    musicType: backendParty.musicType,
    eventType: backendParty.eventType,
    age: backendParty.age,
    tags: backendParty.tags || [],
    referralCode: backendParty.referralCode,
    eventStatus: backendParty.eventStatus,
    eventAttendanceMode: backendParty.eventAttendanceMode,
    organizer: backendParty.organizer,
    performer: backendParty.performer,
  };
};

/**
 * Maps a carousel object from the backend schema to the frontend schema.
 * @param backendCarousel - The carousel object received from the API.
 * @returns A carousel object compliant with the frontend's `Carousel` type.
 */
const mapCarouselToFrontend = (backendCarousel: any): Carousel => {
  return {
    id: backendCarousel._id || backendCarousel.id,
    title: backendCarousel.title,
    partyIds: backendCarousel.partyIds || [], // Ensure partyIds is always an array
  };
};


// --- API Functions ---

/**
 * Fetches all parties from the backend.
 */
export const getParties = async (): Promise<Party[]> => {
  const response = await fetch(`${API_URL}/parties`);
  if (!response.ok) {
    throw new Error('Failed to fetch parties');
  }
  const data = await response.json();
  // Filter out parties that lack a slug to prevent generating broken links.
  return data.map(mapPartyToFrontend).filter(party => {
    if (!party.slug) {
      console.warn('Party data from API is missing a slug, filtering it out:', party);
      return false;
    }
    return true;
  });
};

/**
 * Fetches a single party by its slug.
 */
export const getPartyBySlug = async (slug: string): Promise<Party> => {
  const response = await fetch(`${API_URL}/events/${slug}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch party with slug: ${slug}`);
  }
  const data = await response.json();
  return mapPartyToFrontend(data);
};

/**
 * Adds a new party to the database by sending the URL to be scraped by the backend.
 * @param url - The party's go-out.co URL to add.
 */
export const addParty = async (url: string): Promise<Party> => {
  const response = await fetch(`${API_URL}/admin/add-party`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ url }),
  });

  let responseData;
  try {
    responseData = await response.json();
  } catch (e) {
      const errorText = await response.text();
      console.error("Server returned non-JSON response:", errorText);
      throw new Error("Unexpected server response. The server may be down or returning an HTML error page.");
  }
  
  if (!response.ok) {
    throw new Error(responseData.message || 'Failed to add party');
  }
  return mapPartyToFrontend(responseData.party);
};

/**
 * Deletes a party from the database.
 * @param partyId - The ID of the party to delete.
 */
export const deleteParty = async (partyId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/delete-party/${partyId}`, {
    method: 'DELETE',
    headers: {
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || 'Failed to delete party');
  }
};

/**
 * Updates a party in the a database.
 * @param partyId - The ID of the party to update.
 * @param partyData - An object with all party fields (excluding id).
 */
export const updateParty = async (partyId: string, partyData: Omit<Party, 'id'>): Promise<void> => {
  // The backend's PartyUpdateSchema is very strict and rejects certain fields.
  // We can only send fields that are explicitly intended for update.
  // Fields like date ('startsAt') and location ('venue') are set during scraping and are not updatable via this endpoint.
  const updatePayload = {
    name: partyData.name,
    description: partyData.description,
    tags: partyData.tags,
    referralCode: partyData.referralCode,
  };
  
  const response = await fetch(`${API_URL}/admin/update-party/${partyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(updatePayload),
  });

  if (!response.ok) {
    let responseData;
    try {
        responseData = await response.json();
    } catch (e) {
        const errorText = await response.text();
        console.error("Server returned non-JSON response on update:", errorText);
        throw new Error("Unexpected server response on update.");
    }
    throw new Error(responseData.message || 'Failed to update party');
  }
};

/**
 * Authenticates the admin with a password to get a JWT.
 * @param password - The admin password.
 */
export const login = async (password: string): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }
  if (data.token) {
    sessionStorage.setItem(JWT_TOKEN_STORAGE, data.token);
  } else {
    throw new Error('Login response did not include a token.');
  }
};

/**
 * Verifies if the stored JWT is valid by making a request to a protected endpoint.
 * @returns a promise that resolves if the token is valid, and rejects otherwise.
 */
export const verifyToken = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/verify-token`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    const message = (await response.json().catch(() => ({}))).message || 'Invalid or expired token';
    throw new Error(message);
  }
};

/**
 * Fetches the default referral code from the backend.
 */
export const getDefaultReferral = async (): Promise<string> => {
  const response = await fetch(`${API_URL}/referral`);
  if (!response.ok) {
    if (response.status === 404) return ''; // Not set yet, return empty
    throw new Error('Failed to fetch default referral code');
  }
  const data = await response.json();
  return data.referral || '';
};

/**
 * Sets the default referral code in the backend.
 * @param code - The new default referral code.
 */
export const setDefaultReferral = async (code: string): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/referral`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify({ code }),
  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({ message: 'Failed to set referral code' }));
    throw new Error(data.message || 'Failed to set default referral code');
  }
};

/**
 * Fetches all carousels from the backend.
 */
export const getCarousels = async (): Promise<Carousel[]> => {
  const response = await fetch(`${API_URL}/carousels`);
  if (!response.ok) {
    throw new Error('Failed to fetch carousels');
  }
  const data = await response.json();
  return Array.isArray(data) ? data.map(mapCarouselToFrontend) : [];
};

/**
 * Creates a new carousel on the backend.
 * @param title - The title for the new carousel.
 */
export const addCarousel = async (title: string): Promise<Carousel> => {
  const response = await fetch(`${API_URL}/admin/carousels`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
    body: JSON.stringify({ title }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Failed to create carousel');
  }
  return mapCarouselToFrontend(data);
};

/**
 * Updates an existing carousel's metadata (title, order) on the backend.
 * @param carouselId - The ID of the carousel to update.
 * @param data - The data to update (e.g., { title }).
 */
export const updateCarouselInfo = async (carouselId: string, data: { title: string }): Promise<Carousel> => {
    const response = await fetch(`${API_URL}/admin/carousels/${carouselId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify(data),
    });
    const resData = await response.json();
    if (!response.ok) {
        throw new Error(resData.message || 'Failed to update carousel info');
    }
    return mapCarouselToFrontend(resData.carousel);
};

/**
 * Replaces the list of parties for a carousel on the backend.
 * @param carouselId - The ID of the carousel to update.
 * @param partyIds - The complete new list of party IDs.
 */
export const updateCarouselParties = async (carouselId: string, partyIds: string[]): Promise<Carousel> => {
    const response = await fetch(`${API_URL}/admin/carousels/${carouselId}/parties`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ partyIds }),
    });
    const resData = await response.json();
    if (!response.ok) {
        throw new Error(resData.message || 'Failed to update carousel parties');
    }
    return mapCarouselToFrontend(resData.carousel);
};

/**
 * Deletes a carousel from the backend.
 * @param carouselId - The ID of the carousel to delete.
 */
export const deleteCarousel = async (carouselId: string): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/carousels/${carouselId}`, {
    method: 'DELETE',
    headers: { ...getAuthHeader() },
  });
  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Failed to delete carousel');
  }
};

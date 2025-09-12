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
  return {
    id: backendParty._id,
    name: backendParty.name,
    imageUrl: backendParty.imageUrl,
    date: backendParty.date,
    location: backendParty.location,
    description: backendParty.description,
    originalUrl: backendParty.originalUrl,
    region: backendParty.region,
    musicType: backendParty.musicType,
    eventType: backendParty.eventType,
    age: backendParty.age,
    tags: backendParty.tags || [], // Ensure tags is always an array
  };
};

/**
 * Maps a carousel object from the backend schema to the frontend schema.
 * @param backendCarousel - The carousel object received from the API.
 * @returns A carousel object compliant with the frontend's `Carousel` type.
 */
const mapCarouselToFrontend = (backendCarousel: any): Carousel => {
  return {
    id: backendCarousel._id || backendCarousel.id, // Handle both _id (from admin routes) and id (from public route)
    title: backendCarousel.title,
    partyIds: backendCarousel.partyIds || [],
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
  return data.map(mapPartyToFrontend);
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
    return data.map(mapCarouselToFrontend);
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

  const responseData = await response.json();
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
 * Updates a party in the database.
 * @param partyId - The ID of the party to update.
 * @param partyData - An object with the fields to update (e.g., { tags: [...] }).
 */
export const updateParty = async (partyId: string, partyData: Partial<Party>): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/update-party/${partyId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(partyData),
  });

  if (!response.ok) {
    const responseData = await response.json();
    throw new Error(responseData.message || 'Failed to update party');
  }
};

/**
 * Adds a new carousel to the database.
 * @param title - The title of the new carousel.
 */
export const addCarousel = async (title: string): Promise<Carousel> => {
    const response = await fetch(`${API_URL}/admin/carousels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ title }),
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to create carousel');
    return mapCarouselToFrontend(data);
};

/**
 * Updates a carousel in the database.
 * @param carousel - The carousel object with updated data.
 */
export const updateCarousel = async (carousel: Carousel): Promise<Carousel> => {
    const response = await fetch(`${API_URL}/admin/carousels/${carousel.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
        body: JSON.stringify({ title: carousel.title, partyIds: carousel.partyIds }),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update carousel');
    }
    // Backend only returns a success message, so return the original object for optimistic UI updates.
    return carousel;
};

/**
 * Deletes a carousel from the database.
 * @param carouselId - The ID of the carousel to delete.
 */
export const deleteCarousel = async (carouselId: string): Promise<void> => {
    const response = await fetch(`${API_URL}/admin/carousels/${carouselId}`, {
        method: 'DELETE',
        headers: getAuthHeader(),
    });
    if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to delete carousel');
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
 * @returns A promise that resolves if the token is valid, and rejects otherwise.
 */
export const verifyToken = async (): Promise<void> => {
  const response = await fetch(`${API_URL}/admin/verify-token`, {
    method: 'POST',
    headers: {
      ...getAuthHeader(),
    },
  });

  if (!response.ok) {
    // Try to parse the error message from backend, with a fallback.
    const message = (await response.json().catch(() => ({}))).message || 'Invalid or expired token';
    throw new Error(message);
  }
};
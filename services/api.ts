import { Party } from '../types';

const API_URL = 'https://parties247-backend.onrender.com/api';
const ADMIN_KEY_STORAGE = 'adminSecretKey';

// --- Helper Functions ---

/**
 * Retrieves the admin secret key from session storage and builds the auth header.
 * @returns An object containing the Authorization header, or an empty object.
 */
const getAuthHeader = (): { [key: string]: string } => {
  const key = sessionStorage.getItem(ADMIN_KEY_STORAGE);
  if (key) {
    return { 'x-admin-secret-key': key };
  }
  return {};
};

/**
 * Maps a party object from the backend schema to the frontend schema.
 * This function now explicitly maps each field to prevent any properties
 * from being missed, which was the likely cause of the duplicate party error.
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

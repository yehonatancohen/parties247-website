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
 * @param backendParty - The party object received from the API.
 * @returns A party object compliant with the frontend's `Party` type.
 */
const mapPartyToFrontend = (backendParty: any): Party => {
  const { _id, goOutUrl, ...rest } = backendParty;
  return {
    ...rest,
    id: _id,
    originalUrl: goOutUrl,
  };
};

/**
 * Maps a party object from the frontend schema to the backend schema for sending.
 * @param frontendParty - The party object from the frontend.
 * @returns A plain object compliant with the backend's expected schema.
 */
const mapPartyToBackend = (frontendParty: Party): any => {
    // Backend creates the ID, so we don't send it.
  const { id, originalUrl, ...rest } = frontendParty;
  return {
    ...rest,
    originalUrl: originalUrl, // Backend expects originalUrl
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
 * Adds a new party to the database.
 * @param party - The party data to add (without an ID).
 */
export const addParty = async (party: Omit<Party, 'id'>): Promise<Party> => {
  const response = await fetch(`${API_URL}/admin/add-party`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader(),
    },
    body: JSON.stringify(mapPartyToBackend(party as Party)),
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

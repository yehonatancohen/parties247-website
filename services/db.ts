import { Carousel } from '../types';

const CAROUSELS_STORAGE_KEY = 'carousels_v1';
const DB_SIMULATION_DELAY = 100; // ms to simulate local storage access

// --- Initial Seed Data ---
// FIX: Add missing 'order' property to satisfy the Carousel type.
const initialCarousels: Carousel[] = [
    // This will be populated by the backend data on first load if empty
    { id: 'hot-now', title: '🔥 חם עכשיו', partyIds: [], order: 0 },
    { id: 'techno', title: '🎵 טכנו', partyIds: [], order: 1 }
];

// --- DB Service Functions ---

/**
 * Initializes localStorage with seed data if it's empty.
 */
const initializeDB = () => {
    try {
        if (!localStorage.getItem(CAROUSELS_STORAGE_KEY)) {
            localStorage.setItem(CAROUSELS_STORAGE_KEY, JSON.stringify(initialCarousels));
        }
    } catch (error) {
        console.error("Could not initialize localStorage DB for carousels.", error);
    }
};

initializeDB();

/**
 * Fetches all carousels from localStorage.
 * @returns A Promise that resolves with the carousels.
 */
export const getCarousels = (): Promise<Carousel[]> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const carouselsJSON = localStorage.getItem(CAROUSELS_STORAGE_KEY);
                const carousels = carouselsJSON ? JSON.parse(carouselsJSON) : [];
                resolve(carousels);
            } catch (error) {
                console.error("Failed to read carousels from localStorage", error);
                reject(error);
            }
        }, DB_SIMULATION_DELAY);
    });
};

/**
 * Saves the entire state of carousels to localStorage.
 * @param carousels - The array of carousels to save.
 * @returns A Promise that resolves when the save is complete.
 */
export const saveCarousels = (carousels: Carousel[]): Promise<void> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                localStorage.setItem(CAROUSELS_STORAGE_KEY, JSON.stringify(carousels));
                resolve();
            } catch (error) {
                console.error("Failed to save carousels to localStorage", error);
                reject(error);
            }
        }, DB_SIMULATION_DELAY / 2); // Make saving faster than reading
    });
};
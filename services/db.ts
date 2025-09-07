import { Party, Carousel } from '../types';

const PARTIES_STORAGE_KEY = 'parties_v3';
const CAROUSELS_STORAGE_KEY = 'carousels_v1';
const DB_SIMULATION_DELAY = 500; // ms to simulate network latency

// --- Initial Seed Data ---
const initialParties: Party[] = [
    {
        id: "2025-08-15T23:00:00.000Z", name: "Rave Generation Tel Aviv", imageUrl: "https://picsum.photos/seed/rave1/400/600", date: "2025-08-15T23:00:00.000Z", location: "גגרין, תל אביב", description: "מסיבת טכנו מחתרתית.", originalUrl: "https://www.go-out.co.il/event/example1", region: "מרכז", musicType: "טכנו", eventType: "מסיבת מועדון", age: "18+", tags: ["לוהט", "ביקוש גבוה", "תל אביב"],
    },
    {
        id: "2025-08-22T22:30:00.000Z", name: "Summer Vibes Beach Party", imageUrl: "https://picsum.photos/seed/beachparty/400/600", date: "2025-08-22T22:30:00.000Z", location: "חוף דור, חיפה", description: "מסיבת חוף ענקית.", originalUrl: "https://www.go-out.co.il/event/example2", region: "צפון", musicType: "מיינסטרים", eventType: "מסיבת טבע", age: "21+", tags: ["לוהט", "בחוץ"],
    },
];

const initialCarousels: Carousel[] = [
    { id: 'hot-now', title: '🔥 חם עכשיו', partyIds: ["2025-08-15T23:00:00.000Z", "2025-08-22T22:30:00.000Z"] },
    { id: 'techno', title: '🎵 טכנו', partyIds: ["2025-08-15T23:00:00.000Z"] }
];

// --- DB Service Functions ---

/**
 * Initializes the mock DB (localStorage) with seed data if it's empty.
 */
const initializeDB = () => {
    try {
        if (!localStorage.getItem(PARTIES_STORAGE_KEY)) {
            localStorage.setItem(PARTIES_STORAGE_KEY, JSON.stringify(initialParties));
        }
        if (!localStorage.getItem(CAROUSELS_STORAGE_KEY)) {
            localStorage.setItem(CAROUSELS_STORAGE_KEY, JSON.stringify(initialCarousels));
        }
    } catch (error) {
        console.error("Could not initialize localStorage DB.", error);
    }
};

initializeDB();

/**
 * Fetches all parties and carousels from the mock DB.
 * @returns A Promise that resolves with the parties and carousels.
 */
export const getPartiesAndCarousels = (): Promise<{ parties: Party[]; carousels: Carousel[] }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                const partiesJSON = localStorage.getItem(PARTIES_STORAGE_KEY);
                const carouselsJSON = localStorage.getItem(CAROUSELS_STORAGE_KEY);

                const parties = partiesJSON ? JSON.parse(partiesJSON) : [];
                const carousels = carouselsJSON ? JSON.parse(carouselsJSON) : [];

                resolve({ parties, carousels });
            } catch (error) {
                console.error("Failed to read from mock DB (localStorage)", error);
                reject(error);
            }
        }, DB_SIMULATION_DELAY);
    });
};

/**
 * Saves the entire state of parties and carousels to the mock DB.
 * @param parties - The array of parties to save.
 * @param carousels - The array of carousels to save.
 * @returns A Promise that resolves when the save is complete.
 */
export const savePartiesAndCarousels = (
    parties: Party[], 
    carousels: Carousel[]
): Promise<void> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            try {
                localStorage.setItem(PARTIES_STORAGE_KEY, JSON.stringify(parties));
                localStorage.setItem(CAROUSELS_STORAGE_KEY, JSON.stringify(carousels));
                resolve();
            } catch (error) {
                console.error("Failed to save to mock DB (localStorage)", error);
                reject(error);
            }
        }, DB_SIMULATION_DELAY / 2); // Make saving faster than reading
    });
};


import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Party } from '../types';

interface PartyContextType {
  parties: Party[];
  addParty: (party: Party) => void;
  deleteParty: (partyId: string) => void;
  toggleHotParty: (partyId: string) => void;
  togglePartyDemand: (partyId: string) => void;
  isLoading: boolean;
}

const PartyContext = createContext<PartyContextType | undefined>(undefined);
const STORAGE_KEY = 'parties_v2'; // Use a new versioned key to invalidate old storage.

const initialParties: Party[] = [
    {
        id: "2025-08-15T23:00:00.000Z",
        name: "Rave Generation Tel Aviv",
        imageUrl: "https://picsum.photos/seed/rave1/400/600",
        date: "2025-08-15T23:00:00.000Z",
        location: "גגרין, תל אביב",
        description: "מסיבת טכנו מחתרתית עם מיטב הדיג'יים המובילים בסצנה המקומית.",
        originalUrl: "https://www.go-out.co.il/event/example1",
        isHot: true,
        region: "מרכז",
        musicType: "טכנו",
        eventType: "מסיבת מועדון",
        age: "18+",
        tags: ["תל אביב"],
        demand: 'high',
    },
    {
        id: "2025-08-22T22:30:00.000Z",
        name: "Summer Vibes Beach Party",
        imageUrl: "https://picsum.photos/seed/beachparty/400/600",
        date: "2025-08-22T22:30:00.000Z",
        location: "חוף דור, חיפה",
        description: "מסיבת חוף ענקית עם מוזיקת מיינסטרים, קוקטיילים קרירים ואווירה מחשמלת עד הזריחה.",
        originalUrl: "https://www.go-out.co.il/event/example2",
        isHot: true,
        region: "צפון",
        musicType: "מיינסטרים",
        eventType: "מסיבת טבע",
        age: "21+",
        tags: ["בחוץ"],
        demand: 'normal',
    },
     {
        id: "2025-09-05T21:00:00.000Z",
        name: "Jerusalem Rooftop Sessions",
        imageUrl: "https://picsum.photos/seed/rooftop/400/600",
        date: "2025-09-05T21:00:00.000Z",
        location: "גג מלון, ירושלים",
        description: "ערב של מוזיקת האוס אלגנטית על גג עם נוף עוצר נשימה לעיר העתיקה.",
        originalUrl: "https://www.go-out.co.il/event/example3",
        isHot: false,
        region: "מרכז",
        musicType: "אחר",
        eventType: "מסיבת מועדון",
        age: "21+",
        tags: ["בחוץ"],
        demand: 'high',
    },
    {
        id: "2025-08-16T23:00:00.000Z",
        name: "Psytrance Forest Gathering",
        imageUrl: "https://picsum.photos/seed/psytrance/400/600",
        date: "2025-08-16T23:00:00.000Z",
        location: "יער בן שמן",
        description: "מסע פסיכדלי בלב יער בן שמן עם אמנים בינלאומיים.",
        originalUrl: "https://www.go-out.co.il/event/example4",
        isHot: true,
        region: "מרכז",
        musicType: "טראנס",
        eventType: "מסיבת טבע",
        age: "18+",
        tags: ["בחוץ"],
        demand: 'normal',
    },
    {
        id: "2025-08-23T22:00:00.000Z",
        name: "Eilat Ultimate Pool Party",
        imageUrl: "https://picsum.photos/seed/poolparty/400/600",
        date: "2025-08-23T22:00:00.000Z",
        location: "מלון רויאל גארדן, אילת",
        description: "מסיבת בריכה מטורפת באילת עם דיג'יים שינגנו את כל הלהיטים של הקיץ.",
        originalUrl: "https://www.go-out.co.il/event/example5",
        isHot: true,
        region: "דרום",
        musicType: "מיינסטרים",
        eventType: "אחר",
        age: "18+",
        tags: ["אילת", "בחוץ"],
        demand: 'high',
    },
    {
        id: "2025-08-29T23:59:00.000Z",
        name: "Secret Warehouse Techno",
        imageUrl: "https://picsum.photos/seed/warehouse/400/600",
        date: "2025-08-29T23:59:00.000Z",
        location: "לוקיישן סודי, תל אביב",
        description: "רייב טכנו במחסן תעשייתי. המיקום יישלח לרוכשים ביום האירוע.",
        originalUrl: "https://www.go-out.co.il/event/example6",
        isHot: true,
        region: "מרכז",
        musicType: "טכנו",
        eventType: "מסיבת מועדון",
        age: "21+",
        tags: ["תל אביב"],
        demand: 'normal',
    }
];

export const PartyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [parties, setParties] = useState<Party[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedPartiesJSON = localStorage.getItem(STORAGE_KEY);
      if (storedPartiesJSON) {
        const storedParties: Party[] = JSON.parse(storedPartiesJSON);
        setParties(storedParties);
      } else {
        // If no data under the new key, initialize with defaults.
        setParties(initialParties);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(initialParties));
      }
    } catch (error) {
      console.error('Failed to load parties from localStorage', error);
      setParties(initialParties);
    } finally {
        setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if(!isLoading) {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(parties));
        } catch (error) {
            console.error('Failed to save parties to localStorage', error);
        }
    }
  }, [parties, isLoading]);

  const addParty = useCallback((party: Party) => {
    setParties(prevParties => {
      // Prevent duplicates based on originalUrl
      if (prevParties.some(p => p.originalUrl === party.originalUrl)) {
        return prevParties;
      }
      return [...prevParties, party]
    });
  }, []);

  const deleteParty = useCallback((partyId: string) => {
    setParties(prevParties => prevParties.filter(p => p.id !== partyId));
  }, []);

  const toggleHotParty = useCallback((partyId: string) => {
    setParties(prevParties =>
      prevParties.map(p =>
        p.id === partyId ? { ...p, isHot: !p.isHot } : p
      )
    );
  }, []);

  const togglePartyDemand = useCallback((partyId: string) => {
    setParties(prevParties =>
      prevParties.map(p =>
        p.id === partyId ? { ...p, demand: p.demand === 'high' ? 'normal' : 'high' } : p
      )
    );
  }, []);
  
  return React.createElement(
    PartyContext.Provider,
    { value: { parties, addParty, deleteParty, toggleHotParty, togglePartyDemand, isLoading } },
    children
  );
};

export const useParties = (): PartyContextType => {
  const context = useContext(PartyContext);
  if (context === undefined) {
    throw new Error('useParties must be used within a PartyProvider');
  }
  return context;
};
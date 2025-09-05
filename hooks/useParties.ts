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

const initialParties: Party[] = [
    {
        id: "2024-08-15T23:00:00.000Z",
        name: "Rave Generation Tel Aviv",
        imageUrl: "https://picsum.photos/seed/rave1/600/400",
        date: "2024-08-15T23:00:00.000Z",
        location: "גגרין, תל אביב",
        description: "מסיבת טכנו מחתרתית עם מיטב הדיג'יים המובילים בסצנה המקומית. בואו לחוות לילה של מוזיקה אלקטרונית בועטת.",
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
        id: "2024-08-22T22:30:00.000Z",
        name: "Summer Vibes Beach Party",
        imageUrl: "https://picsum.photos/seed/beachparty/600/400",
        date: "2024-08-22T22:30:00.000Z",
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
        id: "2024-09-05T21:00:00.000Z",
        name: "Jerusalem Rooftop Sessions",
        imageUrl: "https://picsum.photos/seed/rooftop/600/400",
        date: "2024-09-05T21:00:00.000Z",
        location: "גג מלון, ירושלים",
        description: "ערב של מוזיקת האוס אלגנטית על גג עם נוף עוצר נשימה לעיר העתיקה. קוד לבוש: לבן.",
        originalUrl: "https://www.go-out.co.il/event/example3",
        isHot: false,
        region: "מרכז",
        musicType: "אחר",
        eventType: "מסיבת מועדון",
        age: "21+",
        tags: ["בחוץ"],
        demand: 'high',
    }
];

export const PartyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [parties, setParties] = useState<Party[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedParties = localStorage.getItem('parties');
      if (storedParties) {
        setParties(JSON.parse(storedParties));
      } else {
        setParties(initialParties);
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
            localStorage.setItem('parties', JSON.stringify(parties));
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
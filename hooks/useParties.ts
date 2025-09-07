import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback, useRef } from 'react';
import { Party, Carousel } from '../types';
import * as db from '../services/db';

interface PartyContextType {
  parties: Party[];
  carousels: Carousel[];
  addParty: (party: Party) => void;
  deleteParty: (partyId: string) => void;
  updateParty: (party: Party) => void;
  addCarousel: (title: string) => void;
  updateCarousel: (carousel: Carousel) => void;
  deleteCarousel: (carouselId: string) => void;
  isLoading: boolean;
}

const PartyContext = createContext<PartyContextType | undefined>(undefined);

export const PartyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [parties, setParties] = useState<Party[]>([]);
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const isInitialLoad = useRef(true);

  // Effect for initial data load from the mock DB service
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { parties: fetchedParties, carousels: fetchedCarousels } = await db.getPartiesAndCarousels();
        // One-time migration from old format for users who have old data
        const migratedParties = fetchedParties.map(p => {
            if ((p as any).isHot || (p as any).demand || (p.tags && p.tags.some((t: string) => t.includes('🔥') || t.includes('🎉')))) {
                const newTags = (p.tags || []).map((t: string) => t.replace('🔥 ', '').replace('🎉 ', ''));
                if ((p as any).isHot && !newTags.includes('לוהט')) newTags.push('לוהט');
                if ((p as any).demand === 'high' && !newTags.includes('ביקוש גבוה')) newTags.push('ביקוש גבוה');
                const { isHot, demand, ...rest } = p as any;
                return { ...rest, tags: newTags };
            }
            return p;
        });
        setParties(migratedParties);
        setCarousels(fetchedCarousels);
      } catch (error) {
        console.error('Failed to load data from DB service', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Effect for persisting data to the mock DB on any state change
  useEffect(() => {
    // Prevent saving on the initial render until data is loaded
    if (isInitialLoad.current) {
        if (!isLoading) {
            isInitialLoad.current = false;
        }
        return;
    }

    // Debounce saving to avoid rapid writes on consecutive state updates
    const debounceSave = setTimeout(() => {
      db.savePartiesAndCarousels(parties, carousels).catch(err => {
          console.error("Failed to save changes to mock DB", err);
          // In a real app, you might show an error to the user here
      });
    }, 500);

    return () => clearTimeout(debounceSave);
  }, [parties, carousels, isLoading]);

  const addParty = useCallback((party: Party) => {
    setParties(prev => prev.some(p => p.originalUrl === party.originalUrl) ? prev : [...prev, party]);
  }, []);
  
  const updateParty = useCallback((updatedParty: Party) => {
    setParties(prev => prev.map(p => p.id === updatedParty.id ? updatedParty : p));
  }, []);

  const deleteParty = useCallback((partyId: string) => {
    setParties(prev => prev.filter(p => p.id !== partyId));
    // Also remove the party from any carousels it might be in
    setCarousels(prev => prev.map(c => ({...c, partyIds: c.partyIds.filter(id => id !== partyId)})));
  }, []);
  
  const addCarousel = useCallback((title: string) => {
    const newCarousel: Carousel = { id: Date.now().toString(), title, partyIds: [] };
    setCarousels(prev => [...prev, newCarousel]);
  }, []);

  const updateCarousel = useCallback((updatedCarousel: Carousel) => {
    setCarousels(prev => prev.map(c => c.id === updatedCarousel.id ? updatedCarousel : c));
  }, []);

  const deleteCarousel = useCallback((carouselId: string) => {
    setCarousels(prev => prev.filter(c => c.id !== carouselId));
  }, []);
  
  return React.createElement(
    PartyContext.Provider,
    { value: { parties, carousels, addParty, deleteParty, updateParty, addCarousel, updateCarousel, deleteCarousel, isLoading } },
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
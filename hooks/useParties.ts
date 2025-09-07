import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Party, Carousel } from '../types';
import * as api from '../services/api';
import * as carouselDb from '../services/db';

interface PartyContextType {
  parties: Party[];
  carousels: Carousel[];
  addParty: (party: Party) => Promise<void>;
  deleteParty: (partyId: string) => Promise<void>;
  updateParty: (party: Party) => Promise<void>;
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

  // Effect for initial data load
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch parties from backend and carousels from local DB concurrently
        const [fetchedParties, fetchedCarousels] = await Promise.all([
            api.getParties(),
            carouselDb.getCarousels()
        ]);
        setParties(fetchedParties);
        setCarousels(fetchedCarousels);
      } catch (error) {
        console.error('Failed to load initial data', error);
        // Handle error state in UI if necessary
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Effect for persisting carousel data to localStorage on any change
  useEffect(() => {
    if (!isLoading) { // Don't save during initial load
        carouselDb.saveCarousels(carousels).catch(err => {
            console.error("Failed to save carousels to mock DB", err);
        });
    }
  }, [carousels, isLoading]);

  const addParty = useCallback(async (party: Party) => {
    try {
        const newParty = await api.addParty(party);
        setParties(prev => [newParty, ...prev]);
    } catch (error) {
        console.error("Failed to add party:", error);
        alert(`Error: Could not add party. The party may already exist, or there was a server error.`);
        throw error; // Re-throw to allow component to handle it
    }
  }, []);
  
  const updateParty = useCallback(async (updatedParty: Party) => {
    try {
        await api.updateParty(updatedParty.id, { tags: updatedParty.tags });
        setParties(prev => prev.map(p => p.id === updatedParty.id ? updatedParty : p));
    } catch (error) {
        console.error("Failed to update party:", error);
        alert("Error: Could not update party.");
        throw error;
    }
  }, []);

  const deleteParty = useCallback(async (partyId: string) => {
    try {
        await api.deleteParty(partyId);
        setParties(prev => prev.filter(p => p.id !== partyId));
        // Also remove the party from any carousels it might be in
        setCarousels(prev => prev.map(c => ({...c, partyIds: c.partyIds.filter(id => id !== partyId)})));
    } catch (error) {
        console.error("Failed to delete party:", error);
        alert("Error: Could not delete party.");
        throw error;
    }
  }, []);
  
  // Carousel functions remain synchronous as they only affect local state
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

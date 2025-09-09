import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Party, Carousel } from '../types';
import * as api from '../services/api';

interface PartyContextType {
  parties: Party[];
  carousels: Carousel[];
  addParty: (url: string) => Promise<void>;
  deleteParty: (partyId: string) => Promise<void>;
  updateParty: (party: Party) => Promise<void>;
  addCarousel: (title: string) => Promise<void>;
  updateCarousel: (carousel: Carousel) => Promise<void>;
  deleteCarousel: (carouselId: string) => Promise<void>;
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
        // Fetch parties and carousels from the backend API concurrently
        const [fetchedParties, fetchedCarousels] = await Promise.all([
            api.getParties(),
            api.getCarousels()
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

  const addParty = useCallback(async (url: string) => {
    try {
        const newParty = await api.addParty(url);
        setParties(prev => [newParty, ...prev]);
    } catch (error) {
        console.error("Failed to add party:", error);
        const errorMessage = error instanceof Error ? error.message : "Could not add party.";
        alert(`Error: ${errorMessage}`);
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
  
  const addCarousel = useCallback(async (title: string) => {
    try {
      const newCarousel = await api.addCarousel(title);
      setCarousels(prev => [...prev, newCarousel]);
    } catch (error) {
      console.error("Failed to add carousel:", error);
      alert("Error: Could not add carousel.");
      throw error;
    }
  }, []);

  const updateCarousel = useCallback(async (updatedCarousel: Carousel) => {
    try {
      const savedCarousel = await api.updateCarousel(updatedCarousel);
      setCarousels(prev => prev.map(c => c.id === savedCarousel.id ? savedCarousel : c));
    } catch (error) {
      console.error("Failed to update carousel:", error);
      alert("Error: Could not update carousel.");
      throw error;
    }
  }, []);

  const deleteCarousel = useCallback(async (carouselId: string) => {
    try {
      await api.deleteCarousel(carouselId);
      setCarousels(prev => prev.filter(c => c.id !== carouselId));
    } catch (error) {
      console.error("Failed to delete carousel:", error);
      alert("Error: Could not delete carousel.");
      throw error;
    }
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

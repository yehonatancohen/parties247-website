import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Party, Carousel, PartyContextType } from '../types';
import * as api from '../services/api';

const PartyContext = createContext<PartyContextType | undefined>(undefined);

export const PartyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [parties, setParties] = useState<Party[]>([]);
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [defaultReferral, setDefaultReferralState] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

  const fetchParties = useCallback(async () => {
    try {
      const fetchedParties = await api.getParties();
      setParties(fetchedParties);
    } catch (error) {
      console.error('Failed to refetch parties', error);
    }
  }, []);

  const fetchCarousels = useCallback(async () => {
    try {
      const fetchedCarousels = await api.getCarousels();
      setCarousels(fetchedCarousels);
    } catch (error) {
      console.error('Failed to refetch carousels', error);
    }
  }, []);

  // Effect for initial data load
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setLoadingMessage(null);

      for (let i = 0; i < 4; i++) {
        try {
          const [fetchedParties, fetchedCarousels, fetchedReferral] = await Promise.all([
            api.getParties(),
            api.getCarousels(),
            api.getDefaultReferral(),
          ]);
          setParties(fetchedParties);
          setCarousels(fetchedCarousels);
          setDefaultReferralState(fetchedReferral);
          setIsLoading(false);
          setLoadingMessage(null);
          return; // Success, exit function
        } catch (err) {
          if (err instanceof TypeError && err.message === 'Failed to fetch' && i < 3) {
            setLoadingMessage(`Server is waking up... Retrying (attempt ${i + 2}/4)`);
            // Exponential backoff: 2s, 4s, 8s
            await new Promise(resolve => setTimeout(resolve, 2000 * Math.pow(2, i)));
          } else {
            console.error('Failed to load initial data after retries', err);
            setError("Could not connect to the server. Please check your internet connection or try again later.");
            setIsLoading(false);
            setLoadingMessage(null);
            return; // Failure, exit function
          }
        }
      }
    };
    fetchData();
  }, []);

  const addParty = useCallback(async (url: string) => {
    try {
        const newParty = await api.addParty(url);
        setParties(prev => [newParty, ...prev]);
        return newParty;
    } catch (error) {
        console.error("Failed to add party:", error);
        const errorMessage = error instanceof Error ? error.message : "Could not add party.";
        alert(`Error: ${errorMessage}`);
        throw error;
    }
  }, []);
  
  const updateParty = useCallback(async (partyToUpdate: Party) => {
    try {
        const { id, ...partyData } = partyToUpdate;
        await api.updateParty(id, partyData);
        setParties(prev => prev.map(p => p.id === id ? partyToUpdate : p));
    } catch (error) {
        console.error("Failed to update party:", error);
        const errorMessage = error instanceof Error ? error.message : "Could not update party.";
        alert(`Error: ${errorMessage}`);
        throw error;
    }
  }, []);


  const deleteParty = useCallback(async (partyId: string) => {
    try {
        await api.deleteParty(partyId);
        setParties(prev => prev.filter(p => p.id !== partyId));
        setCarousels(prev => prev.map(c => ({...c, partyIds: c.partyIds.filter(id => id !== partyId)})));
    } catch (error) {
        console.error("Failed to delete party:", error);
        alert("Error: Could not delete party.");
        throw error;
    }
  }, []);
  
  const addCarousel = useCallback(async (title: string): Promise<Carousel> => {
    try {
      const newCarousel = await api.addCarousel(title);
      setCarousels(prev => [...prev, newCarousel]);
      return newCarousel;
    } catch (error) {
      console.error("Failed to add carousel:", error);
      alert("Error: Could not add carousel.");
      throw error;
    }
  }, []);

  const updateCarousel = useCallback(async (updatedCarousel: Carousel) => {
    try {
      await api.updateCarousel(updatedCarousel);
      setCarousels(prev => prev.map(c => c.id === updatedCarousel.id ? updatedCarousel : c));
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
  
  const renameTag = useCallback(async (tagId: string, newName: string) => {
    try {
      await api.renameTag(tagId, newName);
      // As requested, refresh both carousels and parties
      await Promise.all([fetchCarousels(), fetchParties()]);
    } catch (error) {
      console.error("Failed to rename tag:", error);
      alert(`Error: ${error instanceof Error ? error.message : 'Could not rename tag.'}`);
      throw error;
    }
  }, [fetchCarousels, fetchParties]);

  const refetchCarousels = useCallback(async () => {
    await fetchCarousels();
  }, [fetchCarousels]);

  const setDefaultReferral = useCallback(async (code: string) => {
    try {
      await api.setDefaultReferral(code);
      setDefaultReferralState(code);
    } catch (error) {
      console.error("Failed to set default referral:", error);
      alert("Error: Could not set default referral code.");
      throw error;
    }
  }, []);
  
  const contextValue: PartyContextType = {
    parties,
    carousels,
    addParty,
    deleteParty,
    updateParty,
    addCarousel,
    updateCarousel,
    deleteCarousel,
    renameTag,
    isLoading,
    refetchCarousels,
    defaultReferral,
    setDefaultReferral,
    error,
    loadingMessage,
  };

  return React.createElement(
    PartyContext.Provider,
    { value: contextValue },
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
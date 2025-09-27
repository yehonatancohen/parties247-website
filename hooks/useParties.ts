import React, { createContext, useState, useContext, useEffect, ReactNode, useCallback } from 'react';
import { Party, Carousel, PartyContextType } from '../types';
import * as api from '../services/api';
import * as db from '../services/db';

const PartyContext = createContext<PartyContextType | undefined>(undefined);

export const PartyProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [parties, setParties] = useState<Party[]>([]);
  const [carousels, setCarousels] = useState<Carousel[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [defaultReferral, setDefaultReferralState] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);

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
            db.getCarousels(),
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
        // Also remove from any carousels
        const updatedCarousels = carousels.map(c => ({
          ...c,
          partyIds: c.partyIds.filter(id => id !== partyId)
        }));
        setCarousels(updatedCarousels);
        await db.saveCarousels(updatedCarousels);
    } catch (error) {
        console.error("Failed to delete party:", error);
        alert("Error: Could not delete party.");
        throw error;
    }
  }, [carousels]);

  const addCarousel = useCallback(async (title: string) => {
    const newCarousel: Carousel = {
      id: `c_${Date.now()}`,
      title,
      partyIds: [],
    };
    const updatedCarousels = [...carousels, newCarousel];
    setCarousels(updatedCarousels);
    await db.saveCarousels(updatedCarousels);
  }, [carousels]);

  const deleteCarousel = useCallback(async (carouselId: string) => {
    const updatedCarousels = carousels.filter(c => c.id !== carouselId);
    setCarousels(updatedCarousels);
    await db.saveCarousels(updatedCarousels);
  }, [carousels]);

  const updateCarousel = useCallback(async (carouselToUpdate: Carousel) => {
    const updatedCarousels = carousels.map(c => 
      c.id === carouselToUpdate.id ? carouselToUpdate : c
    );
    setCarousels(updatedCarousels);
    await db.saveCarousels(updatedCarousels);
  }, [carousels]);

  const updateCarouselOrder = useCallback(async (reorderedCarousels: Carousel[]) => {
    setCarousels(reorderedCarousels);
    await db.saveCarousels(reorderedCarousels);
  }, []);

  const addPartyToCarousel = useCallback(async (carouselId: string, partyId: string) => {
    const updatedCarousels = carousels.map(c => {
      if (c.id === carouselId && !c.partyIds.includes(partyId)) {
        return { ...c, partyIds: [...c.partyIds, partyId] };
      }
      return c;
    });
    setCarousels(updatedCarousels);
    await db.saveCarousels(updatedCarousels);
  }, [carousels]);

  const removePartyFromCarousel = useCallback(async (carouselId: string, partyId: string) => {
    const updatedCarousels = carousels.map(c => {
      if (c.id === carouselId) {
        return { ...c, partyIds: c.partyIds.filter(id => id !== partyId) };
      }
      return c;
    });
    setCarousels(updatedCarousels);
    await db.saveCarousels(updatedCarousels);
  }, [carousels]);
  
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
    deleteCarousel,
    updateCarousel,
    updateCarouselOrder,
    addPartyToCarousel,
    removePartyFromCarousel,
    isLoading,
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
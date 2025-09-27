
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
        // Also remove from any carousels in the local state for immediate UI feedback.
        // The backend should handle the actual removal from its database.
        setCarousels(prev => prev.map(c => ({
          ...c,
          partyIds: c.partyIds.filter(id => id !== partyId)
        })));
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
      alert("Error: " + (error as Error).message);
      throw error;
    }
  }, []);

  const deleteCarousel = useCallback(async (carouselId: string) => {
    try {
      await api.deleteCarousel(carouselId);
      setCarousels(prev => prev.filter(c => c.id !== carouselId));
    } catch (error) {
      console.error("Failed to delete carousel:", error);
      alert("Error: " + (error as Error).message);
      throw error;
    }
  }, []);
  
  const updateCarousel = useCallback(async (carouselId: string, updates: { title?: string; order?: number }) => {
    const originalCarousels = carousels;
    const carouselToUpdate = originalCarousels.find(c => c.id === carouselId);

    if (!carouselToUpdate) {
      console.error("Carousel not found for update:", carouselId);
      throw new Error("Carousel not found for update.");
    }
    
    // Optimistic UI update
    setCarousels(prev => prev.map(c => c.id === carouselId ? { ...c, ...updates } : c));

    try {
        const payload = {
            title: updates.title ?? carouselToUpdate.title,
            order: updates.order ?? carouselToUpdate.order,
        };

        const updatedCarousel = await api.updateCarouselInfo(carouselId, payload);
        // Sync with server response on success for consistency
        setCarousels(prev => prev.map(c => c.id === carouselId ? updatedCarousel : c));
    } catch (error) {
        console.error("Error updating carousel, rolling back.", error);
        alert("Error: " + (error as Error).message);
        // Roll back the optimistic update on failure
        setCarousels(originalCarousels);
        throw error;
    }
  }, [carousels]);


  const addPartyToCarousel = useCallback(async (carouselId: string, partyId: string) => {
    let originalCarousels: Carousel[] = [];
    let updatedPartyIds: string[] | null = null;

    setCarousels(prevCarousels => {
        originalCarousels = prevCarousels;
        const carousel = prevCarousels.find(c => c.id === carouselId);
        
        if (!carousel || carousel.partyIds.includes(partyId)) {
          updatedPartyIds = null; // No change needed, so no API call will be made
          return prevCarousels;
        }
        
        // Defensive check: Ensure all existing IDs in the carousel are still valid
        const validExistingPartyIds = carousel.partyIds.filter(id => parties.some(p => p.id === id));

        updatedPartyIds = [...validExistingPartyIds, partyId];
        
        // Optimistically update UI
        return prevCarousels.map(c => c.id === carouselId ? { ...c, partyIds: updatedPartyIds! } : c);
    });

    if (updatedPartyIds) {
        try {
            const updatedCarousel = await api.updateCarouselParties(carouselId, updatedPartyIds);
            // Sync with server's response on success
            setCarousels(prev => prev.map(c => c.id === carouselId ? updatedCarousel : c));
        } catch (error) {
            console.error("Error adding party to carousel, rolling back.", error);
            alert("Error: " + (error as Error).message);
            // Roll back the optimistic update on failure
            setCarousels(originalCarousels);
            throw error;
        }
    }
  }, [parties]); // Add `parties` dependency to ensure the function has the latest list for validation

  const removePartyFromCarousel = useCallback(async (carouselId: string, partyId: string) => {
      let originalCarousels: Carousel[] = [];
      let updatedPartyIds: string[] | null = null;
  
      setCarousels(prev => {
          originalCarousels = prev;
          const carousel = prev.find(c => c.id === carouselId);
          if (!carousel) {
            updatedPartyIds = null;
            return prev;
          }
          
          updatedPartyIds = carousel.partyIds.filter(id => id !== partyId);
          return prev.map(c => c.id === carouselId ? { ...c, partyIds: updatedPartyIds } : c);
      });
      
      if (updatedPartyIds) {
        try {
            const updatedCarousel = await api.updateCarouselParties(carouselId, updatedPartyIds);
            // Sync with server response
            setCarousels(prev => prev.map(c => c.id === carouselId ? updatedCarousel : c));
        } catch (error) {
            console.error("Error removing party from carousel, rolling back.", error);
            alert("Error: " + (error as Error).message);
            setCarousels(originalCarousels);
            throw error;
        }
      }
  }, []);
  
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
  
  const addPartiesFromSection = useCallback(async (payload: { carouselId: string; carouselTitle: string; url: string; }) => {
    try {
      const { carouselTitle, url } = payload;
      // The backend uses carouselName and title. We'll send the same value for both.
      const result = await api.addSection({ carouselName: carouselTitle, title: carouselTitle, url });

      // After a bulk operation, re-sync the entire state to ensure consistency
      const [fetchedParties, fetchedCarousels] = await Promise.all([
        api.getParties(),
        api.getCarousels(),
      ]);
      setParties(fetchedParties);
      setCarousels(fetchedCarousels);
      
      return { message: result.message, partyCount: result.partyCount, warnings: result.warnings };
    } catch (error) {
      console.error("Failed to add parties from section:", error);
      alert("Error: " + (error as Error).message);
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
    addPartyToCarousel,
    removePartyFromCarousel,
    addPartiesFromSection,
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

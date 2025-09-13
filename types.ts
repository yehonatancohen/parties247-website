import React from 'react';

export interface Party {
  id: string;
  name: string;
  imageUrl: string;
  date: string; // ISO 8601 format
  location: string;
  description: string;
  originalUrl: string;
  region: 'דרום' | 'מרכז' | 'צפון' | 'לא ידוע';
  musicType: 'מיינסטרים' | 'טכנו' | 'טראנס' | 'אחר';
  eventType: 'מסיבת בית' | 'מסיבת מועדון' | 'מסיבת טבע' | 'פסטיבל' | 'אחר';
  age: 'נוער' | '18+' | '21+' | 'כל הגילאים';
  tags: string[];
  referralCode?: string;
}

export interface Carousel {
  id: string;
  title: string;
  partyIds: string[];
  order?: number;
}

export interface Article {
  id: string;
  title: string;
  summary: string;
  imageUrl: string;
}

export type FilterState = {
    region?: string;
    musicType?: string;
    eventType?: string;
    age?: string;
    tags: string[];
    date?: string;
};

export interface PartyContextType {
  parties: Party[];
  carousels: Carousel[];
  addParty: (url: string) => Promise<Party>;
  deleteParty: (partyId: string) => Promise<void>;
  updateParty: (partyToUpdate: Party) => Promise<void>;
  addCarousel: (title: string) => Promise<Carousel>;
  updateCarousel: (carousel: Carousel) => Promise<void>;
  deleteCarousel: (carouselId: string) => Promise<void>;
  renameTag: (tagId: string, newName: string) => Promise<void>;
  isLoading: boolean;
  refetchCarousels: () => Promise<void>;
  defaultReferral: string;
  setDefaultReferral: (code: string) => Promise<void>;
}


// Swiper types for React
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'swiper-container': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        init?: 'true' | 'false';
        navigation?: 'true' | 'false';
        pagination?: 'true' | 'false';
        loop?: 'true' | 'false';
        effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';
        'slides-per-view'?: number | 'auto';
        'centered-slides'?: 'true' | 'false';
        lazy?: 'true' | 'false';
        class?: string;
      }, HTMLElement>;
      'swiper-slide': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        lazy?: 'true' | 'false';
        class?: string;
      }, HTMLElement>;
    }
  }
}

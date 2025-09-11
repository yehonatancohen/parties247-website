// FIX: Import React to make React's DetailedHTMLProps available for JSX namespace augmentation.
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
}

export interface Carousel {
  id: string;
  title: string;
  partyIds: string[];
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

// Swiper types for React
// FIX: Add comprehensive type definitions for Swiper custom elements to fix TypeScript errors.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'swiper-container': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        init?: 'true' | 'false';
        // FIX: Add class property to resolve declaration conflicts and support web component usage.
        class?: string;
        // Add other common Swiper attributes for better type safety
        navigation?: 'true' | 'false';
        pagination?: 'true' | 'false';
        loop?: 'true' | 'false';
        effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';
        'slides-per-view'?: number | 'auto';
        'centered-slides'?: 'true' | 'false';
      };
      'swiper-slide': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement>,
        HTMLElement
      > & {
        lazy?: 'true' | 'false';
      };
    }
  }
}
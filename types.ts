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
// FIX: Refactored the Swiper custom element type definitions to resolve JSX errors.
// By explicitly merging custom props with React.HTMLAttributes inside React.DetailedHTMLProps,
// we ensure TypeScript correctly recognizes 'swiper-container' and 'swiper-slide'
// as valid JSX elements, along with all standard and custom attributes.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'swiper-container': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          // Swiper-specific attributes used in JSX
          init?: 'true' | 'false';
          navigation?: 'true' | 'false';
          pagination?: 'true' | 'false';
          loop?: 'true' | 'false';
          effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';
          'slides-per-view'?: number | 'auto';
          'centered-slides'?: 'true' | 'false';
          lazy?: 'true' | 'false';
          // The `class` attribute is used for web components instead of `className`
          class?: string;
        },
        HTMLElement
      >;
      'swiper-slide': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          lazy?: 'true' | 'false';
          // The `class` attribute is used for web components instead of `className`
          class?: string;
        },
        HTMLElement
      >;
    }
  }
}

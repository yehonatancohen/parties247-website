
export interface Party {
  id: string;
  slug: string;
  name: string;
  imageUrl: string;
  date: string; // ISO 8601 format
  location: {
    name: string;
    address?: string;
    geo?: {
      latitude: string;
      longitude: string;
    };
  };
  description: string;
  originalUrl: string;
  region: 'דרום' | 'מרכז' | 'צפון' | 'לא ידוע';
  musicType: 'מיינסטרים' | 'טכנו' | 'טראנס' | 'אחר';
  eventType: 'מסיבת בית' | 'מסיבת מועדון' | 'מסיבת טבע' | 'פסטיבל' | 'אחר';
  age: 'נוער' | '18+' | '21+' | 'כל הגילאים';
  tags: string[];
  referralCode?: string;
  eventStatus?: 'EventScheduled' | 'EventCancelled' | 'EventPostponed' | 'EventRescheduled';
  eventAttendanceMode?: 'OnlineEventAttendanceMode' | 'OfflineEventAttendanceMode' | 'MixedEventAttendanceMode';
  organizer?: {
    name: string;
    url?: string;
  };
  performer?: {
    name: string;
  };
}

export interface Article {
  id:string;
  slug: string;
  title: string;
  summary: string;
  imageUrl: string;
  content: string;
}

export interface Carousel {
  id: string;
  title: string;
  partyIds: string[];
  order: number;
}

export interface PartyProviderInitialState {
  parties?: Party[];
  carousels?: Carousel[];
  defaultReferral?: string;
  disableInitialFetch?: boolean;
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
  addCarousel: (title: string) => Promise<void>;
  deleteCarousel: (carouselId: string) => Promise<void>;
  updateCarousel: (carouselId: string, updates: { title?: string; order?: number }) => Promise<void>;
  addPartyToCarousel: (carouselId: string, partyId: string) => Promise<void>;
  removePartyFromCarousel: (carouselId: string, partyId: string) => Promise<void>;
  addPartiesFromSection: (payload: { carouselId: string; carouselTitle: string; url: string; }) => Promise<{ message: string; partyCount: number; warnings: any[] }>;
  isLoading: boolean;
  defaultReferral: string;
  setDefaultReferral: (code: string) => Promise<void>;
  error: string | null;
  loadingMessage: string | null;
}

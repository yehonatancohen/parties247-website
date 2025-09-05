
export interface Party {
  id: string;
  name: string;
  imageUrl: string;
  date: string; // ISO 8601 format
  location: string;
  description: string;
  originalUrl: string;
  isHot: boolean;
  region: 'דרום' | 'מרכז' | 'צפון' | 'לא ידוע';
  musicType: 'מיינסטרים' | 'טכנו' | 'טראנס' | 'אחר';
  eventType: 'מסיבת בית' | 'מסיבת מועדון' | 'מסיבת טבע' | 'פסטיבל' | 'אחר';
  age: 'נוער' | '18+' | '21+' | 'כל הגילאים';
  tags: string[];
  demand?: 'high' | 'normal';
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
import { MetadataRoute } from 'next';

import { BASE_URL } from '@/data/constants';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://parties247-backend.onrender.com/api';

interface BackendEvent {
  slug?: string;
  updated_at?: string;
  updatedAt?: string;
  startsAt?: string;
  date?: string;
}

const staticPages: MetadataRoute.Sitemap = [
  {
    url: `${BASE_URL}/`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 1.0,
  },
  {
    url: `${BASE_URL}/all-parties`,
    lastModified: new Date(),
    changeFrequency: 'daily',
    priority: 0.95,
  },
  {
    url: `${BASE_URL}/party-discovery`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/boutique-parties`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/techno-parties`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    changeFrequency: 'monthly',
    priority: 0.5,
  },
  {
    url: `${BASE_URL}/terms`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
  {
    url: `${BASE_URL}/privacy`,
    lastModified: new Date(),
    changeFrequency: 'yearly',
    priority: 0.3,
  },
];

const categoryPaths = [
  // Cities
  '/cities/tel-aviv',
  '/cities/haifa',
  '/cities/jerusalem',
  '/cities/eilat',
  '/cities/beer-sheva',

  // Audiences
  '/audience/student-parties',
  '/audience/teenage-parties',
  '/audience/soldier-parties',
  '/audience/24plus-parties',

  // Genres
  '/genre/techno-music',
  '/genre/trance',
  '/genre/house-music',
  '/genre/mainstream',

  // Days
  '/friday-parties',
  '/saturday-parties',
  '/weekend-parties',
  '/thursday-parties',
  '/day/today',

  // Specific party landing pages (from SPECIFIC_PARTIES_PAGES)
  '/parties/parties-in-tel-aviv-today',
  '/parties/parties-in-tel-aviv-weekend',
  '/parties/techno-parties-today',
  '/parties/techno-parties-weekend',
  '/parties/techno-parties-tel-aviv',
  '/parties/mainstream-parties-tel-aviv',
  '/parties/parties-in-haifa-and-north',
  '/parties/parties-in-south-and-beer-sheva',
  '/parties/18-plus-parties-tel-aviv',
  '/parties/18-plus-parties-weekend',
  '/parties/soldiers-parties-weekend',
  '/parties/students-parties-tel-aviv',
  '/parties/nature-trance-parties',
  '/parties/after-parties-tel-aviv',
  '/parties/sunset-parties',
];

async function fetchUpcomingEvents(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await fetch(`${API_URL}/parties`, {
      next: { revalidate: 3600 },
    });

    if (!response.ok) {
      console.error('Failed to fetch events for sitemap:', response.statusText);
      return [];
    }

    const events: BackendEvent[] = await response.json();
    const now = Date.now();

    return events
      .filter((event) => {
        const eventDate = new Date(event.startsAt || event.date || '').getTime();
        return Number.isFinite(eventDate) && eventDate >= now && Boolean(event.slug);
      })
      .map((event) => ({
        url: `${BASE_URL}/event/${event.slug}`,
        lastModified: new Date(event.updated_at || event.updatedAt || Date.now()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      }));
  } catch (error) {
    console.error('Error building dynamic event sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const categoryEntries: MetadataRoute.Sitemap = categoryPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const eventEntries = await fetchUpcomingEvents();

  return [...staticPages, ...categoryEntries, ...eventEntries];
}

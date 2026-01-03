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
    priority: 1.0, // Only Home is 1.0
  },
  {
    url: `${BASE_URL}/about`,
    lastModified: new Date(),
    priority: 0.5, // Standard pages are lower
  },
  {
    url: `${BASE_URL}/contact`,
    lastModified: new Date(),
    priority: 0.5,
  },
  // Add policies if you want them indexed, otherwise leave them out
  {
    url: `${BASE_URL}/terms`,
    lastModified: new Date(),
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
  
  // Genres
  '/genre/techno-music',
  '/genre/trance',
  
  // Days
  '/friday-parties',
  '/saturday-parties',
  '/weekend-parties',
  '/thursday-parties',
  '/day/today',
  
  // Discovery
  '/party-discovery',
  '/all-parties',
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
    priority: 0.9,
  }));

  const eventEntries = await fetchUpcomingEvents();

  return [...staticPages, ...categoryEntries, ...eventEntries];
}

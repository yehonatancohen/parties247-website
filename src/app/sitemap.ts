import { MetadataRoute } from 'next';

import { BASE_URL } from '@/data/constants';
import { articles } from '@/data/articles';
import { SPECIFIC_PARTIES_PAGES } from '@/lib/seoparties';
import { CITIES_WITH_INVENTORY } from '@/lib/internalLinks';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://parties247-backend.onrender.com/api';

interface BackendEvent {
  slug?: string;
  updated_at?: string;
  updatedAt?: string;
  startsAt?: string;
  date?: string;
}

const staticPages: MetadataRoute.Sitemap = [
  { url: `${BASE_URL}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
  { url: `${BASE_URL}/all-parties`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.95 },
  { url: `${BASE_URL}/party-discovery`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/archive`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.6 },
  { url: `${BASE_URL}/boutique-parties`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/articles`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/rosh-hashana`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: `${BASE_URL}/sukkot`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
  { url: `${BASE_URL}/purim`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  { url: `${BASE_URL}/tel-aviv-weekend-2026`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/friday-parties-guide`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.6 },
  { url: `${BASE_URL}/tickets-israel`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE_URL}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE_URL}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
];

// Evergreen taxonomy — only routes that exist AND are indexable. City pages are
// gated to the ones with real event inventory (the rest are noindex,follow).
const evergreenPaths = [
  ...CITIES_WITH_INVENTORY.map((c) => `/cities/${c}`),

  '/genre/techno-music',
  '/genre/rave-parties',
  '/genre/house-music',
  '/genre/mainstream-music',
  '/genre/trance-music',

  '/audience/teenage-parties',
  '/audience/24plus-parties',

  '/friday-parties',
  '/saturday-parties',
  '/thursday-parties',
  '/weekend-parties',
  '/day/today',
  '/day/friday',
  '/day/weekend',

  '/club/jimmy-who',
  '/club/moon-child',
];

async function fetchEvents(): Promise<MetadataRoute.Sitemap> {
  try {
    const response = await fetch(`${API_URL}/parties`, { next: { revalidate: 3600 } });
    if (!response.ok) {
      console.error('Failed to fetch events for sitemap:', response.statusText);
      return [];
    }

    const events: BackendEvent[] = await response.json();
    const now = Date.now();

    return events
      .filter((event) => Boolean(event.slug) && Number.isFinite(new Date(event.startsAt || event.date || '').getTime()))
      .map((event): MetadataRoute.Sitemap[number] => {
        const eventDate = new Date(event.startsAt || event.date || '').getTime();
        const isPast = eventDate < now;
        return {
          url: `${BASE_URL}/${isPast ? 'archive' : 'event'}/${event.slug}`,
          lastModified: new Date(event.updated_at || event.updatedAt || Date.now()),
          changeFrequency: isPast ? 'monthly' : 'weekly',
          priority: isPast ? 0.4 : 0.8,
        };
      });
  } catch (error) {
    console.error('Error building dynamic event sitemap:', error);
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const evergreenEntries: MetadataRoute.Sitemap = evergreenPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // /parties/* landing pages — skip the ones flagged noindex.
  const partiesEntries: MetadataRoute.Sitemap = SPECIFIC_PARTIES_PAGES.filter((p) => p.index !== false).map((p) => ({
    url: `${BASE_URL}/parties/${p.slug}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Individual magazine articles — previously only /articles (the index) was
  // submitted, so the guides that rank well weren't in the sitemap at all.
  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${BASE_URL}/articles/${encodeURIComponent(a.slug)}`,
    lastModified: new Date(a.dateModified || a.datePublished || Date.now()),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  const eventEntries = await fetchEvents();

  return [...staticPages, ...evergreenEntries, ...partiesEntries, ...articleEntries, ...eventEntries];
}

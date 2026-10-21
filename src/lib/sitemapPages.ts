/**
 * What goes into the sitemaps (see lib/sitemap.ts for the split and lastmod rules).
 */
import { BASE_URL } from '@/data/constants';
import { articles } from '@/data/articles';
import { SPECIFIC_PARTIES_PAGES } from '@/lib/seoparties';
import { CITIES_WITH_INVENTORY } from '@/lib/internalLinks';
import { withFetchBudget } from '@/lib/buildBudget';
import { buildEventSitemaps, type EventSitemaps, type SitemapEntry, type SitemapEvent } from '@/lib/sitemap';
import { ARTISTS } from '@/data/artists';

const apiBase = (process.env.NEXT_PUBLIC_API_URL || 'https://parties247-backend.onrender.com').replace(/\/$/, '');
const API_URL = apiBase.endsWith('/api') ? apiBase : `${apiBase}/api`;

const staticPages: SitemapEntry[] = [
  { url: `${BASE_URL}/`, changeFrequency: 'daily', priority: 1.0 },
  { url: `${BASE_URL}/all-parties`, changeFrequency: 'daily', priority: 0.95 },
  { url: `${BASE_URL}/party-discovery`, changeFrequency: 'weekly', priority: 0.8 },
  { url: `${BASE_URL}/archive`, changeFrequency: 'daily', priority: 0.6 },
  { url: `${BASE_URL}/boutique-parties`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/articles`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/rosh-hashana`, changeFrequency: 'weekly', priority: 0.6 },
  { url: `${BASE_URL}/sukkot`, changeFrequency: 'weekly', priority: 0.6 },
  { url: `${BASE_URL}/halloween`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/hanukkah`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/sylvester`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/purim`, changeFrequency: 'weekly', priority: 0.6 },
  { url: `${BASE_URL}/yom-haatzmaut`, changeFrequency: 'weekly', priority: 0.6 },
  { url: `${BASE_URL}/tel-aviv-weekend-2026`, changeFrequency: 'weekly', priority: 0.7 },
  { url: `${BASE_URL}/friday-parties-guide`, changeFrequency: 'weekly', priority: 0.6 },
  { url: `${BASE_URL}/tickets-israel`, changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
  { url: `${BASE_URL}/terms`, changeFrequency: 'yearly', priority: 0.3 },
  { url: `${BASE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
];

// Evergreen taxonomy — only routes that exist AND are indexable. City pages are
// gated to the ones with real event inventory (the rest are noindex,follow).
const evergreenPaths = [
  '/djs',
  ...ARTISTS.map(artist => `/dj/${artist.slug}`),
  '/genre/hip-hop-music',
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
  '/day/tomorrow',
  '/day/friday',
  '/day/weekend',

  '/club/jimmy-who',
  '/club/moon-child',
  '/club/room-48',
];

export async function loadEventSitemaps(): Promise<EventSitemaps> {
  try {
    const response = await withFetchBudget(
      fetch(`${API_URL}/parties`, { next: { revalidate: 3600 } }),
      'sitemap GET /parties'
    );
    if (!response.ok) {
      console.error('Failed to fetch events for sitemap:', response.statusText);
      return buildEventSitemaps([], BASE_URL);
    }
    const events: SitemapEvent[] = await response.json();
    return buildEventSitemaps(events, BASE_URL);
  } catch (error) {
    console.error('Error building dynamic event sitemap:', error);
    return buildEventSitemaps([], BASE_URL);
  }
}

/** Everything that isn't an event page. */
export function staticSitemapEntries(newest: Date | null): SitemapEntry[] {
  const listLastModified = newest ? { lastModified: newest.toISOString() } : {};
  const pages = staticPages.map((entry) =>
    entry.url === `${BASE_URL}/` || entry.url === `${BASE_URL}/all-parties` ? { ...entry, ...listLastModified } : entry
  );

  const evergreenEntries: SitemapEntry[] = evergreenPaths.map((path) => ({
    url: `${BASE_URL}${path}`,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  // /parties/* landing pages — skip the ones flagged noindex.
  const partiesEntries: SitemapEntry[] = SPECIFIC_PARTIES_PAGES.filter((p) => p.index !== false).map((p) => ({
    url: `${BASE_URL}/parties/${p.slug}`,
    changeFrequency: 'daily' as const,
    priority: 0.8,
  }));

  // Individual magazine articles — previously only /articles (the index) was
  // submitted, so the guides that rank well weren't in the sitemap at all.
  const articleEntries: SitemapEntry[] = articles.map((a) => {
    const modified = a.dateModified || a.datePublished;
    return {
      url: `${BASE_URL}/articles/${encodeURIComponent(a.slug)}`,
      ...(modified ? { lastModified: new Date(modified).toISOString() } : {}),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    };
  });

  return [...pages, ...evergreenEntries, ...partiesEntries, ...articleEntries];
}

/**
 * Sitemap index + child sitemaps (served by app/sitemap.xml and app/sitemaps/[name]).
 *
 * Split so Search Console reports indexing per part: `static` (taxonomy, landing
 * pages, articles), `events` (upcoming), and one `archive-YYYY-MM` per month of
 * past events.
 *
 * lastmod is only sent when we actually know it. It used to be the build time on
 * every URL, which teaches Google to ignore the field:
 *   - archive event: the event date (the page stops changing after it)
 *   - upcoming event: when the listing was created (the Mongo ObjectId timestamp)
 *   - article: its dateModified
 *   - home / all-parties: the newest listing's creation time
 *   - everything else: omitted
 */
import { toIsraelISO } from './dates';

export interface SitemapEntry {
  url: string;
  lastModified?: string;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface SitemapEvent {
  _id?: string;
  id?: string;
  slug?: string;
  date?: string;
  startsAt?: string;
}

/** Creation time encoded in a Mongo ObjectId (first 4 bytes = seconds since epoch). */
export function objectIdTime(id: string | undefined): Date | null {
  if (!id || !/^[0-9a-f]{24}$/i.test(id)) return null;
  const seconds = parseInt(id.slice(0, 8), 16);
  return Number.isFinite(seconds) && seconds > 0 ? new Date(seconds * 1000) : null;
}

export const ARCHIVE_PREFIX = 'archive-';

export interface EventSitemaps {
  events: SitemapEntry[];
  /** 'YYYY-MM' → archive entries for events that took place that month. */
  archive: Map<string, SitemapEntry[]>;
  /** Newest listing creation time, for the list pages' lastmod. */
  newest: Date | null;
}

/** Splits events into upcoming / archive-by-month, one URL per slug. */
export function buildEventSitemaps(events: SitemapEvent[], baseUrl: string, now: Date = new Date()): EventSitemaps {
  const result: EventSitemaps = { events: [], archive: new Map(), newest: null };
  const seen = new Set<string>();
  for (const event of events) {
    const raw = event.startsAt || event.date;
    if (!event.slug || !raw) continue;
    const start = new Date(toIsraelISO(raw));
    if (Number.isNaN(start.getTime())) continue;

    const created = objectIdTime(event._id || event.id);
    if (created && (!result.newest || created > result.newest)) result.newest = created;

    const isPast = start.getTime() < now.getTime();
    const url = `${baseUrl}/${isPast ? 'archive' : 'event'}/${event.slug}`;
    if (seen.has(url)) continue;
    seen.add(url);

    if (isPast) {
      const month = toIsraelISO(raw).slice(0, 7);
      const list = result.archive.get(month) ?? [];
      list.push({ url, lastModified: toIsraelISO(raw), changeFrequency: 'yearly', priority: 0.4 });
      result.archive.set(month, list);
    } else {
      result.events.push({
        url,
        ...(created ? { lastModified: created.toISOString() } : {}),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    }
  }
  return result;
}

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export function renderUrlset(entries: SitemapEntry[]): string {
  const body = entries
    .map((e) =>
      [
        '<url>',
        `<loc>${escapeXml(e.url)}</loc>`,
        e.lastModified ? `<lastmod>${escapeXml(e.lastModified)}</lastmod>` : '',
        e.changeFrequency ? `<changefreq>${e.changeFrequency}</changefreq>` : '',
        e.priority !== undefined ? `<priority>${e.priority}</priority>` : '',
        '</url>',
      ].join('')
    )
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>\n`;
}

export function renderSitemapIndex(sitemaps: { url: string; lastModified?: string }[]): string {
  const body = sitemaps
    .map((s) => `<sitemap><loc>${escapeXml(s.url)}</loc>${s.lastModified ? `<lastmod>${escapeXml(s.lastModified)}</lastmod>` : ''}</sitemap>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>\n`;
}

/** Newest lastmod among entries (for the index), or undefined. */
export function newestLastModified(entries: SitemapEntry[]): string | undefined {
  let best: string | undefined;
  let bestMs = -Infinity;
  for (const e of entries) {
    const ms = e.lastModified ? new Date(e.lastModified).getTime() : NaN;
    if (Number.isFinite(ms) && ms > bestMs) {
      bestMs = ms;
      best = new Date(ms).toISOString();
    }
  }
  return best;
}

import { BASE_URL } from '@/data/constants';
import { ARCHIVE_PREFIX, newestLastModified, renderSitemapIndex } from '@/lib/sitemap';
import { loadEventSitemaps, staticSitemapEntries } from '@/lib/sitemapPages';

export const revalidate = 3600;

/** Sitemap index — the URL robots.txt and Search Console point at. */
export async function GET() {
  const { events, archive, newest } = await loadEventSitemaps();
  const months = [...archive.keys()].sort().reverse();
  const xml = renderSitemapIndex([
    { url: `${BASE_URL}/sitemaps/static.xml`, lastModified: newestLastModified(staticSitemapEntries(newest)) },
    { url: `${BASE_URL}/sitemaps/events.xml`, lastModified: newestLastModified(events) },
    ...months.map((month) => ({
      url: `${BASE_URL}/sitemaps/${ARCHIVE_PREFIX}${month}.xml`,
      lastModified: newestLastModified(archive.get(month) ?? []),
    })),
  ]);
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

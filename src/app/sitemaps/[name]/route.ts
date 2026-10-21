import { ARCHIVE_PREFIX, renderUrlset, type SitemapEntry } from '@/lib/sitemap';
import { loadEventSitemaps, staticSitemapEntries } from '@/lib/sitemapPages';

export const revalidate = 3600;

/** /sitemaps/static.xml, /sitemaps/events.xml, /sitemaps/archive-YYYY-MM.xml */
export async function GET(_request: Request, { params }: { params: Promise<{ name: string }> }) {
  const { name } = await params;
  const id = name.replace(/\.xml$/, '');
  if (id === name) return new Response('Not Found', { status: 404 });

  const { events, archive, newest } = await loadEventSitemaps();
  let entries: SitemapEntry[] | undefined;
  if (id === 'static') entries = staticSitemapEntries(newest);
  else if (id === 'events') entries = events;
  else if (id.startsWith(ARCHIVE_PREFIX)) entries = archive.get(id.slice(ARCHIVE_PREFIX.length));

  if (!entries) return new Response('Not Found', { status: 404 });
  return new Response(renderUrlset(entries), { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}

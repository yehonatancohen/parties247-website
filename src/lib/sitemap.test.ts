import { describe, expect, it } from 'vitest';
import { buildEventSitemaps, newestLastModified, objectIdTime, renderSitemapIndex, renderUrlset } from './sitemap';

const BASE = 'https://www.parties247.co.il';
const NOW = new Date('2026-10-21T12:00:00Z');

describe('objectIdTime', () => {
  it('reads the creation second out of an ObjectId', () => {
    expect(objectIdTime('6a2a73218e0d3577d9f28df3')?.toISOString()).toBe('2026-06-11T08:34:41.000Z');
    expect(objectIdTime('not-an-id')).toBeNull();
    expect(objectIdTime(undefined)).toBeNull();
  });
});

describe('buildEventSitemaps', () => {
  const events = [
    { _id: '6a2a73218e0d3577d9f28df3', slug: 'pub-crawl-july-2026', date: '2026-07-03T22:00:00.000' },
    { _id: '6a2a73218e0d3577d9f28df4', slug: 'pub-crawl-july-2026', date: '2026-07-10T22:00:00.000' },
    { _id: '6a3a73218e0d3577d9f28df3', slug: 'decision', date: '2026-10-22T20:30:00.000' },
    { slug: 'no-date' },
    { date: '2026-10-22T20:30:00' },
  ];
  const { events: upcoming, archive, newest } = buildEventSitemaps(events, BASE, NOW);

  it('puts past events in their month and lists each URL once', () => {
    expect([...archive.keys()]).toEqual(['2026-07']);
    expect(archive.get('2026-07')?.map((e) => e.url)).toEqual([`${BASE}/archive/pub-crawl-july-2026`]);
  });

  it('gives an archive page its event date as lastmod, an upcoming one its creation time', () => {
    expect(archive.get('2026-07')?.[0].lastModified).toBe('2026-07-03T22:00:00+03:00');
    expect(upcoming).toHaveLength(1);
    expect(upcoming[0].url).toBe(`${BASE}/event/decision`);
    expect(upcoming[0].lastModified).toBe(objectIdTime('6a3a73218e0d3577d9f28df3')?.toISOString());
    expect(newest?.toISOString()).toBe(upcoming[0].lastModified);
  });

  it('treats a party as past by its Israel start time, not the UTC-parsed string', () => {
    // 14:30 Israel = 11:30Z, before NOW (12:00Z); read as UTC it would still look upcoming.
    const { archive: a } = buildEventSitemaps([{ slug: 'early', date: '2026-10-21T14:30:00' }], BASE, NOW);
    expect(a.get('2026-10')?.[0].url).toBe(`${BASE}/archive/early`);
  });
});

describe('rendering', () => {
  it('escapes URLs and omits unknown lastmod', () => {
    const xml = renderUrlset([{ url: `${BASE}/a?b=1&c=2` }]);
    expect(xml).toContain('<loc>https://www.parties247.co.il/a?b=1&amp;c=2</loc>');
    expect(xml).not.toContain('<lastmod>');
  });

  it('renders an index', () => {
    expect(renderSitemapIndex([{ url: `${BASE}/sitemaps/static.xml` }])).toContain('<sitemap><loc>https://www.parties247.co.il/sitemaps/static.xml</loc></sitemap>');
  });

  it('newestLastModified ignores entries without a date', () => {
    expect(newestLastModified([{ url: 'a' }, { url: 'b', lastModified: '2026-07-03T22:00:00+03:00' }])).toBe('2026-07-03T19:00:00.000Z');
    expect(newestLastModified([{ url: 'a' }])).toBeUndefined();
  });
});

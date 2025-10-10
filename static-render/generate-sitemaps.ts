import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { BASE_URL } from '../constants';
import { cities, genres, audiences, timeIntents, holidayIntents, topArticles, comboConfigs } from '../data/taxonomy';
import type { Party } from '../types';

const API_URL = 'https://parties247-backend.onrender.com/api/parties';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const outputDir = path.resolve(__dirname, '../public/sitemaps');

const buildUrl = (pathname: string) => `${BASE_URL}${pathname.startsWith('/') ? '' : '/'}${pathname}`;

const wrapSitemap = (urls: string[]) => `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
  .map((url) => `  <url>\n    <loc>${url}</loc>\n    <changefreq>daily</changefreq>\n  </url>`)
  .join('\n')}\n</urlset>\n`;

async function writeSitemap(filename: string, urls: string[]) {
  if (!urls.length) {
    return;
  }
  const filePath = path.join(outputDir, filename);
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, wrapSitemap(urls), 'utf8');
}

async function fetchParties(): Promise<Party[]> {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch parties: ${response.status}`);
    }
    const payload = await response.json();
    return Array.isArray(payload) ? payload : [];
  } catch (error) {
    console.warn('[sitemaps] Could not fetch parties, continuing without events sitemap.', error);
    return [];
  }
}

async function buildSitemaps() {
  const cityUrls = cities.map((config) => buildUrl(config.path));
  await writeSitemap('cities.xml', cityUrls);

  const audienceUrls = audiences.map((config) => buildUrl(config.path));
  await writeSitemap('audiences.xml', audienceUrls);

  const genreUrls = genres.map((config) => buildUrl(config.path));
  await writeSitemap('genres.xml', genreUrls);

  const categoryUrls = comboConfigs.map((config) => buildUrl(config.path));
  await writeSitemap('categories.xml', categoryUrls);

  const timeUrls = [...timeIntents, ...holidayIntents].map((config) => buildUrl(config.path));
  await writeSitemap('time-intents.xml', timeUrls);

  const articleUrls = topArticles.map((config) => buildUrl(config.path));
  await writeSitemap('articles.xml', articleUrls);

  const parties = await fetchParties();
  if (parties.length) {
    const today = new Date().toISOString().split('T')[0];
    const eventUrls = parties
      .filter((party) => party.slug)
      .map((party) => buildUrl(`/event/${party.slug}`));
    await writeSitemap(`events-${today}.xml`, eventUrls);
  }

  const sitemapFiles = await fs.readdir(outputDir);
  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapFiles
    .filter((name) => name.endsWith('.xml'))
    .map((name) => `  <sitemap>\n    <loc>${BASE_URL}/sitemaps/${name}</loc>\n  </sitemap>`)
    .join('\n')}\n</sitemapindex>\n`;
  await fs.writeFile(path.resolve(__dirname, '../public/sitemap.xml'), sitemapIndex, 'utf8');
}

buildSitemaps().catch((error) => {
  console.error('Failed to build sitemaps', error);
  process.exitCode = 1;
});

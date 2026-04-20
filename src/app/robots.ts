import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/'],
      },
      // Search engines
      { userAgent: 'Googlebot',     allow: '/' },
      { userAgent: 'Bingbot',       allow: '/' },
      // AI crawlers — explicitly allowed for indexing by AI platforms
      { userAgent: 'GPTBot',        allow: '/' },
      { userAgent: 'Google-Extended', allow: '/' },
      { userAgent: 'ClaudeBot',     allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'OAI-SearchBot', allow: '/' },
    ],
    sitemap: 'https://www.parties247.co.il/sitemap.xml',
  }
}
import React from 'react';
import { Party } from '../types';

interface SeoListPageProps {
  title: string;
  description: string;
  canonicalPath: string; // e.g. /city/tel-aviv
  parties: Party[];
}

// This is a "pure" component without hooks, designed for render-to-string on a server.
const SeoListPage: React.FC<SeoListPageProps> = ({ title, description, canonicalPath, parties }) => {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://parties247-website.vercel.app/ssg/'},
        { '@type': 'ListItem', 'position': 2, 'name': title }
    ]
  };

  return (
    <html lang="he" dir="rtl">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`${title} | Parties 24/7`}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={`https://parties247-website.vercel.app/ssg${canonicalPath}`} />
        <script type="application/ld+json">{JSON.stringify(breadcrumbJsonLd)}</script>
        <style>{`
          body { font-family: sans-serif; line-height: 1.6; padding: 1rem; background: #0a1a1a; color: #e0f0e3; }
          .container { max-width: 800px; margin: auto; }
          h1 { font-size: 2.5rem; color: #a7ff83; }
          a { color: #76c893; }
          ul { list-style: none; padding: 0; }
          li { margin-bottom: 1rem; border-bottom: 1px solid #162b2b; padding-bottom: 1rem; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <header>
            <h1>{title}</h1>
            <p>{description}</p>
          </header>
          <main>
            <h2>מסיבות קרובות</h2>
            <ul>
              {parties.map(party => (
                <li key={party.id}>
                  <a href={`https://parties247-website.vercel.app/ssg/event/${party.slug}`}>
                    <h3>{party.name}</h3>
                  </a>
                  <p>{party.location.name} - {new Date(party.date).toLocaleDateString('he-IL')}</p>
                </li>
              ))}
            </ul>
          </main>
           <footer>
            <p>
              זוהי גרסה סטטית של העמוד. <a href={`https://parties247-website.vercel.app/#${canonicalPath.replace('/city', '/all-parties?city=')}`}>לחוויה המלאה, בקרו באתר שלנו</a>.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default SeoListPage;

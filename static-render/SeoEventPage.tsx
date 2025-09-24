import React from 'react';
import { Party } from '../types';

interface SeoEventPageProps {
  party: Party;
}

// This is a "pure" component without hooks, designed for render-to-string on a server.
const SeoEventPage: React.FC<SeoEventPageProps> = ({ party }) => {
  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    'name': party.name,
    'startDate': party.date,
    'location': {
      '@type': 'Place',
      'name': party.location.name,
      'address': party.location.address || party.location.name,
    },
    'image': [party.imageUrl],
    'description': party.description,
    'offers': {
      '@type': 'Offer',
      'url': party.originalUrl,
      'availability': 'https://schema.org/InStock',
    },
  };
  
  return (
    <html lang="he" dir="rtl">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{`${party.name} | Parties 24/7`}</title>
        <meta name="description" content={party.description.substring(0, 160)} />
        <link rel="canonical" href={`https://parties247-website.vercel.app/ssg/event/${party.slug}`} />
        <script type="application/ld+json">{JSON.stringify(eventJsonLd)}</script>
        <style>{`
          body { font-family: sans-serif; line-height: 1.6; padding: 1rem; background: #0a1a1a; color: #e0f0e3; }
          .container { max-width: 800px; margin: auto; }
          img { max-width: 100%; height: auto; border-radius: 8px; }
          h1 { font-size: 2.5rem; color: #a7ff83; }
          a { color: #76c893; }
        `}</style>
      </head>
      <body>
        <div className="container">
          <header>
            <h1>{party.name}</h1>
          </header>
          <main>
            <img src={party.imageUrl} alt={party.name} width="800" height="600" />
            <p><strong>תאריך:</strong> {new Date(party.date).toLocaleString('he-IL')}</p>
            <p><strong>מיקום:</strong> {party.location.name}</p>
            <h2>תיאור</h2>
            <p>{party.description}</p>
            <a href={party.originalUrl} target="_blank" rel="noopener noreferrer">לרכישת כרטיסים</a>
          </main>
          <footer>
            <p>
              זוהי גרסה סטטית של העמוד. <a href={`https://parties247-website.vercel.app/#/event/${party.slug}`}>לחוויה המלאה, בקרו באתר שלנו</a>.
            </p>
          </footer>
        </div>
      </body>
    </html>
  );
};

export default SeoEventPage;

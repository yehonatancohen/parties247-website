import { Metadata } from 'next';
import HomeClient from '../components/HomeClient';
import { BASE_URL } from '@/data/constants';
import { getCarouselsData, getPartiesData } from '@/lib/api/parties';

async function getData() {
  const [parties, carousels] = await Promise.all([
    getPartiesData(),
    getCarouselsData(),
  ]);

  return {
    parties,
    carousels,
  };
}

export const metadata: Metadata = {
  title: 'כרטיסים למסיבות, פסטיבלים וחיי לילה | Parties24/7',
  description: 'כל המסיבות הכי חמות בישראל – תל אביב, חיפה, אילת ועוד. Parties24/7 היא פלטפורמת המסיבות של ישראל.',
  alternates: {
    canonical: '/',
  },
};

// 3. The Page Component
export default async function HomePage() {
  const data = await getData();

  // JSON-LD for SEO
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Parties 24/7",
    url: BASE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/all-parties?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      {/* Pass the server-fetched data to the client component */}
      <HomeClient 
        initialParties={data.parties || []} 
        initialCarousels={data.carousels || []} 
      />
    </>
  );
}
import { Metadata } from 'next';
import HomeClient from '../components/HomeClient';
import { BASE_URL } from '@/data/constants';

async function getData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  try {
    const partiesRes = await fetch(`${apiUrl}/api/parties`, { 
      next: { revalidate: 60 } 
    });

    const carouselsRes = await fetch(`${apiUrl}/api/carousels`, { 
      next: { revalidate: 60 } 
    });

    // Check if both succeeded
    if (!partiesRes.ok || !carouselsRes.ok) {
        console.error("Failed to fetch one of the endpoints");
        return { parties: [], carousels: [] };
    }

    let rawParties = await partiesRes.json();
    const carousels = await carouselsRes.json();
    const parties = Array.isArray(rawParties) 
      ? rawParties.map(p => ({ ...p, id: p._id })) 
      : [];

    return { 
      parties: Array.isArray(parties) ? parties : [], 
      carousels: Array.isArray(carousels) ? carousels : [] 
    };

  } catch (error) {
    console.error("Data fetch error:", error);
    return { parties: [], carousels: [] };
  }
}

export const metadata: Metadata = {
  title: 'מסיבות בתל אביב | Parties247',
  description: 'כל המסיבות הכי חמות בישראל – תל אביב, חיפה, אילת ועוד. Parties247 היא פלטפורמת המסיבות של ישראל.',
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
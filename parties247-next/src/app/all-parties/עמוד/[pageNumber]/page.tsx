import React from 'react';
import { Metadata } from 'next';
import PartyGrid from '@/components/PartyGrid';
import * as api from '@/services/api';
import { createCarouselSlug } from '@/lib/carousels';

// Handle dynamic routes like /all-parties/עמוד/2
interface Props {
  params: { slug?: string[] };
  searchParams: { query?: string };
}

/**
 * 1. SERVER-SIDE DATA FETCHING
 * We fetch ALL parties here. This ensures the initial HTML contains the content.
 */
async function getPageData() {
  try {
    const [parties, carousels] = await Promise.all([
      api.getParties(),
      api.getCarousels(),
    ]);

    // OPTIMIZATION: Filter out past parties on the Server
    // This reduces the JSON payload size sent to the client
    const now = new Date();
    const futureParties = parties.filter(p => new Date(p.date) >= now);

    // Calculate "Hot Now" IDs on the server
    const hotNowCarousel = carousels.find((carousel) => {
      const slug = createCarouselSlug(carousel.title);
      return (
        slug === "hot-now" ||
        slug === "חם-עכשיו" ||
        (slug.includes("hot") && slug.includes("now")) ||
        slug.includes("חם-עכשיו")
      );
    });
    
    const hotPartyIds = hotNowCarousel?.partyIds || [];

    return { parties: futureParties, hotPartyIds };
  } catch (error) {
    console.error("Failed to fetch parties:", error);
    return null;
  }
}

/**
 * 2. SEO METADATA
 */
export const metadata: Metadata = {
  title: 'כל המסיבות | Parties 24/7',
  description: 'מצאו את הבילוי הבא שלכם בג\'ונגל העירוני. כל המסיבות, הפסטיבלים והאירועים במקום אחד.',
  alternates: {
    canonical: '/all-parties',
  }
};

/**
 * 3. MAIN SERVER COMPONENT
 */
export default async function AllPartiesPage({ params, searchParams }: Props) {
  const data = await getPageData();

  if (!data) {
    // Basic error handling - potentially show an error component
    return (
      <div className="container mx-auto px-4 text-center py-16">
        <h2 className="text-2xl font-bold text-red-400">שגיאה בטעינת המסיבות</h2>
        <p className="text-white/80">אנא נסו לרענן את העמוד</p>
      </div>
    );
  }

  // Parse Page Number from URL (e.g., /all-parties/עמוד/2)
  // params.slug might be undefined (page 1) or ["עמוד", "2"]
  let currentPage = 1;
  if (params.slug && params.slug[0] === 'עמוד' && params.slug[1]) {
    const pageNum = parseInt(params.slug[1], 10);
    if (!isNaN(pageNum)) {
      currentPage = pageNum;
    }
  }

  // Pass data to the Client Component
  return (
    <PartyGrid
      parties={data.parties}
      hotPartyIds={Array.from(new Set(data.hotPartyIds || []))}
      currentPage={currentPage}
      title="כל המסיבות"
      description="מצאו את הבילוי הבא שלכם בג'ונגל העירוני"
      syncNavigation
      basePath="/all-parties"
    />
  );
}
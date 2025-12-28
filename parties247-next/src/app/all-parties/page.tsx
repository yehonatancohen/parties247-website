import React from 'react';
import { Metadata } from 'next';
import PartyGrid from '@/components/PartyGrid';
import * as api from '@/services/api';
import { createCarouselSlug } from '@/lib/carousels';

// Helper function to fetch and prepare data
// We keep this separate so we can reuse the logic concept, though we'll just call it directly here
async function getPageData() {
  try {
    const [parties, carousels] = await Promise.all([
      api.getParties(),
      api.getCarousels(),
    ]);

    // Filter out past parties on server
    const now = new Date();
    const futureParties = parties.filter(p => new Date(p.date) >= now);

    // Calculate Hot IDs on server
    const hotNowCarousel = carousels.find((carousel) => {
      const slug = createCarouselSlug(carousel.title);
      return (
        slug === "hot-now" || slug === "חם-עכשיו" ||
        (slug.includes("hot") && slug.includes("now")) ||
        slug.includes("חם-עכשיו")
      );
    });

    return { 
      parties: futureParties, 
      hotPartyIds: hotNowCarousel?.partyIds || [] 
    };
  } catch (error) {
    console.error("Failed to fetch parties:", error);
    return null;
  }
}

export const metadata: Metadata = {
  title: 'כל המסיבות | Parties 24/7',
  description: 'מצאו את הבילוי הבא שלכם בג\'ונגל העירוני.',
  alternates: { canonical: '/all-parties' }
};

export default async function AllPartiesPage({ searchParams }: { searchParams: { query?: string } }) {
  const data = await getPageData();
  const { query } = searchParams;

  if (!data) return <div className="text-center text-white p-10">Error loading parties</div>;

  return (
    <PartyGrid
      parties={data.parties}
      hotPartyIds={new Set(data.hotPartyIds)}
      initialPage={1}
      initialQuery={query || ''}
      title="כל המסיבות"
      description="מצאו את הבילוי הבא שלכם בג'ונגל העירוני"
      syncNavigation
      basePath="/all-parties"
    />
  );
}
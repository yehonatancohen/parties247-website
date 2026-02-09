import { Metadata } from 'next';
import PartyGrid from '@/components/PartyGrid';
import * as api from '@/services/api';
import { createCarouselSlug } from '@/lib/carousels';
import { notFound } from 'next/navigation';

// Handle dynamic routes like /all-parties/עמוד/2
interface Props {
  params: Promise<{ pageNumber: string }>;
  searchParams: Promise<{ query?: string }>;
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
export default async function AllPartiesPaginatedPage({ params }: Props) {
  const { pageNumber } = await params;
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
  const currentPage = parseInt(pageNumber, 10);

  // Validate page number
  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
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

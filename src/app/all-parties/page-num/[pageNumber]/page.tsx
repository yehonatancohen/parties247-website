import Link from 'next/link';
import { Metadata } from 'next';
import PartyGrid from '@/components/PartyGrid';
import * as api from '@/services/api';
import { findHotNowCarousel } from '@/lib/carousels';
import { notFound } from 'next/navigation';

// Handle dynamic routes like /all-parties/עמוד/2
interface Props {
  params: Promise<{ pageNumber: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
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
    const hotNowCarousel = findHotNowCarousel(carousels);
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
  title: 'כל המסיבות',
  description: 'מצאו את הבילוי הבא שלכם בג\'ונגל העירוני. כל המסיבות, הפסטיבלים והאירועים במקום אחד.',
  alternates: {
    canonical: '/all-parties',
  }
};

/**
 * 3. MAIN SERVER COMPONENT
 */
export default async function AllPartiesPaginatedPage({ params, searchParams }: Props) {
  const { pageNumber } = await params;
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : undefined;
  const ai_filter = typeof resolvedSearchParams.ai_filter === 'string' ? resolvedSearchParams.ai_filter : undefined;
  const data = await getPageData();

  if (!data) {
    return (
      <div className="font-apple mx-auto flex min-h-[60vh] max-w-[560px] flex-col items-center justify-center px-4 py-20 text-center text-ink">
        <h1 className="text-[28px] font-bold sm:text-[36px]">הרשימה לא נטענה כרגע</h1>
        <p className="mt-3 text-[17px] text-ink-2">שרת המסיבות מתעכב. נסו לרענן בעוד רגע, או התחילו מעמוד הבית.</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full reload is the retry */}
          <a href="/all-parties" className="rounded-full bg-action px-6 py-3 text-[17px] font-medium text-on-action transition-colors hover:bg-action-hover">לנסות שוב</a>
          <Link href="/" className="text-[17px] text-link hover:underline underline-offset-4">לעמוד הבית</Link>
        </div>
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
      searchParams={resolvedSearchParams}
      currentPage={currentPage}
      title="כל המסיבות"
      description="מצאו את הבילוי הבא שלכם בג'ונגל העירוני"
      syncNavigation
      basePath="/all-parties"
      aiFilterIds={ai_filter ? ai_filter.split(',') : undefined}
      aiQuery={query}
    />
  );
}

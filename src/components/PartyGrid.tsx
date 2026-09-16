import React from 'react';
import Link from "next/link";
import { Party, FilterState } from '@/data/types'; // Adjust path
import PartyCard from './PartyCard';
import { sortPromotedWithinNight } from './home/homeData';

// These must be Client Components that read/write to the URL
import AdvancedFilter from './AdvancedFilter';
import AllPartiesAISearch from './AllPartiesAISearch';

const DEFAULT_PAGE_SIZE = 20;

interface PartyGridProps {
  parties: Party[];
  hotPartyIds?: string[];
  searchParams?: { [key: string]: string | string[] | undefined };
  currentPage?: number;
  basePath?: string;
  title?: string;
  description?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  pageSize?: number;
  syncNavigation?: boolean;
  aiFilterIds?: string[];
  aiQuery?: string;
  topSection?: React.ReactNode;
}

export default function PartyGrid({
  parties,
  hotPartyIds = [],
  searchParams = {},
  currentPage = 1,
  basePath = '/all-parties',
  title,
  description,
  showFilters = true,
  showSearch = true,
  pageSize = DEFAULT_PAGE_SIZE,
  syncNavigation = false,
  aiFilterIds,
  aiQuery,
  topSection,
}: PartyGridProps) {

  const searchTerm = typeof searchParams.query === 'string' ? searchParams.query : '';

  const filters: FilterState = {
    region: typeof searchParams.region === 'string' ? searchParams.region : '',
    musicType: typeof searchParams.musicType === 'string' ? searchParams.musicType : '',
    eventType: typeof searchParams.eventType === 'string' ? searchParams.eventType : '',
    age: typeof searchParams.age === 'string' ? searchParams.age : '',
    date: typeof searchParams.date === 'string' ? searchParams.date : '',
    tags: typeof searchParams.tags === 'string' ? searchParams.tags.split(',') : [],
    weekday: typeof searchParams.weekday === 'string' ? parseInt(searchParams.weekday) : undefined,
  };

  const now = new Date();
  const lowercasedTerm = searchTerm.toLowerCase();

  // If AI filter is active, use those specific party IDs
  const aiFilterSet = aiFilterIds ? new Set(aiFilterIds) : null;

  const filteredParties = sortPromotedWithinNight(parties
    .filter((party) => new Date(party.date) >= now) // Filter past events
    .filter((party) => {
      // AI Filter takes priority - if AI filter is active, only show those parties
      if (aiFilterSet) {
        return aiFilterSet.has(party.id);
      }

      // Search Term Logic
      if (
        searchTerm &&
        !party.name.toLowerCase().includes(lowercasedTerm) &&
        !party.location.name.toLowerCase().includes(lowercasedTerm) &&
        !party.description.toLowerCase().includes(lowercasedTerm)
      ) {
        return false;
      }

      // Advanced Filter Logic
      if (filters.weekday !== undefined && new Date(party.date).getDay() !== filters.weekday) return false;
      if (filters.region && party.region !== filters.region) return false;
      if (filters.musicType && party.musicType !== filters.musicType) return false;
      if (filters.eventType && party.eventType !== filters.eventType) return false;
      if (filters.age && party.age !== filters.age) return false;
      if (filters.tags.length > 0 && !filters.tags.every((tag) => party.tags.includes(tag))) return false;

      if (filters.date) {
        const partyDate = new Date(party.date).toISOString().split("T")[0];
        const filterDate = new Date(filters.date).toISOString().split("T")[0];
        if (partyDate !== filterDate) return false;
      }

      return true;
    })
);

  // 3. Pagination Logic
  const totalPages = Math.max(1, Math.ceil(filteredParties.length / pageSize));

  // Ensure currentPage is valid
  const safeCurrentPage = Math.min(Math.max(1, currentPage), totalPages);

  const paginatedParties = filteredParties.slice(
    (safeCurrentPage - 1) * pageSize,
    safeCurrentPage * pageSize
  );

  // Helper to generate pagination links while keeping current search params
  const createPageLink = (page: number) => {
    const params = new URLSearchParams(searchParams as Record<string, string>);
    // If you use query params for pages: params.set('page', page.toString());
    // If you use path based pages (/page/2), we handle it in the return string:

    // Construct Query String (query=techno&region=center...)
    const queryString = params.toString() ? `?${params.toString()}` : '';

    return page === 1
      ? `${basePath}${queryString}`
      : `${basePath}/page-num/${page}${queryString}`;
  };

  return (
    <div id="party-grid-container" className="font-apple mx-auto max-w-[1200px] px-4 pt-10 sm:px-6 md:pt-14">
      {(title || description) && (
        <div className="mb-8 text-center">
          {title && <h1 className="text-balance text-[34px] font-bold leading-tight text-ink sm:text-[48px]">{title}</h1>}
          {description && <p className="mx-auto mt-3 max-w-xl text-[17px] text-ink-2 sm:text-[19px]">{description}</p>}
        </div>
      )}

      {showSearch && (
        <div className="mb-8">
          <AllPartiesAISearch defaultQuery={aiQuery} />
        </div>
      )}

      {topSection}

      {/* AI Search Results Indicator */}
      {aiFilterSet && aiQuery && (
        <div className="mb-6 max-w-4xl mx-auto">
          <div className="rounded-[22px] bg-tile p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-tile-raised text-link">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="flex-grow">
                <p className="mb-0.5 text-[13px] font-semibold text-ink-3">חיפוש חכם</p>
                <p className="text-[15px] text-ink-2">
                  מציג {filteredParties.length} מסיבות שנמצאו עבור: <span className="font-semibold text-ink">"{aiQuery}"</span>
                </p>
              </div>
              <Link
                href="/all-parties"
                className="whitespace-nowrap text-[14px] text-link hover:underline underline-offset-4"
              >
                נקה חיפוש
              </Link>
            </div>
          </div>
        </div>
      )}

      {showFilters && (
        /* NOTE: AdvancedFilter must be a Client Component.
           It should accept 'defaultFilters' and push to router on change.
        */
        <AdvancedFilter defaultFilters={filters} />
      )}

      {paginatedParties.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:grid-cols-3 sm:gap-x-5 sm:gap-y-10 lg:grid-cols-4 xl:grid-cols-5">
          {paginatedParties.map((party) => (
            <PartyCard
              key={party.id}
              party={party}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-[22px] bg-tile py-16 text-center text-[17px] text-ink-2">
          <p>לא נמצאו מסיבות התואמות את החיפוש שלך.</p>
          <Link
            href={basePath}
            className="mt-3 inline-block text-link hover:underline underline-offset-4"
          >
            נקה סינונים
          </Link>
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-14 flex items-center justify-center gap-4" aria-label="עמודים">
          {/* Previous Button */}
          {safeCurrentPage > 1 ? (
            <Link
              href={createPageLink(safeCurrentPage - 1)}
              className="rounded-full bg-tile px-5 py-2 text-[15px] text-ink transition-colors hover:bg-tile-hover"
              scroll={false} // Optional: prevents scroll jump to top
            >
              הקודם
            </Link>
          ) : (
            <button disabled className="cursor-not-allowed rounded-full bg-tile px-5 py-2 text-[15px] text-ink-3/60">
              הקודם
            </button>
          )}

          <span className="text-[14px] tabular-nums text-ink-3">
            עמוד {safeCurrentPage} מתוך {totalPages}
          </span>

          {/* Next Button */}
          {safeCurrentPage < totalPages ? (
            <Link
              href={createPageLink(safeCurrentPage + 1)}
              className="rounded-full bg-tile px-5 py-2 text-[15px] text-ink transition-colors hover:bg-tile-hover"
              scroll={false}
            >
              הבא
            </Link>
          ) : (
            <button disabled className="cursor-not-allowed rounded-full bg-tile px-5 py-2 text-[15px] text-ink-3/60">
              הבא
            </button>
          )}
        </nav>
      )}
    </div>
  );
}
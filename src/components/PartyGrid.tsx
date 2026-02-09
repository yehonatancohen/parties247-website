import React from 'react';
import Link from "next/link";
import { Party, FilterState } from '@/data/types'; // Adjust path
import PartyCard from './PartyCard';

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

  const hotIdsSet = new Set(hotPartyIds);
  const now = new Date();
  const lowercasedTerm = searchTerm.toLowerCase();

  // If AI filter is active, use those specific party IDs
  const aiFilterSet = aiFilterIds ? new Set(aiFilterIds) : null;

  const filteredParties = parties
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
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

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
    <div id="party-grid-container" className="container mx-auto px-4 pt-10 md:pt-14">
      {(title || description) && (
        <div className="text-center mb-6">
          {title && <h1 className="text-3xl md:text-4xl font-display text-white mb-2">{title}</h1>}
          {description && <p className="text-center text-jungle-text/80 max-w-xl mx-auto">{description}</p>}
        </div>
      )}

      {showSearch && (
        <div className="mb-8">
          <AllPartiesAISearch defaultQuery={aiQuery} />
        </div>
      )}

      {/* AI Search Results Indicator */}
      {aiFilterSet && aiQuery && (
        <div className="mb-6 max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-jungle-surface/80 to-jungle-deep/80 border-2 border-jungle-accent/50 rounded-xl p-4 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-jungle-accent to-jungle-lime flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-jungle-deep" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div className="flex-grow">
                <p className="text-jungle-accent font-bold text-sm mb-1">חיפוש מופעל AI</p>
                <p className="text-jungle-text/90 text-sm">
                  מציג {filteredParties.length} מסיבות שנמצאו עבור: <span className="text-white font-semibold">"{aiQuery}"</span>
                </p>
              </div>
              <Link
                href="/all-parties"
                className="px-4 py-2 bg-jungle-surface/60 hover:bg-jungle-surface border border-jungle-accent/30 hover:border-jungle-accent text-jungle-accent rounded-lg text-sm transition-all whitespace-nowrap"
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {paginatedParties.map((party) => (
            <PartyCard
              key={party.id}
              party={party}
              showDiscountCode={hotIdsSet.has(party.id)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-white/60">
          <p>לא נמצאו מסיבות התואמות את החיפוש שלך.</p>
          <Link
            href={basePath}
            className="mt-4 inline-block text-jungle-accent underline"
          >
            נקה סינונים
          </Link>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          {/* Previous Button */}
          {safeCurrentPage > 1 ? (
            <Link
              href={createPageLink(safeCurrentPage - 1)}
              className="px-4 py-2 bg-jungle-surface text-white rounded transition hover:bg-white/10"
              scroll={false} // Optional: prevents scroll jump to top
            >
              הקודם
            </Link>
          ) : (
            <button disabled className="px-4 py-2 bg-jungle-surface text-white/50 rounded cursor-not-allowed">
              הקודם
            </button>
          )}

          <span className="text-white">
            עמוד {safeCurrentPage} מתוך {totalPages}
          </span>

          {/* Next Button */}
          {safeCurrentPage < totalPages ? (
            <Link
              href={createPageLink(safeCurrentPage + 1)}
              className="px-4 py-2 bg-jungle-surface text-white rounded transition hover:bg-white/10"
              scroll={false}
            >
              הבא
            </Link>
          ) : (
            <button disabled className="px-4 py-2 bg-jungle-surface text-white/50 rounded cursor-not-allowed">
              הבא
            </button>
          )}
        </div>
      )}
    </div>
  );
}
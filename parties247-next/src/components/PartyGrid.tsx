"use client";

import React, { useMemo, useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { FilterState, Party } from '@/data/types';
import PartyCard from './PartyCard';
import AdvancedFilter from './AdvancedFilter';
import PartySearchInput from './PartySearchInput';

interface PartyGridProps {
  parties: Party[];
  hotPartyIds?: Set<string>;
  initialPage?: number;
  initialQuery?: string;
  initialFilters?: Partial<FilterState>;
  title?: string;
  description?: string;
  showFilters?: boolean;
  showSearch?: boolean;
  pageSize?: number;
  syncNavigation?: boolean;
  basePath?: string;
}

const DEFAULT_FILTERS: FilterState = {
  region: '',
  musicType: '',
  eventType: '',
  age: '',
  tags: [],
  date: '',
  weekday: undefined,
};

const DEFAULT_PAGE_SIZE = 20;

const PartyGrid: React.FC<PartyGridProps> = ({
  parties,
  hotPartyIds,
  initialPage = 1,
  initialQuery = '',
  initialFilters,
  title,
  description,
  showFilters = true,
  showSearch = true,
  pageSize = DEFAULT_PAGE_SIZE,
  syncNavigation = false,
  basePath = '/all-parties'
}) => {
  const router = useRouter();
  const mergedInitialFilters = useMemo(() => ({ ...DEFAULT_FILTERS, ...initialFilters }), [initialFilters]);

  const [filters, setFilters] = useState<FilterState>(mergedInitialFilters);
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    if (!syncNavigation) return;
    const querySuffix = searchTerm ? `?query=${encodeURIComponent(searchTerm)}` : "";
    const href = currentPage === 1
      ? `${basePath}${querySuffix}`
      : `${basePath}/עמוד/${currentPage}${querySuffix}`;
    router.push(href, { scroll: false });
  }, [basePath, currentPage, router, searchTerm, syncNavigation]);

  useEffect(() => {
    setFilters(mergedInitialFilters);
  }, [mergedInitialFilters]);

  const filteredParties = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    const now = new Date();

    return parties
      .filter((party) => new Date(party.date) >= now)
      .filter((party) => {
        if (
          searchTerm &&
          !party.name.toLowerCase().includes(lowercasedTerm) &&
          !party.location.name.toLowerCase().includes(lowercasedTerm) &&
          !party.description.toLowerCase().includes(lowercasedTerm)
        ) {
          return false;
        }

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
  }, [filters, parties, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredParties.length / pageSize));
  const paginatedParties = filteredParties.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div id="all-parties" className="container mx-auto px-4">
      {(title || description) && (
        <div className="text-center mb-6">
          {title && <h1 className="text-3xl md:text-4xl font-display text-white mb-2">{title}</h1>}
          {description && <p className="text-center text-jungle-text/80 max-w-xl mx-auto">{description}</p>}
        </div>
      )}

      {showSearch && (
        <div className="mb-6 max-w-2xl mx-auto">
          <PartySearchInput
            value={searchTerm}
            onChange={(value) => {
              setSearchTerm(value);
              setCurrentPage(1);
            }}
          />
        </div>
      )}

      {showFilters && (
        <AdvancedFilter
          defaultFilters={mergedInitialFilters}
          onFilterChange={(newFilters) => {
            setFilters((prev) => ({ ...prev, ...newFilters }));
            setCurrentPage(1);
          }}
        />
      )}

      {paginatedParties.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {paginatedParties.map((party) => (
            <PartyCard key={party.id} party={party} showDiscountCode={hotPartyIds?.has(party.id)} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 text-white/60">
          <p>לא נמצאו מסיבות התואמות את החיפוש שלך.</p>
          <button
            onClick={() => {
              setSearchTerm('');
              setFilters(mergedInitialFilters);
            }}
            className="mt-4 text-jungle-accent underline"
          >
            נקה סינונים
          </button>
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-8">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-jungle-surface text-white rounded disabled:opacity-50 transition hover:bg-white/10"
          >
            הקודם
          </button>
          <span className="text-white">
            עמוד {currentPage} מתוך {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 bg-jungle-surface text-white rounded disabled:opacity-50 transition hover:bg-white/10"
          >
            הבא
          </button>
        </div>
      )}
    </div>
  );
};

export default PartyGrid;

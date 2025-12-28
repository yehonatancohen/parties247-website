"use client";

import React, { useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import PartyGrid from "@/components/PartyGrid";
import AdvancedFilter from "@/components/AdvancedFilter";
import { SearchIcon } from "@/components/Icons";
import { FilterState, Party } from "@/data/types"; // Adjust path as needed

const PARTIES_PER_PAGE = 20;

type Props = {
  initialParties: Party[];
  hotPartyIds: string[];
  initialPage: number;
  initialQuery?: string;
};

export default function AllPartiesClient({ 
  initialParties, 
  hotPartyIds, 
  initialPage, 
  initialQuery = "" 
}: Props) {
  const router = useRouter();

  // Initialize state from Server Props
  const [filters, setFilters] = useState<FilterState>({ tags: [] });
  const [searchTerm, setSearchTerm] = useState(initialQuery);
  const [currentPage, setCurrentPage] = useState(initialPage);

  // Sync URL when page changes
  useEffect(() => {
    const querySuffix = searchTerm ? `?query=${encodeURIComponent(searchTerm)}` : "";
    
    // Construct Path based on your folder structure
    // Page 1 -> /all-parties
    // Page 2+ -> /all-parties/עמוד/2
    const href = currentPage === 1 
      ? `/all-parties${querySuffix}` 
      : `/all-parties/עמוד/${currentPage}${querySuffix}`;

    // Update URL without reloading the page
    router.push(href, { scroll: false });
  }, [currentPage, searchTerm, router]);

  const filteredParties = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();

    // Note: Future-date filtering is done on Server to save bandwidth, 
    // but we keep the logic here for safety in case client state shifts.
    return initialParties
      .filter((party) => {
        if (
          searchTerm &&
          !party.name.toLowerCase().includes(lowercasedTerm) &&
          !party.location.name.toLowerCase().includes(lowercasedTerm) &&
          !party.description.toLowerCase().includes(lowercasedTerm)
        ) {
          return false;
        }

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
  }, [initialParties, filters, searchTerm]);

  const totalPages = Math.ceil(filteredParties.length / PARTIES_PER_PAGE);
  const paginatedParties = filteredParties.slice(
    (currentPage - 1) * PARTIES_PER_PAGE,
    currentPage * PARTIES_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div id="all-parties" className="container mx-auto px-4">
      <h1 className="text-3xl md:text-4xl font-display text-center mb-2 text-white">כל המסיבות</h1>
      <p className="text-center text-jungle-text/80 mb-6 max-w-lg mx-auto">מצאו את הבילוי הבא שלכם בג'ונגל העירוני</p>

      {/* Search */}
      <div className="mb-6 max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
            <SearchIcon className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="חיפוש מסיבה (לפי שם, מקום...)"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to page 1 on new search
            }}
            className="bg-jungle-surface border border-wood-brown text-white text-sm rounded-lg focus:ring-jungle-lime focus:border-jungle-lime block w-full p-3.5 pr-12"
          />
        </div>
      </div>

      <AdvancedFilter onFilterChange={(newFilters) => {
        setFilters(newFilters);
        setCurrentPage(1); 
      }} />

      {/* Grid */}
      {paginatedParties.length > 0 ? (
        <PartyGrid parties={paginatedParties} hotPartyIds={new Set(hotPartyIds)} />
      ) : (
        <div className="text-center py-16 text-white/60">
          <p>לא נמצאו מסיבות התואמות את החיפוש שלך.</p>
          <button 
            onClick={() => {setSearchTerm(''); setFilters({tags:[]});}}
            className="mt-4 text-jungle-accent underline"
          >
            נקה סינונים
          </button>
        </div>
      )}

      {/* Pagination */}
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
}
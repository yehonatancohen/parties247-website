import React, { useState, useMemo } from 'react';
import { useParties } from '../hooks/useParties';
import PartyGrid from '../components/PartyGrid';
import SeoManager from '../components/SeoManager';
import LoadingSpinner from '../components/LoadingSpinner';
import AdvancedFilter from '../components/AdvancedFilter';
import { FilterState } from '../types';
import { SearchIcon } from '../components/Icons';

const AllPartiesPage: React.FC = () => {
  const { parties, isLoading } = useParties();
  const [filters, setFilters] = useState<FilterState>({ tags: [] });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParties = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    
    return parties.filter(party => {
        if (searchTerm &&
            !party.name.toLowerCase().includes(lowercasedTerm) &&
            !party.location.toLowerCase().includes(lowercasedTerm) &&
            !party.description.toLowerCase().includes(lowercasedTerm)
        ) {
            return false;
        }

        if (filters.region && party.region !== filters.region) return false;
        if (filters.musicType && party.musicType !== filters.musicType) return false;
        if (filters.eventType && party.eventType !== filters.eventType) return false;
        if (filters.age && party.age !== filters.age) return false;
        if (filters.tags.length > 0 && !filters.tags.every(tag => party.tags.includes(tag))) return false;
        if (filters.date) {
            const partyDate = new Date(party.date).setHours(0,0,0,0);
            const filterDate = new Date(filters.date).setHours(0,0,0,0);
            if (partyDate !== filterDate) return false;
        }
        return true;
    });
  }, [parties, filters, searchTerm]);

  const pageTitle = 'כל המסיבות - Parties 24/7';
  const pageDescription = 'חיפוש וסינון בכל המסיבות, הרייבים והאירועים בישראל. מצאו את המסיבה המושלמת עבורכם לפי אזור, סגנון מוזיקה, תאריך ועוד.';

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  return (
    <>
      <SeoManager title={pageTitle} description={pageDescription} parties={parties} />

      <div id="all-parties">
        <h1 className="text-4xl md:text-5xl font-display text-center mb-4 text-white">כל המסיבות</h1>
        <p className="text-center text-jungle-text/80 mb-8 max-w-lg mx-auto">מצאו את הבילוי הבא שלכם בג'ונגל העירוני</p>
        
        <div className="mb-6 max-w-2xl mx-auto">
          <div className="relative">
              <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                  <SearchIcon className="w-5 h-5 text-gray-400" />
              </div>
              <input
                  type="text"
                  aria-label="Search for a party by name, location or description"
                  placeholder="חיפוש מסיבה (לפי שם, מקום...)"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-jungle-surface border border-wood-brown text-white text-sm rounded-lg focus:ring-jungle-lime focus:border-jungle-lime block w-full p-3.5 pr-12"
              />
          </div>
        </div>

        <AdvancedFilter onFilterChange={setFilters} />
        <PartyGrid parties={filteredParties} />
      </div>
    </>
  );
};

export default AllPartiesPage;
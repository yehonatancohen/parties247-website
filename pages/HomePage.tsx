
import React, { useState, useMemo } from 'react';
import { useParties } from '../hooks/useParties';
import PartyGrid from '../components/PartyGrid';
import BlogSection from '../components/BlogSection';
import SeoManager from '../components/SeoManager';
import LoadingSpinner from '../components/LoadingSpinner';
import HotEventsCarousel from '../components/HotEventsCarousel';
import AdvancedFilter from '../components/AdvancedFilter';
import { FilterState, Party } from '../types';
import { SearchIcon } from '../components/Icons';

const HomePage: React.FC = () => {
  const { parties, isLoading } = useParties();
  const [filters, setFilters] = useState<FilterState>({ tags: [] });
  const [searchTerm, setSearchTerm] = useState('');

  const filteredParties = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    
    return parties.filter(party => {
        // Search filter
        if (searchTerm &&
            !party.name.toLowerCase().includes(lowercasedTerm) &&
            !party.location.toLowerCase().includes(lowercasedTerm) &&
            !party.description.toLowerCase().includes(lowercasedTerm)
        ) {
            return false;
        }

        // Advanced filters
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

  const pageTitle = 'Party 24/7 - כל המסיבות הכי שוות בישראל';
  const pageDescription = 'האתר המוביל לחיי הלילה בישראל. גלו מסיבות, רייבים ואירועים מיוחדים בכל רחבי הארץ ורכשו כרטיסים בקלות.';

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  return (
    <>
      <SeoManager title={pageTitle} description={pageDescription} parties={parties} />

      <div className="relative text-center mb-12 -mt-8 h-[60vh] flex items-center justify-center overflow-hidden rounded-b-2xl shadow-lg -mx-4 sm:mx-0">
        <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute z-0 w-auto min-w-full min-h-full max-w-none object-cover brightness-[0.6]"
            poster="https://images.pexels.com/photos/857195/pexels-photo-857195.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260"
        >
            <source src="https://www.pexels.com/download/video/7722221/" type="video/mp4" />
            Your browser does not support the video tag.
        </video>
        <div className="relative z-10 p-4">
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tighter mb-4 text-white" style={{textShadow: '3px 3px 8px rgba(0,0,0,0.8)'}}>
                איפה המסיבה הבאה שלך?
            </h1>
            <p className="text-xl text-gray-200">האירועים הכי חמים במקום אחד.</p>
        </div>
      </div>
      
      <HotEventsCarousel />
      
      <div id="all-parties" className="mt-16">
        <h2 className="text-3xl font-bold text-center mb-4 text-white">כל המסיבות</h2>
        
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
                  className="bg-brand-surface border border-gray-700 text-white text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full p-3.5 pr-12"
              />
          </div>
        </div>

        <AdvancedFilter onFilterChange={setFilters} />
        <PartyGrid parties={filteredParties} />
      </div>

      <BlogSection />
    </>
  );
};

export default HomePage;
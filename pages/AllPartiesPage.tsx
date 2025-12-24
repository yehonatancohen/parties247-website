import React, { useState, useMemo, useEffect } from 'react';
import { useParties } from '../parties247-next/hooks/useParties';
import PartyGrid from '../parties247-next/components/PartyGrid';
import SeoManager from '../parties247-next/components/SeoManager';
import LoadingSpinner from '../parties247-next/components/LoadingSpinner';
import AdvancedFilter from '../parties247-next/components/AdvancedFilter';
import { FilterState } from '../types';
import { SearchIcon } from '../parties247-next/components/Icons';
import { BASE_URL } from '../constants';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { createCarouselSlug } from '../parties247-next/lib/carousels';

const PARTIES_PER_PAGE = 20;

const AllPartiesPage: React.FC = () => {
  const { parties, carousels, isLoading, error, loadingMessage } = useParties();
  const { pageNumber } = useParams<{ pageNumber?: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const initialPage = pageNumber ? Math.max(parseInt(pageNumber, 10) || 1, 1) : 1;
  const [filters, setFilters] = useState<FilterState>({ tags: [] });
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(initialPage);

  useEffect(() => {
    if (pageNumber) {
      const nextPage = Math.max(parseInt(pageNumber, 10) || 1, 1);
      if (nextPage !== currentPage) {
        setCurrentPage(nextPage);
      }
    } else if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [pageNumber, currentPage]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const queryParam = params.get('query') || '';
    setSearchTerm(queryParam);
  }, [location.search]);

  const filteredParties = useMemo(() => {
    const lowercasedTerm = searchTerm.toLowerCase();
    
    return parties.filter(party => {
        // Future-dated parties only
        if (new Date(party.date) < new Date()) return false;
        
        if (searchTerm &&
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
        if (filters.tags.length > 0 && !filters.tags.every(tag => party.tags.includes(tag))) return false;
        if (filters.date) {
            const partyDate = new Date(party.date).toISOString().split('T')[0];
            const filterDate = new Date(filters.date).toISOString().split('T')[0];
            if (partyDate !== filterDate) return false;
        }
        return true;
    }).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [parties, filters, searchTerm]);
  
  // Pagination logic
  const totalPages = Math.ceil(filteredParties.length / PARTIES_PER_PAGE);
  const paginatedParties = filteredParties.slice((currentPage - 1) * PARTIES_PER_PAGE, currentPage * PARTIES_PER_PAGE);

  const hotNowPartyIds = useMemo(() => {
    const hotNowCarousel = carousels.find(carousel => {
      const slug = createCarouselSlug(carousel.title);
      return slug === 'hot-now' || slug === 'חם-עכשיו' || (slug.includes('hot') && slug.includes('now')) || slug.includes('חם-עכשיו');
    });

    return new Set(hotNowCarousel?.partyIds ?? []);
  }, [carousels]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
      const querySuffix = searchTerm ? `?query=${encodeURIComponent(searchTerm)}` : '';
      if (newPage === 1) {
        navigate(`/all-parties${querySuffix}`, { replace: false });
      } else {
        navigate(`/all-parties/עמוד/${newPage}${querySuffix}`, { replace: false });
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const pageTitle = `כל המסיבות - עמוד ${currentPage} | Parties 24/7`;
  const pageDescription = 'חיפוש וסינון בכל המסיבות, הרייבים והאירועים בישראל. מצאו את המסיבה המושלמת עבורכם לפי אזור, סגנון מוזיקה, תאריך ועוד.';
  
  const breadcrumbJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      'itemListElement': [{
        '@type': 'ListItem',
        'position': 1,
        'name': 'עמוד הבית',
        'item': `${BASE_URL}/`
      },{
        '@type': 'ListItem',
        'position': 2,
        'name': 'כל המסיבות',
        'item': `${BASE_URL}/all-parties`
      }]
  };
  
  const canonicalPath = `/all-parties${currentPage > 1 ? `/עמוד/${currentPage}` : ''}`;
  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'itemListElement': paginatedParties.map((party, index) => ({
      '@type': 'ListItem',
      'position': (currentPage - 1) * PARTIES_PER_PAGE + index + 1,
      'name': party.name,
      'url': `${BASE_URL}/event/${party.slug}`,
    })),
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center">
        <LoadingSpinner />
        {loadingMessage && <p className="text-jungle-accent mt-4 animate-pulse">{loadingMessage}</p>}
      </div>
    );
  }
  
  if (error) {
    return (
        <div className="container mx-auto px-4 text-center py-16">
            <h2 className="text-2xl font-bold text-red-400">Something went wrong</h2>
            <p className="text-red-300/80 mt-2">{error}</p>
        </div>
    );
  }

  return (
    <>
      <SeoManager
        title={pageTitle}
        description={pageDescription}
        canonicalPath={canonicalPath}
        jsonLd={[breadcrumbJsonLd, itemListJsonLd]}
      />

      <div id="all-parties" className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-display text-center mb-2 text-white">כל המסיבות</h1>
        <p className="text-center text-jungle-text/80 mb-6 max-w-lg mx-auto">מצאו את הבילוי הבא שלכם בג'ונגל העירוני</p>
        
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
        <PartyGrid parties={paginatedParties} hotPartyIds={hotNowPartyIds} />
        
        {totalPages > 1 && (
            <div className="flex justify-center items-center gap-4 mt-8">
                <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-4 py-2 bg-jungle-surface text-white rounded disabled:opacity-50">
                    הקודם
                </button>
                <span className="text-white">
                    עמוד {currentPage} מתוך {totalPages}
                </span>
                <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-4 py-2 bg-jungle-surface text-white rounded disabled:opacity-50">
                    הבא
                </button>
            </div>
        )}

      </div>
    </>
  );
};

export default AllPartiesPage;
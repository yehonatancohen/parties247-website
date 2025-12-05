import React, { useMemo } from 'react';
import SeoManager from '../components/SeoManager';
import LoadingSpinner from '../components/LoadingSpinner';
import PartyGrid from '../components/PartyGrid';
import { useParties } from '../hooks/useParties';
import { BASE_URL } from '../constants';

const WEEKEND_DAYS = [5, 6];

const WeekendPartiesPage: React.FC = () => {
  const { parties, isLoading, error, loadingMessage } = useParties();

  const weekendParties = useMemo(() => {
    const now = Date.now();
    return parties
      .filter((party) => {
        const partyDate = new Date(party.date);
        if (Number.isNaN(partyDate.getTime())) return false;
        return WEEKEND_DAYS.includes(partyDate.getDay()) && partyDate.getTime() >= now;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [parties]);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'עמוד הבית',
        item: `${BASE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'מסיבות סוף השבוע',
        item: `${BASE_URL}/weekend-parties`,
      },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: weekendParties.map((party, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: party.name,
      url: `${BASE_URL}/event/${party.slug}`,
    })),
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center">
        <LoadingSpinner />
        {loadingMessage && (
          <p className="text-jungle-accent mt-4 animate-pulse">{loadingMessage}</p>
        )}
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
        title="מסיבות סוף השבוע | Parties 24/7"
        description="חפשו מסיבות שישי ושבת שמתעדכנות בזמן אמת: טכנו, האוס, מיינסטרים, ליינים לסטודנטים וחיילים ועוד."
        canonicalPath="/weekend-parties"
        jsonLd={[breadcrumbJsonLd, itemListJsonLd]}
      />

      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-display text-center mb-2 text-white">
          מסיבות סוף השבוע
        </h1>
        <p className="text-center text-jungle-text/80 mb-6 max-w-xl mx-auto">
          כל המסיבות של שישי ושבת מחכות לכם כאן. מצאו במהירות את הרייב הבא או הבר השמח, כולל סינון לפי קהל יעד וסגנון.
        </p>
        <PartyGrid parties={weekendParties} />
      </div>
    </>
  );
};

export default WeekendPartiesPage;

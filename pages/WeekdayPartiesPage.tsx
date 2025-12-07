import React, { useMemo } from 'react';
import SeoManager from '../components/SeoManager';
import LoadingSpinner from '../components/LoadingSpinner';
import PartyGrid from '../components/PartyGrid';
import { useParties } from '../hooks/useParties';
import { BASE_URL } from '../constants';
import { getCurrentWeekendWindow } from '../lib/weekend';

interface WeekdayPartiesPageProps {
  weekday: number;
  canonicalPath: string;
  pageTitle: string;
  pageDescription: string;
  heading: string;
  intro: string;
}

const WeekdayPartiesPage: React.FC<WeekdayPartiesPageProps> = ({
  weekday,
  canonicalPath,
  pageTitle,
  pageDescription,
  heading,
  intro,
}) => {
  const { parties, isLoading, error, loadingMessage } = useParties();
  const weekendWindow = useMemo(() => getCurrentWeekendWindow(), []);
  const isWeekendDay = useMemo(() => [4, 5, 6].includes(weekday), [weekday]);

  const filteredParties = useMemo(() => {
    const now = Date.now();
    return parties.filter((party) => {
      const partyDate = new Date(party.date);
      if (Number.isNaN(partyDate.getTime())) {
        return false;
      }
      return (
        partyDate.getDay() === weekday &&
        (!isWeekendDay || partyDate.getTime() >= weekendWindow.start.getTime()) &&
        (!isWeekendDay || partyDate.getTime() <= weekendWindow.end.getTime()) &&
        partyDate.getTime() >= now
      );
    });
  }, [isWeekendDay, parties, weekday, weekendWindow.end, weekendWindow.start]);

  const upcomingParties = useMemo(() => {
    const now = Date.now();
    return filteredParties
      .filter((party) => {
        const partyDate = new Date(party.date);
        return partyDate.getTime() >= now;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [filteredParties]);

  const breadcrumbJsonLd = useMemo(
    () => ({
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
          name: heading,
          item: `${BASE_URL}${canonicalPath}`,
        },
      ],
    }),
    [canonicalPath, heading]
  );

  const itemListJsonLd = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      itemListElement: upcomingParties.map((party, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: party.name,
        url: `${BASE_URL}/event/${party.slug}`,
      })),
    }),
    [upcomingParties]
  );

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
        title={pageTitle}
        description={pageDescription}
        canonicalPath={canonicalPath}
        jsonLd={[breadcrumbJsonLd, itemListJsonLd]}
      />

      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-display text-center mb-2 text-white">
          {heading}
        </h1>
        <p className="text-center text-jungle-text/80 mb-6 max-w-lg mx-auto">{intro}</p>
        <PartyGrid parties={filteredParties} />
      </div>
    </>
  );
};

export default WeekdayPartiesPage;

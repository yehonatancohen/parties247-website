import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import SeoManager from '../components/SeoManager';
import LoadingSpinner from '../components/LoadingSpinner';
import PartyGrid from '../components/PartyGrid';
import { useParties } from '../hooks/useParties';
import { BASE_URL } from '../constants';
import { createCarouselSlug, findCarouselBySlug } from '../lib/carousels';

const CarouselPage: React.FC = () => {
  const { carouselSlug } = useParams<{ carouselSlug: string }>();
  const { carousels, parties, isLoading, error, loadingMessage } = useParties();

  const carousel = useMemo(
    () => findCarouselBySlug(carousels, carouselSlug),
    [carousels, carouselSlug]
  );

  const carouselParties = useMemo(() => {
    if (!carousel) {
      return [];
    }

    return parties.filter(party => carousel.partyIds.includes(party.id));
  }, [carousel, parties]);

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

  if (!carousel) {
    return (
      <div className="container mx-auto px-4 text-center py-16">
        <h2 className="text-2xl font-bold text-white">לא מצאנו את הקרוסלה הזו</h2>
        <p className="text-jungle-text/80 mt-2">
          ייתכן שהמסיבה כבר הסתיימה או שהקישור השתנה.
        </p>
        <Link to="/" className="mt-6 inline-block text-jungle-accent hover:text-white">
          חזרה לעמוד הבית
        </Link>
      </div>
    );
  }

  const slug = createCarouselSlug(carousel.title);
  const canonicalPath = `/carousels/${slug}`;
  const pageTitle = `${carousel.title} | Parties247`;
  const pageDescription = `כל המסיבות בקרוסלת "${carousel.title}". הצטרפו לרייב הבא שלכם.`;

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
        name: carousel.title,
        item: `${BASE_URL}${canonicalPath}`,
      },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: carouselParties.map((party, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: party.name,
      url: `${BASE_URL}/event/${party.slug}`,
    })),
  };

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
          {carousel.title}
        </h1>
        <p className="text-center text-jungle-text/80 mb-6 max-w-lg mx-auto">
          כל המסיבות החמות של "{carousel.title}" במקום אחד.
        </p>
        <PartyGrid parties={carouselParties} />
      </div>
    </>
  );
};

export default CarouselPage;

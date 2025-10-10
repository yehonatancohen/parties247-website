
import React from 'react';
import { useParties } from '../hooks/useParties';
import SeoManager from '../components/SeoManager';
import LoadingSpinner from '../components/LoadingSpinner';
import PartyCarousel from '../components/HotEventsCarousel';
import SocialsCta from '../components/SocialsCta';
import { BASE_URL, SOCIAL_LINKS } from '../constants';

const HomePage: React.FC = () => {
  const { parties, carousels, isLoading, error, loadingMessage } = useParties();

  const pageTitle = 'מסיבות בתל אביב | Parties247';
  const pageDescription = 'כל המסיבות הכי חמות בישראל – תל אביב, חיפה, אילת ועוד. Parties247 היא פלטפורמת המסיבות של ישראל.';

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    'name': 'Parties 24/7',
    'url': BASE_URL,
    'logo': 'https://vjkiztnx7gionfos.public.blob.vercel-storage.com/Partieslogo.PNG',
    'sameAs': [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.tiktok,
    ],
    'areaServed': {
      '@type': 'Country',
      'name': 'IL',
    },
  };

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'Parties 24/7',
    'url': BASE_URL,
    'potentialAction': {
      '@type': 'SearchAction',
      'target': `${BASE_URL}/all-parties?query={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
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
  
  const resolveCarouselLink = (title: string) => {
    const normalized = title.replace(/\s+/g, '').toLowerCase();
    if (normalized.includes('תלאביב') && normalized.includes('טכנו')) return '/ערים/תל-אביב/טכנו';
    if (normalized.includes('תלאביב') && normalized.includes('נוער')) return '/ערים/תל-אביב/מסיבות-נוער';
    if (normalized.includes('תלאביב')) return '/ערים/תל-אביב/היום';
    if (normalized.includes('ירושלים')) return '/ערים/ירושלים';
    if (normalized.includes('חיפה')) return '/ערים/חיפה';
    if (normalized.includes('אילת')) return '/ערים/אילת';
    if (normalized.includes('טכנו')) return '/זאנרים/טכנו';
    if (normalized.includes('טראנס')) return '/זאנרים/טראנס';
    if (normalized.includes('edm')) return '/זאנרים/EDM';
    if (normalized.includes('נוער')) return '/קהל/מסיבות-נוער';
    if (normalized.includes('סטודנט')) return '/קהל/מסיבות-סטודנטים';
    if (normalized.includes('חייל')) return '/קהל/מסיבות-חיילים';
    if (normalized.includes('שישי')) return '/מתי/שישי';
    return '/all-parties';
  };

  const carouselsWithParties = carousels.map(carousel => {
    const carouselParties = parties.filter(p => carousel.partyIds.includes(p.id));
    return { ...carousel, parties: carouselParties, viewAllLink: resolveCarouselLink(carousel.title) };
  }).filter(c => c.parties.length > 0);

  return (
    <>
      <SeoManager
        title={pageTitle}
        description={pageDescription}
        canonicalPath="/"
        jsonLd={[organizationJsonLd, websiteJsonLd]}
      />

      <div className="relative text-center mb-12 -mt-8 h-[70vh] sm:h-[60vh] flex items-center justify-center overflow-hidden">
        <video
          src="https://vjkiztnx7gionfos.public.blob.vercel-storage.com/party_video.mp4"
          className="absolute z-0 w-full h-full object-cover brightness-[0.6]"
          preload="metadata"
          autoPlay
          loop
          muted
          playsInline
        >
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-deep via-transparent to-jungle-deep/50"></div>
        <div className="relative z-10 p-4">
            <h1 
                className="font-display text-5xl sm:text-6xl md:text-8xl mb-4 text-white"
                style={{ textShadow: '3px 3px 8px rgba(0,0,0,0.7)' }}
            >
                איפה תהיה המסיבה הבאה שלך?
            </h1>
            <p className="text-lg sm:text-xl text-jungle-text">אתר המסיבות של ישראל</p>
        </div>
      </div>
      
      <div className="space-y-16">
        {carouselsWithParties.map((carousel, index) => (
            <PartyCarousel
                key={carousel.id}
                title={carousel.title}
                parties={carousel.parties}
                viewAllLink={carousel.viewAllLink}
                variant={index === 0 ? 'coverflow' : 'standard'}
            />
        ))}
      </div>
      <SocialsCta />
    </>
  );
};

export default HomePage;
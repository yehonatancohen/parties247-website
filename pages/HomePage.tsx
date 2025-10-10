
import React from 'react';
import { useParties } from '../hooks/useParties';
import SEO from '../components/SeoManager';
import LoadingSpinner from '../components/LoadingSpinner';
import PartyCarousel from '../components/HotEventsCarousel'; 
import SocialsCta from '../components/SocialsCta';
import { Party } from '../types';
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
  };
  
  const feedLinks = [
    { title: 'All Parties RSS Feed', href: '/feeds/events.rss', type: 'application/rss+xml' as const },
    { title: 'All Parties Atom Feed', href: '/feeds/events.atom', type: 'application/atom+xml' as const },
    { title: 'All Parties JSON Feed', href: '/feeds/events.json', type: 'application/json' as const },
  ];

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
  
  const carouselsWithParties = carousels.map(carousel => {
    const carouselParties = parties.filter(p => carousel.partyIds.includes(p.id));
    return { ...carousel, parties: carouselParties };
  }).filter(c => c.parties.length > 0);

  return (
    <>
      <SEO 
        title={pageTitle} 
        description={pageDescription}
        canonicalPath="/"
        jsonLd={organizationJsonLd}
        feedLinks={feedLinks}
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
                viewAllLink={`/category/${carousel.id}`}
                variant={index === 0 ? 'coverflow' : 'standard'}
            />
        ))}
      </div>
      <SocialsCta />
    </>
  );
};

export default HomePage;
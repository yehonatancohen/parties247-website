import React from 'react';
import { useParties } from '../hooks/useParties';
import SeoManager from '../components/SeoManager';
import LoadingSpinner from '../components/LoadingSpinner';
import PartyCarousel from '../components/HotEventsCarousel'; 
import SocialsCta from '../components/SocialsCta';
import { Party } from '../types';

const HomePage: React.FC = () => {
  const { parties, carousels, isLoading } = useParties();

  const pageTitle = 'Party 24/7 - כל המסיבות הכי שוות בישראל';
  const pageDescription = 'האתר המוביל לחיי הלילה בישראל. גלו מסיבות, רייבים ואירועים מיוחדים בכל רחבי הארץ ורכשו כרטיסים בקלות.';

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }
  
  const carouselsWithParties = carousels.map(carousel => {
    const carouselParties = carousel.partyIds
      .map(id => parties.find(p => p.id === id))
      .filter((p): p is Party => Boolean(p));
    return { ...carousel, parties: carouselParties };
  }).filter(c => c.parties.length > 0);

  return (
    <>
      <SeoManager title={pageTitle} description={pageDescription} parties={parties} />

      <div className="relative text-center mb-12 -mt-8 h-[70vh] sm:h-[60vh] flex items-center justify-center overflow-hidden rounded-b-2xl shadow-lg -mx-4 sm:mx-0 border-b-4 border-wood-brown">
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
                הדופק של העיר
            </h1>
            <p className="text-lg sm:text-xl text-jungle-text">האירועים הכי חמים בג'ונגל העירוני.</p>
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
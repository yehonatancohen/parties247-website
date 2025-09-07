import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Party } from '../types';
import { AFFILIATE_CODE } from '../constants';

const CarouselPartyCard: React.FC<{ party: Party }> = ({ party }) => {
    const getAffiliateUrl = (originalUrl: string) => {
        try {
          const url = new URL(originalUrl);
          url.searchParams.set('aff', AFFILIATE_CODE);
          return url.toString();
        } catch (error) {
          return originalUrl;
        }
    };

    const partyDate = new Date(party.date);
    const formattedDate = new Intl.DateTimeFormat('he-IL', {
        weekday: 'long',
        day: '2-digit',
        month: '2-digit',
    }).format(partyDate);

    return (
        <a 
            href={getAffiliateUrl(party.originalUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-64 group"
        >
            <div className="relative rounded-xl overflow-hidden shadow-lg hover:shadow-jungle-glow/60 transition-all duration-300 transform group-hover:-translate-y-1 border border-wood-brown/50">
                <img 
                    src={party.imageUrl} 
                    alt={party.name} 
                    className="w-full aspect-[3/4] object-cover transition-transform duration-300 group-hover:scale-105" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                    <h3 className="font-display text-2xl text-white truncate" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
                        {party.name}
                    </h3>
                </div>
            </div>
            <div className="mt-2 text-center">
                 <p className="text-md font-semibold text-jungle-text/80">{formattedDate}</p>
            </div>
        </a>
    );
};

interface PartyCarouselProps {
    title: string;
    parties: Party[];
    viewAllLink: string;
}

const PartyCarousel: React.FC<PartyCarouselProps> = ({ title, parties, viewAllLink }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const carouselRef = useRef<HTMLDivElement>(null);

  const now = new Date();
  const upcomingParties = useMemo(() => parties
    .filter(p => new Date(p.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()), [parties]);
  
  const itemsToRender = useMemo(() => {
    // We need at least one full screen of items cloned for a smooth loop
    return upcomingParties.length > 4 ? [...upcomingParties, ...upcomingParties.slice(0, 5)] : upcomingParties;
  }, [upcomingParties]);

  const startCarousel = useCallback(() => {
    intervalRef.current = setInterval(() => {
      setCurrentIndex(prevIndex => prevIndex + 1);
    }, 3000);
  }, []);

  const pauseCarousel = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  }, []);
  
  useEffect(() => {
    if (itemsToRender.length > upcomingParties.length) { // Check if animation is active
        startCarousel();
    }
    return () => pauseCarousel();
  }, [itemsToRender.length, upcomingParties.length, startCarousel, pauseCarousel]);
  
  const handleTransitionEnd = () => {
    if (currentIndex >= upcomingParties.length) {
      if (carouselRef.current) {
        carouselRef.current.style.transition = 'none';
        setCurrentIndex(0);
        // Force a reflow to apply the new index without transition
        carouselRef.current.offsetHeight; 
        carouselRef.current.style.transition = 'transform 0.5s ease-in-out';
      }
    }
  };

  if (upcomingParties.length === 0) {
    return null;
  }
  
  const isAnimated = upcomingParties.length > 4;

  if (!isAnimated) {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-3xl font-display text-white">{title}</h2>
                <Link to={viewAllLink} className="text-jungle-accent hover:text-white transition-colors">הצג הכל</Link>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
                {upcomingParties.map(party => (
                  <CarouselPartyCard key={party.id} party={party} />
                ))}
                <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            </div>
        </div>
    );
  }

  const cardWidthWithGap = 256 + 16; // w-64 (256px) + gap-4 (16px)
  const carouselStyle = {
    transform: `translateX(-${currentIndex * cardWidthWithGap}px)`,
    transition: 'transform 0.5s ease-in-out',
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-display text-white">{title}</h2>
        <Link to={viewAllLink} className="text-jungle-accent hover:text-white transition-colors">הצג הכל</Link>
      </div>
      <div 
        className="relative w-full overflow-hidden" 
        style={{ maskImage: 'linear-gradient(to left, transparent, black 5%, black 95%, transparent)' }}
        onMouseEnter={pauseCarousel}
        onMouseLeave={startCarousel}
      >
        <div 
          ref={carouselRef}
          className="flex gap-4" 
          style={carouselStyle}
          onTransitionEnd={handleTransitionEnd}
        >
          {itemsToRender.map((party, index) => (
            <CarouselPartyCard key={`${party.id}-${index}`} party={party} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PartyCarousel;
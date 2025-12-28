"use client";

import React, { useRef, useEffect, useMemo, FC, useId, useState } from 'react';
import Link from "next/link";
import { register } from 'swiper/element/bundle';

import { Party } from '../data/types';
import { CalendarIcon, LocationIcon, FireIcon, PartyPopperIcon } from './Icons';
import { trackPartyRedirect } from '../lib/analytics';

// --- EXACT CSS FROM VITE VERSION ---
const SSR_SWIPER_STYLES = `
  swiper-container {
    display: flex;
    width: 100%;
    max-width: min(1800px, 96vw);
    margin: 0 auto;
    overflow: hidden;
    padding: 0.75rem clamp(0.5rem, 4vw, 2rem) 1.5rem;
  }

  swiper-slide {
    display: block;
    flex-shrink: 0;
    height: auto;
    width: 78%;
    margin-inline-end: 14px;
    backface-visibility: hidden;
    transform: translate3d(0,0,0);
  }

  @media (min-width: 480px) {
    swiper-slide { width: 62%; }
  }

  @media (min-width: 640px) {
    swiper-slide { width: 38%; }
  }

  @media (min-width: 768px) {
    swiper-slide { width: 32%; }
  }

  @media (min-width: 1024px) {
    swiper-slide { width: 28%; }
  }
`;

const ArrowLeft: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
  </svg>
);

const ArrowRight: FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
  </svg>
);

const getTagColor = (tag: string) => {
  if (tag === 'לוהט') return 'bg-jungle-lime/80 text-jungle-deep';
  if (tag === 'ביקוש גבוה') return 'bg-jungle-accent/80 text-jungle-deep';
  if (tag.includes('חינם')) return 'bg-green-500/80 text-white';
  if (tag.includes('+')) return 'bg-wood-brown/80 text-jungle-text';
  return 'bg-jungle-accent/80 text-jungle-deep';
};

const renderTagContent = (tag: string) => {
  if (tag === 'לוהט') return <><FireIcon className="w-3.5 h-3.5 ml-1" />{tag}</>;
  if (tag === 'ביקוש גבוה') return <><PartyPopperIcon className="w-3.5 h-3.5 ml-1" />{tag}</>;
  return tag;
};

const CarouselPartyCard: FC<{ party: Party; directUrl: string; priority: boolean }> = React.memo(({ party, directUrl, priority }) => {
  
  const partyDate = new Date(party.date);
  const formattedDate = new Intl.DateTimeFormat('he-IL', {
    weekday: 'long', day: '2-digit', month: '2-digit',
  }).format(partyDate);

  return (
    <a
      href={directUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block outline-none"
      onClick={() => trackPartyRedirect(party.id, party.slug)}
    >
      <div className="relative rounded-xl overflow-hidden shadow-lg transition-all duration-500 ease-in-out border border-wood-brown/50">
        
        {/* --- USE STANDARD HTML IMG TAG --- */}
        {/* This creates the exact same DOM structure as Vite, preventing layout shifts */}
        <img
          src={party.imageUrl}
          alt={party.name}
          loading={priority ? "eager" : "lazy"}
          className="w-full aspect-[2/3] object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {party.tags.slice(0, 2).map(tag => (
            <span key={tag} className={`${getTagColor(tag)} backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center`}>
              {renderTagContent(tag)}
            </span>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
          <div className="space-y-1 mb-2">
            <div className="flex items-center text-xs text-jungle-text/90 font-medium">
              <CalendarIcon className="w-3.5 h-3.5 ml-1.5 text-jungle-accent" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center text-xs text-jungle-text/80">
              <LocationIcon className="w-3.5 h-3.5 ml-1.5 text-jungle-accent" />
              <span className="truncate max-w-[150px]">{party.location.name}</span>
            </div>
          </div>
          <h3 className="font-display text-xl md:text-2xl text-white truncate" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
            {party.name}
          </h3>
        </div>
      </div>
    </a>
  );
});

interface PartyCarouselProps {
  title: string;
  parties: Party[];
  viewAllLink: string;
  variant?: 'coverflow' | 'standard';
  priority?: boolean;
}

const PartyCarousel: React.FC<PartyCarouselProps> = ({ 
    title, 
    parties, 
    viewAllLink, 
    variant = 'coverflow',
    priority = false 
}) => {
  const swiperElRef = useRef<any>(null);
  const rawId = useId(); 
  const uniqueId = `carousel-${rawId.replace(/:/g, '')}`; 
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    register();
    setMounted(true);
  }, []);

  const upcomingParties = useMemo(() => 
      parties
      .filter(p => new Date(p.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  [parties]);

  const slides = useMemo(() => {
     if (upcomingParties.length === 0) return [];
     const minSlides = variant === 'coverflow' ? 8 : 12;
     const repetitions = Math.ceil(minSlides / upcomingParties.length);
     const duplicated = Array.from({ length: repetitions }, () => upcomingParties).flat();
     return duplicated.slice(0, Math.max(minSlides, upcomingParties.length * 2));
  }, [upcomingParties, variant]);

  const BREAKPOINTS = useMemo(() => (
    variant === 'coverflow'
      ? {
          0:    { slidesPerView: 1.15 },
          360:  { slidesPerView: 1.3 },
          480:  { slidesPerView: 1.6 },
          640:  { slidesPerView: 2.4 },
          768:  { slidesPerView: 2.9 },
          1024: { slidesPerView: 3.3 },
          1440: { slidesPerView: 3.7 },
        }
      : {
          0:    { slidesPerView: 1.8 },
          360:  { slidesPerView: 2.2 },
          420:  { slidesPerView: 2.6 },
          640:  { slidesPerView: 3.2 },
          768:  { slidesPerView: 4.0 },
          1024: { slidesPerView: 5.0 },
          1280: { slidesPerView: 6.0 },
        }
  ), [variant]);

  useEffect(() => {
    const swiperEl = swiperElRef.current;
    if (!swiperEl || !mounted || slides.length === 0) return;
    
    const commonParams = {
      breakpoints: BREAKPOINTS,
      spaceBetween: 12,
      loop: true,
      observer: true,
      observeParents: true,
      loopAdditionalSlides: 4,
      
      // FIX 2: Prevent pixelated text during 3D transform
      roundLengths: true,
      
      navigation: {
        nextEl: `#next-${uniqueId}`,
        prevEl: `#prev-${uniqueId}`,
      },
      watchOverflow: true,
    };
    
    const variantParams = variant === 'coverflow' ? {
      effect: 'coverflow',
      centeredSlides: true,
      grabCursor: true,
      autoplay: {
        delay: 6500,
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      },
      coverflowEffect: {
        rotate: 0,
        stretch: 22,
        depth: 60,
        modifier: 1,
        // FIX 3: DISABLE SHADOWS.
        // This stops the browser from adding the blur filter over your text.
        slideShadows: false,
      },
    } : {
      centeredSlides: false,
    };

    const params = { ...commonParams, ...variantParams };
    
    Object.assign(swiperEl, params);
    swiperEl.initialize();
    
  }, [slides, variant, uniqueId, BREAKPOINTS, mounted]);

  if (slides.length === 0) return null;

  const carouselClasses = `relative party-carousel ${variant === 'coverflow' ? 'party-carousel-coverflow' : 'party-carousel-standard'}`;

  return (
    <div className="py-4">
      <style>{SSR_SWIPER_STYLES}</style>
      
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-display text-white">{title}</h2>
          <div className="flex items-center gap-4">
            <Link href={viewAllLink} className="text-jungle-accent hover:text-white transition-colors">הצג הכל</Link>
            <div className="flex gap-2">
              <button id={`prev-${uniqueId}`} className="swiper-button-prev !static !w-11 !h-11"><ArrowLeft className="w-6 h-6" /></button>
              <button id={`next-${uniqueId}`} className="swiper-button-next !static !w-11 !h-11"><ArrowRight className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </div>
      
      <div className={carouselClasses}>
        {React.createElement(
          'swiper-container',
          { ref: swiperElRef, init: 'false' },
          ...slides.map((party, index) =>
            React.createElement(
              'swiper-slide',
              { key: `${party.id}-${index}` },
              <CarouselPartyCard 
                party={party} 
                directUrl={party.originalUrl || '#'} 
                priority={priority && index < 2} 
              />
            )
          )
        )}
      </div>
    </div>
  );
};

export default PartyCarousel;
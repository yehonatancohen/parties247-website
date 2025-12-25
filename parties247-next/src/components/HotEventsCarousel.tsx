"use client";

import React, { useRef, useEffect, useMemo, FC, useId, useState } from 'react';
import Link from "next/link";
import Image from "next/image";
// Import Swiper React components (The official way)
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, EffectCoverflow } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

import { Party } from '../data/types';
import { CalendarIcon, LocationIcon, FireIcon, PartyPopperIcon } from './Icons';
import { useParties } from '../hooks/useParties';
import { trackPartyRedirect } from '../lib/analytics';

// --- Icons & Helpers ---
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

// --- Party Card ---
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
      className="group block outline-none h-full"
      onClick={() => trackPartyRedirect(party.id, party.slug)}
    >
      <div className="relative h-full rounded-xl overflow-hidden shadow-lg border border-wood-brown/50 bg-jungle-surface/50 group-hover:border-jungle-accent/50 transition-colors">
        <div className="relative w-full aspect-[2/3] bg-jungle-deep/50">
           <Image
            src={party.imageUrl}
            alt={party.name}
            fill
            sizes="(max-width: 640px) 70vw, (max-width: 1024px) 33vw, 20vw"
            priority={priority}
            className="object-cover"
           />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent pointer-events-none"></div>
        <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
          {party.tags.slice(0, 2).map(tag => (
            <span key={tag} className={`${getTagColor(tag)} backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center`}>
              {renderTagContent(tag)}
            </span>
          ))}
        </div>
        <div className="absolute bottom-0 left-0 p-4 w-full z-20">
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
          <h3 className="font-display text-xl md:text-2xl text-white truncate leading-tight" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>
            {party.name}
          </h3>
        </div>
      </div>
    </a>
  );
});

// --- Main Component ---
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
  const { defaultReferral } = useParties();
  const rawId = useId(); 
  const uniqueId = `carousel-${rawId.replace(/:/g, '')}`; 
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering Swiper on client
  useEffect(() => {
    setMounted(true);
  }, []);

  const upcomingParties = useMemo(() => 
      parties
      .filter(p => new Date(p.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
  [parties]);

  const slides = useMemo(() => {
     if (upcomingParties.length === 0) return [];
     if (upcomingParties.length < 6) {
        return [...upcomingParties, ...upcomingParties, ...upcomingParties].slice(0, 10);
     }
     return upcomingParties;
  }, [upcomingParties]);

  if (slides.length === 0) return null;
  if (!mounted) return <div className="h-[400px] w-full bg-jungle-surface/10 animate-pulse rounded-xl" />; // Simple Skeleton

  const isCoverflow = variant === 'coverflow';
  
  const breakpoints = isCoverflow 
    ? {
        0:    { slidesPerView: 1.6, spaceBetween: 12 },
        640:  { slidesPerView: 2.8, spaceBetween: 20 },
        1024: { slidesPerView: 3.4, spaceBetween: 24 },
      }
    : {
        0:    { slidesPerView: 1.8, spaceBetween: 12 },
        640:  { slidesPerView: 3.2, spaceBetween: 20 },
        1024: { slidesPerView: 5.0, spaceBetween: 24 },
      };

  return (
    <div className="py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-display text-white">{title}</h2>
          <div className="flex items-center gap-4">
            <Link href={viewAllLink} className="text-jungle-accent hover:text-white transition-colors">הצג הכל</Link>
            <div className="flex gap-2">
              <button id={`prev-${uniqueId}`} className="swiper-button-prev !static !w-11 !h-11 border border-wood-brown/30 rounded-full flex items-center justify-center bg-jungle-surface/80 hover:bg-jungle-accent hover:text-black transition-colors">
                <ArrowRight className="w-5 h-5" /> 
              </button>
              <button id={`next-${uniqueId}`} className="swiper-button-next !static !w-11 !h-11 border border-wood-brown/30 rounded-full flex items-center justify-center bg-jungle-surface/80 hover:bg-jungle-accent hover:text-black transition-colors">
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <Swiper
        modules={[Navigation, Autoplay, EffectCoverflow]}
        loop={true}
        breakpoints={breakpoints}
        navigation={{ nextEl: `#next-${uniqueId}`, prevEl: `#prev-${uniqueId}` }}
        centeredSlides={isCoverflow}
        effect={isCoverflow ? 'coverflow' : undefined}
        coverflowEffect={isCoverflow ? { rotate: 0, stretch: 0, depth: 100, modifier: 1, slideShadows: false } : undefined}
        autoplay={isCoverflow ? { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true } : undefined}
        className={`party-carousel w-full py-4 ${variant === 'coverflow' ? 'overflow-visible' : ''}`}
      >
        {slides.map((party, index) => (
             <SwiperSlide key={`${party.id}-${index}`}>
                 <CarouselPartyCard 
                    party={party} 
                    directUrl={party.originalUrl || '#'} 
                    priority={priority && index < 2} 
                  />
             </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default PartyCarousel;
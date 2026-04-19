"use client";

import React, { useRef, useEffect, useMemo, FC, useId, useState } from 'react';
import Link from "next/link";
import Image from "next/image";

import { Party } from '../data/types';
import { CalendarIcon, LocationIcon, FireIcon, PartyPopperIcon } from './Icons';
import { trackPartyRedirect } from '../lib/analytics';

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
      className="group block outline-none select-none"
      onClick={() => trackPartyRedirect(party.id, party.slug)}
      draggable="false"
    >
      <div className="relative rounded-xl overflow-hidden shadow-lg transition-all duration-500 ease-in-out border border-wood-brown/50 transform-gpu subpixel-antialiased">

        <Image
          src={party.imageUrl}
          alt={party.name}
          loading={priority ? "eager" : "lazy"}
          className="w-full aspect-[2/3] object-cover"
          draggable="false"
          width={400}
          height={600}
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
    setMounted(true);
  }, []);

  const sortedParties = useMemo(
    () =>
      [...parties].sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      ),
    [parties]
  );

  const slides = useMemo(() => {
    if (sortedParties.length === 0) return [];

    // FIX 1: INCREASED BUFFER SIZE 
    // We drastically increased baseMinSlides (was 12 -> now 30).
    // Coverflow loop needs a huge buffer of slides to ensure the left side is never empty.
    const baseMinSlides = variant === 'coverflow' ? 30 : 20;
    const needsExtraDensity = sortedParties.length <= 2;

    const minSlides = needsExtraDensity ? baseMinSlides * 2 : baseMinSlides;
    const duplicationFactor = needsExtraDensity ? 6 : 2;

    const targetLength = Math.max(minSlides, sortedParties.length * duplicationFactor);
    const repetitions = Math.ceil(targetLength / sortedParties.length);
    const duplicated = Array.from({ length: repetitions }, () => sortedParties).flat();

    return duplicated.slice(0, targetLength);
  }, [sortedParties, variant]);

  const BREAKPOINTS = useMemo(() => (
    variant === 'coverflow'
      ? {
        0: { slidesPerView: 1.6 },
        360: { slidesPerView: 1.9 },
        420: { slidesPerView: 2.2 },
        640: { slidesPerView: 2.8 },
        768: { slidesPerView: 3.0 },
        1024: { slidesPerView: 3.4 },
        1440: { slidesPerView: 3.8 },
      }
      : {
        0: { slidesPerView: 1.8 },
        360: { slidesPerView: 2.2 },
        420: { slidesPerView: 2.6 },
        640: { slidesPerView: 3.2 },
        768: { slidesPerView: 4.0 },
        1024: { slidesPerView: 5.0 },
        1280: { slidesPerView: 6.0 },
      }
  ), [variant]);

  useEffect(() => {
    if (!mounted) return;

    const swiperEl = swiperElRef.current;
    if (!swiperEl || slides.length === 0) return;

    // Calculate offset to start safely in the middle of our duplicated list
    const initialSlideIndex = sortedParties.length > 0 ? sortedParties.length : 0;

    const commonParams = {
      breakpoints: BREAKPOINTS,
      spaceBetween: 12,
      loop: true,

      // Start in the middle of the duplicates
      initialSlide: initialSlideIndex,

      // We increased this to 10 to give coverflow plenty of room
      loopedSlides: 10,
      observer: true,
      observeParents: true,
      loopAdditionalSlides: Math.min(slides.length, 10),
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
        stretch: 36,
        depth: 90,
        modifier: 1,
        slideShadows: false,
      },
    } : {
      centeredSlides: false,
    };

    const params = { ...commonParams, ...variantParams };

    Object.assign(swiperEl, params);

    const timer = setTimeout(() => {
      // Guard: Swiper web-component may not be registered yet
      if (typeof swiperEl.initialize !== 'function') {
        // Retry after a longer delay to allow registration to complete
        const retryTimer = setTimeout(() => {
          if (typeof swiperEl.initialize === 'function') {
            swiperEl.initialize();
            if (swiperEl.swiper) {
              swiperEl.swiper.loopFix();
              swiperEl.swiper.update();
            }
          }
        }, 500);
        return () => clearTimeout(retryTimer);
      }

      swiperEl.initialize();

      // FIX 2: FORCE LOOP FIX
      // Immediately after init, force Swiper to recalculate the loop 
      // and generate the missing ghost slides on the left.
      if (swiperEl.swiper) {
        swiperEl.swiper.loopFix();
        swiperEl.swiper.update();
      }
    }, 50);

    return () => clearTimeout(timer);

  }, [slides, variant, uniqueId, BREAKPOINTS, mounted, sortedParties.length]);

  if (!mounted) return null;
  if (slides.length === 0) return null;

  const carouselClasses = `relative party-carousel ${variant === 'coverflow' ? 'party-carousel-coverflow' : 'party-carousel-standard'}`;

  return (
    <div className="py-4">
      <div className="mx-auto w-full max-w-[min(2200px,calc(100vw-1.25rem))] px-4 sm:px-6">
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

      <div className={`${carouselClasses} mx-auto w-full max-w-[min(2200px,calc(100vw-1.25rem))]`}>
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
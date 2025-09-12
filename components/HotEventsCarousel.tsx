import React, { useRef, useEffect, useMemo, FC } from 'react';
import { Link } from 'react-router-dom';
import { Party } from '../types';
import { AFFILIATE_CODE } from '../constants';
import { CalendarIcon, LocationIcon, FireIcon, PartyPopperIcon } from './Icons';

// --- SVG Arrow Icons ---
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

// --- Tag Helpers ---
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

const CarouselPartyCard: FC<{ party: Party }> = React.memo(({ party }) => {
  const getAffiliateUrl = (originalUrl: string) => {
    try {
      const url = new URL(originalUrl);
      url.searchParams.set('aff', AFFILIATE_CODE);
      return url.toString();
    } catch {
      return originalUrl;
    }
  };

  const partyDate = new Date(party.date);
  const formattedDate = new Intl.DateTimeFormat('he-IL', {
    weekday: 'long', day: '2-digit', month: '2-digit',
  }).format(partyDate);

  return (
    <a
      href={getAffiliateUrl(party.originalUrl)}
      target="_blank"
      rel="noopener noreferrer"
      className="group block outline-none"
      aria-label={`View details for ${party.name}`}
    >
      <div className="relative rounded-xl overflow-hidden shadow-lg transition-all duration-500 ease-in-out border border-wood-brown/50">
        <img
          src={party.imageUrl}
          alt={party.name}
          loading="lazy"
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
          <div className="extra-info opacity-0 transition-opacity duration-500">
            <div className="flex items-center text-xs text-jungle-text/80 mb-1">
              <CalendarIcon className="w-3.5 h-3.5 ml-1.5 text-jungle-accent" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center text-xs text-jungle-text/80 mb-2">
              <LocationIcon className="w-3.5 h-3.5 ml-1.5 text-jungle-accent" />
              <span className="truncate">{party.location}</span>
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
}

const getMaxSlidesPerView = (bps: Record<number, { slidesPerView: number }>) =>
  Math.max(...Object.values(bps).map(v => v.slidesPerView));

const PartyCarousel: React.FC<PartyCarouselProps> = ({ title, parties, viewAllLink, variant = 'coverflow' }) => {
  const swiperElRef = useRef<any>(null);
  const uniqueId = useMemo(() => `carousel-${Math.random().toString(36).substring(2, 11)}`, []);

  const upcomingParties = useMemo(
    () =>
      parties
        .filter(p => new Date(p.date) >= new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [parties]
  );

  const BREAKPOINTS = useMemo(() => (
    variant === 'coverflow'
      ? {
          0:    { slidesPerView: 1.6 },
          360:  { slidesPerView: 1.9 },
          420:  { slidesPerView: 2.2 },
          640:  { slidesPerView: 2.8 },
          768:  { slidesPerView: 3.0 },
          1024: { slidesPerView: 3.4 },
          1440: { slidesPerView: 3.8 },
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

  const maxSlidesPerView = useMemo(() => getMaxSlidesPerView(BREAKPOINTS), [BREAKPOINTS]);
  const minSlidesForLoop = Math.ceil(maxSlidesPerView) * 2 + 2;

  const slides = useMemo(() => {
    if (upcomingParties.length === 0) return [];
    if (upcomingParties.length < minSlidesForLoop) {
      const repeated = [];
      while (repeated.length < minSlidesForLoop) {
        repeated.push(...upcomingParties);
      }
      return repeated;
    }
    return upcomingParties;
  }, [upcomingParties, minSlidesForLoop]);

  useEffect(() => {
    const swiperEl = swiperElRef.current;
    if (!swiperEl || slides.length === 0) return;
    
    // The main fix is simplifying the configuration. By manually duplicating the slides,
    // we satisfy Swiper's loop requirements. We no longer need conflicting parameters
    // like `loopedSlides`. A simple `loop: true` is sufficient.
    const commonParams = {
      breakpoints: BREAKPOINTS,
      spaceBetween: 12,
      loop: true,
      observer: true,
      observeParents: true,
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
        delay: 3500,
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
    swiperEl.initialize();
    
    return () => {
      if (swiperEl.swiper) {
        swiperEl.swiper.destroy(true, true);
      }
    };
  }, [slides, variant, uniqueId, BREAKPOINTS]);

  if (slides.length === 0) return null;

  const carouselClasses = `relative party-carousel ${variant === 'coverflow' ? 'party-carousel-coverflow' : 'party-carousel-standard'}`;

  return (
    <div className="py-4">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-3xl font-display text-white">{title}</h2>
          <div className="flex items-center gap-4">
            <Link to={viewAllLink} className="text-jungle-accent hover:text-white transition-colors">הצג הכל</Link>
            <div className="flex gap-2">
              <button id={`prev-${uniqueId}`} className="swiper-button-prev !static !w-11 !h-11"><ArrowLeft className="w-6 h-6" /></button>
              <button id={`next-${uniqueId}`} className="swiper-button-next !static !w-11 !h-11"><ArrowRight className="w-6 h-6" /></button>
            </div>
          </div>
        </div>
      </div>
      <div className={carouselClasses}>
        <swiper-container ref={swiperElRef} init="false" class="py-4">
          {slides.map((party, index) => (
            <swiper-slide key={`${party.id}-${index}`}>
              <CarouselPartyCard party={party} />
            </swiper-slide>
          ))}
        </swiper-container>
      </div>
    </div>
  );
};

export default PartyCarousel;
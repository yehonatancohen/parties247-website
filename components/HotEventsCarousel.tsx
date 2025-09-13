import React, { useRef, useEffect, useMemo, FC } from 'react';
import { Link } from 'react-router-dom';
import { Party } from '../types';
import { useParties } from '../hooks/useParties';
import PartyCard from './PartyCard';
import { CalendarIcon, LocationIcon, FireIcon, PartyPopperIcon } from './Icons';

// Swiper types for React
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'swiper-container': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        init?: 'true' | 'false';
        navigation?: 'true' | 'false' | string;
        pagination?: 'true' | 'false';
        loop?: 'true' | 'false';
        effect?: 'slide' | 'fade' | 'cube' | 'coverflow' | 'flip';
        'slides-per-view'?: number | 'auto';
        'centered-slides'?: 'true' | 'false';
        lazy?: 'true' | 'false';
        spaceBetween?: number;
        grabCursor?: 'true' | 'false';
        coverflowEffect?: string;
        breakpoints?: string;
      }, HTMLElement>;
      'swiper-slide': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        lazy?: 'true' | 'false';
      }, HTMLElement>;
    }
  }
}


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

// --- Component Props ---
interface PartyCarouselProps {
  title: string;
  parties: Party[];
  viewAllLink: string;
  variant?: 'standard' | 'coverflow';
}

const PartyCarousel: React.FC<PartyCarouselProps> = ({ title, parties, viewAllLink, variant = 'standard' }) => {
  const swiperRef = useRef<HTMLElement | null>(null);
  const { defaultReferral } = useParties();
  const carouselId = useMemo(() => `carousel-${title.replace(/\s+/g, '-')}`, [title]);

  const getReferralUrl = (originalUrl: string, partyReferral?: string): string => {
    try {
      const referralCode = partyReferral || defaultReferral;
      if (!referralCode) return originalUrl;
      const url = new URL(originalUrl);
      url.searchParams.set('ref', referralCode);
      return url.toString();
    } catch {
      return originalUrl;
    }
  };

  useEffect(() => {
    const swiperEl = swiperRef.current;
    if (swiperEl) {
      const coverflowParams = {
        effect: 'coverflow',
        grabCursor: true,
        centeredSlides: true,
        slidesPerView: 'auto',
        coverflowEffect: {
          rotate: 0,
          stretch: 80,
          depth: 200,
          modifier: 1,
          slideShadows: false,
        },
      };

      const standardParams = {
        slidesPerView: 'auto',
        spaceBetween: 20,
        grabCursor: true,
        breakpoints: {
          '640': { slidesPerView: 2, spaceBetween: 20 },
          '768': { slidesPerView: 3, spaceBetween: 25 },
          '1024': { slidesPerView: 4, spaceBetween: 30 },
        },
      };
      
      const params = variant === 'coverflow' ? coverflowParams : standardParams;

      Object.assign(swiperEl, params, { navigation: { nextEl: `#${carouselId}-next`, prevEl: `#${carouselId}-prev` } });
      
      // @ts-ignore
      swiperEl.initialize();
    }
  }, [carouselId, variant]);

  const now = new Date();
  const upcomingParties = parties.filter(p => new Date(p.date) >= now).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (upcomingParties.length === 0) {
    return null;
  }

  return (
    <section className="container mx-auto px-4" aria-labelledby={`${carouselId}-title`}>
      <div className="flex justify-between items-center mb-4">
        <h2 id={`${carouselId}-title`} className="text-3xl font-display text-white">{title}</h2>
        <Link to={viewAllLink} className="text-jungle-accent hover:text-white transition-colors">הצג הכל</Link>
      </div>
      <div className="relative">
        {/* FIX: Use `className` instead of `class` for React components. */}
        <swiper-container
          ref={swiperRef}
          init="false"
          className={variant === 'coverflow' ? 'party-carousel-coverflow' : ''}
        >
          {upcomingParties.map(party => (
            // FIX: Use `className` instead of `class` for React components.
            <swiper-slide key={party.id} className={variant === 'coverflow' ? '!w-[70vw] sm:!w-[50vw] md:!w-[40vw] lg:!w-[30vw]' : '!w-[80vw] sm:!w-auto'}>
              {variant === 'coverflow' ? (
                <a href={getReferralUrl(party.originalUrl, party.referralCode)} target="_blank" rel="noopener noreferrer" className="block relative rounded-2xl overflow-hidden aspect-[3/4] group">
                    <img src={party.imageUrl} alt={party.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent flex flex-col justify-end p-5">
                       <div className="absolute top-3 right-3 flex flex-col gap-2">
                          {party.tags.slice(0, 2).map(tag => (
                            <span key={tag} className={`${getTagColor(tag)} backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center`}>
                              {renderTagContent(tag)}
                            </span>
                          ))}
                        </div>

                       <h3 className="font-display text-3xl text-white mb-2 transform transition-transform duration-500 group-hover:-translate-y-12" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.8)' }}>{party.name}</h3>

                       <div className="extra-info opacity-0 transition-opacity duration-500 absolute bottom-5 left-5 right-5">
                          <div className="flex items-center gap-2 text-jungle-text/80 text-sm mb-2">
                              <CalendarIcon className="h-4 w-4 text-jungle-accent" />
                              <span>{new Date(party.date).toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                          </div>
                          <div className="flex items-center gap-2 text-jungle-text/80 text-sm">
                              <LocationIcon className="h-4 w-4 text-jungle-accent" />
                              <span className="truncate">{party.location}</span>
                          </div>
                       </div>
                    </div>
                </a>
              ) : (
                <PartyCard party={party} />
              )}
            </swiper-slide>
          ))}
        </swiper-container>
        
        {/* Navigation Buttons */}
        <div id={`${carouselId}-prev`} className="swiper-button-prev -left-2 sm:-left-5">
          <ArrowRight className="w-6 h-6" />
        </div>
        <div id={`${carouselId}-next`} className="swiper-button-next -right-2 sm:-right-5">
          <ArrowLeft className="w-6 h-6" />
        </div>
      </div>
    </section>
  );
};

export default PartyCarousel;
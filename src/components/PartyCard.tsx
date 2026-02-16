import React from 'react';
import Link from 'next/link'
import Image from 'next/image'
import { Party } from '../data/types';
import { LAST_TICKETS_TAG } from '../data/constants';
import { CalendarIcon, LocationIcon, FireIcon, PartyPopperIcon } from './Icons';
import DiscountCodeReveal from './DiscountCodeReveal';

interface PartyCardProps {
  party: Party;
  showDiscountCode?: boolean;
}

const PartyCard: React.FC<PartyCardProps> = ({ party, showDiscountCode = false }) => {
  const partyDate = new Date(party.date);

  // FIX: Use compact date format to fit in cards
  const formattedDate = new Intl.DateTimeFormat('he-IL', {
    weekday: 'short',  // Use short weekday (e.g., "שבת" instead of "יום שבת")
    day: 'numeric',
    month: 'numeric',
    timeZone: 'UTC',
  }).format(partyDate);

  const formattedTime = new Intl.DateTimeFormat('he-IL', {
    timeStyle: 'short',
    hour12: false,
    timeZone: 'UTC',
  }).format(partyDate);

  const getTagColor = (tag: string) => {
    if (tag === LAST_TICKETS_TAG) return 'bg-red-500/90 text-white';
    if (tag === 'לוהט') return 'bg-jungle-lime/80 text-jungle-deep';
    if (tag === 'ביקוש גבוה') return 'bg-jungle-accent/80 text-jungle-deep';
    if (tag.includes('חינם')) return 'bg-green-500/80 text-white';
    if (tag.includes('+')) return 'bg-wood-brown/80 text-jungle-text';
    return 'bg-jungle-accent/80 text-jungle-deep';
  };

  const renderTagContent = (tag: string) => {
    if (tag === LAST_TICKETS_TAG) return <><FireIcon className="w-3 h-3 ml-0.5" />{tag}</>;
    if (tag === 'לוהט') return <><FireIcon className="w-3 h-3 ml-0.5" />{tag}</>;
    if (tag === 'ביקוש גבוה') return <><PartyPopperIcon className="w-3 h-3 ml-0.5" />{tag}</>;
    return tag;
  };

  const hasLastTickets = party.tags.includes(LAST_TICKETS_TAG);

  return (
    <div className="group relative bg-jungle-surface rounded-2xl overflow-hidden shadow-lg hover:shadow-jungle-glow/40 transition-all duration-300 flex flex-col transform hover:-translate-y-1.5 border border-white/5 hover:border-jungle-accent/30">
      <Link href={`/event/${party.slug}`} className="block relative">
        {/* Image container — full card-width, proper aspect ratio, no clipping */}
        <div className="relative overflow-hidden">
          <Image
            src={party.imageUrl}
            alt={party.name}
            className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            width={400}
            height={533}
          />
          {/* Gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />

          {/* Tags */}
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5">
            {party.tags.slice(0, 2).map(tag => (
              <span key={tag} className={`${getTagColor(tag)} backdrop-blur-md text-[10px] sm:text-xs font-bold px-2 py-0.5 sm:py-1 rounded-full shadow-lg flex items-center w-fit`}>
                {renderTagContent(tag)}
              </span>
            ))}
          </div>

          {/* Last tickets flash badge */}
          {hasLastTickets && (
            <div className="absolute top-2.5 left-2.5">
              <span className="inline-flex items-center gap-1 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full animate-pulse shadow-lg shadow-red-500/30">
                <FireIcon className="w-3 h-3" />
                אחרונים!
              </span>
            </div>
          )}

          {/* Party name — overlaying image bottom */}
          <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4">
            <h3 className="font-display text-xl sm:text-2xl text-white leading-tight line-clamp-2" style={{ textShadow: '1px 1px 4px rgba(0,0,0,0.9)' }}>
              {party.name}
            </h3>
          </div>
        </div>
      </Link>

      {/* Card body */}
      <div className="p-3 sm:p-4 flex flex-col flex-grow">
        <div className="flex flex-col gap-1.5 text-jungle-text/80 text-xs sm:text-sm mb-3">
          <div className="flex items-center gap-1.5">
            <CalendarIcon className="h-3.5 w-3.5 text-jungle-lime flex-shrink-0" />
            <span className="font-semibold whitespace-nowrap">{formattedDate} · {formattedTime}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <LocationIcon className="h-3.5 w-3.5 text-jungle-lime flex-shrink-0" />
            <span className="truncate">{party.location.name}</span>
          </div>
        </div>

        {showDiscountCode && <DiscountCodeReveal className="mb-3" />}

        <Link
          href={`/event/${party.slug}`}
          className="mt-auto flex items-center justify-center gap-2 text-center bg-gradient-to-r from-jungle-lime to-jungle-accent hover:from-jungle-lime/80 hover:to-jungle-accent/80 text-jungle-deep font-display text-lg sm:text-xl py-2.5 px-3 rounded-xl transition-all w-full group-hover:scale-[1.03] tracking-wide shadow-lg shadow-jungle-lime/10"
        >
          <span>פרטים וכרטיסים</span>
        </Link>
      </div>
    </div>
  );
};

export default PartyCard;
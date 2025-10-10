import React from 'react';
import { Link } from 'react-router-dom';
import { Party } from '../types';
import { CalendarIcon, LocationIcon, FireIcon, PartyPopperIcon } from './Icons';
import { DEFAULT_PARTY_IMAGE } from '../constants';

interface PartyCardProps {
  party: Party;
}

const PartyCard: React.FC<PartyCardProps> = ({ party }) => {
  const partyDate = new Date(party.date);
  const formattedDate = new Intl.DateTimeFormat('he-IL', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  }).format(partyDate);
  const formattedTime = new Intl.DateTimeFormat('he-IL', {
    timeStyle: 'short',
    hour12: false,
  }).format(partyDate);

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

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = DEFAULT_PARTY_IMAGE;
  };

  const imageUrl = party.imageUrl || DEFAULT_PARTY_IMAGE;

  return (
    <div className="bg-jungle-surface rounded-xl overflow-hidden shadow-lg hover:shadow-jungle-glow/60 transition-all duration-300 flex flex-col group transform hover:-translate-y-1 border border-wood-brown/50">
      <Link to={`/event/${party.slug}`} className="block">
        <div className="relative">
          <img
            src={imageUrl}
            alt={party.name}
            className="w-full aspect-[3/4] object-cover"
            loading="lazy"
            width="300"
            height="400"
            onError={handleImageError}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {party.tags.slice(0, 2).map(tag => (
              <span key={tag} className={`${getTagColor(tag)} backdrop-blur-sm text-xs font-bold px-2 py-1 rounded-full shadow-lg flex items-center`}>
                {renderTagContent(tag)}
              </span>
            ))}
          </div>
          <div className="absolute bottom-0 left-0 p-4 w-full">
             <h3 className="font-display text-3xl text-white mb-1 truncate" style={{ textShadow: '2px 2px 6px rgba(0,0,0,0.9)' }}>{party.name}</h3>
          </div>
        </div>
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center text-jungle-text/80 text-md mb-4 gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-jungle-accent flex-shrink-0" />
                <span className="font-semibold">{formattedDate} | {formattedTime}</span>
            </div>
            <div className="flex items-center gap-2">
                <LocationIcon className="h-5 w-5 text-jungle-accent flex-shrink-0" />
                <span className="truncate">{party.location.name}</span>
            </div>
        </div>
        <Link
          to={`/event/${party.slug}`}
          className="mt-auto flex items-center justify-center gap-2 text-center bg-gradient-to-r from-jungle-lime to-jungle-accent hover:from-jungle-lime/80 hover:to-jungle-accent/80 text-jungle-deep font-display text-2xl py-3 px-4 rounded-lg transition-all w-full group-hover:scale-105 tracking-wider"
        >
          <span>פרטים וכרטיסים</span>
        </Link>
      </div>
    </div>
  );
};

export default PartyCard;
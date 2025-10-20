import React from 'react';
import { Link } from 'react-router-dom';
import { Party } from '../types';
import { CalendarIcon, LocationIcon } from './Icons';
import { trackEvent } from '../lib/analytics';

interface RelatedPartyCardProps {
  party: Party;
}

const RelatedPartyCard: React.FC<RelatedPartyCardProps> = ({ party }) => {
  const partyDate = new Date(party.date);
  const formattedDate = new Intl.DateTimeFormat('he-IL', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).format(partyDate);

  const handleOpenRelated = () => {
    trackEvent({
      category: 'party',
      action: 'open-related',
      label: party.slug,
      path: `/event/${party.slug}`,
      context: {
        partyId: party.id,
        source: 'related-card',
      },
    });
  };

  return (
    <Link
      to={`/event/${party.slug}`}
      className="bg-jungle-deep rounded-lg overflow-hidden shadow-lg hover:shadow-jungle-glow/30 transition-all duration-300 flex flex-col group transform hover:-translate-y-1 border border-wood-brown/30"
      onClick={handleOpenRelated}
    >
        <div className="relative">
          <img 
            src={party.imageUrl} 
            alt={party.name} 
            className="w-full aspect-[4/3] object-cover" 
            loading="lazy"
            width="400"
            height="300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
        </div>
      <div className="p-3">
        <h3 className="font-display text-lg text-white mb-2 truncate group-hover:text-jungle-accent">{party.name}</h3>
        <div className="flex items-center text-jungle-text/70 text-xs mb-1">
            <CalendarIcon className="h-4 w-4 text-jungle-accent flex-shrink-0 ml-1.5" />
            <span>{formattedDate}</span>
        </div>
        <div className="flex items-center text-jungle-text/70 text-xs">
            <LocationIcon className="h-4 w-4 text-jungle-accent flex-shrink-0 ml-1.5" />
            <span className="truncate">{party.location.name}</span>
        </div>
      </div>
    </Link>
  );
};

export default RelatedPartyCard;
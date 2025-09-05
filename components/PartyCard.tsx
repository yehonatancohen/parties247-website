
import React from 'react';
import { Party } from '../types';
import { AFFILIATE_CODE } from '../constants';
import { CalendarIcon, LocationIcon } from './Icons';

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


  const getAffiliateUrl = (originalUrl: string) => {
    try {
      const url = new URL(originalUrl);
      url.searchParams.set('aff', AFFILIATE_CODE);
      return url.toString();
    } catch (error) {
      return originalUrl; // Fallback if URL is invalid
    }
  };

  return (
    <div className="bg-brand-surface rounded-xl overflow-hidden shadow-lg hover:shadow-neon-glow/30 transition-all duration-300 flex flex-col group transform hover:-translate-y-1">
      <div className="relative">
        <img src={party.imageUrl} alt={party.name} className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          {party.isHot && (
            <span className="bg-orange-500/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">🔥 לוהט</span>
          )}
          {party.demand === 'high' && (
            <span className="bg-brand-primary/80 backdrop-blur-sm text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">🎉 ביקוש גבוה</span>
          )}
        </div>
        <div className="absolute bottom-0 left-0 p-4 w-full">
           <h3 className="text-2xl font-bold text-white mb-1 truncate" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.7)' }}>{party.name}</h3>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center text-gray-300 text-md mb-4 gap-2 sm:gap-4">
            <div className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5 text-brand-secondary flex-shrink-0" />
                <span className="font-semibold">{formattedDate} | {formattedTime}</span>
            </div>
            <div className="flex items-center gap-2">
                <LocationIcon className="h-5 w-5 text-brand-secondary flex-shrink-0" />
                <span className="truncate">{party.location}</span>
            </div>
        </div>
        <a
          href={getAffiliateUrl(party.originalUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-auto block text-center bg-gradient-to-r from-brand-primary to-brand-secondary hover:from-brand-primary/80 hover:to-brand-secondary/80 text-white font-bold py-3 px-4 rounded-lg transition-all w-full text-lg group-hover:scale-105"
        >
          קחו אותי לשם 🚀
        </a>
      </div>
    </div>
  );
};

export default PartyCard;
import React from 'react';
import { useParties } from '../hooks/useParties';
import { Party } from '../types';
import { Link } from 'react-router-dom';
import { AFFILIATE_CODE } from '../constants';

const HotPartyCard: React.FC<{ party: Party }> = ({ party }) => {
    const getAffiliateUrl = (originalUrl: string) => {
    try {
      const url = new URL(originalUrl);
      url.searchParams.set('aff', AFFILIATE_CODE);
      return url.toString();
    } catch (error) {
      return originalUrl;
    }
  };

    return (
        <a 
            href={getAffiliateUrl(party.originalUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-shrink-0 w-72 h-40 bg-brand-surface rounded-lg overflow-hidden relative group shadow-lg hover:shadow-neon-glow/30 transition-shadow duration-300"
        >
            <img src={party.imageUrl} alt={party.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-4">
                <h3 className="text-lg font-bold text-white truncate">{party.name}</h3>
                <p className="text-sm text-gray-300 truncate">{party.location}</p>
            </div>
        </a>
    );
};

const HotEventsCarousel: React.FC = () => {
  const { parties } = useParties();
  const hotParties = parties.filter(p => p.isHot);

  if (hotParties.length === 0) {
    return null;
  }

  return (
    <div className="mb-12">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span className="text-orange-400">🔥</span>
        <span className="text-white">אירועים חמים</span>
      </h2>
      <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
        {hotParties.map(party => (
          <HotPartyCard key={party.id} party={party} />
        ))}
        <style>{`.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
      </div>
    </div>
  );
};

export default HotEventsCarousel;

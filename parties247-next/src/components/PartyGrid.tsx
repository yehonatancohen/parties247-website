
import React from 'react';
import { Party } from '../data/types';
import PartyCard from './PartyCard';

interface PartyGridProps {
  parties: Party[];
  hotPartyIds?: Set<string>;
}

const PartyGrid: React.FC<PartyGridProps> = ({ parties, hotPartyIds }) => {
  const now = new Date();

  const upcomingParties = parties
    .filter(party => new Date(party.date) >= now)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  if (upcomingParties.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-400">לא נמצאו מסיבות קרובות</h2>
        <p className="text-gray-500 mt-2">בדקו שוב בקרוב או נסו עיר אחרת.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {upcomingParties.map(party => (
        <PartyCard key={party.id} party={party} showDiscountCode={hotPartyIds?.has(party.id)} />
      ))}
    </div>
  );
};

export default PartyGrid;
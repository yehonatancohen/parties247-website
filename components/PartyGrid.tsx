
import React from 'react';
import { Party } from '../types';
import PartyCard from './PartyCard';

interface PartyGridProps {
  parties: Party[];
}

const PartyGrid: React.FC<PartyGridProps> = ({ parties }) => {
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {upcomingParties.map(party => (
        <PartyCard key={party.id} party={party} />
      ))}
    </div>
  );
};

export default PartyGrid;

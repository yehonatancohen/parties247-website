import { Party } from '../../types';
import PartyCard from './PartyCard';

interface PartyGridProps {
  parties: Party[];
}

export default function PartyGrid({ parties }: PartyGridProps) {
  if (parties.length === 0) {
    return (
      <div className="text-center py-16">
        <h2 className="text-2xl font-bold text-gray-400">לא נמצאו מסיבות קרובות</h2>
        <p className="text-gray-500 mt-2">בדקו שוב בקרוב או נסו עיר אחרת.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {parties.map((party) => (
        <PartyCard key={party.id} party={party} />
      ))}
    </div>
  );
}

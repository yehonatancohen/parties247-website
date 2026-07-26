import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Party } from '../data/types';
import { CalendarIcon, LocationIcon } from './Icons';

interface ArchivePartyCardProps {
  party: Party;
}

const ArchivePartyCard: React.FC<ArchivePartyCardProps> = ({ party }) => {
  const partyDate = new Date(party.date);
  const formattedDate = new Intl.DateTimeFormat('he-IL', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(partyDate);

  return (
    <Link
      href={`/archive/${party.slug}`}
      className="group relative bg-jungle-surface rounded-2xl overflow-hidden shadow-lg transition-all duration-300 flex flex-col border border-white/5 hover:border-white/20"
    >
      <div className="relative overflow-hidden">
        <Image
          src={party.imageUrl}
          alt={party.name}
          className="w-full aspect-[3/4] object-cover opacity-70 group-hover:opacity-90 transition-opacity"
          loading="lazy"
          width={400}
          height={533}
        />
        <span className="absolute top-2 right-2 bg-black/60 text-white/80 text-[10px] font-semibold px-2 py-1 rounded-full">
          אירוע שהתקיים
        </span>
      </div>
      <div className="p-3 flex flex-col gap-1.5">
        <h3 className="text-white font-semibold text-sm truncate">{party.name}</h3>
        <div className="flex items-center gap-1.5 text-jungle-text/60 text-xs">
          <CalendarIcon className="w-3.5 h-3.5 flex-shrink-0" />
          <span>{formattedDate}</span>
        </div>
        <div className="flex items-center gap-1.5 text-jungle-text/60 text-xs">
          <LocationIcon className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{party.location.name}</span>
        </div>
      </div>
    </Link>
  );
};

export default ArchivePartyCard;

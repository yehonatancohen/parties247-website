import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Party } from '../data/types';
import { formatDayShort } from '@/lib/nights';
import { venueOf } from './home/homeData';

interface ArchivePartyCardProps {
  party: Party;
}

const ArchivePartyCard: React.FC<ArchivePartyCardProps> = ({ party }) => {
  const year = party.date?.slice(0, 4);
  const venue = venueOf(party);

  return (
    <Link href={`/archive/${party.slug}`} className="group flex flex-col">
      <div className="relative aspect-square overflow-hidden rounded-[18px] bg-tile">
        <Image
          src={party.imageUrl}
          alt={party.name}
          fill
          sizes="(min-width: 1280px) 230px, (min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
          quality={50}
          loading="lazy"
          className="object-cover opacity-60 grayscale-[30%] transition-[opacity,filter] duration-500 group-hover:opacity-90 group-hover:grayscale-0"
        />
        <span className="absolute right-3 top-3 rounded-full bg-black/65 px-2.5 py-1 text-[11px] font-semibold text-ink-2 backdrop-blur-md">
          אירוע שהתקיים
        </span>
      </div>
      <div className="px-1 pt-3">
        <p className="text-[12px] text-ink-3">
          {formatDayShort(party.date)}
          {year ? `.${year.slice(2)}` : ''}
        </p>
        <h3 className="mt-0.5 truncate text-[15px] font-semibold text-ink" dir="auto">{party.name}</h3>
        {venue && <p className="truncate text-[12px] text-ink-3">{venue}</p>}
      </div>
    </Link>
  );
};

export default ArchivePartyCard;

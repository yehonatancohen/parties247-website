import Image from 'next/image';
import Link from 'next/link';
import { Party } from '@/data/types';

interface FlyerFanProps {
  parties: Party[];
  size: 'lg' | 'md';
  /**
   * Make each flyer a link to its event page. Only for a fan that stands on its
   * own (holiday hero) — the home / discovery tiles already wrap the fan in a
   * `<Link>`, and a link inside a link is invalid.
   */
  linked?: boolean;
}

/** A fanned stack of real flyers — the "product shot" of a tile. */
export default function FlyerFan({ parties, size, linked = false }: FlyerFanProps) {
  const shown = parties.slice(0, size === 'lg' ? 5 : 3);
  const mid = (shown.length - 1) / 2;
  const box = size === 'lg' ? 'h-[128px] w-[128px] sm:h-[220px] sm:w-[220px]' : 'h-[64px] w-[64px] sm:h-[150px] sm:w-[150px]';
  const overlap = size === 'lg' ? '-ml-10 sm:-ml-16' : '-ml-5 sm:-ml-10';

  return (
    <div className={`flex items-end justify-center ${size === 'lg' ? 'pl-10 sm:pl-16' : 'pl-5 sm:pl-10'}`} aria-hidden={linked ? undefined : true}>
      {shown.map((party, i) => {
        const offset = i - mid;
        const className = `relative shrink-0 overflow-hidden rounded-[14px] bg-tile-raised shadow-[0_18px_40px_rgba(0,0,0,0.55)] transition-transform duration-700 ease-apple sm:rounded-[18px] ${box} ${overlap}`;
        const style = {
          transform: `translateY(${Math.abs(offset) * (size === 'lg' ? 14 : 8)}px) rotate(${offset * 5}deg) scale(${1 - Math.abs(offset) * 0.06})`,
          zIndex: 10 - Math.abs(Math.round(offset * 2)),
        };
        const flyer = (
          <Image src={party.imageUrl} alt="" fill sizes={size === 'lg' ? '(min-width: 640px) 220px, 128px' : '(min-width: 640px) 150px, 64px'} quality={50} className="object-cover" />
        );
        return linked ? (
          <Link key={party.id} href={`/event/${party.slug}`} aria-label={party.name} className={className} style={style}>
            {flyer}
          </Link>
        ) : (
          <div key={party.id} className={className} style={style}>
            {flyer}
          </div>
        );
      })}
    </div>
  );
}

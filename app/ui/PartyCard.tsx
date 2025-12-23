import Link from 'next/link';
import { Party } from '../../types';

interface PartyCardProps {
  party: Party;
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const formattedDate = new Intl.DateTimeFormat('he-IL', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
  }).format(date);
  const formattedTime = new Intl.DateTimeFormat('he-IL', {
    timeStyle: 'short',
    hour12: false,
  }).format(date);
  return `${formattedDate} | ${formattedTime}`;
};

export default function PartyCard({ party }: PartyCardProps) {
  return (
    <div className="bg-jungle-surface rounded-xl overflow-hidden shadow-lg border border-wood-brown/50 flex flex-col">
      <Link href={`/event/${party.slug}`} className="block">
        <div className="relative">
          <img
            src={party.imageUrl}
            alt={party.name}
            className="w-full aspect-[3/4] object-cover"
            loading="lazy"
            width={300}
            height={400}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 p-4 w-full">
            <h3 className="font-display text-2xl text-white mb-1 truncate">{party.name}</h3>
            <p className="text-sm text-jungle-text/80">{formatDate(party.date)}</p>
            <p className="text-sm text-jungle-text/80 truncate">{party.location.name}</p>
          </div>
        </div>
      </Link>
      <div className="p-4 flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {party.tags.slice(0, 2).map((tag) => (
            <span key={tag} className="bg-jungle-accent/80 text-jungle-deep text-xs font-semibold px-2 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>
        <Link
          href={`/event/${party.slug}`}
          className="mt-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r from-jungle-lime to-jungle-accent text-jungle-deep font-display text-lg py-2 px-4 rounded-lg transition-all hover:from-jungle-lime/80 hover:to-jungle-accent/80"
        >
          פרטים וכרטיסים
        </Link>
      </div>
    </div>
  );
}

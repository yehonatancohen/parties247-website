import Image from 'next/image';
import Link from 'next/link';
import { Party } from '@/data/types';
import { isCouponEligible } from '@/data/constants';
import { formatDayShort, formatTime } from '@/lib/nights';
import { priceOf, venueOf } from './homeData';

interface LaunchPartyCardProps {
  party: Party;
  sizes: string;
  eager?: boolean;
}

export default function LaunchPartyCard({ party, sizes, eager = false }: LaunchPartyCardProps) {
  const price = priceOf(party);
  const venue = venueOf(party);
  const when = [formatDayShort(party.date), formatTime(party.date)].filter(Boolean).join(' · ');
  const hasCoupon = !party.soldOut && isCouponEligible(party.referralCode);

  return (
    <Link
      href={`/event/${party.slug}`}
      className="group flex h-full flex-col rounded-[22px] outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-link"
    >
      <div className="relative aspect-square overflow-hidden rounded-[18px] bg-tile">
        <Image
          src={party.imageUrl}
          alt={party.name}
          fill
          sizes={sizes}
          quality={75}
          loading={eager ? 'eager' : 'lazy'}
          className={`object-cover transition-transform duration-700 ease-apple group-hover:scale-[1.035] ${party.soldOut ? 'opacity-60 grayscale-[35%]' : ''}`}
        />
        {hasCoupon && (
          <span className="absolute left-3 top-3 rounded-full bg-action px-2.5 py-1 text-[12px] font-semibold text-on-action shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
            קוד הנחה
          </span>
        )}
        {party.soldOut && (
          <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2.5 py-1 text-[12px] font-semibold text-ink backdrop-blur-md">
            אזלו הכרטיסים
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-1 pt-3">
        <p className="text-[12px] font-medium text-ink-3 sm:text-[13px]">{when}</p>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-[1.3] text-ink sm:text-[17px]" dir="auto">
          {party.name.trim()}
        </h3>
        {venue && <p className="mt-0.5 truncate text-[12px] text-ink-3 sm:text-[13px]">{venue}</p>}

        <div className="mt-auto flex flex-wrap items-center justify-between gap-x-3 gap-y-1 pt-3">
          <span className="text-[14px] text-ink-2 sm:text-[15px]">
            {price ? (
              <>
                החל מ-<span className="font-semibold tabular-nums text-ink">{price} ₪</span>
              </>
            ) : party.soldOut ? (
              'אזל'
            ) : (
              'מחיר בדף האירוע'
            )}
          </span>
          <span
            className={`inline-flex shrink-0 items-center gap-0.5 text-[15px] font-medium ${
              party.soldOut ? 'text-ink-3' : 'text-link group-hover:underline underline-offset-4'
            }`}
          >
            {party.soldOut ? 'פרטים' : 'כרטיסים'}
            <svg viewBox="0 0 24 24" className="h-[0.8em] w-[0.8em]" fill="none" stroke="currentColor" strokeWidth={2.6} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

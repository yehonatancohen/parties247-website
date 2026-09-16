import { Carousel, Party } from '@/data/types';
import { isCouponEligible } from '@/data/constants';
import { nightOf } from '@/lib/nights';
import { createCarouselSlug } from '@/lib/carousels';

const CITY_NAMES: Record<string, string> = {
  'tel aviv-yafo': 'תל אביב',
  'tel aviv': 'תל אביב',
  'tel-aviv': 'תל אביב',
  'תל אביב-יפו': 'תל אביב',
  'תל אביב': 'תל אביב',
  haifa: 'חיפה',
  'חיפה': 'חיפה',
  jerusalem: 'ירושלים',
  'ירושלים': 'ירושלים',
  eilat: 'אילת',
  'אילת': 'אילת',
  'rishon lezion': 'ראשון לציון',
  'ראשון לציון': 'ראשון לציון',
  holon: 'חולון',
  'חולון': 'חולון',
  'ramat yishai': 'רמת ישי',
  'רמת ישי': 'רמת ישי',
  'beer sheva': 'באר שבע',
  'באר שבע': 'באר שבע',
  'הרצליה': 'הרצליה',
  herzliya: 'הרצליה',
  'נתניה': 'נתניה',
  netanya: 'נתניה',
  'אשדוד': 'אשדוד',
  ashdod: 'אשדוד',
  'ramat hasharon': 'רמת השרון',
  athens: 'אתונה',
};
const DROP_PARTS = new Set(['israel', 'israël', 'ישראל', 'greece', 'unknown location', 'north']);

/**
 * Short venue line in Hebrew: "<venue> · <city>", no street numbers or country
 * ("Gagarin Club TLV, דרך קיבוץ גלויות, Tel Aviv-Yafo, Israel" → "Gagarin Club TLV · תל אביב").
 * Backend sends `location` as a plain string today, the type says object — accept both.
 */
export function venueOf(party: Party): string {
  const loc = party.location as unknown;
  const raw = typeof loc === 'string' ? loc : (loc as { name?: string } | undefined)?.name;
  if (!raw) return '';
  const parts = raw
    .split(',')
    .map((part) => part.trim())
    .filter((part) => part && !DROP_PARTS.has(part.toLowerCase()));
  if (parts.length === 0) return '';

  const city = parts.map((part) => CITY_NAMES[part.toLowerCase()]).find(Boolean);
  const venue = CITY_NAMES[parts[0].toLowerCase()] ? '' : parts[0];
  return [venue, city].filter(Boolean).join(' · ') || parts[0];
}

export function priceOf(party: Party): number | null {
  const p = party.ticketPrice;
  return typeof p === 'number' && p > 0 ? Math.round(p) : null;
}

/** Carousel titles are typed in the admin with trailing emoji ("חם עכשיו🔥"). */
export function cleanTitle(title: string): string {
  return title
    .replace(/[\p{Emoji_Presentation}\p{Extended_Pictographic}‍️]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();
}

const byDate = (a: Party, b: Party) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0);

/** account1 events (our own referral account, with a coupon) get promoted placement. */
export const isPromoted = (party: Party) => !party.soldOut && isCouponEligible(party.referralCode);

/** Available parties first, sold-out ones last, each group in date order. */
export function sortForDisplay(parties: Party[]): Party[] {
  return [...parties].sort((a, b) => Number(!!a.soldOut) - Number(!!b.soldOut) || byDate(a, b));
}

/**
 * Same as sortForDisplay, but within each night account1 parties lead. Dates still
 * read in order — a promoted Saturday party never jumps ahead of Thursday.
 */
export function sortPromotedWithinNight(parties: Party[]): Party[] {
  return [...parties].sort(
    (a, b) =>
      Number(!!a.soldOut) - Number(!!b.soldOut) ||
      (nightOf(a.date) ?? a.date).localeCompare(nightOf(b.date) ?? b.date) ||
      Number(isPromoted(b)) - Number(isPromoted(a)) ||
      byDate(a, b)
  );
}

export interface HomeShelf {
  id: string;
  title: string;
  href: string;
  parties: Party[];
}

export function buildShelves(carousels: Carousel[], parties: Party[]): HomeShelf[] {
  const lookup = new Map(parties.map((p) => [String(p.id ?? (p as Party & { _id?: string })._id), p]));

  return [...carousels]
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    .map((carousel) => {
      const lowerTitle = carousel.title.toLowerCase();
      let href = `/carousels/${createCarouselSlug(carousel.title)}`;
      if (lowerTitle.includes('purim') || carousel.title.includes('פורים')) href = '/purim';
      else if (lowerTitle.includes('rosh hashan') || /ראש[ -]השנה/.test(carousel.title)) href = '/rosh-hashana';
      else if (lowerTitle.includes('sukkot') || lowerTitle.includes('succot') || carousel.title.includes('סוכות')) href = '/sukkot';

      const shelfParties = (carousel.partyIds ?? [])
        .map((id) => lookup.get(String(id)))
        .filter((p): p is Party => Boolean(p));

      return {
        id: carousel.id,
        title: cleanTitle(carousel.title),
        href,
        parties: sortForDisplay(shelfParties),
      };
    })
    .filter((shelf) => shelf.parties.length > 0);
}

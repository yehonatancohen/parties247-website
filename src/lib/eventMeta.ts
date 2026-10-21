/**
 * Text and links an event page derives from a party: the meta title and
 * description, a short summary of our own, and the Google Calendar link.
 *
 * Party dates are naive Israel wall-clock strings, so nothing here builds a
 * Date from them directly (see `dates.ts`).
 */
import type { Party } from '@/data/types';
import { toIsraelISO } from './dates';
import { formatDayShort, formatTime } from './nights';
import { priceLabel } from './price';
import { venueOf } from '@/components/home/homeData';

const META_DESCRIPTION_MAX = 160;

/** Cuts at a word boundary and adds an ellipsis when the text is too long. */
export function truncateWords(text: string, max: number): string {
  const clean = text.replace(/\s+/g, ' ').trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,.;:–-]+$/, '')}…`;
}

/** "חמישי 22.10 · 20:30" */
function whenLabel(party: Pick<Party, 'date'>): string {
  return [formatDayShort(party.date), formatTime(party.date)].filter(Boolean).join(' · ');
}

/** "DECISION FESTIVAL | Gagarin Club TLV · תל אביב, חמישי 22.10" (the layout adds "| Parties 24/7"). */
export function eventMetaTitle(party: Party, opts: { past?: boolean } = {}): string {
  const venue = venueOf(party);
  const day = formatDayShort(party.date);
  const where = [venue, day].filter(Boolean).join(', ');
  const title = where ? `${party.name} - ${where}` : party.name;
  return opts.past ? `${title} | ארכיון מסיבות` : title;
}

/**
 * A short description in our own words, built only from facts we hold: when,
 * where, music, age and price. Shown on the page and used as the meta/OG
 * description, so a shared link no longer previews the promoter's text.
 */
export function eventSummary(party: Party, opts: { past?: boolean } = {}): string {
  const venue = venueOf(party);
  const when = whenLabel(party);
  const facts: string[] = [];
  if (party.musicType && party.musicType !== 'אחר') facts.push(`מוזיקת ${party.musicType}`);
  if (party.age && party.age !== 'כל הגילאים') facts.push(`גיל כניסה ${party.age}`);

  const head = opts.past
    ? `${party.name} התקיימה ${[when, venue && `ב-${venue}`].filter(Boolean).join(' ')}.`
    : `${party.name} – ${[when, venue && `ב-${venue}`].filter(Boolean).join(' ')}.`;
  const parts = [head.replace(/\s+\./, '.')];
  if (facts.length) parts.push(`${facts.join(', ')}.`);
  if (!opts.past) {
    const price = party.soldOut ? 'הכרטיסים אזלו' : priceLabel(party);
    if (price) parts.push(`${price}.`);
  }
  return parts.join(' ');
}

/** Meta description: our summary first, then as much of the cleaned promoter text as fits. */
export function eventMetaDescription(party: Party, plainDescription: string, opts: { past?: boolean } = {}): string {
  const summary = eventSummary(party, opts);
  const rest = plainDescription.trim();
  return truncateWords(rest ? `${summary} ${rest}` : summary, META_DESCRIPTION_MAX);
}

/** Google Calendar wants real UTC ("…Z"); the stored date is Israel wall-clock. */
function toGCalUTC(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

const EVENT_LENGTH_MS = 4 * 60 * 60 * 1000;

export function googleCalendarUrl(party: Party, details: string): string {
  const start = new Date(toIsraelISO(party.date));
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: party.name,
    details: details.substring(0, 200),
    location: party.location?.address || party.location?.name || '',
    ctz: 'Asia/Jerusalem',
  });
  if (!Number.isNaN(start.getTime())) {
    const end = new Date(start.getTime() + EVENT_LENGTH_MS);
    params.set('dates', `${toGCalUTC(start)}/${toGCalUTC(end)}`);
  }
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** UTM-tagged event page URL for links people share. */
export function shareUrl(slug: string, baseUrl: string, medium: string): string {
  const params = new URLSearchParams({ utm_source: 'share', utm_medium: medium, utm_campaign: 'event_share' });
  return `${baseUrl}/event/${slug}?${params.toString()}`;
}

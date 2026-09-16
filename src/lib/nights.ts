/**
 * "Which night does this party belong to?" helpers for the home page.
 *
 * Backend dates are naive Israel wall-clock strings (see `dates.ts`), so they are
 * parsed textually here — never through `new Date(str)`, which would read them in
 * the server's timezone (UTC on Vercel).
 *
 * A night runs from 06:00 to 05:59 the next morning: a party starting at 00:30 on
 * Friday is a Thursday-night party, which is how people actually talk about it.
 */
import { getIsraelDateString } from './dates';

const NAIVE_RE = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2})/;
const NIGHT_ROLLOVER_HOUR = 6;

const HEBREW_WEEKDAYS = ['ראשון', 'שני', 'שלישי', 'רביעי', 'חמישי', 'שישי', 'שבת'];

export interface WallClock {
  year: number;
  month: number; // 1-12
  day: number;
  hour: number;
  minute: number;
}

export function parseWallClock(dateStr: string | undefined | null): WallClock | null {
  if (typeof dateStr !== 'string') return null;
  const m = NAIVE_RE.exec(dateStr.trim());
  if (!m) return null;
  const [, y, mo, d, h, mi] = m;
  return { year: +y, month: +mo, day: +d, hour: +h, minute: +mi };
}

const pad = (n: number) => String(n).padStart(2, '0');

/** Adds days to a YYYY-MM-DD calendar date (pure calendar math, no timezone). */
export function addDays(ymd: string, days: number): string {
  const [y, m, d] = ymd.split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + days));
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(t.getUTCDate())}`;
}

/** 0 = Sunday … 6 = Saturday, for a YYYY-MM-DD calendar date. */
export function weekdayOf(ymd: string): number {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

/** The night (YYYY-MM-DD of its evening) a party belongs to. */
export function nightOf(dateStr: string): string | null {
  const wc = parseWallClock(dateStr);
  if (!wc) return null;
  const ymd = `${wc.year}-${pad(wc.month)}-${pad(wc.day)}`;
  return wc.hour < NIGHT_ROLLOVER_HOUR ? addDays(ymd, -1) : ymd;
}

/** Tonight's night key in Israel, for a given absolute instant. */
export function currentNight(now: Date = new Date()): string {
  const ymd = getIsraelDateString(now);
  const hour = Number(
    new Intl.DateTimeFormat('en-GB', { timeZone: 'Asia/Jerusalem', hour: '2-digit', hour12: false }).format(now)
  );
  return hour < NIGHT_ROLLOVER_HOUR ? addDays(ymd, -1) : ymd;
}

export type NightRange = 'tonight' | 'tomorrow' | 'weekend' | 'week';

/** Inclusive [first, last] night keys for a named range, relative to tonight. */
export function rangeNights(range: NightRange, tonight: string): [string, string] {
  switch (range) {
    case 'tonight':
      return [tonight, tonight];
    case 'tomorrow': {
      const t = addDays(tonight, 1);
      return [t, t];
    }
    case 'weekend': {
      // Thursday–Saturday nights. From Thursday on, it's this weekend (what's left of it).
      const wd = weekdayOf(tonight);
      if (wd >= 4) return [tonight, addDays(tonight, 6 - wd)];
      return [addDays(tonight, 4 - wd), addDays(tonight, 6 - wd)];
    }
    case 'week':
      return [tonight, addDays(tonight, 6)];
  }
}

export function isInRange(dateStr: string, range: [string, string]): boolean {
  const n = nightOf(dateStr);
  return n !== null && n >= range[0] && n <= range[1];
}

/** "חמישי 17.9" */
export function formatDayShort(dateStr: string): string {
  const wc = parseWallClock(dateStr);
  if (!wc) return '';
  const ymd = `${wc.year}-${pad(wc.month)}-${pad(wc.day)}`;
  return `${HEBREW_WEEKDAYS[weekdayOf(ymd)]} ${wc.day}.${wc.month}`;
}

/** "22:30" */
export function formatTime(dateStr: string): string {
  const wc = parseWallClock(dateStr);
  return wc ? `${pad(wc.hour)}:${pad(wc.minute)}` : '';
}

/** "יום רביעי, 16 בספטמבר" for a night key. */
export function formatLongDate(ymd: string): string {
  const [y, m, d] = ymd.split('-').map(Number);
  return new Intl.DateTimeFormat('he-IL', {
    weekday: 'long', day: 'numeric', month: 'long', timeZone: 'UTC',
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

/**
 * Computed date windows for holiday landing pages (`/sukkot`, `/hanukkah`, ...).
 *
 * Hebrew-calendar holidays shift every Gregorian year, so their dates are computed
 * via `@hebcal/core` rather than hardcoded — a page written today must still show
 * the right window next year without a code edit. Halloween and Sylvester are fixed
 * Gregorian dates and don't touch hebcal at all.
 *
 * Party dates from the backend are naive Israel wall-clock strings (see `dates.ts`
 * header comment) — the `YYYY-MM-DD` prefix of that string *is* the Israel calendar
 * day already, no timezone conversion needed to compare it against a window.
 */
import { HDate, HebrewCalendar } from '@hebcal/core';
import { Party } from '@/data/types';
import { getIsraelDateString } from './dates';

export interface HolidayDef {
  slug: string;
  hebrewName: string;
  source: 'hebcal' | 'fixed';
  /** Exact hebcal event description marking the first day of the holiday window. */
  hebcalStartDesc?: string;
  /** Exact hebcal event description marking the last day; defaults to `hebcalStartDesc`. */
  hebcalEndDesc?: string;
  /** 1-indexed Gregorian month/day, for `source: 'fixed'` holidays. */
  fixedMonthDay?: { month: number; day: number };
  /** Extra days to include before the holiday's first day (e.g. erev-evening parties). */
  leadDays: number;
  /** Extra days to include after the holiday's last day. */
  trailDays: number;
}

export const HOLIDAYS: Record<string, HolidayDef> = {
  sukkot: {
    slug: 'sukkot',
    hebrewName: 'סוכות',
    source: 'hebcal',
    hebcalStartDesc: 'Sukkot I',
    hebcalEndDesc: 'Shmini Atzeret',
    leadDays: 1,
    trailDays: 0,
  },
  halloween: {
    slug: 'halloween',
    hebrewName: 'האלווין',
    source: 'fixed',
    fixedMonthDay: { month: 10, day: 31 },
    leadDays: 3,
    trailDays: 0,
  },
  hanukkah: {
    slug: 'hanukkah',
    hebrewName: 'חנוכה',
    source: 'hebcal',
    hebcalStartDesc: 'Chanukah: 1 Candle',
    hebcalEndDesc: 'Chanukah: 8th Day',
    leadDays: 0,
    trailDays: 0,
  },
  sylvester: {
    slug: 'sylvester',
    hebrewName: 'סילבסטר',
    source: 'fixed',
    fixedMonthDay: { month: 12, day: 31 },
    leadDays: 1,
    trailDays: 1,
  },
  purim: {
    slug: 'purim',
    hebrewName: 'פורים',
    source: 'hebcal',
    hebcalStartDesc: 'Erev Purim',
    hebcalEndDesc: 'Purim',
    leadDays: 2,
    trailDays: 1,
  },
  'yom-haatzmaut': {
    slug: 'yom-haatzmaut',
    hebrewName: 'יום העצמאות',
    source: 'hebcal',
    hebcalStartDesc: "Yom HaAtzma'ut",
    hebcalEndDesc: "Yom HaAtzma'ut",
    leadDays: 1,
    trailDays: 0,
  },
};

export interface HolidayWindow {
  /** Inclusive window start, `YYYY-MM-DD`. */
  start: string;
  /** Inclusive window end, `YYYY-MM-DD`. */
  end: string;
  /** Civil year of the holiday's first day — the year to show in title/H1/meta. */
  year: number;
}

const pad2 = (n: number) => String(n).padStart(2, '0');
const ymd = (y: number, m: number, d: number) => `${y}-${pad2(m)}-${pad2(d)}`;

function shiftYmd(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + days);
  return ymd(dt.getUTCFullYear(), dt.getUTCMonth() + 1, dt.getUTCDate());
}

/**
 * `HDate.greg()` builds its `Date` from *local* year/month/day components, so
 * reading it back with `getFullYear`/`getMonth`/`getDate` (also local) round-trips
 * correctly regardless of the process's TZ — `toISOString()` would not (it re-reads
 * in UTC and can shift the day).
 */
function gregEventYmd(hdate: HDate): string {
  const g = hdate.greg();
  return ymd(g.getFullYear(), g.getMonth() + 1, g.getDate());
}

function findHebcalDateYmd(hebrewYear: number, desc: string): string | undefined {
  const events = HebrewCalendar.calendar({ year: hebrewYear, isHebrewYear: true, il: true });
  const ev = events.find((e) => e.getDesc() === desc);
  return ev ? gregEventYmd(ev.getDate()) : undefined;
}

/**
 * The next upcoming-or-current occurrence of a holiday's window, relative to `now`.
 * Never returns an already-fully-passed window — always the live or next one.
 */
export function getHolidayWindow(def: HolidayDef, now: Date = new Date()): HolidayWindow {
  const todayYmd = getIsraelDateString(now);

  if (def.source === 'fixed') {
    if (!def.fixedMonthDay) throw new Error(`${def.slug}: fixed holiday missing fixedMonthDay`);
    const [todayY] = todayYmd.split('-').map(Number);
    for (const year of [todayY, todayY + 1]) {
      const anchor = ymd(year, def.fixedMonthDay.month, def.fixedMonthDay.day);
      const start = shiftYmd(anchor, -def.leadDays);
      const end = shiftYmd(anchor, def.trailDays);
      if (end >= todayYmd) return { start, end, year };
    }
    // Unreachable in practice (the year+1 branch always qualifies), but keep a
    // deterministic fallback rather than throwing.
    const anchor = ymd(todayY + 1, def.fixedMonthDay.month, def.fixedMonthDay.day);
    return { start: shiftYmd(anchor, -def.leadDays), end: shiftYmd(anchor, def.trailDays), year: todayY + 1 };
  }

  if (!def.hebcalStartDesc) throw new Error(`${def.slug}: hebcal holiday missing hebcalStartDesc`);
  const endDesc = def.hebcalEndDesc ?? def.hebcalStartDesc;

  // Noon UTC keeps the calendar-day read-back stable across the TZs this runs
  // under (Vercel's UTC server, and local `Asia/Jerusalem`/`UTC` test runs).
  const [ty, tm, td] = todayYmd.split('-').map(Number);
  const noonUtcToday = new Date(Date.UTC(ty, tm - 1, td, 12));
  const currentHebrewYear = new HDate(noonUtcToday).getFullYear();

  for (const hy of [currentHebrewYear, currentHebrewYear + 1]) {
    const startAnchor = findHebcalDateYmd(hy, def.hebcalStartDesc);
    const endAnchor = findHebcalDateYmd(hy, endDesc);
    if (!startAnchor || !endAnchor) continue;
    const start = shiftYmd(startAnchor, -def.leadDays);
    const end = shiftYmd(endAnchor, def.trailDays);
    if (end >= todayYmd) {
      return { start, end, year: Number(startAnchor.split('-')[0]) };
    }
  }

  throw new Error(`${def.slug}: could not resolve a hebcal window for ${todayYmd}`);
}

/** True when `now` falls within `daysBefore` days of a holiday window's start. */
export function isHolidayApproaching(def: HolidayDef, daysBefore: number, now: Date = new Date()): boolean {
  const window = getHolidayWindow(def, now);
  const todayYmd = getIsraelDateString(now);
  const threshold = shiftYmd(window.start, -daysBefore);
  return todayYmd >= threshold && todayYmd <= window.end;
}

/** Filters parties to those whose Israel-local date falls inside the holiday window. */
export function filterPartiesInHolidayWindow(parties: Party[], def: HolidayDef, now: Date = new Date()): Party[] {
  const window = getHolidayWindow(def, now);
  return parties
    .filter((p) => {
      const partyYmd = (p.date || '').slice(0, 10);
      return partyYmd >= window.start && partyYmd <= window.end;
    })
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

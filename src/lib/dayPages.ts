/**
 * Date windows for the `/day/[day]` pages ("today", "thursday", "friday", "weekend").
 *
 * Everything here is calendar-date strings (YYYY-MM-DD) in Israel. "Today" must come
 * from `getIsraelDateString(new Date())`, never `new Date().toISOString()`: the server
 * runs UTC, so between 00:00 and 03:00 Israel time the UTC date is still yesterday and
 * `/day/today` used to list the previous night's parties.
 */
import { addDays, parseWallClock, rangeNights, weekdayOf } from './nights';

export type DayKey = 'today' | 'thursday' | 'friday' | 'weekend';

export const isDayKey = (day: string): day is DayKey =>
  day === 'today' || day === 'thursday' || day === 'friday' || day === 'weekend';

/** The next occurrence of a weekday (0 = Sunday), counting today itself. */
const nextWeekday = (todayYmd: string, weekday: number): string =>
  addDays(todayYmd, (weekday + 7 - weekdayOf(todayYmd)) % 7);

/** Inclusive [first, last] calendar dates a day page covers, relative to today in Israel. */
export function dayRange(day: DayKey, todayYmd: string): [string, string] {
  switch (day) {
    case 'today':
      return [todayYmd, todayYmd];
    case 'thursday': {
      const d = nextWeekday(todayYmd, 4);
      return [d, d];
    }
    case 'friday': {
      const d = nextWeekday(todayYmd, 5);
      return [d, d];
    }
    case 'weekend':
      // Thursday–Saturday; from Thursday on it's what's left of this weekend.
      return rangeNights('weekend', todayYmd);
  }
}

/** Whether a naive Israel wall-clock party date falls on a calendar date inside the range. */
export function isOnDayRange(dateStr: string, range: [string, string]): boolean {
  const wc = parseWallClock(dateStr);
  if (!wc) return false;
  const ymd = `${wc.year}-${String(wc.month).padStart(2, '0')}-${String(wc.day).padStart(2, '0')}`;
  return ymd >= range[0] && ymd <= range[1];
}

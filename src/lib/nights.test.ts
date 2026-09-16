import { describe, expect, it } from 'vitest';
import {
  addDays,
  currentNight,
  formatDayShort,
  formatTime,
  isInRange,
  nightOf,
  rangeNights,
  weekdayOf,
} from './nights';

describe('nightOf', () => {
  it('keeps evening parties on their own calendar day', () => {
    expect(nightOf('2026-09-17T22:30:00.000')).toBe('2026-09-17');
  });

  it('moves after-midnight starts to the previous night', () => {
    expect(nightOf('2026-09-17T00:00:00.000')).toBe('2026-09-16');
    expect(nightOf('2026-09-17T03:06:00')).toBe('2026-09-16');
  });

  it('rolls over at 06:00', () => {
    expect(nightOf('2026-09-17T06:00:00')).toBe('2026-09-17');
  });

  it('crosses month and year boundaries', () => {
    expect(nightOf('2026-10-01T01:00:00')).toBe('2026-09-30');
    expect(nightOf('2027-01-01T02:00:00')).toBe('2026-12-31');
  });

  it('returns null for unparseable input', () => {
    expect(nightOf('not a date')).toBeNull();
  });
});

describe('currentNight', () => {
  it('uses Israel wall-clock regardless of process TZ', () => {
    // 2026-09-16 20:00 UTC = 23:00 in Israel (IDT, +03:00) -> Wednesday night
    expect(currentNight(new Date('2026-09-16T20:00:00Z'))).toBe('2026-09-16');
    // 2026-09-16 23:30 UTC = 02:30 on the 17th in Israel -> still Wednesday night
    expect(currentNight(new Date('2026-09-16T23:30:00Z'))).toBe('2026-09-16');
    // 2026-09-17 04:00 UTC = 07:00 in Israel -> Thursday
    expect(currentNight(new Date('2026-09-17T04:00:00Z'))).toBe('2026-09-17');
  });
});

describe('rangeNights', () => {
  const wednesday = '2026-09-16';
  it('computes the coming weekend from mid-week', () => {
    expect(weekdayOf(wednesday)).toBe(3);
    expect(rangeNights('weekend', wednesday)).toEqual(['2026-09-17', '2026-09-19']);
  });

  it('keeps the remaining weekend from Friday', () => {
    expect(rangeNights('weekend', '2026-09-18')).toEqual(['2026-09-18', '2026-09-19']);
  });

  it('covers tonight, tomorrow and a week', () => {
    expect(rangeNights('tonight', wednesday)).toEqual([wednesday, wednesday]);
    expect(rangeNights('tomorrow', wednesday)).toEqual(['2026-09-17', '2026-09-17']);
    expect(rangeNights('week', wednesday)).toEqual([wednesday, addDays(wednesday, 6)]);
  });

  it('matches after-midnight parties into tonight', () => {
    expect(isInRange('2026-09-17T01:00:00', rangeNights('tonight', wednesday))).toBe(true);
    expect(isInRange('2026-09-17T21:00:00', rangeNights('tonight', wednesday))).toBe(false);
  });
});

describe('formatting', () => {
  it('formats day and time from the wall clock', () => {
    expect(formatDayShort('2026-09-17T22:30:00.000')).toBe('חמישי 17.9');
    expect(formatTime('2026-09-17T22:30:00.000')).toBe('22:30');
  });
});

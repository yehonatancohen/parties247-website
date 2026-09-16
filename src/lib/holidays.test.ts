import { describe, expect, it } from 'vitest';
import { HOLIDAYS, filterPartiesInHolidayWindow, getHolidayWindow, isHolidayApproaching } from './holidays';
import { Party } from '@/data/types';

// These run under whatever TZ the test process starts with. package.json's
// `test` script doesn't pin TZ, so CI/local runs may differ — run once with
// `TZ=UTC npm test` and once with `TZ=Asia/Jerusalem npm test` to confirm both
// pass, per parties247-website/CLAUDE.md's testing rule for src/lib/.

describe('getHolidayWindow', () => {
  it('resolves Sukkot 2026 correctly from a date well before it', () => {
    const now = new Date('2026-09-16T10:00:00Z');
    const w = getHolidayWindow(HOLIDAYS.sukkot, now);
    expect(w).toEqual({ start: '2026-09-25', end: '2026-10-03', year: 2026 });
  });

  it('rolls Sukkot forward to the next year once this year\'s window has passed', () => {
    const now = new Date('2026-10-10T10:00:00Z');
    const w = getHolidayWindow(HOLIDAYS.sukkot, now);
    expect(w.year).toBe(2027);
    expect(w.start > '2026-10-03').toBe(true);
  });

  it('stays on the current window while inside it', () => {
    const now = new Date('2026-09-27T10:00:00Z'); // chol hamoed
    const w = getHolidayWindow(HOLIDAYS.sukkot, now);
    expect(w).toEqual({ start: '2026-09-25', end: '2026-10-03', year: 2026 });
  });

  it('resolves a fixed-date holiday (Halloween) without touching hebcal', () => {
    const now = new Date('2026-10-01T10:00:00Z');
    const w = getHolidayWindow(HOLIDAYS.halloween, now);
    expect(w).toEqual({ start: '2026-10-28', end: '2026-10-31', year: 2026 });
  });

  it('rolls Sylvester into next year right after it passes', () => {
    const now = new Date('2027-01-02T10:00:00Z');
    const w = getHolidayWindow(HOLIDAYS.sylvester, now);
    expect(w.year).toBe(2027);
  });

  it('excludes "Purim Katan" (Adar Aleph, leap years) and only matches real Purim', () => {
    const now = new Date('2026-09-16T10:00:00Z');
    const w = getHolidayWindow(HOLIDAYS.purim, now);
    // Purim 2027 falls 2027-03-23 (Erev Purim 2027-03-22); window has leadDays=2, trailDays=1.
    expect(w).toEqual({ start: '2027-03-20', end: '2027-03-24', year: 2027 });
  });
});

describe('isHolidayApproaching', () => {
  it('is false far outside the lead window', () => {
    expect(isHolidayApproaching(HOLIDAYS.sukkot, 30, new Date('2026-06-01T10:00:00Z'))).toBe(false);
  });

  it('is true inside the lead window', () => {
    expect(isHolidayApproaching(HOLIDAYS.sukkot, 30, new Date('2026-09-16T10:00:00Z'))).toBe(true);
  });

  it('stays true throughout the holiday itself', () => {
    expect(isHolidayApproaching(HOLIDAYS.sukkot, 30, new Date('2026-09-28T10:00:00Z'))).toBe(true);
  });
});

describe('filterPartiesInHolidayWindow', () => {
  const mkParty = (id: string, date: string): Party => ({
    id,
    slug: id,
    name: id,
    imageUrl: '',
    date,
    musicGenres: '',
    location: { name: 'Tel Aviv' },
    description: '',
    originalUrl: '',
    region: 'מרכז',
    musicType: 'אחר',
    eventType: 'אחר',
    age: 'כל הגילאים',
    tags: [],
  });

  it('keeps only parties whose naive Israel date falls in-window, including late-night ones', () => {
    const parties = [
      mkParty('before', '2026-09-24T22:00:00.000'),
      mkParty('erev', '2026-09-25T22:00:00.000'),
      mkParty('cholHamoed-late', '2026-09-27T23:30:00.000'),
      mkParty('lastDay', '2026-10-03T20:00:00.000'),
      mkParty('after', '2026-10-04T20:00:00.000'),
    ];
    const result = filterPartiesInHolidayWindow(parties, HOLIDAYS.sukkot, new Date('2026-09-16T10:00:00Z'));
    expect(result.map((p) => p.id)).toEqual(['erev', 'cholHamoed-late', 'lastDay']);
  });
});

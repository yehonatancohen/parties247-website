import { describe, expect, it } from 'vitest';
import { getIsraelDateString } from './dates';
import { dayRange, isDayKey, isOnDayRange } from './dayPages';

describe('today in Israel', () => {
  it('is already the new day between 00:00 and 03:00 Israel time', () => {
    // 2026-10-08 22:30Z = 01:30 on Fri 9 Oct in Israel (UTC+3); the UTC date is still the 8th.
    expect(getIsraelDateString(new Date('2026-10-08T22:30:00Z'))).toBe('2026-10-09');
  });

  it('follows the winter offset after DST ends on 2026-10-25', () => {
    // UTC+2: 22:30Z is 00:30 the next day, 21:30Z is still 23:30 the same day.
    expect(getIsraelDateString(new Date('2026-11-05T22:30:00Z'))).toBe('2026-11-06');
    expect(getIsraelDateString(new Date('2026-11-05T21:30:00Z'))).toBe('2026-11-05');
  });
});

describe('dayRange', () => {
  it('today is a single date', () => {
    expect(dayRange('today', '2026-10-06')).toEqual(['2026-10-06', '2026-10-06']);
  });

  it('thursday and friday are the next occurrence, counting today', () => {
    expect(dayRange('thursday', '2026-10-06')).toEqual(['2026-10-08', '2026-10-08']); // Tuesday
    expect(dayRange('thursday', '2026-10-08')).toEqual(['2026-10-08', '2026-10-08']); // Thursday
    expect(dayRange('thursday', '2026-10-09')).toEqual(['2026-10-15', '2026-10-15']); // Friday
    expect(dayRange('friday', '2026-10-09')).toEqual(['2026-10-09', '2026-10-09']);
    expect(dayRange('friday', '2026-10-10')).toEqual(['2026-10-16', '2026-10-16']); // Saturday
  });

  it('weekend is Thursday–Saturday, or what is left of it', () => {
    expect(dayRange('weekend', '2026-10-06')).toEqual(['2026-10-08', '2026-10-10']);
    expect(dayRange('weekend', '2026-10-09')).toEqual(['2026-10-09', '2026-10-10']);
    expect(dayRange('weekend', '2026-10-10')).toEqual(['2026-10-10', '2026-10-10']);
    expect(dayRange('weekend', '2026-10-11')).toEqual(['2026-10-15', '2026-10-17']); // Sunday
  });
});

describe('isOnDayRange', () => {
  const thu: [string, string] = ['2026-10-08', '2026-10-08'];

  it('reads the naive wall-clock date, whatever the server timezone', () => {
    expect(isOnDayRange('2026-10-08T23:30:00.000', thu)).toBe(true);
    expect(isOnDayRange('2026-10-08T00:30:00', thu)).toBe(true);
    expect(isOnDayRange('2026-10-09T00:30:00.000', thu)).toBe(false);
    expect(isOnDayRange('2026-10-07T23:59:00.000', thu)).toBe(false);
  });

  it('rejects unparseable dates', () => {
    expect(isOnDayRange('', thu)).toBe(false);
    expect(isOnDayRange('not a date', thu)).toBe(false);
  });
});

describe('isDayKey', () => {
  it('accepts only the four day pages', () => {
    expect(isDayKey('today')).toBe(true);
    expect(isDayKey('weekend')).toBe(true);
    expect(isDayKey('monday')).toBe(false);
  });
});

import { describe, expect, it } from 'vitest';
import { byRank, cleanTitle, sortRankedWithinNight, venueOf } from './homeData';
import { Party } from '@/data/types';

const at = (location: string) => ({ location } as unknown as Party);

describe('venueOf', () => {
  it('keeps venue name and a Hebrew city, drops street and country', () => {
    expect(venueOf(at('Gagarin Club TLV, דרך קיבוץ גלויות, Tel Aviv-Yafo, Israel'))).toBe('Gagarin Club TLV · תל אביב');
    expect(venueOf(at('הארבעה 28, Tel Aviv-Yafo, Israel'))).toBe('הארבעה 28 · תל אביב');
  });
  it('shows just the city when that is all there is', () => {
    expect(venueOf(at('Tel Aviv, ישראל'))).toBe('תל אביב');
    expect(venueOf(at('נתניה, ישראל'))).toBe('נתניה');
  });
  it('hides placeholder locations', () => {
    expect(venueOf(at('ישראל'))).toBe('');
    expect(venueOf(at('Unknown Location'))).toBe('');
  });
});

describe('cleanTitle', () => {
  it('strips admin emoji from carousel titles', () => {
    expect(cleanTitle('חם עכשיו🔥')).toBe('חם עכשיו');
    expect(cleanTitle('מסיבות סוכות 🍋')).toBe('מסיבות סוכות');
  });
});

describe('sortRankedWithinNight', () => {
  const party = (id: string, date: string, extra: Partial<Party> = {}) => ({ id, date, ...extra } as Party);

  it('orders by rank inside a night but never across nights', () => {
    const sorted = sortRankedWithinNight([
      party('thu-low', '2026-10-15T23:00:00', { rankScore: 10 }),
      party('fri-top', '2026-10-16T23:00:00', { rankScore: 100 }),
      party('thu-high', '2026-10-15T22:00:00', { rankScore: 80 }),
      party('thu-soldout', '2026-10-15T21:00:00', { rankScore: 99, soldOut: true }),
    ]);
    expect(sorted.map((p) => p.id)).toEqual(['thu-high', 'thu-low', 'fri-top', 'thu-soldout']);
  });

  it('keeps date order when the backend sent no rank', () => {
    const sorted = sortRankedWithinNight([party('b', '2026-10-15T23:00:00'), party('a', '2026-10-15T22:00:00')]);
    expect(sorted.map((p) => p.id)).toEqual(['a', 'b']);
  });

  it('byRank puts a ranked party before an unranked one', () => {
    expect(byRank(party('x', '2026-10-15', { rankScore: 0 }), party('y', '2026-10-15'))).toBeLessThan(0);
  });
});

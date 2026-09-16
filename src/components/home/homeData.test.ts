import { describe, expect, it } from 'vitest';
import { cleanTitle, venueOf } from './homeData';
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

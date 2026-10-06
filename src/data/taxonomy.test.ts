import { describe, expect, it } from 'vitest';
import { findClubForParty } from './taxonomy';

const party = (name: string, location: string) => ({ name, location: { name: location } });

describe('findClubForParty', () => {
  it('matches a club named in the party title', () => {
    expect(findClubForParty(party('ROOM 48 | OPENING WEEK | 1.10 | OMRI', "המלך ג'ורג' 48, תל אביב-יפו"))?.path).toBe('/club/room-48');
  });

  it('matches a club named in the venue', () => {
    expect(findClubForParty(party('FRIDAY OPEN AIR', 'Gagarin Club TLV, דרך קיבוץ גלויות, Tel Aviv-Yafo, Israel'))?.path).toBe('/club/gagarin');
  });

  it('returns nothing for a venue without a club page', () => {
    expect(findClubForParty(party('METZUDA : FRIDAY NOON 9.10', 'Ashdod, ישראל'))).toBeUndefined();
  });
});

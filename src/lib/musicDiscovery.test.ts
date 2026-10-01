import { describe, expect, it } from 'vitest';
import { isHipHopParty } from './musicDiscovery';
import { ARTISTS, matchesArtist } from '../data/artists';
import type { Party } from '../data/types';

const party = (name: string, description = ''): Party => ({ id: name, slug: name, name, description, tags: [], musicGenres: '', imageUrl: '', date: '2026-10-01', location: { name: '' }, originalUrl: '', region: 'לא ידוע', musicType: 'אחר', eventType: 'אחר', age: '18+' });
describe('music discovery', () => {
  it('finds Hebrew and English hip hop in multi-room event descriptions', () => {
    expect(isHipHopParty(party('Mainstream night', 'Hip Hop in the second room'))).toBe(true);
    expect(isHipHopParty(party('ערב היפ־הופ'))).toBe(true);
    expect(isHipHopParty(party('ערב טכנו'))).toBe(false);
  });
  it('matches Hebrew aliases and mixed lineups without matching part of another name', () => {
    const artist = ARTISTS.find(a => a.slug === 'kino-todo')!;
    expect(matchesArtist(party('KINO TODO x PETTRA'), artist)).toBe(true);
    expect(matchesArtist(party('קינו טודו חוזר'), artist)).toBe(true);
    expect(matchesArtist(party('NotKino TodoElse'), artist)).toBe(false);
  });
});

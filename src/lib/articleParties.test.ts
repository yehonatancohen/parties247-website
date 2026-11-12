import { describe, expect, it } from 'vitest';
import { ARTICLE_PARTY_TOPICS, pickArticleParties } from './articleParties';
import { articles } from '../data/articles';
import type { Party } from '../data/types';

const party = (id: string, over: Partial<Party> = {}): Party => ({
  id, slug: id, name: id, description: '', tags: [], musicGenres: '', imageUrl: '',
  date: '2026-11-20T23:00:00', location: { name: '' }, originalUrl: '', region: 'לא ידוע',
  musicType: 'אחר', eventType: 'אחר', age: '18+', ticketPrice: 80, ...over,
});

describe('article party topics', () => {
  it('only names articles that exist', () => {
    const slugs = new Set(articles.map((a) => a.slug));
    for (const slug of Object.keys(ARTICLE_PARTY_TOPICS)) expect(slugs.has(slug)).toBe(true);
  });

  it('matches techno by music type or tag, not mainstream', () => {
    const techno = ARTICLE_PARTY_TOPICS['מדריך-מועדוני-טכנו-בתל-אביב'];
    expect(techno.match(party('a', { musicType: 'טכנו' }))).toBe(true);
    expect(techno.match(party('b', { tags: ['House'] }))).toBe(true);
    expect(techno.match(party('c', { musicType: 'מיינסטרים' }))).toBe(false);
  });

  it('does not call an outdoor mainstream night a nature party', () => {
    const nature = ARTICLE_PARTY_TOPICS['מדריך-מסיבת-טבע-ראשונה'];
    expect(nature.match(party('port', { eventType: 'מסיבת טבע', musicType: 'מיינסטרים', tags: ['בחוץ'] }))).toBe(false);
    expect(nature.match(party('trance', { musicType: 'טראנס' }))).toBe(true);
  });

  it('matches cities by backend areas', () => {
    const eilat = ARTICLE_PARTY_TOPICS['מדריך-מסיבות-אילת-2026'];
    expect(eilat.match(party('a', { areas: ['eilat'] }))).toBe(true);
    expect(eilat.match(party('b', { areas: ['tel aviv'] }))).toBe(false);
  });
});

describe('pickArticleParties', () => {
  const techno = ARTICLE_PARTY_TOPICS['מדריך-מועדוני-טכנו-בתל-אביב'];

  it('drops sold-out parties, keeps night order and caps the count', () => {
    const picked = pickArticleParties(
      [
        party('later', { musicType: 'טכנו', date: '2026-11-27T23:00:00' }),
        party('sold', { musicType: 'טכנו', soldOut: true, date: '2026-11-13T23:00:00' }),
        party('sooner', { musicType: 'טכנו', date: '2026-11-14T23:00:00' }),
        party('pop', { musicType: 'מיינסטרים' }),
      ],
      techno,
      4,
    );
    expect(picked.map((p) => p.id)).toEqual(['sooner', 'later']);
    expect(pickArticleParties(Array.from({ length: 9 }, (_, i) => party(`t${i}`, { musicType: 'טכנו' })), techno).length).toBe(4);
  });

  it('puts the better-ranked party first within the same night', () => {
    const picked = pickArticleParties(
      [party('low', { musicType: 'טכנו', rankScore: 10 }), party('high', { musicType: 'טכנו', rankScore: 90 })],
      techno,
    );
    expect(picked.map((p) => p.id)).toEqual(['high', 'low']);
  });
});

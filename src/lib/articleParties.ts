import type { Party } from '@/data/types';
import { isUnavailable, sortRankedWithinNight } from '@/components/home/homeData';

/**
 * Guide articles that have a matching set of parties to buy. Without this block
 * an article ends in "back to all articles", a dead end for someone who arrived
 * from search wanting to go out (the techno-clubs guide: 31 clicks/30d, #3 for
 * "מועדוני טכנו תל אביב", linked to zero parties — seo-update 2026-11-12).
 * Articles not listed here (house parties, safety, the parents' guide) get no block.
 */
export interface ArticlePartyTopic {
  heading: string;
  moreHref: string;
  moreLabel: string;
  match: (party: Party) => boolean;
}

const tagHas = (party: Party, ...needles: string[]) =>
  party.tags.some((tag) => needles.some((n) => tag.toLowerCase().includes(n)));

const inArea = (party: Party, area: string, hebrew: string) =>
  (party.areas ?? []).includes(area) || tagHas(party, hebrew);

export const ARTICLE_PARTY_TOPICS: Record<string, ArticlePartyTopic> = {
  'מדריך-מועדוני-טכנו-בתל-אביב': {
    heading: 'מסיבות טכנו והאוס קרובות',
    moreHref: '/genre/techno-music',
    moreLabel: 'לכל מסיבות הטכנו',
    match: (p) => p.musicType === 'טכנו' || tagHas(p, 'techno', 'טכנו', 'house', 'האוס'),
  },
  'מדריך-רייבים-בישראל': {
    heading: 'רייבים קרובים',
    moreHref: '/genre/rave-parties',
    moreLabel: 'לכל הרייבים',
    match: (p) =>
      p.musicType === 'טכנו' || p.musicType === 'טראנס' || tagHas(p, 'rave', 'רייב', 'underground', 'אנדרגראונד'),
  },
  'מדריך-מסיבת-טבע-ראשונה': {
    heading: 'מסיבות טבע קרובות',
    moreHref: '/parties/nature-trance-parties',
    moreLabel: 'לכל מסיבות הטבע',
    // Not eventType: the feed marks outdoor city nights (Port TLV mainstream) as
    // 'מסיבת טבע'. Match the page the block links to (trance) plus explicit tags.
    match: (p) => p.musicType === 'טראנס' || tagHas(p, 'טבע', 'nature'),
  },
  'פופ-ישראלי-ברחבות': {
    heading: 'מסיבות מיינסטרים קרובות',
    moreHref: '/genre/mainstream-music',
    moreLabel: 'לכל מסיבות המיינסטרים',
    match: (p) => p.musicType === 'מיינסטרים' || tagHas(p, 'mainstream', 'פופ'),
  },
  'מדריך-מסיבות-תל-אביב': {
    heading: 'המסיבות הקרובות בתל אביב',
    moreHref: '/cities/tel-aviv',
    moreLabel: 'לכל המסיבות בתל אביב',
    match: (p) => inArea(p, 'tel aviv', 'תל אביב'),
  },
  'מדריך-מסיבות-אילת-2026': {
    heading: 'המסיבות הקרובות באילת',
    moreHref: '/cities/eilat',
    moreLabel: 'לכל המסיבות באילת',
    match: (p) => inArea(p, 'eilat', 'אילת'),
  },
};

/**
 * The parties to show under an article: matching, buyable, nearest nights first
 * and the best-ranked party first within a night (same order as every listing).
 * `parties` is the upcoming feed (getParties), so past events are already gone.
 */
export function pickArticleParties(parties: Party[], topic: ArticlePartyTopic, limit = 4): Party[] {
  return sortRankedWithinNight(parties.filter((p) => topic.match(p) && !isUnavailable(p))).slice(0, limit);
}

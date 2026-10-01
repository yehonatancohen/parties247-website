import type { Party } from '@/data/types';

export function isHipHopParty(party: Party): boolean {
  const text = [party.name, party.description, party.musicGenres, ...party.tags].join(' ');
  return /hip[\s-]?hop|היפ[\s־-]?הופ/i.test(text);
}

export const HOLIDAY_PAGES = [
  { href: '/rosh-hashana', label: 'ראש השנה' },
  { href: '/sukkot', label: 'סוכות' },
  { href: '/halloween', label: 'האלווין' },
  { href: '/hanukkah', label: 'חנוכה' },
  { href: '/sylvester', label: 'סילבסטר' },
  { href: '/purim', label: 'פורים' },
  { href: '/yom-haatzmaut', label: 'יום העצמאות' },
];

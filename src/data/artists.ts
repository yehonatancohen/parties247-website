import type { Party } from '@/data/types';

// Curated from artist names in published GoOut event lineups, October 2026.
// Keep profiles tied to event evidence; do not infer biographies or genres.
export const ARTISTS = [
  { slug: 'omri-smadar', name: 'עמרי סמדר', stageName: 'Omri Smadar', aliases: ['omri smadar', 'omri smader', 'עמרי סמדר', 'עומרי סמדר'] },
  { slug: 'darwish', name: 'דרוויש', stageName: 'Darwish', aliases: ['darwish', 'דרוויש', 'דרויש'] },
  { slug: 'kino-todo', name: 'קינו טודו', stageName: 'Kino Todo', aliases: ['kino todo', 'קינו טודו'] },
  { slug: 'rising-dust', name: 'רייזינג דאסט', stageName: 'Rising Dust', aliases: ['rising dust', 'רייזינג דאסט'] },
  { slug: 'pettra', name: 'פטרה', stageName: 'Pettra', aliases: ['pettra', 'פטרה'] },
  { slug: 'asher-swissa', name: 'אשר סוויסה', stageName: 'Asher Swissa', aliases: ['asher swissa', 'אשר סוויסה'] },
  { slug: 'shtuby', name: 'שטובי', stageName: 'Shtuby', aliases: ['shtuby', 'שטובי'] },
  { slug: 'club-de-combat', name: 'קלאב דה קומבט', stageName: 'Club de Combat', aliases: ['club de combat', 'קלאב דה קומבט'] },
  { slug: 'mor-avrahami', name: 'מור אברהמי', stageName: 'Mor Avrahami', aliases: ['mor avrahami', 'מור אברהמי'] },
  { slug: 'bliss', name: 'בליס', stageName: 'BLiSS', aliases: ['bliss', 'בליס'] },
  { slug: 'hello-vera', name: 'הלו ורה', stageName: 'Hello Vera', aliases: ['hello vera', 'הלו ורה'] },
] as const;

export type Artist = (typeof ARTISTS)[number];

export function matchesArtist(party: Party, artist: Artist): boolean {
  const text = [party.name, party.description, party.performer?.name].filter(Boolean).join(' ').toLowerCase().replace(/[־–—]/g, '-');
  return artist.aliases.some(alias => {
    const escaped = alias.toLowerCase().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`(?:^|[^\\p{L}\\p{N}])${escaped}(?=$|[^\\p{L}\\p{N}])`, 'u').test(text);
  });
}

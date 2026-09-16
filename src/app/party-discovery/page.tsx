import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { Carousel, Party } from '@/data/types';
import { getCarousels, getParties } from '@/services/api';
import AllPartiesAISearch from '@/components/AllPartiesAISearch';
import FlyerFan from '@/components/home/FlyerFan';
import { buildShelves, sortForDisplay } from '@/components/home/homeData';
import { currentNight, isInRange, nightOf, rangeNights, weekdayOf } from '@/lib/nights';

export const revalidate = 300;

export const metadata: Metadata = {
  title: 'חיפוש מסיבות | ז׳אנרים, ערים ומועדונים',
  description: 'חפשו כרטיסים למסיבות בישראל לפי עיר, ז׳אנר, קהל יעד או מועדון. טכנו, האוס, מיינסטרים, מסיבות נוער ועוד – כל הליינים מתעדכנים בזמן אמת.',
  alternates: {
    canonical: '/party-discovery',
  },
};

const CONTAINER = 'mx-auto w-full max-w-[1100px] px-4 sm:px-6';

const Chevron = () => (
  <svg viewBox="0 0 24 24" className="h-[0.8em] w-[0.8em]" fill="none" stroke="currentColor" strokeWidth={2.6} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
  </svg>
);

const countLabel = (n: number) => (n === 0 ? 'יתעדכן בקרוב' : n === 1 ? 'מסיבה אחת קרובה' : `${n} מסיבות קרובות`);

/** A browse tile: title, live count, and a fan of the real flyers behind it. */
function BrowseTile({ href, title, parties, flyers, wide = false }: { href: string; title: string; parties: Party[]; flyers: Party[]; wide?: boolean }) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`group flex flex-col items-center overflow-hidden rounded-[22px] bg-tile px-3 pb-6 pt-6 text-center transition-colors duration-300 hover:bg-tile-hover sm:rounded-[28px] sm:px-6 sm:pb-8 sm:pt-9 ${wide ? 'col-span-2' : ''}`}
    >
      <h3 className="text-[19px] font-bold leading-tight text-ink sm:text-[28px]">{title}</h3>
      <p className="mt-1 text-[13px] text-ink-2 sm:text-[15px]">
        <span className="tabular-nums">{countLabel(parties.length)}</span>
      </p>
      {flyers.length > 0 ? (
        <div className="mt-5 transition-transform duration-700 ease-apple group-hover:-translate-y-1.5 sm:mt-8">
          <FlyerFan parties={flyers} size="md" />
        </div>
      ) : (
        <span className="mt-4 inline-flex items-center gap-1 text-[15px] text-link">
          לעמוד <Chevron />
        </span>
      )}
    </Link>
  );
}

function ListRows({ items }: { items: { href: string; title: string; blurb: string; count?: number }[] }) {
  return (
    <ul className="divide-y divide-hairline border-y border-hairline">
      {items.map((item) => (
        <li key={item.href}>
          <Link href={item.href} prefetch={false} className="group flex items-center justify-between gap-4 py-4 sm:py-5">
            <span className="min-w-0">
              <span className="block text-[17px] font-semibold text-ink transition-colors group-hover:text-link">{item.title}</span>
              <span className="mt-0.5 block text-[14px] leading-snug text-ink-3">{item.blurb}</span>
            </span>
            <span className="flex shrink-0 items-center gap-3 text-ink-3">
              {typeof item.count === 'number' && item.count > 0 && (
                <span className="text-[13px] tabular-nums">{item.count}</span>
              )}
              <Chevron />
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} className="scroll-mt-20 pb-16 sm:pb-24" aria-labelledby={`${id}-heading`}>
      <h2 id={`${id}-heading`} className="mb-6 text-[26px] font-bold leading-tight text-ink sm:mb-8 sm:text-[36px]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default async function PartyDiscoveryPage() {
  const [parties, carousels] = await Promise.all([
    getParties().catch((): Party[] => []),
    getCarousels().catch((): Carousel[] => []),
  ]);

  const upcoming = sortForDisplay(parties);
  const tonight = currentNight();
  const onWeekday = (wd: number) =>
    upcoming.filter((p) => {
      const n = nightOf(p.date);
      return n !== null && n >= tonight && n <= rangeNights('week', tonight)[1] && weekdayOf(n) === wd;
    });
  const inArea = (...keys: string[]) => upcoming.filter((p) => p.areas?.some((a) => keys.includes(a)));
  const ofMusic = (type: string) => upcoming.filter((p) => p.musicType === type);
  const withTag = (needle: string) => upcoming.filter((p) => p.tags?.some((t) => t.includes(needle)));

  const nights = [
    { href: '/day/today', title: 'הלילה', parties: upcoming.filter((p) => isInRange(p.date, rangeNights('tonight', tonight))) },
    { href: '/day/thursday', title: 'חמישי', parties: onWeekday(4) },
    { href: '/day/friday', title: 'שישי', parties: onWeekday(5) },
    { href: '/day/weekend', title: 'סוף השבוע', parties: upcoming.filter((p) => isInRange(p.date, rangeNights('weekend', tonight))) },
  ];

  const cities = [
    { href: '/cities/tel-aviv', title: 'תל אביב', parties: inArea('tel aviv') },
    { href: '/cities/haifa', title: 'חיפה והצפון', parties: inArea('haifa', 'north') },
    { href: '/cities/jerusalem', title: 'ירושלים', parties: inArea('jerusalem') },
    { href: '/cities/eilat', title: 'אילת', parties: inArea('eilat') },
  ];

  const styles = [
    { href: '/genre/mainstream-music', title: 'מיינסטרים', parties: ofMusic('מיינסטרים') },
    { href: '/genre/techno-music', title: 'טכנו', parties: ofMusic('טכנו') },
    { href: '/genre/trance-music', title: 'טראנס', parties: ofMusic('טראנס') },
    { href: '/genre/house-music', title: 'האוס', parties: withTag('האוס') },
  ];

  const audiences = [
    { title: 'מסיבות סטודנטים', href: '/audience/student-parties', blurb: 'ליינים אקדמיים, הנחות ושאטלים מקמפוסים.' },
    { title: 'מסיבות חיילים', href: '/audience/soldier-parties', blurb: 'הטבות חיילים, שעות מאוחרות ושמירת ציוד.' },
    { title: 'מסיבות 24+', href: '/audience/24plus-parties', blurb: 'וייב בוגר, שירות מוקפד וקוקטיילים.' },
    { title: 'מסיבות נוער', href: '/audience/teenage-parties', blurb: 'אירועים מפוקחים עם פירוט אבטחה וגיל כניסה.' },
  ];

  const clubs = [
    { title: 'ECHO Club', href: '/club/echo', blurb: 'רחבה דרומית עם טכנו, האוס והופעות לייב.' },
    { title: 'Jimmy Who', href: '/club/jimmy-who', blurb: 'בר-מועדון תל אביבי עם להיטים ורחבה שמחה.' },
    { title: 'Gagarin', href: '/club/gagarin', blurb: 'חלל אנדרגראונד עם במה להופעות חיות.' },
    { title: 'Moon Child', href: '/club/moon-child', blurb: 'וייב ירח עם קוקטיילים וגרוב מלודי.' },
  ];

  // Fan flyers: each tile prefers flyers no earlier tile on the page already showed.
  const used = new Set<string>();
  const withFlyers = <T extends { parties: Party[] }>(tiles: T[]) =>
    tiles.map((tile) => {
      const pool = tile.parties.filter((p) => !p.soldOut && p.imageUrl);
      const fresh = pool.filter((p) => !used.has(p.id));
      const flyers = (fresh.length >= 2 ? fresh : pool).slice(0, 3);
      flyers.forEach((p) => used.add(p.id));
      return { ...tile, flyers };
    });
  const nonEmpty = <T extends { parties: Party[] }>(tiles: T[]) => tiles.filter((t) => t.parties.length > 0);
  const nightTiles = withFlyers(nonEmpty(nights));
  const cityTiles = withFlyers(nonEmpty(cities));
  const styleTiles = withFlyers(nonEmpty(styles));

  const tileTitles = new Set([...nights, ...cities, ...styles].map((t) => t.title));
  const collections = buildShelves(carousels, parties).filter((c) => c.parties.length >= 3 && !tileTitles.has(c.title));

  return (
    <div className="font-apple min-h-screen bg-stage text-ink">
      {/* ─── Hero: search first ─── */}
      <section className="relative overflow-hidden pb-14 pt-12 sm:pb-20 sm:pt-20">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_55%_60%_at_50%_0%,rgba(118,200,147,0.15),transparent_72%)]" />
        <div className={`${CONTAINER} relative text-center`}>
          <h1 className="text-balance text-[clamp(34px,10vw,44px)] font-bold leading-[1.05] sm:text-[64px]">
            איזו מסיבה <span className="text-ink-3">בא לכם?</span>
          </h1>
          <p className="mx-auto mt-4 max-w-[560px] text-balance text-[17px] text-ink-2 sm:text-[21px]">
            כתבו מה אתם מחפשים, או בחרו לפי ערב, עיר, סגנון ומועדון.
          </p>
          <div className="mt-8 sm:mt-10">
            <AllPartiesAISearch />
          </div>
          <nav className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[15px]" aria-label="קפיצה לקטגוריה">
            {[
              { label: 'ערבים', hash: '#nights' },
              { label: 'ערים', hash: '#cities' },
              { label: 'סגנונות', hash: '#styles' },
              { label: 'קהלים', hash: '#audiences' },
              { label: 'מועדונים', hash: '#clubs' },
            ].map((item) => (
              <a key={item.hash} href={item.hash} className="text-link hover:underline underline-offset-4">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className={CONTAINER}>
        <Section id="nights" title="מתי יוצאים?">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {nightTiles.map((tile) => (
              <BrowseTile key={tile.href} {...tile} />
            ))}
          </div>
        </Section>

        <Section id="cities" title="איפה?">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {cityTiles.map((tile) => (
              <BrowseTile key={tile.href} {...tile} />
            ))}
          </div>
        </Section>

        <Section id="styles" title="איזה סאונד?">
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {styleTiles.map((tile) => (
              <BrowseTile key={tile.href} {...tile} />
            ))}
          </div>
        </Section>

        <div className="grid gap-x-12 md:grid-cols-2">
          <Section id="audiences" title="למי זה מתאים?">
            <ListRows items={audiences} />
          </Section>
          <Section id="clubs" title="מועדונים">
            <ListRows items={clubs} />
          </Section>
        </div>

        {collections.length > 0 && (
          <Section id="collections" title="אוספים נבחרים">
            <ListRows
              items={collections.map((c) => ({
                href: c.href,
                title: c.title,
                blurb: `${c.parties.length} מסיבות באוסף`,
              }))}
            />
          </Section>
        )}

        <section className="pb-20 text-center sm:pb-28">
          <h2 className="text-[26px] font-bold sm:text-[36px]">מחפשים משהו ספציפי?</h2>
          <p className="mx-auto mt-3 max-w-[520px] text-[17px] text-ink-2">
            מסיבות טכנו בתל אביב, 18+ עם אלכוהול חופשי, סופ״ש בצפון ועוד קטגוריות ממוקדות.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
            <Link href="/all-parties" prefetch={false} className="rounded-full bg-action px-6 py-3 text-[17px] font-medium text-on-action transition-colors hover:bg-action-hover">
              לכל המסיבות
            </Link>
            <Link href="/parties" prefetch={false} className="inline-flex items-center gap-1 text-[17px] text-link hover:underline underline-offset-4">
              לקטגוריות המיוחדות <Chevron />
            </Link>
            <Link href="/articles" prefetch={false} className="inline-flex items-center gap-1 text-[17px] text-link hover:underline underline-offset-4">
              מדריכים וטיפים <Chevron />
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Carousel, Party } from '@/data/types';
import { SOCIAL_LINKS } from '@/data/constants';
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from '@/components/Icons';
import { currentNight, isInRange, NightRange, rangeNights } from '@/lib/nights';
import FlyerFan from './FlyerFan';
import FlyerWall from './FlyerWall';
import HeroGlow from './HeroGlow';
import { heroFont } from './heroFont';
import LaunchPartyCard from './LaunchPartyCard';
import NightPicker, { NightPanel } from './NightPicker';
import ShelfRow from './ShelfRow';
import { buildShelves, isPromoted, sortForDisplay, sortPromotedWithinNight } from './homeData';

export interface HomeHoliday {
  slug: string;
  hebrewName: string;
  year: number;
  parties: Party[];
}

interface HomeLaunchProps {
  parties: Party[];
  carousels: Carousel[];
  holiday: HomeHoliday | null;
}

const CONTAINER = 'mx-auto w-full max-w-[1200px] px-4 sm:px-6';

const ChevronLink = ({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) => (
  <Link href={href} className={`group/link inline-flex items-center gap-1 text-link hover:underline underline-offset-4 ${className}`}>
    {children}
    <svg viewBox="0 0 24 24" className="h-[0.8em] w-[0.8em] transition-transform duration-200 group-hover/link:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.6} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
    </svg>
  </Link>
);

const NIGHT_RANGES: { key: NightRange; label: string; linkLabel: string; href: string }[] = [
  { key: 'tonight', label: 'הלילה', linkLabel: 'לכל מסיבות הלילה', href: '/day/today' },
  { key: 'tomorrow', label: 'מחר', linkLabel: 'לכל המסיבות הקרובות', href: '/all-parties' },
  { key: 'weekend', label: 'סוף השבוע', linkLabel: 'לכל מסיבות סוף השבוע', href: '/day/weekend' },
  { key: 'week', label: 'השבוע', linkLabel: 'לכל המסיבות הקרובות', href: '/all-parties' },
];

const MAX_NIGHT_CARDS = 8;

export default function HomeLaunch({ parties, carousels, holiday }: HomeLaunchProps) {
  const upcoming = sortForDisplay(parties);
  const available = upcoming.filter((p) => !p.soldOut && p.imageUrl);
  const allShelves = buildShelves(carousels, parties);

  // ── Flyer wall: curated "hot" picks first, then the soonest parties.
  const hotIds = new Set((allShelves[0]?.parties ?? []).map((p) => p.id));
  const wallParties = [
    ...available.filter((p) => isPromoted(p)),
    ...available.filter((p) => !isPromoted(p) && hotIds.has(p.id)),
    ...available.filter((p) => !isPromoted(p) && !hotIds.has(p.id)),
  ].slice(0, 32);

  // ── Night picker
  const tonight = currentNight();
  const panels = NIGHT_RANGES.map((range) => {
    const inRange = sortPromotedWithinNight(upcoming.filter((p) => isInRange(p.date, rangeNights(range.key, tonight))));
    return { ...range, parties: inRange };
  }).filter((r) => r.parties.length > 0);

  const nightPanels: NightPanel[] = panels.map((range, panelIndex) => ({
    key: range.key,
    label: range.label,
    count: range.parties.length,
    content: (
      <div>
        <div className="mx-auto max-w-[1200px] sm:px-6">
        <ul className={`no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:scroll-px-0 sm:px-0 lg:overflow-visible ${range.parties.length >= 4 ? 'lg:grid lg:grid-cols-4 lg:gap-x-6 lg:gap-y-10' : 'lg:justify-center lg:gap-6'}`}>
          {range.parties.slice(0, MAX_NIGHT_CARDS).map((party, i) => (
            <li key={party.id} className={`w-[72vw] max-w-[300px] shrink-0 snap-start sm:w-[42vw] ${range.parties.length >= 4 ? 'lg:w-auto lg:max-w-none' : 'lg:w-[276px]'}`}>
              <LaunchPartyCard party={party} sizes="(min-width: 1024px) 280px, (min-width: 640px) 42vw, 72vw" eager={panelIndex === 0 && i < 2} />
            </li>
          ))}
        </ul>
        </div>
        <div className={`${CONTAINER} mt-6 text-center text-[17px] sm:mt-10`}>
          <ChevronLink href={range.href}>
            {range.linkLabel}
            {range.parties.length > MAX_NIGHT_CARDS ? ` (${range.parties.length})` : ''}
          </ChevronLink>
        </div>
      </div>
    ),
  }));
  // Tonight leads whenever anything is on; otherwise the first night with a real choice.
  const defaultPanel = panels.find((p) => p.key === 'tonight') ?? panels.find((p) => p.parties.length >= 4) ?? panels[0];

  // ── Category tiles: only ones with enough real parties behind them.
  const tiles = [
    {
      title: 'סוף השבוע',
      href: '/day/weekend',
      parties: upcoming.filter((p) => !p.soldOut && isInRange(p.date, rangeNights('weekend', tonight))),
    },
    {
      title: 'תל אביב',
      href: '/cities/tel-aviv',
      parties: available.filter((p) => p.areas?.includes('tel aviv')),
    },
    {
      title: 'מיינסטרים',
      href: '/genre/mainstream-music',
      parties: available.filter((p) => p.musicType === 'מיינסטרים'),
    },
    {
      title: 'חיפה והצפון',
      href: '/cities/haifa',
      parties: available.filter((p) => p.areas?.some((a) => a === 'haifa' || a === 'north')),
    },
  ].filter((t) => t.parties.length >= 3);

  // Each tile shows flyers no earlier tile already used, so the fans don't repeat.
  const usedOnTiles = new Set(holiday ? sortForDisplay(holiday.parties).filter((p) => !p.soldOut && p.imageUrl).slice(0, 5).map((p) => p.id) : []);
  const tileFans = tiles.map((tile) => {
    const fresh = tile.parties.filter((p) => !usedOnTiles.has(p.id));
    const fan = (fresh.length >= 2 ? fresh : tile.parties).slice(0, 3);
    fan.forEach((p) => usedOnTiles.add(p.id));
    return fan;
  });

  // Shelves: skip thin ones and ones that repeat a tile above them.
  const tileTitles = new Set(tiles.map((t) => t.title));
  const shelves = allShelves.filter((s) => s.parties.length >= 3 && !tileTitles.has(s.title));

  const holidayFlyers = holiday ? sortForDisplay(holiday.parties).filter((p) => !p.soldOut && p.imageUrl) : [];

  return (
    <div className="font-apple bg-stage text-ink">
      {/* ─── Announcement ribbon (replaces the old holiday banner) ─── */}
      {holiday && (
        <div className="border-b border-hairline bg-tile">
          <p className={`${CONTAINER} py-3 text-center text-[14px] leading-snug text-ink-2`}>
            מסיבות {holiday.hebrewName} {holiday.year} כבר כאן.{' '}
            <ChevronLink href={`/${holiday.slug}`}>ללוח המסיבות</ChevronLink>
          </p>
        </div>
      )}

      {/* ─── Hero stage ─── */}
      <section className="relative overflow-hidden pb-14 pt-10 sm:pb-24 sm:pt-20">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_55%_60%_at_50%_0%,rgba(118,200,147,0.17),transparent_72%)]" />
        <HeroGlow parties={wallParties} />
        <div className={`${CONTAINER} relative text-center`}>
          <h1 className={`${heroFont.className} text-balance text-[clamp(34px,10.4vw,44px)] font-extrabold leading-[1.05] tracking-[-0.02em] sm:text-[68px] lg:text-[92px]`}>
            <span className="block text-ink">המסיבה הבאה שלך</span>
            <span className="block text-ink-3">מתחילה כאן.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[680px] text-balance text-[18px] leading-[1.45] text-ink-2 sm:mt-6 sm:text-[23px]">
            מסיבות היום, מחר וסוף השבוע. רייבים, פסטיבלים ואירועי חגים בתל אביב, אילת, חיפה וכל הארץ.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-4 sm:mt-9">
            <Link
              href="/all-parties"
              className="rounded-full bg-action px-6 py-3 text-[17px] font-medium text-on-action transition-colors duration-200 hover:bg-action-hover"
            >
              לכל המסיבות
            </Link>
            {defaultPanel && (
              <ChevronLink href="#nights" className="text-[17px]">
                {defaultPanel.key === 'tonight' ? 'מה קורה הלילה' : `מסיבות ${defaultPanel.label}`}
              </ChevronLink>
            )}
          </div>
          {upcoming.length > 0 && (
            <p className="mt-6 text-[13px] text-ink-3">
              <span className="tabular-nums">{upcoming.length}</span> מסיבות קרובות · מתעדכן כל יום
            </p>
          )}
        </div>

        <div className="relative mt-12 sm:mt-16">
          <FlyerWall parties={wallParties} />
        </div>
      </section>

      {/* ─── Night picker ─── */}
      {nightPanels.length > 0 && defaultPanel && (
        <section id="nights" className="scroll-mt-16 pb-20 sm:pb-28">
          <h2 className={`${CONTAINER} mb-7 text-center text-[32px] font-bold leading-tight sm:mb-9 sm:text-[48px]`}>
            לאן יוצאים?
          </h2>
          <NightPicker panels={nightPanels} defaultKey={defaultPanel.key} />
        </section>
      )}

      {/* ─── Tiles ─── */}
      {(holiday || tiles.length > 0) && (
        <section className={`${CONTAINER} grid grid-cols-2 gap-3 pb-20 sm:gap-4 sm:pb-28`} aria-label="קיצורי דרך">
          {holiday && (
            <Link
              href={`/${holiday.slug}`}
              className="group relative flex flex-col items-center overflow-hidden rounded-[28px] bg-tile px-6 pb-10 pt-12 text-center transition-colors duration-300 hover:bg-tile-hover sm:pb-14 sm:pt-16 col-span-2"
            >
              <h2 className="text-[34px] font-bold leading-tight sm:text-[56px]">
                מסיבות {holiday.hebrewName} {holiday.year}
              </h2>
              <p className="mt-2 text-[17px] text-ink-2 sm:text-[21px]">
                {holidayFlyers.length > 0
                  ? `${holiday.parties.length} מסיבות ואירועים לחג, במקום אחד.`
                  : 'לוח המסיבות לחג מתעדכן כל יום.'}
              </p>
              <span className="mt-6 rounded-full bg-action px-6 py-3 text-[17px] font-medium text-on-action transition-colors duration-200 group-hover:bg-action-hover">
                ללוח מסיבות {holiday.hebrewName}
              </span>
              {holidayFlyers.length >= 3 && (
                <div className="mt-12 transition-transform duration-700 ease-apple group-hover:-translate-y-2 sm:mt-14">
                  <FlyerFan parties={holidayFlyers} size="lg" />
                </div>
              )}
            </Link>
          )}

          {tiles.map((tile, tileIndex) => (
            <Link
              key={tile.href}
              href={tile.href}
              className="group flex flex-col items-center overflow-hidden rounded-[22px] bg-tile px-3 pb-7 pt-7 text-center transition-colors duration-300 hover:bg-tile-hover sm:rounded-[28px] sm:px-6 sm:pb-10 sm:pt-12"
            >
              <h2 className="text-[21px] font-bold leading-tight sm:text-[40px]">{tile.title}</h2>
              <p className="mt-1 text-[14px] text-ink-2 sm:mt-1.5 sm:text-[17px]">
                <span className="tabular-nums">{tile.parties.length}</span> מסיבות קרובות
              </p>
              <span className="mt-2 hidden items-center gap-1 text-[17px] text-link sm:mt-3 sm:inline-flex group-hover:underline underline-offset-4">
                לצפייה
                <svg viewBox="0 0 24 24" className="h-[0.8em] w-[0.8em]" fill="none" stroke="currentColor" strokeWidth={2.6} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
                </svg>
              </span>
              <div className="mt-6 transition-transform duration-700 ease-apple group-hover:-translate-y-2 sm:mt-10">
                <FlyerFan parties={tileFans[tileIndex]} size="md" />
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* ─── Curated shelves ─── */}
      {shelves.length > 0 && (
        <div className="space-y-16 pb-20 sm:space-y-20 sm:pb-28">
          {shelves.map((shelf) => (
            <section key={shelf.id} aria-labelledby={`shelf-${shelf.id}`}>
              <div className={`${CONTAINER} mb-5 flex items-baseline justify-between gap-4 sm:mb-6`}>
                <h2 id={`shelf-${shelf.id}`} className="text-[26px] font-bold leading-tight sm:text-[32px]">
                  {shelf.title}
                </h2>
                <ChevronLink href={shelf.href} className="shrink-0 text-[15px] sm:text-[17px]">
                  הצג הכל
                </ChevronLink>
              </div>
              <ShelfRow label={shelf.title} id={`shelf-list-${shelf.id}`}>
                {shelf.parties.slice(0, 12).map((party) => (
                  <li key={party.id} className="w-[72vw] max-w-[300px] shrink-0 snap-start sm:w-[280px]">
                    <LaunchPartyCard party={party} sizes="(min-width: 640px) 280px, 72vw" />
                  </li>
                ))}
              </ShelfRow>
            </section>
          ))}
        </div>
      )}

      {/* ─── Browse ─── */}
      <section className={`${CONTAINER} pb-20 text-center sm:pb-28`} aria-labelledby="browse-heading">
        <h2 id="browse-heading" className="text-[28px] font-bold leading-tight sm:text-[40px]">
          גלו לפי יום, סגנון ועיר
        </h2>
        <ul className="mx-auto mt-8 flex max-w-[860px] flex-wrap justify-center gap-2.5 sm:gap-3">
          {[
            { href: '/day/today', label: 'הלילה' },
            { href: '/day/thursday', label: 'חמישי' },
            { href: '/day/friday', label: 'שישי' },
            { href: '/day/weekend', label: 'סוף שבוע' },
            { href: '/genre/techno-music', label: 'טכנו' },
            { href: '/genre/house-music', label: 'האוס' },
            { href: '/genre/trance', label: 'טראנס' },
            { href: '/genre/mainstream-music', label: 'מיינסטרים' },
            { href: '/cities/tel-aviv', label: 'תל אביב' },
            { href: '/cities/haifa', label: 'חיפה' },
            { href: '/cities/jerusalem', label: 'ירושלים' },
            { href: '/cities/eilat', label: 'אילת' },
          ].map((chip) => (
            <li key={chip.href}>
              <Link
                href={chip.href}
                className="block rounded-full border border-hairline px-5 py-2.5 text-[15px] text-ink transition-colors duration-200 hover:border-white/30 hover:bg-tile"
              >
                {chip.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ─── Story (indexable copy) ─── */}
      <section className="border-t border-hairline py-20 sm:py-28">
        <div className="mx-auto max-w-[760px] px-4 sm:px-6">
          <h2 className="text-center text-[28px] font-bold leading-tight sm:text-[40px]">למה לבחור ב-Parties 24/7?</h2>
          <div className="mt-8 space-y-5 text-[17px] leading-[1.75] text-ink-2">
            <p>
              Parties 24/7 הוא המקום שבו חיי הלילה בישראל מתחברים לנקודה אחת ברורה, פשוטה ונוחה. במקום לבזבז זמן על חיפושים מפוזרים, עמודי אינסטגרם, קבוצות וואטסאפ או המלצות מפה לאוזן – כאן אפשר למצוא מסיבות, אירועים וליינאפים נבחרים מכל רחבי הארץ, עם דגש על תל אביב והמרכז. האתר מרכז מסיבות מיינסטרים, טכנו, טראנס, אירועי סילבסטר, חגים, מסיבות אלכוהול חופשי ואירועים מיוחדים, ומאפשר לבחור את המסיבה שמתאימה בדיוק לסגנון, ליום ולוייב שאתם מחפשים.
            </p>
            <p>
              אנחנו עובדים ישירות עם מפיקים, יחסי ציבור ודיג&apos;יים, ומביאים רק אירועים שאנחנו מאמינים בהם – בלי ספאם ובלי עומס מיותר. המטרה שלנו היא לחסוך לכם זמן, להוריד חוסר ודאות, ולתת לכם חוויית גילוי נוחה, מהירה וברורה, שמובילה להחלטה ולקנייה בצורה טבעית. בנוסף, Parties 24/7 מחובר לקהילות חיי לילה, עדכונים שוטפים ותוכן שמגיע מהשטח, כדי שתמיד תהיו עם היד על הדופק ותדעו מה קורה הלילה, מחר ובסוף השבוע. אם אתם מחפשים מסיבות בישראל ולא רוצים לפספס את האירועים החזקים באמת – זה המקום להתחיל בו.
            </p>
            <p>
              בקרו ב<Link href="/genre/techno-music" className="text-link hover:underline underline-offset-4">דף הטכנו</Link>, ב
              <Link href="/cities/tel-aviv" className="text-link hover:underline underline-offset-4">מדריך תל אביב</Link> או ב
              <Link href="/audience/student-parties" className="text-link hover:underline underline-offset-4">מסיבות הסטודנטים</Link> כדי לתכנן את הלילה הבא שלכם.
            </p>
            <p>
              קיצורי הדרך בעמוד מחברים אתכם למסיבות היום, חמישי ושישי, ועמוד החיפוש מציג את כל הקטגוריות – כולל דפי מועדון ל-
              <Link href="/club/echo" className="text-link hover:underline underline-offset-4">ECHO</Link>,{' '}
              <Link href="/club/jimmy-who" className="text-link hover:underline underline-offset-4">Jimmy Who</Link>,{' '}
              <Link href="/club/gagarin" className="text-link hover:underline underline-offset-4">Gagarin</Link> ו-
              <Link href="/club/moon-child" className="text-link hover:underline underline-offset-4">Moon Child</Link>. שמרו את העמוד במועדפים וחזרו מדי שבוע כדי לא לפספס שום רייב.
            </p>
          </div>
        </div>
      </section>

      {/* ─── Follow ─── */}
      <section className="border-t border-hairline py-20 text-center sm:py-24">
        <div className={CONTAINER}>
          <h2 className="text-[28px] font-bold leading-tight sm:text-[40px]">אל תפספסו אף מסיבה.</h2>
          <p className="mx-auto mt-3 max-w-[520px] text-[17px] text-ink-2 sm:text-[19px]">
            ליינים חדשים וכרטיסים שנפתחו, ישר אליכם לאינסטגרם, לטיקטוק ולוואטסאפ.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { href: SOCIAL_LINKS.whatsapp, label: 'קבוצת הוואטסאפ', Icon: WhatsAppIcon },
              { href: SOCIAL_LINKS.instagram, label: 'אינסטגרם', Icon: InstagramIcon },
              { href: SOCIAL_LINKS.tiktok, label: 'טיקטוק', Icon: TikTokIcon },
            ].map(({ href, label, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 rounded-full bg-tile px-5 py-3 text-[15px] font-medium text-ink transition-colors duration-200 hover:bg-tile-raised"
              >
                <Icon className="h-5 w-5" />
                {label}
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

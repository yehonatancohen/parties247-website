import React from 'react';
import Link from 'next/link';
import { Carousel } from '@/data/types';
import { Metadata } from 'next';
import { createCarouselSlug } from '@/lib/carousels';
import { getCarousels } from '@/services/api';
import SmoothScrollAnchors from '@/components/SmoothScrollAnchors';
import BackButton from '@/components/BackButton';

export const dynamic = 'force-dynamic';

// --- Static Data ---
const quickLinks = [
  { label: 'כל המסיבות', emoji: '🎉', to: '/all-parties', desc: 'רשימה מתעדכנת עם חיפוש מתקדם' },
  { label: 'מסיבות חמישי', emoji: '🔥', to: '/day/thursday', desc: 'לילה פותח סופ״ש' },
  { label: 'מסיבות שישי', emoji: '🪩', to: '/day/friday', desc: 'הרחבות המבוקשות' },
  { label: 'סוף שבוע', emoji: '🌴', to: '/day/weekend', desc: 'שישי + שבת במקום אחד' },
  { label: 'הערב', emoji: '⚡', to: '/day/today', desc: 'מה קורה היום' },
];

const audienceLinks = [
  { title: 'מסיבות נוער', to: '/audience/teenage-parties', blurb: 'אירועים מפוקחים עם פירוט אבטחה וגיל כניסה.', emoji: '🎓' },
  { title: 'מסיבות סטודנטים', to: '/audience/student-parties', blurb: 'ליינים אקדמיים, הנחות ושאטלים מקמפוסים.', emoji: '📚' },
  { title: 'מסיבות חיילים', to: '/audience/soldier-parties', blurb: 'הטבות חיילים, שעות מאוחרות ושמירת ציוד.', emoji: '🎖️' },
  { title: 'מסיבות 24+', to: '/audience/24plus-parties', blurb: 'וייב בוגר, שירות מוקפד וקוקטיילים.', emoji: '🍸' },
];

const cityLinks = [
  { title: 'תל אביב', to: '/cities/tel-aviv', blurb: 'טכנו בדרום, גגות במרכז והכל בעדכון יומיומי.', emoji: '🌃' },
  { title: 'חיפה', to: '/cities/haifa', blurb: 'חוף, כרמל ושוק תלפיות – כל הוייבים.', emoji: '⛵' },
];

const styleLinks = [
  { title: 'טכנו', to: '/genre/techno-music', blurb: 'רייבי מחסן, חופים ומועדוני ענק.', emoji: '🔊' },
  { title: 'האוס וגרוב', to: '/genre/house-music', blurb: 'גגות שקיעה, ברים אינטימיים.', emoji: '🎧' },
  { title: 'מיינסטרים ופופ', to: '/genre/mainstream-music', blurb: 'להיטים, רגאטון וקריוקי.', emoji: '🎤' },
];

const clubLinks = [
  { title: 'ECHO Club', to: '/club/echo', blurb: 'רחבה דרומית עם טכנו, האוס והופעות לייב.' },
  { title: 'Jimmy Who', to: '/club/jimmy-who', blurb: 'בר-מועדון תל אביבי עם להיטים ורחבה שמחה.' },
  { title: 'Gagarin', to: '/club/gagarin', blurb: 'חלל אנדרגראונד עם במה להופעות חיות.' },
  { title: 'Moon Child', to: '/club/moon-child', blurb: 'וייב ירח עם קוקטיילים וגרוב מלודי.' },
];

const helperLinks = [
  { title: 'בלוג וטיפים', to: '/articles', blurb: 'מדריכים, ראיונות ותחקירי ליינים.' },
  { title: 'הצהרת מקדמי אירועים', to: '/promoter-disclaimer', blurb: 'שקיפות מלאה מול מפיקים ושותפים.' },
];

const subPageLinks = [
  {
    title: 'חיפוש ממוקד וקטגוריות מיוחדות',
    description: 'מסיבות טכנו בתל אביב, 18+ עם אלכוהול חופשי, מסיבות לחיילים, סופ"ש בצפון ועוד.',
    to: '/parties',
  },
];

// --- Metadata ---
export const metadata: Metadata = {
  title: 'חיפוש מסיבות | ז׳אנרים, ערים ומועדונים | Parties 24/7',
  description: 'חפשו כרטיסים למסיבות בישראל לפי עיר, ז׳אנר, קהל יעד או מועדון. טכנו, האוס, מיינסטרים, מסיבות נוער ועוד – כל הליינים מתעדכנים בזמן אמת.',
  alternates: {
    canonical: '/party-discovery',
  },
};

// --- Helper: Section wrapper ---
function Section({ id, title, subtitle, children }: { id?: string; title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-14 scroll-mt-24">
      <div className="mb-6">
        <h2 className="text-3xl font-display text-white">{title}</h2>
        {subtitle && <p className="text-jungle-text/60 text-sm mt-1">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

// --- Helper: Link card ---
function LinkCard({ href, title, blurb, emoji, accent }: { href: string; title: string; blurb: string; emoji?: string; accent?: string }) {
  return (
    <Link
      href={href}
      prefetch={false}
      className={`group block rounded-2xl border border-white/8 bg-jungle-surface/60 p-5 transition-all duration-200 hover:border-jungle-lime/40 hover:bg-jungle-surface/90 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-jungle-lime/5`}
    >
      <div className="flex items-start gap-3">
        {emoji && <span className="text-2xl mt-0.5 flex-shrink-0">{emoji}</span>}
        <div className="min-w-0">
          <h3 className={`text-lg font-bold text-white group-hover:text-jungle-lime transition-colors ${accent || ''}`}>{title}</h3>
          <p className="text-sm text-jungle-text/70 mt-1 leading-relaxed">{blurb}</p>
        </div>
      </div>
    </Link>
  );
}

// --- Main Component ---
export default async function PartyDiscoveryPage() {
  let carousels: Carousel[] = [];
  try {
    const data = await getCarousels();
    if (Array.isArray(data)) {
      carousels = data;
    }
  } catch (error) {
    console.error("Failed to fetch carousels for SSR", error);
  }

  const carouselLinks = carousels
    .sort((a: any, b: any) => a.order - b.order)
    .map((carousel: any) => {
      const isPurim = carousel.title.toLowerCase().includes('purim') || carousel.title.includes('פורים');
      return {
        title: carousel.title,
        to: isPurim ? '/purim' : `/carousels/${createCarouselSlug(carousel.title)}`,
      };
    });

  return (
    <div id="top" className="min-h-screen bg-jungle-deep text-white scroll-smooth">
      <SmoothScrollAnchors />

      <div className="max-w-5xl mx-auto px-4 pb-16 pt-10 md:pt-14">

        {/* Back */}
        <div className="mb-8">
          <BackButton fallbackHref="/" label="חזרה" />
        </div>

        {/* ══════════════════════════════════════════════
            HERO
        ══════════════════════════════════════════════ */}
        <header className="text-center mb-14">
          <p className="inline-block text-xs font-semibold uppercase tracking-[0.25em] text-jungle-accent/80 mb-4">
            Party Discovery
          </p>
          <h1 className="text-4xl md:text-6xl font-display text-white leading-tight mb-4">
            מוצאים את המסיבה<br className="hidden md:block" /> הבאה שלכם
          </h1>
          <p className="text-lg text-jungle-text/70 max-w-2xl mx-auto leading-relaxed">
            כל הליינים, הערים, הסגנונות והמועדונים — במקום אחד.
            <br />בחרו קטגוריה ותעברו ישר לעמוד הרלוונטי.
          </p>

          {/* Anchor nav */}
          <nav className="flex flex-wrap justify-center gap-2 mt-8" aria-label="קישורי ניווט מהיר">
            {[
              { label: 'קהל יעד', hash: '#audiences' },
              { label: 'ערים', hash: '#cities' },
              { label: 'סגנונות', hash: '#styles' },
              { label: 'מועדונים', hash: '#clubs' },
            ].map(item => (
              <a
                key={item.hash}
                href={item.hash}
                className="rounded-full border border-white/15 px-4 py-2 text-sm font-medium text-jungle-text/80 hover:border-jungle-lime/50 hover:text-jungle-lime transition-colors"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </header>

        {/* ══════════════════════════════════════════════
            QUICK ACCESS — pill-style links
        ══════════════════════════════════════════════ */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-14">
          {quickLinks.map(item => (
            <Link
              key={item.to}
              href={item.to}
              prefetch={false}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-white/8 bg-jungle-surface/40 py-5 px-3 text-center transition-all hover:border-jungle-lime/40 hover:bg-jungle-surface/70 hover:-translate-y-0.5"
            >
              <span className="text-3xl">{item.emoji}</span>
              <span className="text-sm font-bold text-white group-hover:text-jungle-lime transition-colors">{item.label}</span>
              <span className="text-[11px] text-jungle-text/50 leading-tight">{item.desc}</span>
            </Link>
          ))}
        </div>

        {/* ══════════════════════════════════════════════
            FOCUSED SEARCH CTA
        ══════════════════════════════════════════════ */}
        {subPageLinks.map(item => (
          <Link
            key={item.to}
            href={item.to}
            prefetch={false}
            className="group block rounded-2xl border border-jungle-accent/20 bg-gradient-to-r from-jungle-surface/80 to-jungle-deep p-6 md:p-8 mb-14 transition-all hover:border-jungle-accent/40 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-jungle-accent/5"
          >
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-display text-jungle-lime mb-1">{item.title}</h2>
                <p className="text-jungle-text/70 text-sm max-w-xl">{item.description}</p>
              </div>
              <span className="inline-flex items-center gap-2 rounded-full bg-jungle-accent/15 border border-jungle-accent/30 px-5 py-2.5 text-sm font-bold text-jungle-accent group-hover:bg-jungle-accent group-hover:text-jungle-deep transition-colors whitespace-nowrap self-start md:self-center">
                לקטגוריות מיוחדות ↗
              </span>
            </div>
          </Link>
        ))}

        {/* ══════════════════════════════════════════════
            AUDIENCE
        ══════════════════════════════════════════════ */}
        <Section id="audiences" title="לפי קהל יעד" subtitle="מצאו אירועים שמותאמים בדיוק לגיל ולוייב שלכם.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {audienceLinks.map(item => (
              <LinkCard key={item.to} href={item.to} title={item.title} blurb={item.blurb} emoji={item.emoji} />
            ))}
          </div>
        </Section>

        {/* ══════════════════════════════════════════════
            CITIES
        ══════════════════════════════════════════════ */}
        <Section id="cities" title="לפי עיר" subtitle="כל המסיבות באזור שלכם.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {cityLinks.map(item => (
              <LinkCard key={item.to} href={item.to} title={item.title} blurb={item.blurb} emoji={item.emoji} />
            ))}
          </div>
        </Section>

        {/* ══════════════════════════════════════════════
            STYLES / GENRES
        ══════════════════════════════════════════════ */}
        <Section id="styles" title="לפי סגנון מוזיקה" subtitle="טכנו, האוס, פופ — בחרו את הסאונד שלכם.">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {styleLinks.map(item => (
              <LinkCard key={item.to} href={item.to} title={item.title} blurb={item.blurb} emoji={item.emoji} />
            ))}
          </div>
        </Section>

        {/* ══════════════════════════════════════════════
            CLUBS
        ══════════════════════════════════════════════ */}
        <Section id="clubs" title="מועדונים" subtitle="עמודים ייעודיים לכל מועדון עם כל האירועים הקרובים.">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {clubLinks.map(item => (
              <LinkCard key={item.to} href={item.to} title={item.title} blurb={item.blurb} emoji="🏛️" />
            ))}
          </div>
        </Section>

        {/* ══════════════════════════════════════════════
            CAROUSELS (Dynamic)
        ══════════════════════════════════════════════ */}
        {carouselLinks.length > 0 && (
          <Section id="carousels" title="קרוסלות נבחרות" subtitle="אוספים שנבחרו במיוחד עם הליינים הכי חמים.">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {carouselLinks.map(item => (
                <LinkCard key={item.to} href={item.to} title={item.title} blurb="כל הליינים החמים בקרוסלה אחת." emoji="🎠" />
              ))}
            </div>
          </Section>
        )}

        {/* ══════════════════════════════════════════════
            RESOURCES
        ══════════════════════════════════════════════ */}
        <Section title="עוד משאבים">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {helperLinks.map(item => (
              <LinkCard key={item.to} href={item.to} title={item.title} blurb={item.blurb} emoji="📄" />
            ))}
          </div>
        </Section>

        {/* Bottom CTA */}
        <div className="text-center pt-4 pb-8">
          <Link
            href="/all-parties"
            prefetch={false}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-jungle-lime to-jungle-accent px-8 py-3.5 text-lg font-bold text-jungle-deep shadow-lg shadow-jungle-lime/20 transition-all hover:scale-105 hover:shadow-jungle-lime/30"
          >
            🎉 לכל המסיבות
          </Link>
        </div>
      </div>
    </div>
  );
}
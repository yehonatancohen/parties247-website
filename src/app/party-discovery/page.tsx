import React from 'react';
import Link from 'next/link';
import { Carousel } from '@/data/types'; // Ensure this path is correct
import { Metadata } from 'next';
import { createCarouselSlug } from '@/lib/carousels';
import { getCarousels } from '@/services/api';
import SmoothScrollAnchors from '@/components/SmoothScrollAnchors';
import BackButton from '@/components/BackButton';

// 1. Force Dynamic Rendering
export const dynamic = 'force-dynamic';

// --- Static Data Definitions ---
const quickLinks = [
  {
    label: 'כל המסיבות הקרובות',
    description: 'רשימה מתעדכנת עם אפשרות חיפוש מתקדם',
    to: '/all-parties',
  },
  {
    label: 'מסיבות חמישי',
    description: 'קפיצה מהירה ללילה הפותח את הסופ״ש',
    to: '/day/thursday',
  },
  {
    label: 'מסיבות שישי',
    description: 'רחבות הסופ״ש הכי מבוקשות',
    to: '/day/friday',
  },
  {
    label: 'מסיבות סוף השבוע',
    description: 'כל האירועים של שישי ושבת במקום אחד',
    to: '/day/weekend',
  },
  {
    label: 'מסיבות הערב',
    description: 'כל מה שקורה היום בלבד',
    to: '/day/today',
  },
];

const audienceLinks = [
  { title: 'מסיבות נוער', to: '/audience/teenage-parties', blurb: 'אירועים מפוקחים עם פירוט אבטחה וגיל כניסה.' },
  { title: 'מסיבות סטודנטים', to: '/audience/student-parties', blurb: 'ליינים אקדמיים, הנחות ושאטלים מקמפוסים.' },
  { title: 'מסיבות חיילים', to: '/audience/soldier-parties', blurb: 'הטבות חיילים, שעות מאוחרות ושמירת ציוד.' },
  { title: 'מסיבות 24+', to: '/audience/24plus-parties', blurb: 'וייב בוגר, שירות מוקפד וקוקטיילים איכותיים.' },
];

const cityLinks = [
  { title: 'מסיבות תל אביב', to: '/cities/tel-aviv', blurb: 'טכנו בדרום, גגות במרכז והכל בעדכון יומיומי.' },
  { title: 'מסיבות חיפה', to: '/cities/haifa', blurb: 'חוף, כרמל ושוק תלפיות – כל הוייבים בדף אחד.' },
];

const styleLinks = [
  { title: 'טכנו', to: '/genre/techno-music', blurb: 'רייבי מחסן, חופים ומועדוני ענק.' },
  { title: 'האוס וגרוב', to: '/genre/house-music', blurb: 'גגות שקיעה, ברים אינטימיים וסאונד נעים.' },
  { title: 'מיינסטרים ופופ', to: '/genre/mainstream-music', blurb: 'להיטים, רגאטון וקריוקי עד הבוקר.' },
];

const clubLinks = [
  { title: 'ECHO Club', to: '/club/echo', blurb: 'רחבה דרומית עם טכנו, האוס והופעות לייב.' },
  { title: 'Jimmy Who', to: '/club/jimmy-who', blurb: 'בר-מועדון תל אביבי עם להיטים ורחבה שמחה.' },
  { title: 'Gagarin', to: '/club/gagarin', blurb: 'חלל אנדרגראונד עם במה להופעות חיות וסטים אלקטרוניים.' },
  { title: 'Moon Child', to: '/club/moon-child', blurb: 'וייב ירח עם קוקטיילים, גרוב מלודי ורחבה אינטימית.' },
];

const helperLinks = [
  { title: 'בלוג וטיפים', to: '/articles', blurb: 'מדריכים, ראיונות ותחקירי ליינים.' },
  { title: 'הצהרת מקדמי אירועים', to: '/promoter-disclaimer', blurb: 'שקיפות מלאה מול מפיקים ושותפים.' },
];

// --- UPDATED SECTION: Only 1 link to the Specific Parties Hub ---
const subPageLinks = [
  {
    title: 'חיפוש ממוקד וקטגוריות מיוחדות',
    description: 'מסיבות טכנו בתל אביב, 18+ עם אלכוהול חופשי, מסיבות לחיילים, סופ"ש בצפון ועוד – כל השילובים הספציפיים במקום אחד.',
    // Update this to the exact route where you placed the component from the previous step
    to: '/parties', 
  },
];

const vibePills = [
  { label: 'מסיבת רגע אחרון', to: '/all-parties', gradient: 'from-pink-500/90 via-orange-400/90 to-yellow-300/80' },
  { label: 'וייב גג שקיעה', to: '/day/weekend', gradient: 'from-fuchsia-500/80 via-purple-500/80 to-blue-400/80' },
  { label: 'טכנו', to: '/genre/techno-music', gradient: 'from-emerald-400/90 via-teal-400/90 to-cyan-300/90' },
  { label: 'הנחת חיילים/סטודנטים', to: '/audience/student-parties', gradient: 'from-indigo-400/80 via-blue-500/80 to-sky-400/80' },
];

const impulseLinks = [
  {
    title: 'דילים של הרגע האחרון',
    to: '/all-parties',
    anchor: 'impulse-last-minute',
    badge: '🔥 לוהט',
    blurb: 'קפצו ישר למסיבות שמתמלאות עכשיו ושריינו מקום לפני שזה נעלם.',
  },
  {
    title: 'היום בלילה',
    to: '/day/today',
    anchor: 'impulse-tonight',
    badge: '⚡ ספונטני',
    blurb: 'סינון מהיר לליינים של הלילה הקרוב, עם שעות פתיחה וכניסה מהירה.',
  },
  {
    title: 'חברים באים?',
    to: '/carousels/חם-עכשיו',
    anchor: 'impulse-groups',
    badge: '✨ וייב חברתי',
    blurb: 'אוספים עם רחבות ענק, חבילות שולחן וסטים של הדיג׳יים המדוברים.',
  },
];

export const metadata: Metadata = {
  title: 'חיפוש מסיבות בישראל | Parties 24/7',
  description: 'חפשו מסיבות לפי קהל יעד, עיר, סגנון מוזיקלי או מועדון ספציפי. עמוד הניווט המהיר שלנו מציג קישורים פנימיים מסודרים לכל העמודים החמים והמתעדכנים בזמן אמת.',
  alternates: {
    canonical: '/party-discovery',
  },
};

// --- Main Server Component ---
export default async function PartyDiscoveryPage() {
  // SSR Data Fetching
  let carousels: Carousel[] = [];
  try {
     const data = await getCarousels();
     // 2. Safeguard Data
     if (Array.isArray(data)) {
        carousels = data;
     }
  } catch (error) {
     console.error("Failed to fetch carousels for SSR", error);
  }

  const carouselLinks = carousels
    .sort((a: any, b: any) => a.order - b.order)
    .map((carousel: any) => ({
      title: carousel.title,
      to: `/carousels/${createCarouselSlug(carousel.title)}`,
    }));

  return (
    <div id="top" className="min-h-screen bg-gradient-to-b from-jungle-deep via-[#0c1713] to-black text-white scroll-smooth">
      <SmoothScrollAnchors />
      <div className="container mx-auto px-4 pb-16 pt-14 md:pt-16">
        <div className="mb-6 flex justify-start">
          <BackButton fallbackHref="/" label="חזרה" />
        </div>
        {/* Header Section */}
        <div className="max-w-6xl mx-auto text-center mb-12">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-jungle-surface/80 via-emerald-900/35 to-jungle-deep/70 px-6 py-10 shadow-[0_15px_60px_rgba(0,0,0,0.35)]">
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_18%_15%,rgba(167,255,131,0.16),transparent_32%),radial-gradient(circle_at_70%_30%,rgba(0,191,165,0.12),transparent_36%),radial-gradient(circle_at_40%_90%,rgba(255,255,255,0.06),transparent_30%)]" />
          <div className="relative space-y-5">
            <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-jungle-text/80">
              ניווט ממוקד • בחירה מהירה
            </p>
            <h1 className="text-4xl md:text-5xl font-display text-white leading-tight">
              מוצאים את המסיבה הבאה ב־60 שניות
            </h1>
            <p className="text-lg text-jungle-text/85 leading-relaxed max-w-4xl mx-auto">
              חיברנו בין הקיצורי דרך החמים, הוייבים הצבעוניים והטבות ספונטניות כדי שתמצאו מיד את האירוע שמדליק אתכם. בחרו לפי אנרגיה, עיר או חבר׳ה ותעברו ישר לעמוד הרלוונטי.
            </p>

            <div className="flex flex-wrap justify-center gap-3">
              {vibePills.map((pill) => (
                <Link
                  key={pill.to}
                  href={pill.to}
                  prefetch={false}
                  className={`group relative overflow-hidden rounded-full border border-white/10 bg-gradient-to-r ${pill.gradient} px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-105 hover:-rotate-1`}
                >
                  <span className="absolute inset-0 bg-white/20 opacity-0 transition group-hover:opacity-20" />
                  <span className="relative flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-white/80 shadow-[0_0_0_4px_rgba(255,255,255,0.2)]" aria-hidden />
                    {pill.label}
                  </span>
                </Link>
              ))}
            </div>

            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <Link
                href="/all-parties"
                prefetch={false}
                className="rounded-full bg-gradient-to-r from-emerald-500 via-jungle-accent to-amber-200/90 px-6 py-3 text-base font-bold text-slate-950 shadow-[0_10px_40px_rgba(114,213,174,0.35)] transition hover:-translate-y-1 hover:shadow-[0_18px_55px_rgba(114,213,174,0.45)]"
              >
                מצאו מסיבה עכשיו
              </Link>
              <Link
                href="/day/weekend"
                prefetch={false}
                className="rounded-full border border-white/25 px-6 py-3 text-base font-bold text-white backdrop-blur transition hover:border-jungle-lime hover:text-jungle-lime"
              >
                לראות מה קורה בסופ׳׳ש
              </Link>
            </div>

            {/* Hash Links */}
            <div className="flex flex-wrap justify-center gap-3 text-sm text-jungle-accent/90 pt-2">
              <a href="#audiences" className="rounded-full border border-white/10 px-3 py-1 hover:border-jungle-lime hover:text-white">קהל יעד</a>
              <a href="#cities" className="rounded-full border border-white/10 px-3 py-1 hover:border-jungle-lime hover:text-white">ערים</a>
              <a href="#styles" className="rounded-full border border-white/10 px-3 py-1 hover:border-jungle-lime hover:text-white">סגנונות</a>
              <a href="#clubs" className="rounded-full border border-white/10 px-3 py-1 hover:border-jungle-lime hover:text-white">מועדונים</a>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-12">
        {quickLinks.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            prefetch={false}
            className="group overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-jungle-surface/80 via-emerald-900/30 to-slate-900/40 p-5 text-right shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-jungle-glow"
          >
            <div className="absolute inset-0 opacity-0 transition group-hover:opacity-15 bg-[radial-gradient(circle_at_20%_20%,rgba(167,255,131,0.25),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.18),transparent_32%)]" />
            <span className="relative inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-jungle-lime/90">
              קיצור דרך
              <span className="h-1 w-1 rounded-full bg-jungle-lime" />
            </span>
            <h2 className="relative text-2xl font-display text-white group-hover:text-jungle-lime transition-colors">{item.label}</h2>
            <p className="relative text-jungle-text/80 text-sm leading-relaxed">{item.description}</p>
            <span className="relative inline-flex items-center gap-2 text-xs font-semibold text-jungle-lime mt-3">פתחו את הרשימה <span aria-hidden="true">&rarr;</span></span>
          </Link>
        ))}
      </div>

      {/* Sub Pages CTA - UPDATED to Single Column Grid */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-display text-white">חיפוש ממוקד</h2>
          <p className="text-sm text-jungle-text/70">הדרך המדויקת למצוא את המסיבה שלכם.</p>
        </div>
        {/* Changed grid-cols-1 to make the single item span full width */}
        <div className="grid grid-cols-1 gap-4">
          {subPageLinks.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              prefetch={false}
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-jungle-surface/80 via-emerald-900/30 to-indigo-900/30 p-8 text-right shadow-lg transition hover:-translate-y-1 hover:shadow-jungle-glow"
            >
              <div className="absolute inset-0 opacity-0 transition group-hover:opacity-15 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.15),transparent_35%),radial-gradient(circle_at_80%_20%,rgba(0,191,165,0.12),transparent_32%)]" />
              <h3 className="relative text-3xl font-display text-white mb-2 text-jungle-lime">{item.title}</h3>
              <p className="relative text-base text-jungle-text/85 leading-relaxed max-w-3xl">{item.description}</p>
              <span className="relative inline-flex items-center gap-2 text-sm font-semibold text-white mt-4 bg-white/10 px-4 py-2 rounded-full group-hover:bg-jungle-lime group-hover:text-black transition-colors">
                 מעבר לקטגוריות המיוחדות <span aria-hidden="true">↗</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Impulse Highlights */}
      <section className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-display text-white">למי שמתחשק עכשיו</h2>
          <p className="text-sm text-jungle-text/70">קיצורי דרך עם צבעים ויתרונות מיידיים.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {impulseLinks.map((item) => (
            <Link
              key={item.to}
              href={`#${item.anchor}`}
              prefetch={false}
              className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-emerald-700/30 via-jungle-surface/70 to-amber-700/25 p-5 text-right shadow-lg transition hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_35%)] opacity-80" />
              <div className="relative flex items-center justify-between gap-3">
                <h3 className="text-2xl font-display text-white">{item.title}</h3>
                <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white">{item.badge}</span>
              </div>
              <p className="relative mt-2 text-jungle-text/85 leading-relaxed">{item.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Impulse Landing Sections */}
      <div className="space-y-8 mb-14">
        {impulseLinks.map((item) => (
          <section
            key={item.anchor}
            id={item.anchor}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-r from-jungle-surface/85 via-jungle-deep/80 to-emerald-900/40 p-6 md:p-8 shadow-[0_18px_45px_rgba(0,0,0,0.32)] transition-all duration-500 target:-translate-y-1 target:shadow-jungle-glow"
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(167,255,131,0.12),transparent_32%),radial-gradient(circle_at_80%_15%,rgba(0,191,165,0.16),transparent_34%)]" />
            <div className="relative flex flex-col md:flex-row md:items-center gap-4 md:gap-8">
              <div className="flex-1 space-y-2">
                <p className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-jungle-accent">
                  {item.badge}
                  <span className="h-1 w-1 rounded-full bg-jungle-accent" />
                  עכשיו
                </p>
                <h3 className="text-2xl md:text-3xl font-display text-white">{item.title}</h3>
                <p className="text-jungle-text/80 leading-relaxed max-w-2xl">{item.blurb}</p>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Link
                  href={item.to}
                  prefetch={false}
                  className="inline-flex items-center gap-2 rounded-full bg-jungle-accent px-5 py-3 text-base font-semibold text-black shadow-lg shadow-jungle-accent/30 transition hover:-translate-y-0.5 hover:bg-white"
                >
                  מעבר לעמוד המלא
                  <span aria-hidden="true">↗</span>
                </Link>
                <a href="#top" className="text-sm text-jungle-text/70 hover:text-jungle-accent">חזרה לראש הדף</a>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Audiences Section */}
      <section id="audiences" className="mb-12 scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-display text-white">לפי קהל יעד</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audienceLinks.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              prefetch={false}
              className="rounded-2xl border border-white/10 bg-gradient-to-r from-jungle-surface/80 via-emerald-900/20 to-slate-900/40 p-5 shadow-md transition hover:-translate-y-1 hover:border-jungle-lime/60 hover:shadow-jungle-glow"
            >
              <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
              <p className="text-jungle-text/85 leading-relaxed">{item.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Cities Section */}
      <section id="cities" className="mb-12 scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-display text-white">לפי עיר</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cityLinks.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              prefetch={false}
              className="rounded-2xl border border-white/10 bg-gradient-to-r from-jungle-surface/80 via-slate-900/40 to-indigo-900/30 p-5 shadow-md transition hover:-translate-y-1 hover:border-jungle-lime/60 hover:shadow-jungle-glow"
            >
              <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
              <p className="text-jungle-text/85 leading-relaxed">{item.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Styles Section */}
      <section id="styles" className="mb-12 scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-display text-white">לפי סגנון</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {styleLinks.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              prefetch={false}
              className="rounded-2xl border border-white/10 bg-gradient-to-r from-jungle-surface/80 via-purple-900/30 to-pink-900/30 p-5 shadow-md transition hover:-translate-y-1 hover:border-jungle-lime/60 hover:shadow-jungle-glow"
            >
              <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
              <p className="text-jungle-text/85 leading-relaxed">{item.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Clubs Section */}
      <section id="clubs" className="mb-12 scroll-mt-24">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-display text-white">מועדונים</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clubLinks.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              prefetch={false}
              className="rounded-2xl border border-white/10 bg-gradient-to-r from-jungle-surface/80 via-slate-900/40 to-emerald-900/30 p-5 shadow-md transition hover:-translate-y-1 hover:border-jungle-lime/60 hover:shadow-jungle-glow"
            >
              <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
              <p className="text-jungle-text/85 leading-relaxed">{item.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Dynamic Carousels Section */}
      {carouselLinks.length > 0 && (
        <section id="carousels" className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-3xl font-display text-white">קרוסלות נבחרות</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {carouselLinks.map((item) => (
              <Link
                key={item.to}
                href={item.to}
                prefetch={false}
                className="rounded-2xl border border-white/10 bg-gradient-to-r from-jungle-surface/80 via-cyan-900/30 to-purple-900/30 p-5 shadow-md transition hover:-translate-y-1 hover:border-jungle-lime/60 hover:shadow-jungle-glow"
              >
                <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
                <p className="text-jungle-text/75 leading-relaxed">כל הליינים החמים בקרוסלה אחת.</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Helper Links Section */}
      <section className="mb-16">
        <h2 className="text-2xl font-display text-white mb-3">עוד משאבים</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {helperLinks.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              prefetch={false}
              className="rounded-2xl border border-white/10 bg-gradient-to-r from-jungle-surface/80 via-emerald-900/30 to-slate-900/40 p-5 shadow-md transition hover:-translate-y-1 hover:border-jungle-lime/60 hover:shadow-jungle-glow"
            >
              <h3 className="text-xl font-display text-white">{item.title}</h3>
              <p className="text-jungle-text/85 leading-relaxed">{item.blurb}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  </div>
  );
}
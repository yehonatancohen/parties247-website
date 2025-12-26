import React from 'react';
import Link from 'next/link';
import { Carousel } from '@/data/types';
import { Metadata } from 'next';
import { createCarouselSlug } from '@/lib/carousels'; // Assumed path
// Note: We cannot use hooks (useParties) in Server Components.
// We must fetch data directly or import a utility function.
import { getCarouselsData } from '@/lib/api/parties'; // See explanation below

// --- Static Data Definitions (Moved outside component) ---
const quickLinks = [
  {
    label: 'כל המסיבות הקרובות',
    description: 'רשימה מתעדכנת עם אפשרות חיפוש מתקדם',
    to: '/all-parties',
  },
  {
    label: 'מסיבות חמישי',
    description: 'קפיצה מהירה ללילה הפותח את הסופ״ש',
    to: '/thursday-parties',
  },
  {
    label: 'מסיבות שישי',
    description: 'רחבות הסופ״ש הכי מבוקשות',
    to: '/friday-parties',
  },
  {
    label: 'מסיבות סוף השבוע',
    description: 'כל האירועים של שישי ושבת במקום אחד',
    to: '/weekend-parties',
  },
];

const audienceLinks = [
  { title: 'מסיבות נוער', to: '/teen-parties', blurb: 'אירועים מפוקחים עם פירוט אבטחה וגיל כניסה.' },
  { title: 'מסיבות סטודנטים', to: '/student-parties', blurb: 'ליינים אקדמיים, הנחות ושאטלים מקמפוסים.' },
  { title: 'מסיבות חיילים', to: '/soldier-parties', blurb: 'הטבות חיילים, שעות מאוחרות ושמירת ציוד.' },
  { title: 'מסיבות 25+', to: '/25plus-parties', blurb: 'וייב בוגר, שירות מוקפד וקוקטיילים איכותיים.' },
];

const cityLinks = [
  { title: 'מסיבות תל אביב', to: '/tel-aviv-parties', blurb: 'טכנו בדרום, גגות במרכז והכל בעדכון יומיומי.' },
  { title: 'מסיבות חיפה', to: '/haifa-parties', blurb: 'חוף, כרמל ושוק תלפיות – כל הוייבים בדף אחד.' },
];

const styleLinks = [
  { title: 'טכנו', to: '/techno-parties', blurb: 'רייבי מחסן, חופים ומועדוני ענק.' },
  { title: 'האוס וגרוב', to: '/house-parties', blurb: 'גגות שקיעה, ברים אינטימיים וסאונד נעים.' },
  { title: 'מיינסטרים ופופ', to: '/mainstream-parties', blurb: 'להיטים, רגאטון וקריוקי עד הבוקר.' },
];

const clubLinks = [
  { title: 'ECHO Club', to: '/echo-club', blurb: 'רחבה דרומית עם טכנו, האוס והופעות לייב.' },
  { title: 'Jimmy Who', to: '/jimmy-who-club', blurb: 'בר-מועדון תל אביבי עם להיטים ורחבה שמחה.' },
];

const helperLinks = [
  { title: 'בלוג וטיפים', to: '/articles', blurb: 'מדריכים, ראיונות ותחקירי ליינים.' },
  { title: 'הצהרת מקדמי אירועים', to: '/promoter-disclaimer', blurb: 'שקיפות מלאה מול מפיקים ושותפים.' },
];

// --- SEO Metadata Configuration ---
export const metadata: Metadata = {
  title: 'חיפוש מסיבות בישראל | Parties 24/7',
  description: 'חפשו מסיבות לפי קהל יעד, עיר, סגנון מוזיקלי או מועדון ספציפי. עמוד הניווט המהיר שלנו מציג קישורים פנימיים מסודרים לכל העמודים החמים והמתעדכנים בזמן אמת.',
  alternates: {
    canonical: '/party-discovery',
  },
};

// --- Main Server Component ---
export default async function PartyDiscoveryPage() {
  // SSR Data Fetching:
  // Instead of useParties(), we fetch data directly on the server.
  // This ensures the HTML is populated BEFORE it reaches the browser (Great for SEO).
  let carousels: Carousel[] = [];
  try {
     // You need to expose the fetching logic from useParties as a standalone function
     // e.g., const data = await fetch('api/carousels', { cache: 'no-store' }).json();
     carousels = await getCarouselsData();
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
    <div className="container mx-auto px-4">
      {/* Header Section */}
      <div className="max-w-5xl mx-auto text-center mb-12 space-y-4">
        <p className="text-sm uppercase tracking-wide text-jungle-accent/80">ניווט ממוקד</p>
        <h1 className="text-4xl md:text-5xl font-display text-white">איך תרצו לבחור את המסיבה הבאה?</h1>
        <p className="text-lg text-jungle-text/80 leading-relaxed">
          ריכזנו את כל הדרכים לגלות מסיבות בעמוד אחד ברור: קהל יעד, ערים, סגנונות ומועדונים ספציפיים. השתמשו בתפריט הקפיצה כדי להגיע מיד לחלק הרלוונטי, או התחילו עם קיצורי הדרך לסוף השבוע הקרוב.
        </p>
        
        {/* Hash Links (Standard <a> is fine for same-page anchors) */}
        <div className="flex flex-wrap justify-center gap-3 text-sm text-jungle-accent">
          <a href="#audiences" className="hover:text-white">קהל יעד</a>
          <span className="text-jungle-text/40">•</span>
          <a href="#cities" className="hover:text-white">ערים</a>
          <span className="text-jungle-text/40">•</span>
          <a href="#styles" className="hover:text-white">סגנונות</a>
          <span className="text-jungle-text/40">•</span>
          <a href="#clubs" className="hover:text-white">מועדונים</a>
        </div>
      </div>

      {/* Quick Links Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-12">
        {quickLinks.map((item) => (
          <Link
            key={item.to}
            href={item.to}
            className="group rounded-2xl border border-wood-brown/50 bg-gradient-to-br from-jungle-surface/90 to-jungle-bg/80 p-5 text-right hover:border-jungle-accent/70 hover:-translate-y-1 transition"
          >
            <span className="text-sm font-semibold text-jungle-accent/80">קיצור דרך</span>
            <h2 className="text-2xl font-display text-white group-hover:text-jungle-accent transition-colors">{item.label}</h2>
            <p className="text-jungle-text/75 text-sm leading-relaxed">{item.description}</p>
            <span className="inline-flex items-center gap-2 text-xs text-jungle-accent mt-3">פתחו את הרשימה <span aria-hidden="true">&rarr;</span></span>
          </Link>
        ))}
      </div>

      {/* Audiences Section */}
      <section id="audiences" className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-display text-white">לפי קהל יעד</h2>
          <Link href="/קהל" className="text-jungle-accent hover:text-white text-sm">ראו את כל קהלי היעד</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {audienceLinks.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className="rounded-2xl border border-wood-brown/40 bg-jungle-surface/80 p-5 hover:border-jungle-accent/60 transition"
            >
              <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
              <p className="text-jungle-text/75 leading-relaxed">{item.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Cities Section */}
      <section id="cities" className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-display text-white">לפי עיר</h2>
          <Link href="/ערים" className="text-jungle-accent hover:text-white text-sm">כל הערים</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {cityLinks.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className="rounded-2xl border border-wood-brown/40 bg-jungle-surface/80 p-5 hover:border-jungle-accent/60 transition"
            >
              <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
              <p className="text-jungle-text/75 leading-relaxed">{item.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Styles Section */}
      <section id="styles" className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-display text-white">לפי סגנון</h2>
          <Link href="/זאנרים" className="text-jungle-accent hover:text-white text-sm">כל הסגנונות</Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {styleLinks.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className="rounded-2xl border border-wood-brown/40 bg-jungle-surface/80 p-5 hover:border-jungle-accent/60 transition"
            >
              <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
              <p className="text-jungle-text/75 leading-relaxed">{item.blurb}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Clubs Section */}
      <section id="clubs" className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-3xl font-display text-white">מועדונים</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {clubLinks.map((item) => (
            <Link
              key={item.to}
              href={item.to}
              className="rounded-2xl border border-wood-brown/40 bg-jungle-surface/80 p-5 hover:border-jungle-accent/60 transition"
            >
              <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
              <p className="text-jungle-text/75 leading-relaxed">{item.blurb}</p>
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
                className="rounded-2xl border border-wood-brown/40 bg-jungle-surface/80 p-5 hover:border-jungle-accent/60 transition"
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
              className="rounded-2xl border border-wood-brown/40 bg-jungle-surface/80 p-5 hover:border-jungle-accent/60 transition"
            >
              <h3 className="text-xl font-display text-white">{item.title}</h3>
              <p className="text-jungle-text/75 leading-relaxed">{item.blurb}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
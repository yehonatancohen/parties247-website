import Link from 'next/link';
import { Metadata } from 'next';
import BackButton from '@/components/BackButton';
import { createCarouselSlug } from '@/lib/carousels';
import { getCarousels } from '@/services/api';

export const metadata: Metadata = {
  title: 'עמודי קהל יעד | Parties 24/7',
  description: 'מצאו מסיבות לפי קהל – סטודנטים, חיילים, נוער או 24+. קרוסלות מסוננות מראש לכל קבוצת גיל.',
  alternates: { canonical: '/party-discovery/audience' },
};

const audienceDeepLinks = [
  {
    title: 'מסיבות סטודנטים בתל אביב',
    description: 'ליין אקדמי, דילים ושאטלים מקמפוסים.',
  },
  {
    title: 'מסיבות חיילים בסופ׳׳ש',
    description: 'הטבות שירות, שעות מאוחרות ושמירת ציוד.',
  },
  {
    title: 'מסיבות נוער מפוקחות',
    description: 'הורים בראש שקט עם גיל כניסה ושמירה.',
  },
  {
    title: 'מסיבות 24+ בוטיקיות',
    description: 'רחבות בוגרות עם קוקטיילים ודיוק בסאונד.',
  },
  {
    title: 'מסיבות למשפחות וחברים',
    description: 'אירועי צהריים, ימי הולדת ומסיבות קונספט.',
  },
  {
    title: 'מסיבות קהילה וגאווה',
    description: 'וייב פתוח ומרומם עם רשימות מוקדמות.',
  },
].map((item) => ({
  ...item,
  slug: createCarouselSlug(item.title),
}));

const audienceCarouselKeywords = [
  'student',
  'סטודנט',
  'campus',
  'חייל',
  'soldier',
  'נוער',
  'teen',
  '24',
  'מבוגרים',
  'משפחה',
  'משפחות',
  'קהילה',
  'גאווה',
];

export default async function PartyDiscoveryAudienceLanding() {
  const carousels = await getCarousels();
  const filteredCarousels = carousels
    .map((carousel) => ({ ...carousel, slug: createCarouselSlug(carousel.title) }))
    .filter((carousel) =>
      audienceCarouselKeywords.some((keyword) => carousel.slug.toLowerCase().includes(keyword)),
    )
    .sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-gradient-to-b from-jungle-deep via-[#0c1713] to-black text-white">
      <div className="container mx-auto px-4 pb-16 pt-14 md:pt-16">
        <div className="mb-6 flex justify-start">
          <BackButton fallbackHref="/party-discovery" label="חזרה" />
        </div>

        <div className="mx-auto mb-12 max-w-5xl space-y-4 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-jungle-text/80">
            עמודי משנה • לפי קהל יעד
          </p>
          <h1 className="text-4xl md:text-5xl font-display text-white leading-tight">
            מתאימים את המסיבה לקהל שלכם
          </h1>
          <p className="text-lg text-jungle-text/85 leading-relaxed">
            קיצורי דרך למסיבות שמותאמות לקהל ספציפי – סטודנטים, חיילים, נוער או בוגרים. כל קישור מגיע לקרוסלה עם מסיבות שמתעדכנות לפי הצורך.
          </p>
        </div>

        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {audienceDeepLinks.map((item) => (
              <Link
                key={item.slug}
                href={`/carousels/${item.slug}`}
                prefetch={false}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-jungle-surface/80 via-emerald-900/35 to-blue-900/30 p-5 text-right shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-jungle-glow"
              >
                <div className="absolute inset-0 opacity-0 transition group-hover:opacity-15 bg-[radial-gradient(circle_at_20%_15%,rgba(167,255,131,0.22),transparent_35%),radial-gradient(circle_at_75%_10%,rgba(255,255,255,0.16),transparent_32%)]" />
                <h2 className="relative text-2xl font-display text-white group-hover:text-jungle-lime transition-colors">
                  {item.title}
                </h2>
                <p className="relative text-sm text-jungle-text/85 leading-relaxed">{item.description}</p>
                <span className="relative inline-flex items-center gap-2 text-xs font-semibold text-jungle-lime mt-3">לעמוד הקרוסלה <span aria-hidden="true">↗</span></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-display text-white">קרוסלות לפי קהל יעד</h2>
            <p className="text-sm text-jungle-text/70">מיון אוטומטי לפי מילות מפתח של קהל.</p>
          </div>
          {filteredCarousels.length === 0 ? (
            <p className="text-jungle-text/80">לא נמצאו קרוסלות רלוונטיות כרגע.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCarousels.map((carousel) => (
                <Link
                  key={carousel.id}
                  href={`/carousels/${carousel.slug}`}
                  prefetch={false}
                  className="rounded-2xl border border-white/10 bg-gradient-to-r from-jungle-surface/80 via-indigo-900/40 to-emerald-900/25 p-5 shadow-md transition hover:-translate-y-1 hover:border-jungle-lime/60 hover:shadow-jungle-glow"
                >
                  <h3 className="text-2xl font-display text-white mb-2">{carousel.title}</h3>
                  <p className="text-jungle-text/75 leading-relaxed">קרוסלה שמסוננת מראש לפי קהל מועדף.</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Metadata } from 'next';
import BackButton from '@/components/BackButton';
import { createCarouselSlug } from '@/lib/carousels';
import { getCarousels } from '@/services/api';

export const metadata: Metadata = {
  title: 'עמודי יום ממוקדים | Parties 24/7',
  description:
    'מצאו מסיבות לפי יום ספציפי והעיר שמתאימה לכם – החל ממסיבות היום בתל אביב ועד סופ׳׳ש בצפון.',
  alternates: { canonical: '/party-discovery/day' },
};

const dayDeepLinks = [
  {
    title: 'מסיבות היום בתל אביב',
    description: 'קפיצה מהירה לכל מה שקורה הערב בעיר ללא הפסקה.',
  },
  {
    title: 'מסיבות חמישי בדרום תל אביב',
    description: 'רייבים וברים אנדרגראונד לפתיחת הסופ״ש.',
  },
  {
    title: 'מסיבות שישי בחיפה',
    description: 'חוף, כרמל ושוק תלפיות – כל מה שחם ביום שישי.',
  },
  {
    title: 'מסיבות שבת בכל הארץ',
    description: 'אפטרים, ברנצ׳ים ודאנס פלור לסגירת השבוע.',
  },
  {
    title: 'מסיבות סוף שבוע בתל אביב',
    description: 'אוספים שמתעדכנים בין חמישי לשבת בעיר.',
  },
  {
    title: 'מסיבות השבוע הקרוב',
    description: 'מה שנפתח בימים הקרובים עם כרטיסים זמינים.',
  },
].map((item) => ({
  ...item,
  slug: createCarouselSlug(item.title),
}));

const dayCarouselKeywords = [
  'today',
  'tonight',
  'היום',
  'הלילה',
  'thursday',
  'friday',
  'saturday',
  'weekend',
  'חמישי',
  'שישי',
  'שבת',
  'סופ',
  'תל-אביב',
  'tel-aviv',
  'חיפה',
];

export default async function PartyDiscoveryDayLanding() {
  const carousels = await getCarousels();
  const filteredCarousels = carousels
    .map((carousel) => ({ ...carousel, slug: createCarouselSlug(carousel.title) }))
    .filter((carousel) =>
      dayCarouselKeywords.some((keyword) => carousel.slug.toLowerCase().includes(keyword)),
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
            עמודי משנה • לפי יום
          </p>
          <h1 className="text-4xl md:text-5xl font-display text-white leading-tight">
            מסדרים את הסופ״ש לפי יום ועיר
          </h1>
          <p className="text-lg text-jungle-text/85 leading-relaxed">
            בחרו את היום המדויק ואת הוייב המתאים – ממסיבות היום בתל אביב ועד חמישי בדרום או שישי בחיפה. כל הקישורים מובילים לעמודים ממוקדים עם קרוסלות שמתעדכנות.
          </p>
        </div>

        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dayDeepLinks.map((item) => (
              <Link
                key={item.slug}
                href={`/carousels/${item.slug}`}
                prefetch={false}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-jungle-surface/80 via-emerald-900/30 to-slate-900/40 p-5 text-right shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-jungle-glow"
              >
                <div className="absolute inset-0 opacity-0 transition group-hover:opacity-15 bg-[radial-gradient(circle_at_20%_20%,rgba(167,255,131,0.25),transparent_35%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,0.18),transparent_32%)]" />
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
            <h2 className="text-3xl font-display text-white">קרוסלות שמתאימות ליום שבחרתם</h2>
            <p className="text-sm text-jungle-text/70">מבוסס על מילות מפתח של יום ועיר.</p>
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
                  className="rounded-2xl border border-white/10 bg-gradient-to-r from-jungle-surface/80 via-cyan-900/30 to-purple-900/30 p-5 shadow-md transition hover:-translate-y-1 hover:border-jungle-lime/60 hover:shadow-jungle-glow"
                >
                  <h3 className="text-2xl font-display text-white mb-2">{carousel.title}</h3>
                  <p className="text-jungle-text/75 leading-relaxed">קרוסלה שבנויה סביב תאריכים ספציפיים או ערים.</p>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

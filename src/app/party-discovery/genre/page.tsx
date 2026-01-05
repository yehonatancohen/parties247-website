import Link from 'next/link';
import { Metadata } from 'next';
import BackButton from '@/components/BackButton';
import PartyGrid from '@/components/PartyGrid';
import { Carousel, Party } from '@/data/types';
import { createCarouselSlug } from '@/lib/carousels';
import { getCarousels, getParties } from '@/services/api';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'עמודי ז׳אנר ממוקדים | Parties 24/7',
  description: 'מצאו מסיבות לפי סגנון – טכנו, האוס, טראנס או פופ – עם קרוסלות ייעודיות לכל וייב.',
  alternates: { canonical: '/party-discovery/genre' },
};

const genreDeepLinks = [
  {
    title: 'מסיבות טכנו בתל אביב',
    description: 'רייבים מחתרתיים ומועדוני ענק בעיר.',
    match: ['טכנו', 'techno'],
  },
  {
    title: 'מסיבות האוס וגרוב בגגות',
    description: 'שקיעות, קוקטיילים וסאונד נעים.',
    match: ['house', 'האוס', 'groove'],
  },
  {
    title: 'מסיבות טראנס בצפון',
    description: 'פסטיבלים ואפטרים עם נוף ירוק.',
    match: ['trance', 'טראנס', 'psy'],
  },
  {
    title: 'מסיבות מיינסטרים בתל אביב',
    description: 'להיטים, פופ ורגאטון עם רחבה שמחה.',
    match: ['mainstream', 'פופ', 'רגאטון', 'pop'],
  },
  {
    title: 'מסיבות אלקטרו ובאסים',
    description: 'דאנס אנרגטי עם ליינים כבדים.',
    match: ['bass', 'electro'],
  },
  {
    title: 'מסיבות דיסקו ופאנק',
    description: 'רחבות רטרו עם אורות ניאון וצ׳יל.',
    match: ['disco', 'פאנק', 'funk'],
  },
];

const genreCarouselKeywords = [
  'techno',
  'טכנו',
  'house',
  'האוס',
  'groove',
  'גרוב',
  'trance',
  'טראנס',
  'psy',
  'pop',
  'פופ',
  'mainstream',
  'disco',
  'funk',
  'bass',
  'electro',
];

export default async function PartyDiscoveryGenreLanding() {
  let carousels: Carousel[] = [];
  let parties: Party[] = [];

  try {
    [carousels, parties] = await Promise.all([getCarousels(), getParties()]);
  } catch (error) {
    console.error('Failed to fetch genre discovery data', error);
  }

  const enrichedCarousels = carousels
    .map((carousel) => ({ ...carousel, slug: createCarouselSlug(carousel.title) }))
    .sort((a, b) => a.order - b.order);

  const filteredCarousels = enrichedCarousels.filter((carousel) =>
    genreCarouselKeywords.some((keyword) => carousel.slug.toLowerCase().includes(keyword)),
  );

  const deepLinkCards = genreDeepLinks.map((item) => {
    const matchedCarousel = enrichedCarousels.find((carousel) =>
      item.match.some((keyword) => carousel.slug.toLowerCase().includes(keyword)),
    );

    return {
      ...item,
      slug: matchedCarousel ? matchedCarousel.slug : createCarouselSlug(item.title),
      resolvedTitle: matchedCarousel?.title ?? item.title,
    };
  });

  const partiesByCarousel = filteredCarousels.map((carousel) => ({
    carousel,
    parties: parties.filter((party) => carousel.partyIds?.includes(party.id)),
  }));

  return (
    <div className="min-h-screen bg-gradient-to-b from-jungle-deep via-[#0c1713] to-black text-white">
      <div className="container mx-auto px-4 pb-16 pt-14 md:pt-16">
        <div className="mb-6 flex justify-start">
          <BackButton fallbackHref="/party-discovery" label="חזרה" />
        </div>

        <div className="mx-auto mb-12 max-w-5xl space-y-4 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-jungle-text/80">
            עמודי משנה • לפי ז׳אנר
          </p>
          <h1 className="text-4xl md:text-5xl font-display text-white leading-tight">
            מוצאים את הז׳אנר שמדליק אתכם
          </h1>
          <p className="text-lg text-jungle-text/85 leading-relaxed">
            דילוג מהיר למסיבות לפי סגנון מוזיקלי – מטכנו מחסנים עד גגות האוס, טראנס בטבע או מיינסטרים בעיר. כל קישור מוביל לקרוסלות שמעדיפות את הוייב המבוקש.
          </p>
        </div>

        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deepLinkCards.map((item) => (
              <Link
                key={item.slug}
                href={`/carousels/${item.slug}`}
                prefetch={false}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-jungle-surface/80 via-purple-900/40 to-pink-900/35 p-5 text-right shadow-lg backdrop-blur transition hover:-translate-y-1 hover:shadow-jungle-glow"
              >
                <div className="absolute inset-0 opacity-0 transition group-hover:opacity-15 bg-[radial-gradient(circle_at_15%_20%,rgba(255,255,255,0.18),transparent_35%),radial-gradient(circle_at_80%_15%,rgba(0,191,165,0.12),transparent_32%)]" />
                <h2 className="relative text-2xl font-display text-white group-hover:text-jungle-lime transition-colors">
                  {item.resolvedTitle}
                </h2>
                <p className="relative text-sm text-jungle-text/85 leading-relaxed">{item.description}</p>
                <span className="relative inline-flex items-center gap-2 text-xs font-semibold text-jungle-lime mt-3">לעמוד הקרוסלה <span aria-hidden="true">↗</span></span>
              </Link>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-display text-white">קרוסלות לפי ז׳אנר</h2>
            <p className="text-sm text-jungle-text/70">מסוננות לפי מילות מפתח של סגנון.</p>
          </div>
          {partiesByCarousel.length === 0 ? (
            <p className="text-jungle-text/80">לא נמצאו קרוסלות רלוונטיות כרגע.</p>
          ) : (
            <div className="space-y-8">
              {partiesByCarousel.map(({ carousel, parties: carouselParties }) => (
                <div key={carousel.id} className="rounded-2xl border border-white/10 bg-jungle-surface/60 p-4 shadow-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="text-2xl font-display text-white">{carousel.title}</h3>
                      <p className="text-sm text-jungle-text/80">מוצג ישירות מהקרוסלה של הבקאנד.</p>
                    </div>
                    <Link
                      href={`/carousels/${carousel.slug}`}
                      prefetch={false}
                      className="text-sm font-semibold text-jungle-lime hover:text-white"
                    >
                      לכל הקרוסלה ↗
                    </Link>
                  </div>
                  <PartyGrid parties={carouselParties} showFilters={false} showSearch={false} />
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

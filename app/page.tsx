import Link from 'next/link';
import { fetchCarousels, fetchParties } from '../lib/api';
import PartyGrid from './ui/PartyGrid';
import { createCarouselSlug } from '../lib/carousels';
import { BASE_URL } from '../constants';

const HERO_IMAGE_URL =
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=70';

export const revalidate = 3600;

export default async function HomePage() {
  const [parties, carousels] = await Promise.all([fetchParties(), fetchCarousels()]);

  const upcomingParties = parties.filter((party) => new Date(party.date) >= new Date());

  const carouselsWithParties = carousels
    .map((carousel) => ({
      ...carousel,
      parties: upcomingParties.filter((party) => carousel.partyIds.includes(party.id)),
      viewAllLink: `/carousels/${createCarouselSlug(carousel.title)}`,
    }))
    .filter((carousel) => carousel.parties.length > 0);

  const websiteJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Parties 24/7',
    url: BASE_URL,
    potentialAction: {
      '@type': 'SearchAction',
      target: `${BASE_URL}/all-parties?query={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <div className="space-y-16">
      <section
        className="relative text-center mb-12 -mt-8 h-[60vh] sm:h-[50vh] flex items-center justify-center overflow-hidden bg-jungle-deep"
        style={{
          backgroundImage:
            'radial-gradient(circle at 30% 20%, rgba(47, 197, 165, 0.18), transparent 40%), radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.08), transparent 45%)',
        }}
      >
        <picture className="absolute inset-0">
          <source srcSet={`${HERO_IMAGE_URL}&fm=avif`} type="image/avif" />
          <img
            src={HERO_IMAGE_URL}
            alt="קהל חוגג במסיבה לילית"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1600}
            height={900}
            className="w-full h-full object-cover brightness-[0.6]"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-deep via-transparent to-jungle-deep/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/60" aria-hidden="true" />
        <div className="relative z-10 p-4">
          <h1
            className="font-display text-5xl sm:text-6xl md:text-7xl mb-4 text-white"
            style={{ textShadow: '3px 3px 8px rgba(0,0,0,0.7)' }}
          >
            איפה תהיה המסיבה הבאה שלך?
          </h1>
          <p className="text-lg sm:text-xl text-jungle-text">אתר המסיבות של ישראל</p>
        </div>
      </section>

      {carouselsWithParties.length === 0 ? (
        <div className="container mx-auto px-4 text-center py-8 text-jungle-text/80">
          אין כרגע קרוסלות להציג, חזרו בקרוב!
        </div>
      ) : (
        carouselsWithParties.map((carousel) => (
          <section key={carousel.id} className="container mx-auto px-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-display text-white">{carousel.title}</h2>
                <p className="text-jungle-text/70">אירועים נבחרים שמתעדכנים כל שעה.</p>
              </div>
              <Link href={carousel.viewAllLink} className="text-jungle-accent hover:text-white transition-colors">
                הצג הכל
              </Link>
            </div>
            <PartyGrid parties={carousel.parties} />
          </section>
        ))
      )}

      <div className="container mx-auto px-4">
        <section className="max-w-5xl mx-auto bg-jungle-surface/80 border border-wood-brown/50 rounded-2xl p-8 shadow-xl space-y-4">
          <h2 className="text-3xl font-display text-white">למה לבחור ב- Parties 24/7?</h2>
          <p className="text-jungle-text/85 leading-relaxed">
            אנחנו בונים את חוויית חיפוש המסיבות כך שתהיה מהירה ואמינה: כל דף קטגוריה מקבל כותרת H1 ברורה, 300–500 מילים של
            הסבר על הוייב, וקישורים פנימיים שמחברים בין ערים, ז׳אנרים וקהלים. הדפים מתעדכנים אוטומטית כך שתמיד תראו את האירועים
            הבאים – מטכנו בדרום תל אביב דרך האוס רגוע בחיפה ועד מסיבות סטודנטים או 25 פלוס.
          </p>
          <p className="text-jungle-text/80 leading-relaxed">
            כדי שהאתר ייטען מהר, אנחנו משתמשים ב-ISR לעדכון שעתי של אירועי הליבה וב-SSG לדפי התוכן. ככה מנועי החיפוש מקבלים
            מטא-דאטה מלא וטעינה עליונה בזמן שאתם מתכננים את הלילה הבא.
          </p>
        </section>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }} />
    </div>
  );
}

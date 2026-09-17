import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import PartyGrid from '@/components/PartyGrid';
import * as api from '@/services/api';
import { findHotNowCarousel } from '@/lib/carousels';

// Parties happening between now and the end of the coming Saturday (Israel weekend).
function getWeekendParties(parties: { date: string }[]) {
  const now = new Date();
  const endOfSaturday = new Date(now);
  endOfSaturday.setDate(now.getDate() + ((6 - now.getDay() + 7) % 7));
  endOfSaturday.setHours(23, 59, 59, 999);
  return parties
    .filter(p => {
      const d = new Date(p.date);
      return d >= now && d <= endOfSaturday;
    })
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

// Helper function to fetch and prepare data
// We keep this separate so we can reuse the logic concept, though we'll just call it directly here
async function getPageData() {
  try {
    const [parties, carousels] = await Promise.all([
      api.getParties(),
      api.getCarousels(),
    ]);

    // Filter out past parties on server
    const now = new Date();
    const futureParties = parties.filter(p => new Date(p.date) >= now);

    // Calculate Hot IDs on server
    const hotNowCarousel = findHotNowCarousel(carousels);

    return {
      parties: futureParties,
      hotPartyIds: hotNowCarousel?.partyIds || []
    };
  } catch (error) {
    console.error("Failed to fetch parties:", error);
    return null;
  }
}

export const metadata: Metadata = {
  title: 'כל המסיבות בישראל – כרטיסים ורשימה מתעדכנת',
  description: 'כל הליינים בישראל במקום אחד. מצאו כרטיסים למסיבות טכנו, האוס, מיינסטרים ועוד – עם סינון חכם לפי עיר, סגנון ותאריך.',
  alternates: { canonical: '/all-parties', languages: { 'he-IL': '/all-parties' } }
};

const faqItems = [
  {
    question: 'איפה אפשר לקנות כרטיסים למסיבות בישראל?',
    answer: 'ב-Parties 24/7 תמצאו קישורים ישירים לרכישת כרטיסים לכל המסיבות בישראל. לחצו על כל מסיבה ברשימה ותועברו לדף הקנייה הרשמי של המוכר.',
  },
  {
    question: 'כמה עולים כרטיסים למסיבות?',
    answer: 'המחירים משתנים לפי סוג האירוע: מסיבות מועדון מתחילות מ-60–120 ₪, אירועים עם אמנים בינלאומיים 150–250 ₪, ופסטיבלים יכולים להגיע ל-350 ₪ ומעלה. כרטיסי early bird זולים משמעותית ממחיר הדלת.',
  },
  {
    question: 'איך בוחרים מסיבה מתאימה?',
    answer: 'סננו לפי ז\'אנר (טכנו, האוס, מיינסטרים, טראנס), עיר, תאריך או קהל יעד. בכל כרטיס מסיבה תמצאו פרטי גיל כניסה, סגנון מוזיקה, מחיר ומיקום.',
  },
  {
    question: 'יש מסיבות חינם בישראל?',
    answer: 'כן, חלק מהאירועים כוללים כניסה חופשית – בעיקר בערבי ראשון לחודש, אירועי חסות ומסיבות רחוב. חפשו את התג "חינם" ברשימה.',
  },
  {
    question: 'האם אפשר לקנות כרטיסים בכניסה?',
    answer: 'ברוב המסיבות כן, אך מחיר הדלת גבוה יותר ממחיר המכירה המוקדמת. לאירועים מבוקשים, כרטיסים נגמרים לפני האירוע ולכן מומלץ לרכוש מראש.',
  },
];

const faqJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqItems.map((item) => ({
    '@type': 'Question',
    name: item.question,
    acceptedAnswer: { '@type': 'Answer', text: item.answer },
  })),
};

export default async function AllPartiesPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const data = await getPageData();
  const resolvedSearchParams = await searchParams;
  const query = typeof resolvedSearchParams.query === 'string' ? resolvedSearchParams.query : undefined;
  const ai_filter = typeof resolvedSearchParams.ai_filter === 'string' ? resolvedSearchParams.ai_filter : undefined;

  if (!data) return (
      <div className="font-apple mx-auto flex min-h-[60vh] max-w-[560px] flex-col items-center justify-center px-4 py-20 text-center text-ink">
        <h1 className="text-[28px] font-bold sm:text-[36px]">הרשימה לא נטענה כרגע</h1>
        <p className="mt-3 text-[17px] text-ink-2">שרת המסיבות מתעכב. נסו לרענן בעוד רגע, או התחילו מעמוד הבית.</p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- full reload is the retry */}
          <a href="/all-parties" className="rounded-full bg-action px-6 py-3 text-[17px] font-medium text-on-action transition-colors hover:bg-action-hover">לנסות שוב</a>
          <Link href="/" className="text-[17px] text-link hover:underline underline-offset-4">לעמוד הבית</Link>
        </div>
      </div>
    );

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="space-y-10">
        <section className="container mx-auto max-w-4xl px-4 pt-10 text-center">
          <h1 className="text-[34px] font-bold leading-tight text-ink sm:text-[48px] mb-4">כל המסיבות בישראל</h1>
          <p className="text-lg text-ink-2 leading-relaxed max-w-2xl mx-auto">
            הרשימה המלאה של מסיבות, רייבים ואירועי לילה בישראל – מתעדכנת בזמן אמת. סננו לפי עיר, ז'אנר מוזיקה, תאריך או קהל יעד, ורכשו כרטיסים מוקדמים ישירות מהמוכר הרשמי.
          </p>
          <div className="mt-5 flex flex-wrap gap-2 justify-center" dir="rtl">
            {[
              { label: 'ראש השנה 2026', href: '/rosh-hashana' },
              { label: 'סוכות 2026', href: '/sukkot' },
              { label: 'מסיבות בתל אביב', href: '/cities/tel-aviv' },
              { label: 'מסיבות באילת', href: '/cities/eilat' },
              { label: 'מסיבות 18 פלוס', href: '/parties/18-plus-parties-tel-aviv' },
              { label: 'טכנו וטראנס', href: '/genre/rave-parties' },
              { label: 'סוף שבוע', href: '/day/weekend' },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-hairline px-4 py-2 text-[14px] text-ink transition-colors hover:border-white/25 hover:bg-tile"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>

        <PartyGrid
          parties={data.parties}
          hotPartyIds={Array.from(new Set(data.hotPartyIds || []))}
          searchParams={resolvedSearchParams}
          title="כל המסיבות"
          description="מצאו את הבילוי הבא שלכם בג'ונגל העירוני"
          syncNavigation
          basePath="/all-parties"
          aiFilterIds={ai_filter ? ai_filter.split(',') : undefined}
          aiQuery={query}
          topSection={(() => {
            const weekendParties = getWeekendParties(data.parties) as typeof data.parties;
            if (weekendParties.length < 3) return null;
            return (
              <section className="mb-8">
                <h2 className="mb-4 text-right text-[21px] font-bold text-ink">הסופ״ש הקרוב</h2>
                <div className="flex gap-3 overflow-x-auto pb-2" dir="rtl">
                  {weekendParties.slice(0, 8).map(party => (
                    <Link
                      key={party.id}
                      href={`/event/${party.slug}`}
                      className="group w-24 sm:w-28 flex-shrink-0 text-center"
                    >
                      <div className="relative aspect-square w-full overflow-hidden rounded-[14px] bg-tile">
                        <Image
                          src={party.imageUrl}
                          alt={party.name}
                          fill
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                          sizes="112px"
                        />
                      </div>
                      <p className="mt-1.5 text-xs text-ink-2 leading-tight line-clamp-2">{party.name}</p>
                    </Link>
                  ))}
                </div>
              </section>
            );
          })()}
        />

        <section className="container mx-auto max-w-4xl px-4 pb-16">
          <div className="rounded-[28px] bg-tile p-6 sm:p-10">
            <h2 className="text-[24px] font-bold text-ink sm:text-[28px] mb-6">שאלות נפוצות על כרטיסים למסיבות</h2>
            <div className="space-y-6">
              {faqItems.map((item) => (
                <div key={item.question}>
                  <h3 className="text-[17px] font-semibold text-ink mb-2">{item.question}</h3>
                  <p className="text-ink-2 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
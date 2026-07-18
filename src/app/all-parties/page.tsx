import { Metadata } from 'next';
import PartyGrid from '@/components/PartyGrid';
import PartyCard from '@/components/PartyCard';
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
  title: 'כל המסיבות בישראל – כרטיסים ורשימה מתעדכנת | Parties 24/7',
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

  if (!data) return <div className="text-center text-white p-10">Error loading parties</div>;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="space-y-10">
        <section className="container mx-auto max-w-4xl px-4 pt-10 text-center">
          <h1 className="text-3xl md:text-4xl font-display text-white mb-4">כל המסיבות בישראל</h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            הרשימה המלאה של מסיבות, רייבים ואירועי לילה בישראל – מתעדכנת בזמן אמת. סננו לפי עיר, ז'אנר מוזיקה, תאריך או קהל יעד, ורכשו כרטיסים מוקדמים ישירות מהמוכר הרשמי.
          </p>
        </section>

        {(() => {
          const weekendParties = getWeekendParties(data.parties) as typeof data.parties;
          if (weekendParties.length < 3) return null;
          return (
            <section className="container mx-auto px-4">
              <h2 className="text-2xl font-display text-white mb-4 text-right">הסופ״ש הקרוב 🔥</h2>
              <div className="flex gap-4 overflow-x-auto pb-2" dir="rtl">
                {weekendParties.slice(0, 6).map(party => (
                  <div key={party.id} className="w-44 sm:w-56 flex-shrink-0">
                    <PartyCard party={party} />
                  </div>
                ))}
              </div>
            </section>
          );
        })()}

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
        />

        <section className="container mx-auto max-w-4xl px-4 pb-16">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
            <h2 className="text-2xl font-display text-white mb-6">שאלות נפוצות על כרטיסים למסיבות</h2>
            <div className="space-y-6">
              {faqItems.map((item) => (
                <div key={item.question}>
                  <h3 className="text-lg font-bold text-white mb-2">{item.question}</h3>
                  <p className="text-jungle-text/80 leading-relaxed">{item.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
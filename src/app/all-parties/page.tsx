import { Metadata } from 'next';
import PartyGrid from '@/components/PartyGrid';
import * as api from '@/services/api';
import { createCarouselSlug } from '@/lib/carousels';

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
    const hotNowCarousel = carousels.find((carousel) => {
      const slug = createCarouselSlug(carousel.title);
      return (
        slug === "hot-now" || slug === "חם-עכשיו" ||
        (slug.includes("hot") && slug.includes("now")) ||
        slug.includes("חם-עכשיו")
      );
    });

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
  title: 'כל המסיבות – כרטיסים ורשימה מתעדכנת | Parties 24/7',
  description: 'כל הליינים בישראל במקום אחד. מצאו כרטיסים למסיבות טכנו, האוס, מיינסטרים ועוד – עם סינון חכם לפי עיר, סגנון ותאריך.',
  alternates: { canonical: '/all-parties' }
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

export default async function AllPartiesPage({ searchParams }: { searchParams: { query?: string; ai_filter?: string } }) {
  const data = await getPageData();
  const { query, ai_filter } = await searchParams;

  if (!data) return <div className="text-center text-white p-10">Error loading parties</div>;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="space-y-10">
        <PartyGrid
          parties={data.parties}
          hotPartyIds={Array.from(new Set(data.hotPartyIds || []))}
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
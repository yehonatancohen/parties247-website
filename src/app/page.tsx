import { Metadata } from 'next';
import HomeLaunch, { HomeHoliday } from '@/components/home/HomeLaunch';
import { BASE_URL, BRAND_LOGO_URL, SOCIAL_LINKS } from '@/data/constants';
import { Party } from '@/data/types';
import { HOLIDAYS, filterPartiesInHolidayWindow, getHolidayWindow, isHolidayApproaching } from '@/lib/holidays';
import { isBuildPhase, withFetchBudget } from '@/lib/buildBudget';

const HOLIDAY_BANNER_LEAD_DAYS = 30;

// Computed server-side so hebcal never ships to the client bundle. Only the
// first holiday within the lead window shows.
function getApproachingHoliday() {
  const candidates = Object.values(HOLIDAYS)
    .filter((def) => isHolidayApproaching(def, HOLIDAY_BANNER_LEAD_DAYS))
    .map((def) => ({ def, window: getHolidayWindow(def) }))
    .sort((a, b) => (a.window.start < b.window.start ? -1 : 1));
  return candidates[0] ?? null;
}

// Homepage FAQ — visible below and mirrored into FAQPage JSON-LD. Answers the
// broad-intent questions ("is it free?", "which cities?", "how do I buy?") that
// the homepage should own for head terms and be citable on by AI search.
const HOME_FAQS: { question: string; answer: string }[] = [
  {
    question: 'האם השימוש ב-Parties 24/7 כרוך בתשלום?',
    answer: 'לא. גלישה, חיפוש וצפייה בכל המסיבות והאירועים באתר הם בחינם. את הכרטיסים עצמם קונים דרך אתר המכירה הרשמי של כל אירוע, בלחיצה אחת מדף האירוע.',
  },
  {
    question: 'מאילו ערים יש מסיבות באתר?',
    answer: 'עיקר האירועים בתל אביב והמרכז, ולצידם מסיבות ופסטיבלים בחיפה והצפון, באילת ובדרום, ובירושלים. לכל עיר מרכזית יש עמוד ייעודי שמתעדכן מדי יום.',
  },
  {
    question: 'איך קונים כרטיסים למסיבה?',
    answer: 'נכנסים לדף האירוע ולוחצים על כפתור רכישת הכרטיסים – מועברים ישירות לדף המכירה הרשמי. מומלץ לקנות מוקדם: כרטיס Early Bird זול משמעותית ממחיר הדלת, ולאירועים מבוקשים הכרטיסים אוזלים מראש.',
  },
  {
    question: 'מאיפה מגיעות המסיבות שמופיעות באתר?',
    answer: 'אנחנו עובדים ישירות מול מפיקים, יחסי ציבור ודי-ג\'ייז, ומרכזים ליינאפים נבחרים מכל הארץ – מיינסטרים, טכנו, טראנס, רייבים, פסטיבלים ואירועי חגים. הרשימה מתעדכנת כל יום.',
  },
  {
    question: 'כל כמה זמן מתעדכנות המסיבות?',
    answer: 'מדי יום. אירועים חדשים, מחירים ומצב כרטיסים מתרעננים באופן שוטף, כך שמה שמופיע בעמוד הבית ובעמודי הערים והסגנונות הוא תמונת מצב עדכנית.',
  },
];

async function getData() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://parties247-backend.onrender.com/';

  try {
    // In parallel: sequentially these two stacked to 100s+ on a slow backend.
    const [partiesRes, carouselsRes] = await withFetchBudget(
      Promise.all([
        fetch(`${apiUrl}/api/parties?upcoming=true`, { next: { revalidate: 60 } }),
        fetch(`${apiUrl}/api/carousels`, { next: { revalidate: 60 } }),
      ]),
      'home data'
    );

    // Check if both succeeded
    if (!partiesRes.ok || !carouselsRes.ok) {
      throw new Error(`Backend responded ${partiesRes.status}/${carouselsRes.status}`);
    }

    const [rawParties, carousels]: [Array<Party & { _id: string }>, unknown] = await withFetchBudget(
      Promise.all([partiesRes.json(), carouselsRes.json()]),
      'home data body'
    );
    const parties: Party[] = Array.isArray(rawParties)
      ? rawParties.map(p => ({ ...p, id: p._id })).filter((p) => !p.tags?.includes('promotion'))
      : [];

    return {
      parties,
      carousels: Array.isArray(carousels) ? carousels : []
    };

  } catch (error) {
    console.error("Data fetch error:", error);
    // Build: render empty rather than fail the deploy; ISR refills it.
    // Runtime: rethrow so a failed regeneration keeps the last good home page
    // cached instead of replacing it with an empty one.
    if (isBuildPhase()) return { parties: [] as Party[], carousels: [] };
    throw error;
  }
}

export const metadata: Metadata = {
  title: 'מסיבות היום, הלילה וסוף השבוע בישראל | Parties24/7',
  description: 'מחפשים מסיבה הלילה? כל המסיבות היום, מחר ובסוף השבוע – 18 פלוס, אלכוהול חופשי, רייבים, פסטיבלים ואירועי חגים בתל אביב, חיפה, אילת ובכל הארץ. כרטיסים מעודכנים כל יום.',
  alternates: {
    canonical: '/',
    languages: { 'he-IL': '/' },
  },
};

export default async function HomePage() {
  const data = await getData();

  const approaching = getApproachingHoliday();
  const holiday: HomeHoliday | null = approaching
    ? {
        slug: approaching.def.slug,
        hebrewName: approaching.def.hebrewName,
        year: approaching.window.year,
        parties: filterPartiesInHolidayWindow(data.parties, approaching.def),
      }
    : null;

  // JSON-LD for SEO
  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Parties 24/7",
    url: BASE_URL,
    inLanguage: "he-IL",
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/all-parties?query={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Parties 24/7",
    url: BASE_URL,
    logo: BRAND_LOGO_URL,
    description:
      "פלטפורמה לגילוי מסיבות, פסטיבלים ואירועי חיי לילה בישראל, עם ליינים וכרטיסים מעודכנים מדי יום.",
    sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.tiktok, SOCIAL_LINKS.whatsapp].filter(Boolean),
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: HOME_FAQS.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: { "@type": "Answer", text: f.answer },
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <HomeLaunch parties={data.parties} carousels={data.carousels} holiday={holiday} />

      {/* Server-rendered FAQ — indexable text matching the FAQPage JSON-LD above.
          <details> keeps every answer in the HTML while collapsed. */}
      <section className="font-apple bg-stage pb-24 text-ink sm:pb-32" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-[860px] px-4 sm:px-6">
          <h2 id="faq-heading" className="text-center text-[28px] font-bold leading-tight sm:text-[40px]">
            שאלות נפוצות
          </h2>
          <div className="mt-10 border-t border-hairline">
            {HOME_FAQS.map((f) => (
              <details key={f.question} className="group border-b border-hairline">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-semibold text-ink transition-colors hover:text-ink sm:text-[19px] [&::-webkit-details-marker]:hidden">
                  {f.question}
                  <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ink-3 transition-transform duration-300 ease-apple group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                    <path strokeLinecap="round" d="M12 5v14M5 12h14" />
                  </svg>
                </summary>
                <p className="-mt-1 pb-6 text-[17px] leading-[1.7] text-ink-2">{f.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
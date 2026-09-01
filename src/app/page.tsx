import { Metadata } from 'next';
import HomeClient from '../components/HomeClient';
import { BASE_URL, BRAND_LOGO_URL, SOCIAL_LINKS } from '@/data/constants';

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
    const partiesRes = await fetch(`${apiUrl}/api/parties?upcoming=true`, {
      next: { revalidate: 60 }
    });

    const carouselsRes = await fetch(`${apiUrl}/api/carousels`, {
      next: { revalidate: 60 }
    });

    // Check if both succeeded
    if (!partiesRes.ok || !carouselsRes.ok) {
      console.error("Failed to fetch one of the endpoints");
      return { parties: [], carousels: [] };
    }

    let rawParties = await partiesRes.json();
    const carousels = await carouselsRes.json();
    const parties = Array.isArray(rawParties)
      ? rawParties.map(p => ({ ...p, id: p._id })).filter((p: any) => !p.tags?.includes('promotion'))
      : [];

    return {
      parties: Array.isArray(parties) ? parties : [],
      carousels: Array.isArray(carousels) ? carousels : []
    };

  } catch (error) {
    console.error("Data fetch error:", error);
    return { parties: [], carousels: [] };
  }
}

export const metadata: Metadata = {
  title: 'מסיבות היום, הלילה וסוף השבוע בישראל | Parties24/7',
  description: 'כל המסיבות היום, מחר ובסוף השבוע – מסיבות 18 פלוס, אלכוהול חופשי, רייבים, פסטיבלים ואירועי חגים בתל אביב, חיפה, אילת ובכל הארץ. ליינים וכרטיסים מעודכנים כל יום. Parties24/7.',
  alternates: {
    canonical: '/',
    languages: { 'he-IL': '/' },
  },
};

// 3. The Page Component
export default async function HomePage() {
  const data = await getData();

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
      {/* Pass the server-fetched data to the client component */}
      <HomeClient
        initialParties={data.parties || []}
        initialCarousels={data.carousels || []}
      />

      {/* Server-rendered homepage FAQ — indexable text + matches the FAQPage
          JSON-LD above. Lives here (Server Component) so it ships independently
          of the in-progress redesign inside HomeClient. */}
      <div className="container mx-auto px-4 mt-16 mb-20">
        <section
          className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-8 text-jungle-text"
          dir="rtl"
        >
          <h2 className="text-3xl font-display text-white mb-6">שאלות נפוצות</h2>
          <div className="space-y-6">
            {HOME_FAQS.map((f) => (
              <div key={f.question}>
                <h3 className="text-lg font-bold text-white mb-2">{f.question}</h3>
                <p className="text-jungle-text/85 leading-relaxed">{f.answer}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
import { Metadata } from "next";
import PartyGrid from "@/components/PartyGrid";
import { findHotNowCarousel } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";
import BackButton from "@/components/BackButton";
import { BASE_URL } from "@/data/constants";

export const revalidate = 300;

// 1. Define the dictionary mapping English slugs to Hebrew names
const CITY_HEBREW_NAMES: Record<string, string> = {
  "tel-aviv": "תל אביב",
  "haifa": "חיפה",
  "jerusalem": "ירושלים",
  "rishon-lezion": "ראשון לציון",
  "petah-tikva": "פתח תקווה",
  "ashdod": "אשדוד",
  "netanya": "נתניה",
  "beer-sheva": "באר שבע",
  "holon": "חולון",
  "bnei-brak": "בני ברק",
  "ramat-gan": "רמת גן",
  "rehovot": "רחובות",
  "bat-yam": "בת ים",
  "herzliya": "הרצליה",
  "kfar-saba": "כפר סבא",
  "eilat": "אילת",
  "tiberias": "טבריה",
  // Add more cities as needed
};

const formatCityName = (rawCity: string) =>
  rawCity
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

// 2. Helper function to get Hebrew name with English fallback
const getCityDisplayName = (slug: string) => {
  const normalizedSlug = slug.toLowerCase().trim();
  // Return the Hebrew name if it exists, otherwise format the English slug
  return CITY_HEBREW_NAMES[normalizedSlug] || formatCityName(slug);
};

const CITY_BODIES: Record<string, string> = {
  'תל אביב': `תל אביב היא בירת הלילה של ישראל ואחת הערים התוססות ביותר בתחום המסיבות בעולם. סצנת הלילה מתרכזת בכמה אזורים מרכזיים: שכונת פלורנטין עם מועדוני האנדרגראונד, נמל תל אביב עם הפקות קיץ גדולות, והרחבות הפתוחות לאורך הצפון. בכל לילה שישי ושבת עשרות אירועים מתקיימים במקביל – מרייבים טכנו ועד מסיבות מיינסטרים.\n\nהמועדונים הבולטים של תל אביב פועלים עם ליינים בינלאומיים ומתמחים בז'אנרים שונים: טכנו, האוס, היפ הופ, מיינסטרים ועוד. כרטיסים מוקדמים נמכרים בדרך כלל שבוע עד שבועיים לפני האירוע ומחיר הדלת גבוה משמעותית מ-early bird. אם אתם מגיעים בתחבורה ציבורית, קווי הלילה של תל אביב פועלים בסופי שבוע ומחברים את עיקר האזורים.\n\nמחפשים מסיבות בתל אביב היום או הלילה? הרשימה למטה מתעדכנת מדי יום עם האירועים הקרובים בעיר – כך שתמיד תדעו מה קורה הערב, מחר ובסוף השבוע לפני שאתם קונים כרטיס.`,

  'אילת': `אילת היא עיר הבילוי של ישראל – יעד שמושך תיירים ומקומיים לאורך כל השנה. מועדוני הלילה של אילת פזורים לאורך החוף הדרומי, ומציעים מוזיקה חיה, דיג'ייז מובילים ואווירה ייחודית שאי אפשר למצוא בשום מקום אחר בארץ. בין אם אתם מגיעים לחופשת קיץ, לסוף שבוע מהיר או לאירוע מיוחד – תמיד יש מה לעשות בעיר שלא ישנה.\n\nהמועדונים הפופולריים ביותר באילת כוללים הפקות לילה על חוף הים, מסיבות בבריכה ואירועי DJ אינטרנציונליים. עונת השיא נמשכת מאפריל עד ספטמבר, אך גם בחורף ימצאו חובבי הבילוי אירועים איכותיים. כרטיסים לאירועי אילת נמכרים מראש ומומלץ לרכוש כמה ימים לפני האירוע כדי להבטיח כניסה.`,
};

const buildCityBody = (cityName: string) =>
  CITY_BODIES[cityName] ??
  `עמוד המסיבות של ${cityName} מרכז את כל האירועים, המועדונים וההפקות המתקיימים בעיר. תמצאו כאן ליינים מעודכנים, כרטיסים מוקדמים ופרטי כניסה לכל האירועים הקרובים – מסורות טכנו ורייבים ועד מסיבות מיינסטרים ואירועי חוף.\n\nסננו לפי תאריך, ז'אנר או קהל יעד כדי למצוא את המסיבה שמתאימה לכם. כרטיסים מוקדמים זולים משמעותית ממחיר הדלת – מומלץ לרכוש מראש לאירועים מבוקשים.`;

const buildCityFaqs = (cityName: string) => [
  {
    question: `איפה יש מסיבות ב${cityName}?`,
    answer: `ב-Parties 24/7 תמצאו את כל המסיבות, הרייבים והאירועים ב${cityName} מעודכנים בזמן אמת. הרשימה כוללת מועדוני לילה, אירועי חוץ וסוגי מוזיקה שונים – עם קישורים ישירים לרכישת כרטיסים.`,
  },
  {
    question: `איך קונים כרטיסים לאירועים ב${cityName}?`,
    answer: `לחצו על כל אירוע ברשימה ותועברו לדף הרכישה הרשמי. מומלץ לקנות מוקדם – כרטיסי early bird זולים משמעותית ממחיר הדלת, ולאירועים מבוקשים הכרטיסים נגמרים לפני האירוע.`,
  },
  {
    question: `מה גיל הכניסה למסיבות ב${cityName}?`,
    answer: `ברוב המסיבות גיל הכניסה הוא 18+. חלק מהאירועים פתוחים לגיל 21+ ומעלה. גיל הכניסה המדויק מצוין בכל כרטיס אירוע ברשימה.`,
  },
  {
    question: `מהן המסיבות הכי טובות ב${cityName}?`,
    answer: `המסיבות הפופולריות ביותר ב${cityName} מסומנות ברשימה. תוכלו לסנן לפי ז'אנר מוזיקה, תאריך ומחיר כדי למצוא את האירוע שמתאים לכם.`,
  },
];

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const { city } = await params;
  const decodedSlug = decodeURIComponent(city);
  const cityName = getCityDisplayName(decodedSlug);

  const CITY_META_DESCRIPTIONS: Record<string, string> = {
    'תל אביב': 'מסיבות בתל אביב היום, הלילה ובסוף השבוע: כל הרייבים, מועדוני הטכנו, האוס והמיינסטרים בעיר – ליינים מעודכנים יומית וכרטיסים מוקדמים במקום אחד. Parties 24/7.',
    'אילת': 'מסיבות ורייבים באילת – הכל במקום אחד. ליינים מעודכנים לחופשה, כרטיסים מוקדמים ומידע על מועדוני הלילה של אילת. Parties 24/7.',
  };

  const CITY_TITLES: Record<string, string> = {
    'תל אביב': 'מסיבות בתל אביב היום ובסוף השבוע',
  };

  return {
    title: CITY_TITLES[cityName] ?? `מסיבות ב${cityName}`,
    description: CITY_META_DESCRIPTIONS[cityName] ?? `כל המסיבות, הרייבים והאירועי לילה ב${cityName}. כרטיסים וליינים מעודכנים – Parties 24/7.`,
    alternates: {
      canonical: `/cities/${decodedSlug}`,
      languages: { 'he-IL': `/cities/${decodedSlug}` },
    },
  };
}

export default async function CityPage({ params }: { params: { city: string } }) {
  const { city } = await params;
  const citySlug = decodeURIComponent(city);
  
  // 3. Get the Hebrew name for display
  const displayCityName = getCityDisplayName(citySlug);

  const [parties, carousels] = await Promise.all([
    getParties(),
    getCarousels(),
  ]);

  // Keep the filtering logic based on the slug/English (assuming your DB data is in English or tags match the slug)
  const lowerCity = citySlug.replace(/-/g, " ").toLowerCase();
  
  const cityParties = parties.filter((party) =>
    party.location.name.toLowerCase().includes(lowerCity) ||
    party.region?.toLowerCase() === lowerCity ||
    party.tags.some((tag) => tag.toLowerCase().includes(lowerCity))
    || party.tags.some((tag) => tag.includes(displayCityName)) 
  );

  const hotNowCarousel = findHotNowCarousel(carousels);

  // Pass the Hebrew name to the body builder
  const body = buildCityBody(displayCityName);
  const faqItems = buildCityFaqs(displayCityName);

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': `מסיבות ב${displayCityName}`,
    'description': `כל המסיבות והאירועים ב${displayCityName}`,
    'numberOfItems': cityParties.length,
    'itemListElement': cityParties.slice(0, 20).map((p, i) => ({
      '@type': 'ListItem',
      'position': i + 1,
      'name': p.name,
      'url': `${BASE_URL}/event/${p.slug}`,
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'בית', 'item': { '@type': 'Thing', '@id': BASE_URL, 'name': 'בית' } },
      { '@type': 'ListItem', 'position': 2, 'name': 'מסיבות לפי עיר', 'item': { '@type': 'Thing', '@id': `${BASE_URL}/party-discovery`, 'name': 'מסיבות לפי עיר' } },
      { '@type': 'ListItem', 'position': 3, 'name': `מסיבות ב${displayCityName}` },
    ],
  };

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <div className="container mx-auto px-4 pt-6 md:pt-8">
        <BackButton fallbackHref="/party-discovery" label="חזרה לעמוד החיפוש" />
      </div>

      <PartyGrid
        parties={cityParties}
        hotPartyIds={Array.from(new Set(hotNowCarousel?.partyIds || []))}
        showFilters={false}
        showSearch={false}
        // Use the Hebrew name here
        title={`מסיבות ב${displayCityName}`}
        description="כל האירועים הקרובים בעיר שאתם אוהבים."
        basePath={`/cities/${citySlug}`}
        syncNavigation
      />

      <section className="container mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 text-jungle-text">
        <h2 className="text-2xl font-display text-white mb-4">למה שווה לצאת בעיר</h2>
        <div className="space-y-4 leading-relaxed text-base text-jungle-text/90">
          {body
            .split("\n\n")
            .filter(Boolean)
            .map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4 pb-16">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-display text-white mb-6">שאלות נפוצות על מסיבות ב{displayCityName}</h2>
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
  );
}
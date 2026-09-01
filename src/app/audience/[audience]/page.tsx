import { Metadata } from "next";
import { notFound } from "next/navigation";
import PartyGrid from "@/components/PartyGrid";
import ExploreMoreLinks from "@/components/ExploreMoreLinks";
import { findHotNowCarousel } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";
import { BASE_URL } from "@/data/constants";

export const revalidate = 300;

type AudienceKey = "teenage-parties" | "student-parties" | "soldier-parties" | "24plus-parties";

type Faq = { question: string; answer: string };

const audienceConfig: Record<
  AudienceKey,
  {
    title: string;
    description: string;
    filter: (party: any) => boolean;
    basePath: string;
    /** When false the page is `noindex, follow` — kept for navigation but not
     *  submitted to search, because it reliably resolves to zero events. */
    index: boolean;
    body: string;
    faqs: Faq[];
  }
> = {
  "teenage-parties": {
    title: "מסיבות נוער בישראל",
    description: "מסיבות נוער מפוקחות בישראל: אירועים לגילאי 16–18, שעות מוקדמות, אבטחה וללא אלכוהול. תאריכים וכרטיסים מתעדכנים.",
    filter: (party) => party.age === "נוער" || party.tags.some((tag: string) => tag.includes("נוער")),
    basePath: "/audience/teenage-parties",
    index: true,
    body:
      "מסיבות נוער הן קטגוריה נפרדת לחלוטין ממסיבות 18+: אירועים שמיועדים לגילאי 16–18 בערך, מתקיימים בשעות מוקדמות (לרוב 20:00–01:00), עם אבטחה מוגברת, ללא מכירת אלכוהול, ובפיקוח מפיקים שמתמחים בקהל הזה.\n\nמה מאפיין אירוע נוער טוב: מיקום סגור ומוסדר (לא שטח פתוח), כניסה עם תעודת תלמיד או תעודת זהות, בידוק בכניסה, ומוזיקת מיינסטרים ופופ שמתאימה לגיל. הרבה מהאירועים משתפים פעולה עם תנועות נוער, מועצות תלמידים או בתי ספר.\n\nלהורים: בכל אירוע ברשימה מופיעים גיל הכניסה המדויק, שעת הסיום, המיקום ופרטי המפיק. מומלץ לתאם הסעה חזרה מראש – רוב האירועים מסתיימים בשעה שבה אין תחבורה ציבורית.\n\nהרשימה למטה מתעדכנת עם כל אירועי הנוער המפוקחים הקרובים, כולל מחיר כרטיס וקישור לרכישה.",
    faqs: [
      {
        question: "מה גיל הכניסה למסיבות נוער?",
        answer: "רוב אירועי הנוער מיועדים לגילאי 16–18, עם כניסה בהצגת תעודת תלמיד או תעודת זהות. הגיל המדויק מצוין בכל כרטיס אירוע.",
      },
      {
        question: "יש אלכוהול במסיבות נוער?",
        answer: "לא. אירועי נוער מפוקחים אינם מוכרים אלכוהול, ויש בהם בידוק בכניסה ואבטחה מוגברת.",
      },
      {
        question: "באיזו שעה מסתיימות מסיבות נוער?",
        answer: "לרוב בין 00:00 ל-01:00. מומלץ לתאם הסעה חזרה מראש כי בשעות האלה כמעט אין תחבורה ציבורית.",
      },
    ],
  },
  "student-parties": {
    title: "מסיבות סטודנטים בישראל",
    description: "מסיבות סטודנטים: ליינים אקדמיים, מסיבות פתיחת סמסטר, הנחות באגודות ושאטלים מהקמפוסים. תאריכים וכרטיסים מתעדכנים.",
    filter: (party) => party.tags.some((tag: string) => tag.toLowerCase().includes("student") || tag.includes("סטוד")),
    basePath: "/audience/student-parties",
    index: false,
    body:
      "מסיבות סטודנטים בישראל מתרכזות סביב לוח השנה האקדמי: מסיבות פתיחת וסיום סמסטר, אירועי אגודות סטודנטים, ולילות קבועים במועדונים שמשתפים פעולה עם הקמפוסים. הכניסה לרוב מוזלת עם כרטיס סטודנט, ולעיתים יש שאטלים מאורגנים מהאוניברסיטאות והמכללות.\n\nהסגנון המוזיקלי הוא בדרך כלל מיינסטרים ופופ, לפעמים ערבי נושא (שנות ה-2000, לטיני, רטרו). האירועים הגדולים ביותר הם בתחילת אוקטובר ותחילת מרץ, סביב פתיחת הסמסטרים.\n\nהרשימה למטה מתעדכנת עם אירועי הסטודנטים הקרובים, כולל פרטי הנחות וקישור לרכישה.",
    faqs: [
      {
        question: "מתי יש הכי הרבה מסיבות סטודנטים?",
        answer: "סביב פתיחת הסמסטרים – תחילת אוקטובר ותחילת מרץ – וכן בסיום כל סמסטר. באותם שבועות יש ריכוז גבוה של אירועי אגודות ומסיבות קמפוס.",
      },
      {
        question: "צריך כרטיס סטודנט כדי להיכנס?",
        answer: "לרוב לא חובה לכניסה, אבל כרטיס סטודנט בתוקף מזכה בכניסה מוזלת או במחיר מבצע. פרטי ההנחה מופיעים בכל אירוע.",
      },
    ],
  },
  "soldier-parties": {
    title: "מסיבות לחיילים בישראל",
    description: "מסיבות והטבות לחיילים: כניסה חינם או מוזלת בהצגת תעודת חוגר, אירועי סופ״ש ושעות מותאמות. תאריכים וכרטיסים מתעדכנים.",
    filter: (party) => party.tags.some((tag: string) => tag.toLowerCase().includes("soldier") || tag.includes("חייל")),
    basePath: "/audience/soldier-parties",
    index: false,
    body:
      "חלק מהמועדונים וההפקות בישראל מציעים הטבות ייעודיות לחיילים בסדיר: כניסה חינם או מוזלת בהצגת תעודת חוגר, כניסה מהירה בתור נפרד, ולעיתים אירועים שמתוזמנים במיוחד לשבתות של יציאות. ההטבות בולטות במיוחד באזורי הדרום והמרכז, קרוב לבסיסי הדרכה גדולים.\n\nהרשימה למטה מתעדכנת עם אירועים שמציעים הטבת חיילים, כולל פרטי ההטבה המדויקים וקישור לרכישה.",
    faqs: [
      {
        question: "איך מקבלים הטבת חיילים בכניסה?",
        answer: "בהצגת תעודת חוגר בתוקף בכניסה. ההטבה משתנה בין אירועים – כניסה חינם, מחיר מוזל או כניסה מהירה – ומפורטת בכל כרטיס אירוע.",
      },
    ],
  },
  "24plus-parties": {
    title: "מסיבות 24+ בישראל",
    description: "מסיבות 24+ בישראל: קהל בוגר, מוזיקה מוקפדת, קוקטיילים ואווירה איכותית ללא קהל צעיר מדי. ליינים וכרטיסים מתעדכנים.",
    filter: (party) => party.age === "21+" || party.tags.some((tag: string) => tag.includes("24") || tag.includes("25")),
    basePath: "/audience/24plus-parties",
    index: true,
    body:
      "מסיבות 24+ נועדו למי שרוצה לצאת בלי למצוא את עצמו בין קהל של בני 18. גיל הכניסה המוגבר (24+, ולעיתים 21+ או 25+) מסנן את הקהל, וההפקות משקיעות יותר בסאונד, בעיצוב החלל, בבר ובשירות. הסגנון המוזיקלי נוטה להאוס, מלודי האוס, אפרו, דיסקו ולפעמים טכנו רך – מוזיקה לרקוד אליה בלי שהיא צועקת.\n\nאיפה מתקיימות: מועדוני בוטיק במרכז תל אביב, רחבות גג, ואירועי סאנסט בסופי שבוע. רבים מהם עם אפשרות להזמנת שולחן מראש לקבוצות. קוד הלבוש מוקפד יותר מהממוצע.\n\nמתי להגיע: אירועי גג וסאנסט מתחילים באחר הצהריים; אירועי מועדון סביב חצות ומגיעים לשיא אחרי 01:00. כרטיס מוקדם נע לרוב בין 80 ל-140 ₪.\n\nהרשימה למטה מתעדכנת עם כל אירועי ה-24+ הקרובים, כולל גיל כניסה מדויק, מיקום, מחיר עדכני וקישור לרכישה.",
    faqs: [
      {
        question: "מה גיל הכניסה למסיבות 24+?",
        answer: "בדרך כלל 24+, אך חלק מהאירועים מגדירים 21+ או 25+. הגיל המדויק מצוין בכל כרטיס אירוע ברשימה, ונאכף בכניסה בהצגת תעודה מזהה.",
      },
      {
        question: "איזו מוזיקה מתנגנת במסיבות 24+?",
        answer: "בעיקר האוס, מלודי האוס, אפרו האוס ודיסקו, ולעיתים טכנו רך – מוזיקה קצבית אך לא אגרסיבית, שמתאימה לרחבה ולשיחה כאחד.",
      },
      {
        question: "אפשר להזמין שולחן מראש?",
        answer: "בחלק מאירועי ה-24+, בעיקר במועדוני בוטיק ורחבות גג, יש אפשרות להזמנת שולחן לקבוצות. הפרטים מופיעים בעמוד הרכישה של האירוע.",
      },
    ],
  },
};

export async function generateMetadata({ params }: { params: { audience: AudienceKey } }): Promise<Metadata> {
  const { audience } = await params;
  const config = audienceConfig[audience];
  return {
    title: config ? config.title : "מסיבות לפי קהל יעד",
    description: config?.description,
    alternates: {
      canonical: `/audience/${audience}`,
      languages: { 'he-IL': `/audience/${audience}` },
    },
    ...(config && !config.index ? { robots: { index: false, follow: true } } : {}),
  };
}

export default async function AudiencePage({ params }: { params: { audience: AudienceKey } }) {
  const { audience } = await params;
  const config = audienceConfig[audience];
  if (!config) {
    notFound();
  }

  const [parties, carousels] = await Promise.all([
    getParties(),
    getCarousels(),
  ]);

  const hotNowCarousel = findHotNowCarousel(carousels);

  const filteredParties = parties.filter(config.filter);
  const hotPartyIds = new Set(hotNowCarousel?.partyIds || []);

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    'name': config.title,
    'description': config.description,
    'numberOfItems': filteredParties.length,
    'itemListElement': filteredParties.slice(0, 20).map((p, i) => ({
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
      { '@type': 'ListItem', 'position': 2, 'name': 'גילוי מסיבות', 'item': { '@type': 'Thing', '@id': `${BASE_URL}/party-discovery`, 'name': 'גילוי מסיבות' } },
      { '@type': 'ListItem', 'position': 3, 'name': config.title },
    ],
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: config.faqs.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: { '@type': 'Answer', text: item.answer },
    })),
  };

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <PartyGrid
        parties={filteredParties}
        hotPartyIds={Array.from(new Set(hotPartyIds || []))}
        showFilters={false}
        showSearch={false}
        title={config.title}
        description={config.description}
        basePath={config.basePath}
        syncNavigation
      />

      <section className="container mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 text-jungle-text">
        <h2 className="text-2xl font-display text-white mb-4">על העמוד הזה</h2>
        <div className="space-y-4 leading-relaxed text-base text-jungle-text/90">
          {config.body.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 25)}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="container mx-auto max-w-4xl px-4">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
          <h2 className="text-2xl font-display text-white mb-6">שאלות נפוצות</h2>
          <div className="space-y-6">
            {config.faqs.map((item) => (
              <div key={item.question}>
                <h3 className="text-lg font-bold text-white mb-2">{item.question}</h3>
                <p className="text-jungle-text/80 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <ExploreMoreLinks context={{ kind: "audience", slug: audience }} />
    </div>
  );
}

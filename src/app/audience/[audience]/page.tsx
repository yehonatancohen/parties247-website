import { Metadata } from "next";
import { notFound } from "next/navigation";
import PartyGrid from "@/components/PartyGrid";
import { createCarouselSlug } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";
import { BASE_URL } from "@/data/constants";

export const revalidate = 300;

type AudienceKey = "teenage-parties" | "student-parties" | "soldier-parties" | "24plus-parties";

const audienceConfig: Record<AudienceKey, { title: string; description: string; filter: (party: any) => boolean; basePath: string; body: string }> = {
  "teenage-parties": {
    title: "מסיבות נוער",
    description: "מסיבות נוער בתל אביב ובכל הארץ: אירועים מפוקחים, גיל כניסה עד 18, אבטחה מלאה ושירותי הסעה. כרטיסים ורשימת אירועים מתעדכנת.",
    filter: (party) => party.age === "נוער" || party.tags.some((tag: string) => tag.includes("נוער")),
    basePath: "/audience/teenage-parties",
    body:
      "מסיבות נוער בישראל מאורגנות בצורה שונה לחלוטין ממסיבות מבוגרים – וזה בכוונה. הכניסה מוגבלת לגילאי 16–18 בלבד, ויש אבטחה וצוות פיקוח בכל כניסה. המוסיקה בדרך כלל מיינסטרים, פופ ישראלי ורגאטון, והאירועים מסתיימים בשעות שמאפשרות לחזור הביתה בתחבורה ציבורית.\n\nמה חשוב לדעת לפני שמגיעים: גיל הכניסה נאכף בכניסה עם תעודת זהות. חלק מהאירועים דורשים הרשמה מראש ואישור הורים לגילאי 16. מומלץ לבדוק אם יש שאטל ממרכז העיר, כי חלק מהמסיבות נערכות מחוץ לאזורי תחבורה נגישה.\n\nאיך מוצאים מסיבות נוער: הדף הזה מרכז רק אירועים שמסומנים לקהל נוער. אפשר לסנן לפי עיר, תאריך וסוג מוזיקה. כל אירוע כולל מידע על גיל מינימום, מחיר כרטיס ושם המקום. אין הפתעות.",
  },
  "student-parties": {
    title: "מסיבות סטודנטים",
    description: "מסיבות סטודנטים בתל אביב ובכל הארץ: ליינים אקדמיים, הנחות מיוחדות עם תעודת סטודנט, שאטלים מהקמפוסים וכרטיסים מוקדמים בזול.",
    filter: (party) => party.tags.some((tag: string) => tag.toLowerCase().includes("student") || tag.includes("סטוד")),
    basePath: "/audience/student-parties",
    body:
      "מסיבות סטודנטים בישראל מציעות כמה יתרונות ברורים על פני מסיבות רגילות: כרטיסים בהנחה עם תעודת סטודנט, שאטלים מהאוניברסיטאות ומהמכללות, ולעיתים גם bar open בחלק מהזמן. האירועים מתחילים לרוב מוקדם יותר – כי מחר בבוקר יש שיעורים.\n\nאיזה סוגי אירועים תמצאו כאן: ערבי פתיחת שנה ומסיבות סגירת שנה בקמפוסים, לילות סטודנטים בקלאבים שמציעים הנחה עם תעודה, ואירועי בר-קלאב שמאורגנים על ידי ועדי הסטודנטים.\n\nטיפ לחיסכון: רוב הכרטיסים המוזלים לסטודנטים נמכרים בקדם-מכירה בלבד. כשאירוע מתפרסם – כדאי לנצל את מחיר ה-early bird לפני שהמכסה נגמרת. הדף מתעדכן בזמן אמת, אז אפשר לחזור ולבדוק לפני כל סוף שבוע.",
  },
  "soldier-parties": {
    title: "מסיבות חיילים",
    description: "מסיבות לחיילים בישראל: הטבות מיוחדות, כרטיסים בהנחה עם תז חייל, שעות גמישות ושמירת ציוד בכניסה. כל האירועים המתאימים במקום אחד.",
    filter: (party) => party.tags.some((tag: string) => tag.toLowerCase().includes("soldier") || tag.includes("חייל")),
    basePath: "/audience/soldier-parties",
    body:
      "מסיבות לחיילים בישראל לוקחות בחשבון את המציאות של השירות הצבאי: כניסה עם תז חייל במחיר מוזל, לוקר לנשק ולציוד בכניסה, ושעות שמתחשבות בחיילים שצריכים לחזור לבסיס בבוקר.\n\nמה לבדוק לפני שמגיעים: האם יש לוקר מאובטח לנשק – לא כל מקום מציע את זה, וחשוב לוודא מראש. האם ההנחה לחיילים חלה על כל הכרטיסים או רק על קדם-מכירה. חלק מהאירועים מחייבים הצגת תעודת חייל בכניסה ולא מקבלים הצהרה בעל-פה.\n\nאיך הדף הזה עוזר: כל האירועים שמסומנים כמתאימים לחיילים מרוכזים כאן. אפשר לסנן לפי עיר ותאריך, ולבדוק את פרטי ההנחה ישירות בדף האירוע. אם אתם מחפשים מסיבה שמחכה לכם אחרי שחרור – גם זה כאן.",
  },
  "24plus-parties": {
    title: "מסיבות 24+",
    description: "מסיבות 24 פלוס בתל אביב: רחבות עם קהל בוגר, קוקטיילים, שירות מוקפד ואמנים איכותיים. כניסה מגיל 24 ומעלה. אירועים ועדכונים שוטפים.",
    filter: (party) => party.age === "21+" || party.tags.some((tag: string) => tag.includes("24") || tag.includes("25")),
    basePath: "/audience/24plus-parties",
    body:
      "מסיבות 24 פלוס בתל אביב מציעות חוויה שונה מהמסיבות הרגילות: קהל בוגר יותר, רמת שירות גבוהה, וקוקטיילים במקום תורים ארוכים לבר. גיל הכניסה המינימלי – בדרך כלל 24 ומעלה – מסנן את הקהל ומשמר את הווייב הספציפי שמחפשים.\n\nמה מאפיין את האירועים האלו: ביגוד מרוכסן מקובל יותר. שולחנות ניתן לשריין מראש. המוסיקה נעה בין האוס מלודי, פופ בינלאומי ומיינסטרים – פחות תוכניות ״הפתעה״ ויותר ליין מוכר. המקומות קטנים יותר, ולכן הכרטיסים אוזלים מהר.\n\nאיך לא לפספס: רוב האירועים האלו מפרסמים כרטיסים שבועיים לפני האירוע ואוזלים תוך ימים. הדף הזה מתעדכן ברגע שיוצא אירוע חדש עם גיל כניסה 24 ומעלה, כך שתוכלו לרכוש כרטיסים לפני שהמקום מתמלא.",
  },
};

export async function generateMetadata({ params }: { params: { audience: AudienceKey } }): Promise<Metadata> {
  const { audience } = await params;
  const config = audienceConfig[audience];
  return {
    title: config ? `${config.title} | Parties 24/7` : "מסיבות לפי קהל יעד",
    description: config?.description,
    alternates: {
      canonical: `/audience/${audience}`,
      languages: { 'he-IL': `/audience/${audience}` },
    },
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

  const hotNowCarousel = carousels.find((carousel) => {
    const slug = createCarouselSlug(carousel.title);
    return slug === "hot-now" || slug.includes("hot") || slug.includes("חם-עכשיו");
  });

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

  return (
    <div className="space-y-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
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
        <h2 className="text-2xl font-display text-white mb-4">מה כולל העמוד הזה?</h2>
        <div className="space-y-4 leading-relaxed text-base text-jungle-text/90">
          {config.body.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 25)}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  );
}

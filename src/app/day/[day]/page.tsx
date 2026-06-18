import { Metadata } from "next";
import { notFound } from "next/navigation";
import PartyGrid from "@/components/PartyGrid";
import { createCarouselSlug } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";
import { BASE_URL } from "@/data/constants";

export const revalidate = 300;

type DayConfig = {
  title: string;
  description: string;
  basePath: string;
  filter: (party: any, todayString: string, todayWeekday: number) => boolean;
};

const getDayConfig = (todayString: string, todayWeekday: number): Record<string, DayConfig> => {
  const today = new Date();

  // Calculate next Thursday
  const thursday = new Date(today);
  thursday.setDate(today.getDate() + ((4 + 7 - today.getDay()) % 7));
  if (today.getDay() === 4) { thursday.setDate(today.getDate()); } // if today is thursday
  thursday.setHours(0, 0, 0, 0);
  const thursdayEnd = new Date(thursday);
  thursdayEnd.setHours(23, 59, 59, 999);

  // Calculate next Friday
  const friday = new Date(today);
  friday.setDate(today.getDate() + ((5 + 7 - today.getDay()) % 7));
  if (today.getDay() === 5) { friday.setDate(today.getDate()); } // if today is friday
  friday.setHours(0, 0, 0, 0);
  const fridayEnd = new Date(friday);
  fridayEnd.setHours(23, 59, 59, 999);

  // Calculate this/upcoming weekend (Thu-Sat)
  const weekendStart = new Date(thursday);
  const weekendEnd = new Date(thursday);
  weekendEnd.setDate(weekendEnd.getDate() + 2); // Thu -> Sat
  weekendEnd.setHours(23, 59, 59, 999);

  return {
    thursday: {
      title: "מסיבות ביום חמישי הקרוב",
      description: "רחבות לפתיחת הסופ\"ש עם מיטב הסטים והאמנים.",
      basePath: "/day/thursday",
      filter: (party) => {
        const pDate = new Date(party.date);
        return pDate >= thursday && pDate <= thursdayEnd;
      },
    },
    friday: {
      title: "מסיבות ביום שישי הקרוב",
      description: "ליין-אפים לחמישי בלילה ולחגיגות הסופ\"ש המרכזיות.",
      basePath: "/day/friday",
      filter: (party) => {
        const pDate = new Date(party.date);
        return pDate >= friday && pDate <= fridayEnd;
      },
    },
    weekend: {
      title: "מסיבות בסופ\"ש הקרוב",
      description: "חמישי, שישי ושבת – כל המסיבות של סוף השבוע במקום אחד.",
      basePath: "/day/weekend",
      filter: (party) => {
        const pDate = new Date(party.date);
        return pDate >= weekendStart && pDate <= weekendEnd;
      },
    },
    today: {
      title: "מסיבות היום",
      description: "מה שקורה ממש הערב – מסיבות נבחרות שמתעדכנות בזמן אמת.",
      basePath: "/day/today",
      filter: (party, normalizedToday) => {
        const partyDate = new Date(party.date);
        return partyDate.toISOString().slice(0, 10) === normalizedToday;
      },
    },
  };
};

const dayBodies: Record<string, string> = {
  thursday:
    "יום חמישי הוא ערב הפתיחה הרשמי של סוף השבוע הישראלי. הרחבות מתחממות כבר מ-23:00 ועד הזריחה, עם ליינאפים שמשלבים דיג'יים מקומיים ואמנים בינלאומיים. המסיבות הפופולריות ביותר בחמישי מרוכזות באזור פלורנטין ודרום תל אביב, אך גם חיפה ובאר שבע מציעות ערבי חמישי פעילים.\n\nמה כדאי לדעת לפני שיוצאים: רוב המסיבות בחמישי מתחילות לגבות כניסה החל מחצות, ולכן כדאי לרכוש כרטיס early bird מראש דרך האתר. תחבורה ציבורית פעילה רק עד סביב 01:00, אז מומלץ לתכנן הגעה ברכב פרטי או מוניות. בדקו גיל כניסה מראש – חלק מהמסיבות הן 18+ ודורשות תעודת זהות.",
  friday:
    "שישי בלילה הוא שיא שבוע חיי הלילה הישראלי. מהמסיבות בחוף הים של תל אביב ועד רייבי הטכנו של דרום העיר, יש כאן משהו לכל אחד. הרחבות מתמלאות בין 23:00 ל-01:00 ומשם לא מפסיקות עד שעות הבוקר המאוחרות.\n\nטיפים לשישי: מסיבות חוף לרוב מסתיימות סביב 04:00 בגלל הגבלות רעש, בעוד שמסיבות במועדונים סגורים ממשיכות עד 08:00-10:00. אם מתכננים ללכת ליותר ממקום אחד, בדקו מרחק ותחבורה מראש. early bird זול בדרך כלל ב-30-50% לעומת מחיר הדלת, ולכן שווה לרכוש כרטיס מוקדם. ימי שישי הם הערבים הפופולריים ביותר ולכן הכרטיסים אוזלים מהר.",
  weekend:
    "סוף שבוע בישראל מתחיל בחמישי ומסתיים בשבת בבוקר, עם מגוון אירועים שמתאים לכל טעם ותקציב. בשישי תמצאו את הריכוז הגדול ביותר של מסיבות בתל אביב, חיפה ובמרחב הפתוח. מסיבות שבת מאופיינות לרוב ב-afterparty או ב-day parties שמתחילות מהצהריים.\n\nאיך לתכנן סוף שבוע מושלם: כנסו לעמוד כל המסיבות, סננו לפי ז'אנר, עיר ותאריך, ורכשו כרטיסים מוקדם. שימו לב שחלק מהמסיבות הן ביום חמישי בלבד ואחרות מתפרסות על פני כל הסוף שבוע. מסיבות חוץ כפופות להיתרי רעש ולמזג האוויר, ולכן בדקו עדכונים בעמוד האירוע לפני שיוצאים מהבית.",
  today:
    "כל המסיבות שמתקיימות הערב בישראל – מסונכרן לתאריך של היום. הרשימה מתעדכנת בזמן אמת ומציגה רק אירועים פעילים עם כרטיסים זמינים לרכישה.\n\nמחפשים משהו ספונטני? בדקו אם נותרו כרטיסים בדלת – לחלק מהמסיבות אפשר להגיע גם בלי הזמנה מראש, אך המחיר גבוה יותר. סמנו את 'חם עכשיו' לראות את האירועים הכי מבוקשים הערב.",
};

export async function generateMetadata({ params }: { params: { day: string } }): Promise<Metadata> {
  const { day } = await params;
  const today = new Date();
  const dayConfigs = getDayConfig(today.toISOString().slice(0, 10), today.getDay());
  const config = dayConfigs[day];
  if (!config) {
    return { title: "מסיבות קרובות | Parties 24/7" };
  }

  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: `/day/${day}`,
      languages: { 'he-IL': `/day/${day}` },
    },
  };
}

export default async function DayPartiesPage({ params }: { params: { day: string } }) {
  const { day } = await params;
  const today = new Date();
  const normalizedToday = today.toISOString().slice(0, 10);
  const dayConfigs = getDayConfig(normalizedToday, today.getDay());
  const config = dayConfigs[day];
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

  const hotPartyIds = new Set(hotNowCarousel?.partyIds || []);
  const filteredParties = parties.filter((party) => config.filter(party, normalizedToday, today.getDay()));

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
      { '@type': 'ListItem', 'position': 2, 'name': 'כל המסיבות', 'item': { '@type': 'Thing', '@id': `${BASE_URL}/all-parties`, 'name': 'כל המסיבות' } },
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
        <h2 className="text-2xl font-display text-white mb-4">מה מחכה לכם ביום הזה?</h2>
        <div className="space-y-4 leading-relaxed text-base text-jungle-text/90">
          {(dayBodies[day] || "").split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 20)}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  );
}

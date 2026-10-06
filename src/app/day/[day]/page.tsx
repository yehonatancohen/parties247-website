import { Metadata } from "next";
import { notFound } from "next/navigation";
import PartyGrid from "@/components/PartyGrid";
import { findHotNowCarousel } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";
import { BASE_URL } from "@/data/constants";
import { getIsraelDateString } from "@/lib/dates";
import { DayKey, dayRange, isDayKey, isOnDayRange } from "@/lib/dayPages";

export const revalidate = 300;

type DayConfig = {
  title: string;
  description: string;
  basePath: string;
};

const dayConfigs: Record<DayKey, DayConfig> = {
  thursday: {
    title: "מסיבות ביום חמישי הקרוב",
    description: "רחבות לפתיחת הסופ\"ש עם מיטב הסטים והאמנים.",
    basePath: "/day/thursday",
  },
  friday: {
    title: "מסיבות ביום שישי הקרוב",
    description: "ליין-אפים לחמישי בלילה ולחגיגות הסופ\"ש המרכזיות.",
    basePath: "/day/friday",
  },
  weekend: {
    title: "מסיבות בסופ\"ש הקרוב",
    description: "חמישי, שישי ושבת – כל המסיבות של סוף השבוע במקום אחד.",
    basePath: "/day/weekend",
  },
  today: {
    title: "מסיבות היום",
    description: "מה שקורה ממש הערב – מסיבות נבחרות שמתעדכנות בזמן אמת.",
    basePath: "/day/today",
  },
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
  if (!isDayKey(day)) {
    return { title: "מסיבות קרובות" };
  }
  const config = dayConfigs[day];

  return {
    title: config.title,
    description: config.description,
    alternates: {
      canonical: `/day/${day}`,
      languages: { 'he-IL': `/day/${day}` },
    },
  };
}

export default async function DayPartiesPage({
  params,
  searchParams,
}: {
  params: { day: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { day } = await params;
  const resolvedSearchParams = await searchParams;
  if (!isDayKey(day)) {
    notFound();
  }
  const config = dayConfigs[day];
  // Israel's calendar date, not the server's UTC one (see lib/dayPages.ts).
  const range = dayRange(day, getIsraelDateString(new Date()));

  const pageParam = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

  const [parties, carousels] = await Promise.all([
    getParties(),
    getCarousels(),
  ]);

  const hotNowCarousel = findHotNowCarousel(carousels);

  const hotPartyIds = new Set(hotNowCarousel?.partyIds || []);
  const filteredParties = parties.filter((party) => isOnDayRange(party.date, range));

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
        currentPage={currentPage}
        paginationMode="query"
        syncNavigation
      />

      <section className="mx-4 max-w-[860px] rounded-[28px] bg-tile p-6 text-ink-2 sm:p-10 md:mx-auto">
        <h2 className="text-[24px] font-bold text-ink sm:text-[28px] mb-4">מה מחכה לכם ביום הזה?</h2>
        <div className="space-y-4 leading-relaxed text-base text-ink-2">
          {(dayBodies[day] || "").split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 20)}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  );
}

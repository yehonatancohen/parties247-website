import { notFound } from "next/navigation";
import { buildSegmentsFromCity, buildSegmentsFromCityIntent, buildSegmentsFromIntent } from "./routes";
import type { RouteKind } from "./routes";
import { appendPageToSegments, segmentsToPath } from "./url";
import type { City, FaqEntry, Intent } from "@/data/models";
import { paginateEvents } from "./events";

export interface BreadcrumbItem {
  name: string;
  href: string;
}

export interface PageCopy {
  metaTitle: string;
  metaDescription: string;
  h1: string;
  intro: string;
  canonical: string;
  breadcrumbs: BreadcrumbItem[];
  faq: FaqEntry[];
  intent?: Intent;
  city?: City;
}

const SITE_ORIGIN = "https://www.parties247.co.il";

const formatNeighborhoods = (city: City) => city.neighborhoods.slice(0, 3).join(", ");
const formatLandmarks = (city: City) => city.landmarks.slice(0, 2).join(" ו");

const buildCityIntentIntro = (city: City, intent: Intent): string => {
  const neighborhoods = formatNeighborhoods(city);
  const landmarks = formatLandmarks(city);
  const base = `${intent.name} ב${city.name} מתרחשות סביב ${neighborhoods} ומושכות קהל שמחפש חוויה ממוקדת.`;
  const audienceLine =
    intent.kind === "audience"
      ? `אנחנו מרכזים רק את האירועים שמפוקחים ומתאימים לקהל היעד, עם מידע על אבטחה, הסעות ושעת כניסה מדויקת.`
      : intent.kind === "genre"
        ? `הדף מסנן ליינים לפי תתי ז'אנרים ומדגיש שיתופי פעולה של מפיקים מובילים בעיר.`
        : `הלוח מציג לוח זמנים מלא לפי ימים ושעות כדי שתדעו בדיוק מה קורה ומתי.`;
  const venueLine = `תוכלו למצוא כאן קישורים לרכישת כרטיסים, מפות הגעה ומידע על חניונים קרובים ליד ${landmarks}.`;
  const safetyLine = `כל אירוע נבדק ידנית כדי לוודא שיש צוות אבטחה, נקודות מים ומדיניות ברורה לגבי גיל, כך שתוכלו לצאת בראש שקט.`;
  const planningLine = `אנו מעדכנים את הרשימה מדי יום עם אורחים מיוחדים, הטבות פריסייל וטיפים להתארגנות חזרה הביתה.`;
  return [base, audienceLine, venueLine, safetyLine, planningLine].join(" ");
};

const buildTimeIntentTitle = (city: City, intent: Intent) => `מסיבות ב${city.name} – ${intent.name}`;

const buildAudienceOrGenreTitle = (city: City, intent: Intent) => `${intent.name} ב${city.name}`;

const buildCityIntentH1 = (city: City, intent: Intent) => {
  if (intent.kind === "time") {
    return `${buildTimeIntentTitle(city, intent)}`;
  }
  return `${buildAudienceOrGenreTitle(city, intent)}`;
};

const buildCityIntentMetaTitle = (city: City, intent: Intent) => {
  const base = intent.kind === "time" ? buildTimeIntentTitle(city, intent) : buildAudienceOrGenreTitle(city, intent);
  const candidate = `${base} - Parties 24/7`;
  return candidate.length <= 60 ? candidate : `${base.slice(0, 56)}…`;
};

const buildCityIntentDescription = (city: City, intent: Intent) => {
  const core = `${intent.name} ב${city.name} עם פירוט מלא על ליינים, קודי הנחה וקישורים למפת הגעה.`;
  const note = intent.kind === "time" ? "עדכון יומי ללוח המסיבות הקרובות." : "פרטים על קהל היעד, אמנים אורחים ואבטחה.";
  return `${core} ${note}`.slice(0, 158);
};

const buildCityBreadcrumbs = (city: City, intent?: Intent): BreadcrumbItem[] => {
  const crumbs: BreadcrumbItem[] = [
    { name: "בית", href: "/" },
    { name: city.name, href: segmentsToPath(buildSegmentsFromCity(city)) }
  ];
  if (intent) {
    const label = intent.kind === "time" ? intent.name : intent.name;
    crumbs.push({
      name: label,
      href: segmentsToPath(buildSegmentsFromCityIntent(city, intent))
    });
  }
  return crumbs;
};

const buildIntentBreadcrumbs = (intent: Intent): BreadcrumbItem[] => [
  { name: "בית", href: "/" },
  { name: intent.name, href: segmentsToPath(buildSegmentsFromIntent(intent)) }
];

export const buildPageCopy = (route: RouteKind): PageCopy => {
  switch (route.type) {
    case "home": {
      return {
        metaTitle: "מסיבות ואירועים בישראל - Parties 24/7",
        metaDescription:
          "המסיבות הכי חמות בישראל בערים המובילות. בחרו עיר, ז'אנר או קהל יעד וגלה אירועים עם קישורים להזמנת כרטיסים.",
        h1: "Parties 24/7 – הבית למסיבות בישראל",
        intro:
          "ברוכים הבאים ללוח המסיבות של Parties 24/7. ריכזנו בדף הבית את הקטגוריות הכי מבוקשות – ערים, ז'אנרים, קהלי יעד וזמנים ספציפיים – כדי שתמצאו את האירוע שלכם בכמה קליקים. כל אירוע נבדק ידנית ומציג זמני התחלה, מפיקים, מפות הגעה וקישורים לרכישת כרטיסים. התוכן מתעדכן מדי יום כדי שתמיד תדעו מה קורה הלילה, מחר ובחגים.",
        canonical: `${SITE_ORIGIN}/`,
        breadcrumbs: [{ name: "בית", href: "/" }],
        faq: []
      };
    }
    case "city": {
      const { city, page } = route;
      const baseSegments = appendPageToSegments(buildSegmentsFromCity(city), page);
      return {
        metaTitle: city.metaTitle,
        metaDescription: city.metaDescription,
        h1: `מסיבות ב${city.name}`,
        intro: city.intro,
        canonical: `${SITE_ORIGIN}${segmentsToPath(baseSegments)}`,
        breadcrumbs: buildCityBreadcrumbs(city),
        faq: city.faq,
        city
      };
    }
    case "intent": {
      const { intent, page } = route;
      const baseSegments = appendPageToSegments(buildSegmentsFromIntent(intent), page);
      return {
        metaTitle: intent.metaTitle,
        metaDescription: intent.metaDescription,
        h1: intent.name,
        intro: intent.intro,
        canonical: `${SITE_ORIGIN}${segmentsToPath(baseSegments)}`,
        breadcrumbs: buildIntentBreadcrumbs(intent),
        faq: intent.faq,
        intent
      };
    }
    case "city-intent": {
      const { city, intent, page } = route;
      const baseSegments = appendPageToSegments(buildSegmentsFromCityIntent(city, intent), page);
      const intro = buildCityIntentIntro(city, intent);
      const faq: FaqEntry[] = [...intent.faq.slice(0, 2), ...city.faq.slice(0, 1)];
      return {
        metaTitle: buildCityIntentMetaTitle(city, intent),
        metaDescription: buildCityIntentDescription(city, intent),
        h1: buildCityIntentH1(city, intent),
        intro,
        canonical: `${SITE_ORIGIN}${segmentsToPath(baseSegments)}`,
        breadcrumbs: buildCityBreadcrumbs(city, intent),
        faq,
        city,
        intent
      };
    }
    case "articles": {
      return {
        metaTitle: "כתבות ומדריכים למסיבות",
        metaDescription:
          "טיפים למפיקים ולבליינים: מדריכים על מועדונים, בטיחות נוער וחוויות מיוחדות בכל הארץ.",
        h1: "כתבות מסיבות",
        intro:
          "האסופה המערכתית של Parties 24/7 מציגה מדריכים מקצועיים לחיי לילה בישראל. נסקור מועדונים, מפיקים, נושאי בטיחות לנוער והשראות לחופשות מסיבות. כל כתבה מקושרת לדפי הקטגוריות וללוח האירועים הרלוונטי.",
        canonical: `${SITE_ORIGIN}/כתבות`,
        breadcrumbs: [
          { name: "בית", href: "/" },
          { name: "כתבות", href: "/כתבות" }
        ],
        faq: []
      };
    }
    case "article": {
      const { article } = route;
      return {
        metaTitle: `${article.title} - Parties 24/7`,
        metaDescription: article.excerpt.slice(0, 155),
        h1: article.title,
        intro: article.intro,
        canonical: `${SITE_ORIGIN}/כתבות/${article.slug}`,
        breadcrumbs: [
          { name: "בית", href: "/" },
          { name: "כתבות", href: "/כתבות" },
          { name: article.title, href: `/כתבות/${article.slug}` }
        ],
        faq: article.faq
      };
    }
    default:
      return notFound();
  }
};

export const getPaginationInfo = (route: RouteKind) => {
  switch (route.type) {
    case "city":
      return paginateEvents({ city: route.city }, route.page);
    case "intent":
      return paginateEvents({ intent: route.intent }, route.page);
    case "city-intent":
      return paginateEvents({ city: route.city, intent: route.intent }, route.page);
    default:
      return { events: [], total: 0, totalPages: 1 };
  }
};

export const buildBreadcrumbSchema = (breadcrumbs: BreadcrumbItem[]) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: crumb.name,
    item: `${SITE_ORIGIN}${crumb.href === "/" ? "" : crumb.href}`
  }))
});

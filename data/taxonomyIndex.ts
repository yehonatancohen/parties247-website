import { DEFAULT_TAXONOMY_IMAGE } from '../constants';
import { audiences, cities, genres, holidayIntents, TaxonomyFAQ, timeIntents } from './taxonomy';

export interface TaxonomyIndexItem {
  label: string;
  description: string;
  path: string;
  imageUrl?: string;
}

export interface TaxonomyIndexSection {
  title: string;
  description?: string;
  items: TaxonomyIndexItem[];
}

export interface TaxonomyIndexConfig {
  path: string;
  title: string;
  description: string;
  intro: string;
  heroImage: string;
  breadcrumbs: { label: string; path?: string }[];
  sections: TaxonomyIndexSection[];
  faq?: TaxonomyFAQ[];
}

const withFallbackImage = (imageUrl?: string) => imageUrl || DEFAULT_TAXONOMY_IMAGE;

export const taxonomyIndexConfigs: TaxonomyIndexConfig[] = [
  {
    path: '/ערים',
    title: 'מסיבות לפי ערים בישראל',
    description:
      'גלו את המסיבות החמות ביותר בכל עיר בישראל – מתל אביב והמרכז ועד הצפון והדרום.',
    intro:
      'בחרו את העיר שמעניינת אתכם וקבלו רשימה חיה של כל הליינים, ההפקות והאירועים הקרובים. לכל עיר ריכזנו טיפים לשכונות הכי מסקרנות, קיצורי דרך לרכישת כרטיסים ועדכונים שוטפים על הליינים החדשים בעיר.',
    heroImage: 'https://images.unsplash.com/photo-1505765050516-f72dcac9c60e?auto=format&fit=crop&w=1600&q=80',
    breadcrumbs: [
      { label: 'בית', path: '/' },
      { label: 'ערים' },
    ],
    sections: [
      {
        title: 'ערים מובילות במסיבות וחיי לילה',
        description: 'ערים שמציגות חיי לילה עשירים עם מגוון מועדונים, ברים וליינים קבועים.',
        items: cities.map((city) => ({
          label: city.label,
          description: city.description,
          path: city.path,
          imageUrl: withFallbackImage(city.ogImage),
        })),
      },
    ],
    faq: [
      {
        question: 'איך לבחור את העיר המתאימה לבילוי הבא?',
        answer:
          'תחשבו על סגנון המוזיקה שאתם אוהבים ועל סוג החוויה – תל אביב מתאימה לרייבים עמוקים, חיפה לסצנה יצירתית ומעורבת, ואילת למסיבות נופשים וחוויות חוף. כל עמוד עיר מציג את ההצעות הייחודיות שלה.',
      },
      {
        question: 'האם הערים מתעדכנות בזמן אמת?',
        answer:
          'כן. ברגע שמתווספים אירועים חדשים מהשותפים שלנו הם מופיעים בדפי הערים, כולל כרטיסים והנחיות הגעה. מומלץ לחזור לפני סוף השבוע כדי לתפוס את ההשקות והליינים החדשים.',
      },
    ],
  },
  {
    path: '/זאנרים',
    title: 'מסיבות לפי ז׳אנר מוזיקלי',
    description:
      'טכנו, היפ הופ, EDM, טראנס ועוד – כך תבחרו את המסיבה המושלמת לפי הוייב המוזיקלי שלכם.',
    intro:
      'המסיבה הנכונה מתחילה במוזיקה נכונה. אספנו עבורכם את הז׳אנרים המרכזיים בישראל עם הסבר קצר על כל אחד והמסיבות המובילות סביבו. כנסו, בחרו את הסאונד שאתם מחפשים, ותגיעו ישירות לרשימת האירועים הקרובים.',
    heroImage: 'https://images.unsplash.com/photo-1518972559570-7cc1309f3229?auto=format&fit=crop&w=1600&q=80',
    breadcrumbs: [
      { label: 'בית', path: '/' },
      { label: 'ז׳אנרים' },
    ],
    sections: [
      {
        title: 'סגנונות חמים במועדונים ובפסטיבלים',
        items: genres.map((genre) => ({
          label: genre.label,
          description: genre.description,
          path: genre.path,
          imageUrl: withFallbackImage(genre.ogImage),
        })),
      },
    ],
    faq: [
      {
        question: 'אפשר לראות אילו אמנים מובילים בכל ז׳אנר?',
        answer:
          'בכל דף ז׳אנר תמצאו סקירה של הליינים וההפקות הקבועות, כולל אמנים חוזרים וטיפים על הרחבות המתאימות לכם. אנו מוסיפים המלצות לאירועים בולטים בכל שבוע.',
      },
      {
        question: 'האם אפשר לסנן לפי עיר בתוך דף ז׳אנר?',
        answer:
          'בוודאי. לחצו על אחד מהקישורים המהירים בראש הדף כדי להגיע ישירות לשילובים כמו טכנו בתל אביב או היפ הופ בירושלים.',
      },
    ],
  },
  {
    path: '/קהל',
    title: 'מסיבות לפי קהל יעד וגיל',
    description:
      'מסיבות לנוער, לסטודנטים, לחיילים ולקהילה הגאה – כל אחד מוצא את הרחבה שלו.',
    intro:
      'לא כל מסיבה מתאימה לכל גיל או מצב רוח. כאן תחכו לכם קטגוריות שמכוונות בדיוק אליכם: מסיבות רשמיות לנוער, ליינים סטודנטיאליים, אירועי חיילים וליינים להט"ב צבעוניים. בחרו את הקהל המתאים וקבלו את כל האירועים הרלוונטיים.',
    heroImage: 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1600&q=80',
    breadcrumbs: [
      { label: 'בית', path: '/' },
      { label: 'קהל יעד' },
    ],
    sections: [
      {
        title: 'לפי סוג הקהל',
        description: 'כל קבוצה מקבלת דגש על בטיחות, אווירה והטבות מתאימות.',
        items: audiences.map((audience) => ({
          label: audience.label,
          description: audience.description,
          path: audience.path,
          imageUrl: withFallbackImage(audience.ogImage),
        })),
      },
    ],
    faq: [
      {
        question: 'איך יודעים מהו הגיל המינימלי לכל מסיבה?',
        answer:
          'בכל עמוד אירוע מצוין טווח הגילאים המדויק והאם נדרש אישור הורים או הצגת תעודה. בדפי הקהל תמצאו גם טיפים לגבי בדיקות אבטחה והסעות מאורגנות.',
      },
      {
        question: 'האם המסיבות מתעדכנות בחגים וחופשות?',
        answer:
          'כן. בתקופות חגים אנחנו מסמנים בדפי הקהל אילו אירועים הם חלק מהחגיגה הארצית, כולל ססיות בוקר מיוחדות ובילויים למשפחות.',
      },
    ],
  },
  {
    path: '/מתי',
    title: 'מסיבות לפי זמן ותאריך',
    description:
      'חפשו מסיבה להיום, למחר או לסוף השבוע – וגם אירועים מיוחדים בחגים.',
    intro:
      'כשמתכננים את הלילה הבא צריך לדעת מה קורה ומתי. דף זה מחלק את המסיבות שלנו לפי זמן: היום, מחר, סוף השבוע, וכן חגים גדולים כמו פורים וסוכות. ככה תדעו בדיוק איפה לחגוג ומתי להזמין כרטיסים.',
    heroImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1600&q=80',
    breadcrumbs: [
      { label: 'בית', path: '/' },
      { label: 'מתי' },
    ],
    sections: [
      {
        title: 'בחירה לפי תאריך קרוב',
        items: timeIntents.map((intent) => ({
          label: intent.label,
          description: intent.description,
          path: intent.path,
          imageUrl: withFallbackImage(intent.ogImage),
        })),
      },
      {
        title: 'אירועים עונתיים וחגיגות מיוחדות',
        description: 'מסיבות גדולות סביב חגים וחופשות רשמיות.',
        items: holidayIntents.map((holiday) => ({
          label: holiday.label,
          description: holiday.description,
          path: holiday.path,
          imageUrl: withFallbackImage(holiday.ogImage),
        })),
      },
    ],
    faq: [
      {
        question: 'כל כמה זמן מתעדכנים התאריכים?',
        answer:
          'העמודים של היום ומחר מתעדכנים בכל שעה, והעמודים השבועיים והחגיגיים מתעדכנים לפחות פעם ביום בתקופות החמות. כך תראו רק אירועים שעדיין פתוחים להרשמה.',
      },
      {
        question: 'אפשר לשלב בין זמן לעיר או ז׳אנר?',
        answer:
          'כמעט בכל עמוד זמן תמצאו קישורים מהירים לשילובים פופולריים כמו "שישי בתל אביב" או "היום – מסיבות טכנו". ניתן גם להגיע אליהם דרך מקטעי הקומבו באתר.',
      },
    ],
  },
];

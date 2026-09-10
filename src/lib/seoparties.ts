// lib/seoparties.ts

export type SeoPageConfig = {
  slug: string;
  title: string;
  description: string;
  /** Unique long-form copy for the page. Paragraphs separated by a blank line. Falls back to a generic template when omitted. */
  body?: string;
  /** Page-specific FAQ. Rendered visibly and as FAQPage JSON-LD. */
  faqs?: { question: string; answer: string }[];
  /** Cross-links shown when the visitor doesn't find a matching event, to keep them on-site instead of bouncing. */
  related?: { label: string; href: string }[];
  /** When false the page is `noindex, follow` — kept for navigation/long-tail
   *  but not submitted to search because its filter structurally resolves to
   *  ~zero events and a cluster owner (/audience/*, /genre/*) covers the query. */
  index?: boolean;
  apiFilters: {
    region?: string;
    cityTag?: string;     // Matches values inside 'tags' or 'city' field
    age?: string;         // Matches values inside 'tags' (e.g., "18+", "24+") or 'age' field
    musicType?: string;   // Matches primary music type
    eventType?: string;
    generalTag?: string;  // Matches specific strings in tags (e.g., "free alcohol", "rooftop")
    dateRange?: 'today' | 'weekend';
  };
};

export const SPECIFIC_PARTIES_PAGES: SeoPageConfig[] = [
  // ========================================================
  // ⚡ TIME BASED (TODAY / WEEKEND)
  // ========================================================
  {
    slug: 'parties-in-tel-aviv-today',
    title: 'מסיבות היום בתל אביב – מה קורה הערב',
    description: 'כל המסיבות והאירועים שקורים היום והערב בתל אביב – רשימה מתעדכנת בזמן אמת עם מחירי כרטיסים וקישור ישיר לרכישה של הרגע האחרון.',
    body: `רוצים לצאת הערב בתל אביב ולא יודעים לאן? העמוד הזה מרכז אך ורק את המסיבות והאירועים של היום – בלי לגלול דרך תאריכים עתידיים. הרשימה נבנית מחדש בכל בוקר לפי מה שבאמת פתוח הלילה, כך שכל אירוע שמופיע כאן מתרחש היום.\n\nרוב מסיבות מרכז העיר נפתחות בין 23:00 לחצות, ואירועי גג וסאנסט מתחילים כבר משעות אחר הצהריים המאוחרות. בלילות חמישי, שישי ושבת הבחירה הכי גדולה, אבל גם באמצע השבוע – ובמיוחד בערבי חג – יש ליינים פעילים. לכל אירוע מצורף מחיר הכרטיס העדכני וקישור ישיר לרכישה, מה שחשוב במיוחד ליציאה של הרגע האחרון: בכניסה המחיר לרוב גבוה יותר וחלק מהאירועים נסגרים מראש.\n\nאם לא מצאתם משהו שמתאים להיום, אפשר להמשיך לעמוד מסיבות סוף השבוע בתל אביב או לעמוד העיר המלא, שם מרוכזים כל האירועים הקרובים לפי תאריך.`,
    faqs: [
      {
        question: 'אילו מסיבות יש היום בתל אביב?',
        answer: 'הרשימה בעמוד זה מציגה רק אירועים שמתקיימים היום בתל אביב, ומתעדכנת מדי יום. בלילות חמישי–שבת יש בדרך כלל בחירה רחבה של מועדונים, מסיבות גג ורייבים; באמצע השבוע ובחגים המספר קטן יותר אך עדיין יש ליינים פעילים.',
      },
      {
        question: 'באיזו שעה מתחילות המסיבות הערב?',
        answer: 'מסיבות מועדון במרכז תל אביב נפתחות לרוב בין 23:00 לחצות, בעוד אירועי סאנסט וגג מתחילים כבר בשעות אחר הצהריים המאוחרות. שעת הפתיחה המדויקת מופיעה בכל כרטיס אירוע.',
      },
      {
        question: 'אפשר לקנות כרטיס למסיבה של היום ברגע האחרון?',
        answer: 'כן. לכל אירוע יש קישור ישיר לרכישה מקוונת שעובד עד רגעים לפני הכניסה. מומלץ לרכוש מראש – מחיר הדלת גבוה יותר וחלק מהאירועים המבוקשים נסגרים לפני שהם מתחילים.',
      },
    ],
    related: [
      { label: 'מסיבות סופ״ש בתל אביב', href: '/parties/parties-in-tel-aviv-weekend' },
      { label: 'מסיבות בתל אביב', href: '/cities/tel-aviv' },
      { label: 'כל המסיבות בישראל', href: '/all-parties' },
      { label: 'מסיבות 18 פלוס בתל אביב', href: '/parties/18-plus-parties-tel-aviv' },
      { label: 'מסיבות ראש השנה 2026', href: '/rosh-hashana' },
    ],
    apiFilters: { cityTag: 'תל אביב', dateRange: 'today' }
  },
  {
    slug: 'parties-in-tel-aviv-weekend',
    title: 'מסיבות סופ״ש בתל אביב',
    description: 'המדריך המלא למסיבות חמישי, שישי ושבת בתל אביב.',
    apiFilters: { cityTag: 'תל אביב', dateRange: 'weekend' }
  },
  {
    slug: 'techno-parties-today',
    title: 'מסיבות טכנו הערב',
    description: 'איפה רוקדים טכנו היום? רשימת האירועים האלקטרוניים שפתוחים הערב.',
    apiFilters: { musicType: 'טכנו', dateRange: 'today' }
  },
  {
    slug: 'techno-parties-weekend',
    title: 'מסיבות טכנו בסופ״ש',
    description: 'כל הרייבים, המועדונים והאפטרים של סוף השבוע הקרוב.',
    apiFilters: { musicType: 'טכנו', dateRange: 'weekend' }
  },
  {
    slug: 'mainstream-parties-today',
    title: 'מסיבות מיינסטרים להיום',
    description: 'לרקוד את הלהיטים הכי חמים הערב בברים ובמועדונים.',
    apiFilters: { musicType: 'מיינסטרים', dateRange: 'today' }
  },
  {
    slug: 'mainstream-parties-weekend',
    title: 'מסיבות מיינסטרים בסופ״ש',
    description: 'הפקות סוף השבוע עם מוזיקת פופ, רגאטון ולהיטים.',
    apiFilters: { musicType: 'מיינסטרים', dateRange: 'weekend' }
  },

  // ========================================================
  // 📍 LOCATION + GENRE COMBINATIONS
  // ========================================================
  {
    slug: 'techno-parties-tel-aviv',
    title: 'מסיבות טכנו בתל אביב',
    description: 'סצנת האנדרגראונד, מועדוני הפאר והליינים האלקטרוניים של תל אביב.',
    related: [
      { label: 'מסיבות טכנו ורייבים', href: '/genre/techno-music' },
      { label: 'רייבים בישראל', href: '/genre/rave-parties' },
      { label: 'מסיבות בתל אביב', href: '/cities/tel-aviv' },
      { label: 'מדריך מועדוני טכנו בתל אביב', href: '/articles/מדריך-מועדוני-טכנו-בתל-אביב' },
    ],
    apiFilters: { cityTag: 'תל אביב', musicType: 'טכנו' }
  },
  {
    slug: 'mainstream-parties-tel-aviv',
    title: 'מסיבות מיינסטרים בתל אביב',
    description: 'המועדונים הכי שמחים בתל אביב לקהל שאוהב לרקוד ולשיר – ליינים, מחירים וכרטיסים מעודכנים כל יום.',
    body: `מסיבות מיינסטרים בתל אביב הן הבחירה הבטוחה לערב שכולו להיטים – פופ, רגאטון, מזרחית, היפ הופ ולהיטי רדיו – עם קהל שבא לרקוד, לשיר ולא להתאמץ יותר מדי. רוב האירועים מתקיימים בחמישי, שישי ושבת במועדוני מרכז העיר, בנמל תל אביב וברחבות הגג, וחלקם פתוחים כבר משעות הסאנסט.\n\nהסדרות הקבועות – כמו THURSDAY MOON, מיינסטרים בקבוע ו-FRIDAY MAINSTREAM – חוזרות כל שבוע עם ליינאפ מתחלף, כך שכדאי לבדוק את התאריך המדויק לפני שקונים. גיל הכניסה נע בדרך כלל בין 18+ ל-21+, ומחיר כרטיס מוקדם זול משמעותית ממחיר הדלת.\n\nהרשימה למטה מתעדכנת מדי יום עם כל מסיבות המיינסטרים הקרובות בתל אביב, כולל מחיר עדכני וקישור ישיר לרכישה. אם אתם מגיעים בחג – ראש השנה או סוכות – שווה לבדוק גם את עמודי החגים הייעודיים, שם מרוכזים האירועים המיוחדים של אותו סוף שבוע.`,
    faqs: [
      {
        question: 'מתי יש מסיבות מיינסטרים בתל אביב?',
        answer: 'רוב האירועים מתקיימים בלילות חמישי, שישי ושבת, עם סדרות קבועות שחוזרות מדי שבוע. בחגים ובחופשות נוספים אירועים גם באמצע השבוע. התאריכים המדויקים מופיעים בכל כרטיס אירוע ברשימה.',
      },
      {
        question: 'כמה עולה כרטיס למסיבת מיינסטרים בתל אביב?',
        answer: 'כרטיס מוקדם נע לרוב בין 60 ל-120 ₪, ולעיתים פחות בליינים קבועים. מחיר הדלת גבוה יותר ולאירועים מבוקשים הכרטיסים נגמרים מראש, לכן מומלץ לרכוש מוקדם.',
      },
      {
        question: 'מה גיל הכניסה למסיבות מיינסטרים בתל אביב?',
        answer: 'ברוב האירועים גיל הכניסה הוא 18+, וחלק מהמועדונים מגדירים 21+ ומעלה. גיל הכניסה המדויק מצוין בכל כרטיס אירוע.',
      },
    ],
    related: [
      { label: 'מסיבות 18 פלוס בתל אביב', href: '/parties/18-plus-parties-tel-aviv' },
      { label: 'מסיבות סופ״ש בתל אביב', href: '/parties/parties-in-tel-aviv-weekend' },
      { label: 'מסיבות בתל אביב', href: '/cities/tel-aviv' },
      { label: 'מסיבות ראש השנה 2026', href: '/rosh-hashana' },
      { label: 'מסיבות סוכות 2026', href: '/sukkot' },
    ],
    apiFilters: { cityTag: 'תל אביב', musicType: 'מיינסטרים' }
  },
  {
    slug: 'house-parties-tel-aviv',
    title: 'מסיבות האוס בתל אביב',
    description: 'גגות, שקיעות ומועדונים עם מוזיקת האוס ודיסקו בתל אביב.',
    related: [
      { label: 'מסיבות האוס', href: '/genre/house-music' },
      { label: 'מסיבות בתל אביב', href: '/cities/tel-aviv' },
      { label: 'אפטרים בתל אביב', href: '/parties/after-parties-tel-aviv' },
    ],
    apiFilters: { cityTag: 'תל אביב', generalTag: 'האוס' } // Searching 'house' in tags/genre
  },
  {
    slug: 'parties-in-haifa-and-north',
    title: 'מסיבות בצפון – קריות, עכו והגליל',
    description: 'חיי הלילה של כל הצפון – מהקריות ועד עכו והגליל. לחיפה עצמה יש מדריך ייעודי משלה.',
    apiFilters: { region: 'צפון' }
  },
  {
    slug: 'techno-parties-north',
    title: 'מסיבות טכנו בצפון',
    description: 'קהילת הטכנו הצפונית – מסיבות בחיפה, קריות והעמקים.',
    apiFilters: { region: 'צפון', musicType: 'טכנו' }
  },
  {
    slug: 'parties-in-south-and-beer-sheva',
    title: 'מסיבות בדרום ובאר שבע',
    description: 'סצנת הסטודנטים, מועדוני הענק והפקות המדבר של הדרום.',
    apiFilters: { region: 'דרום' }
  },

  // ========================================================
  // 👥 AUDIENCE BASED
  // ========================================================
  {
    slug: '18-plus-parties-tel-aviv',
    title: 'מסיבות 18 פלוס בתל אביב ובכל הארץ',
    description: 'מסיבות 18 פלוס בתל אביב, במרכז ובכל הארץ – ליינים לצעירים לפני ואחרי צבא, מחירי כניסה וכרטיסים. מתעדכן כל יום.',
    related: [
      { label: 'מסיבות בתל אביב', href: '/cities/tel-aviv' },
      { label: 'מסיבות מיינסטרים', href: '/genre/mainstream-music' },
      { label: 'מסיבות טכנו ורייבים', href: '/genre/techno-music' },
      { label: 'מסיבות 18+ לסופ״ש הקרוב', href: '/parties/18-plus-parties-weekend' },
      { label: 'מסיבות 24+ בתל אביב', href: '/audience/24plus-parties' },
    ],
    apiFilters: { cityTag: 'תל אביב', age: '18+' }
  },
  {
    slug: '18-plus-parties-weekend',
    title: 'מסיבות 18+ לסופ״ש הקרוב',
    description: 'כל מה שפתוח לקהל הצעיר בחמישי ושישי הקרובים.',
    apiFilters: { age: '18+', dateRange: 'weekend' }
  },
  {
    slug: 'soldiers-parties-weekend',
    title: 'מסיבות לחיילים בסופ״ש',
    description: 'הטבות חוגר, כניסה חינם ומסיבות שמתאימות במיוחד לחיילים.',
    index: false, // no "soldier" inventory exists; /audience/soldier-parties owns the query
    apiFilters: { age: 'חיילים' } // Ensures mapping looks for "Soldier" related tags
  },
  {
    slug: 'students-parties-tel-aviv',
    title: 'מסיבות סטודנטים בתל אביב',
    description: 'ליינים אקדמיים, מסיבות פתיחת סמסטר והנחות לסטודנטים.',
    apiFilters: { cityTag: 'תל אביב', age: 'סטודנט' }
  },
  {
    slug: '24-plus-parties-tel-aviv',
    title: 'מסיבות 24+ בתל אביב',
    description: 'קהל בוגר, אווירה איכותית ומוזיקה מדוייקת בעיר.',
    index: false, // age '24+' filter ~never matches (data uses '21+'); /audience/24plus-parties is the owner
    related: [
      { label: 'מסיבות 24+ בישראל', href: '/audience/24plus-parties' },
      { label: 'מסיבות בתל אביב', href: '/cities/tel-aviv' },
      { label: 'מסיבות האוס', href: '/genre/house-music' },
    ],
    apiFilters: { cityTag: 'תל אביב', age: '24+' }
  },

  // ========================================================
  // ✨ SPECIAL FEATURES & VIBES
  // ========================================================
  {
    slug: 'free-alcohol-parties-tel-aviv',
    title: 'מסיבות אלכוהול חופשי – בר פתוח בתל אביב ובמרכז',
    description: 'מסיבות עם אלכוהול חופשי בתל אביב ובמרכז – בר פתוח, מסלולי שתייה ללא הגבלה וצמידי open bar. רשימת אירועים מתעדכנת עם מחירים וכרטיסים.',
    body: `מסיבות עם אלכוהול חופשי (open bar) הן הבחירה של מי שרוצה לדעת מראש כמה הערב יעלה. במקום לשלם על כל כוס בנפרד, מחיר הכרטיס כולל שתייה ללא הגבלה לאורך שעות מוגדרות – לרוב שעתיים עד שלוש מפתיחת הדלתות – ואחריהן הבר עובר למחירון רגיל. רוב האירועים האלה מתקיימים בתל אביב ובמרכז, בליינים לקהל צעיר, מסיבות סטודנטים וערבי 18+.\n\nכדאי לבדוק בכל אירוע מה בדיוק נכלל: חלק מהמסלולים מוגבלים לבירה, יין וקוקטיילים בסיסיים, ואחרים כוללים גם אלכוהול חריף. שווה לשים לב גם לשעת ההתחלה של מסלול השתייה – מי שמאחר מפספס חלק ממנו. גיל הכניסה נע בדרך כלל בין 18+ ל-21+.\n\nהרשימה למטה מתעדכנת עם מסיבות האלכוהול החופשי הקרובות, כולל מחיר כרטיס עדכני וקישור ישיר לרכישה. כרטיס מוקדם כמעט תמיד זול ממחיר הדלת, ובאירועים מבוקשים המסלולים נגמרים מראש.`,
    faqs: [
      {
        question: 'מה זה מסיבה עם אלכוהול חופשי?',
        answer: 'זו מסיבה שבה מחיר הכרטיס כולל שתייה ללא הגבלה במשך פרק זמן מוגדר (לרוב שעתיים–שלוש מפתיחת הדלתות). אחרי שהמסלול נגמר, הבר ממשיך לעבוד במחירים רגילים.',
      },
      {
        question: 'איזה סוגי אלכוהול נכללים בבר הפתוח?',
        answer: 'זה משתנה בין אירוע לאירוע. מסלול בסיסי כולל בדרך כלל בירה, יין וקוקטיילים פשוטים; מסלולים מורחבים כוללים גם אלכוהול חריף. הפירוט המדויק מופיע בעמוד האירוע.',
      },
      {
        question: 'כמה עולה כרטיס למסיבת אלכוהול חופשי בתל אביב?',
        answer: 'המחירים נעים לרוב בין 90 ל-180 ₪ לכרטיס מוקדם, בהתאם לאורך מסלול השתייה ולסוג האלכוהול הכלול. מחיר הדלת גבוה יותר ולעיתים אין כרטיסים בכניסה.',
      },
    ],
    related: [
      { label: 'מסיבות 18 פלוס בתל אביב', href: '/parties/18-plus-parties-tel-aviv' },
      { label: 'מסיבות סטודנטים בתל אביב', href: '/parties/students-parties-tel-aviv' },
      { label: 'מסיבות מיינסטרים בתל אביב', href: '/parties/mainstream-parties-tel-aviv' },
      { label: 'מסיבות בתל אביב', href: '/cities/tel-aviv' },
    ],
    apiFilters: { cityTag: 'תל אביב', generalTag: 'אלכוהול' }
  },
  {
    slug: 'nature-trance-parties',
    title: 'מסיבות טבע וטראנס',
    description: 'לרקוד תחת כיפת השמיים – פסטיבלים, מחתרות וטראנס.',
    apiFilters: { musicType: 'טראנס' }
  },
  {
    slug: 'after-parties-tel-aviv',
    title: 'אפטרים בתל אביב',
    description: 'למי שרוצה להמשיך לרקוד בבוקר – אירועי האפטר החזקים בעיר.',
    apiFilters: { cityTag: 'תל אביב', generalTag: 'אפטר' }
  },
  {
    slug: 'sunset-parties',
    title: 'מסיבות שקיעה וצהריים',
    description: 'אירועים שמתחילים באור יום וממשיכים לתוך הלילה.',
    index: false, // 'שקיעה' tag rarely applied → structurally empty, no search traffic
    apiFilters: { generalTag: 'שקיעה' } // Requires tags like "Sunset", "Tzahorayim"
  },
];
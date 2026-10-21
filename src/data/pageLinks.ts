export interface PageLinkOption {
  label: string;
  path: string;
  tag?: string;
  description?: string;
}

// Linked from every page that renders PageCrossLinks — so only pages that have
// parties. /audience/student-parties and /audience/soldier-parties are left out:
// no party is tagged for them, so they are empty and noindex (see their config in
// app/audience/[audience]/page.tsx); add them back once the tagging fills them.
export const pageLinkOptions: PageLinkOption[] = [
  {
    label: 'מסיבות נוער',
    path: '/audience/teenage-parties',
    tag: 'נוער',
    description: 'מסיבות מותאמות לגילאי נוער עם פיקוח בטיחותי.',
  },
  {
    label: 'מסיבות 24+',
    path: '/audience/24plus-parties',
    tag: '24 פלוס',
    description: 'ערבים בוגרים יותר עם קהל 24 פלוס.',
  },
  {
    label: 'מסיבות חמישי',
    path: '/day/thursday',
    description: 'הפתיחה הרשמית של סוף השבוע עם מסיבות חמישי.',
  },
  {
    label: 'מסיבות שישי',
    path: '/day/friday',
    description: 'רשימת האירועים החמים לשישי הקרוב.',
  },
  {
    label: 'מסיבות שבת',
    path: '/saturday-parties',
    description: 'מוצאי שבת על הרחבה עם דיג׳יים מובילים.',
  },
  {
    label: 'מסיבות סוף שבוע',
    path: '/day/weekend',
    description: 'כל מה שקורה בין חמישי לשבת בערב אחד.',
  },
  {
    label: 'מסיבות היום',
    path: '/day/today',
    description: 'רשימת ספונטנית של מה שקורה עוד הלילה.',
  },
  {
    label: 'מסיבות בתל אביב',
    path: '/cities/tel-aviv',
    description: 'אירועים בעיר שלא נרדמת – טכנו, גגות וחופים.',
  },
  {
    label: 'מסיבות בחיפה',
    path: '/cities/haifa',
    description: 'אירועים בעיר הצפונית עם אווירה מרהיבה.',
  }
];

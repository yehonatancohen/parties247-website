export interface PageLinkOption {
  label: string;
  path: string;
  tag?: string;
  description?: string;
}

export const pageLinkOptions: PageLinkOption[] = [
  {
    label: 'מסיבות סטודנטים',
    path: '/קהל/מסיבות-סטודנטים',
    tag: 'סטודנטים',
    description: 'אירועים עם הנחות סטודנט ואווירה קמפוסית.',
  },
  {
    label: 'מסיבות נוער',
    path: '/קהל/מסיבות-נוער',
    tag: 'נוער',
    description: 'מסיבות מותאמות לגילאי נוער עם פיקוח בטיחותי.',
  },
  {
    label: 'מסיבות חיילים',
    path: '/קהל/מסיבות-חיילים',
    tag: 'חיילים',
    description: 'ליינים שמקבלים חוגר ומציעים כניסה מוזלת.',
  },
  {
    label: 'מסיבות להט"ב',
    path: '/קהל/מסיבות-להטב',
    tag: 'להט"ב',
    description: 'אירועים וגאווה ברחבי הארץ עם אווירה מכילה.',
  },
  {
    label: 'מסיבות 25+',
    path: '/קהל/מסיבות-25-פלוס',
    tag: '25 פלוס',
    description: 'ערבים בוגרים יותר עם קהל 25 פלוס.',
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
    path: '/weekend-parties',
    description: 'כל מה שקורה בין חמישי לשבת בערב אחד.',
  },
  {
    label: 'מסיבות בתל אביב',
    path: '/ערים/תל-אביב',
    description: 'אירועים בעיר שלא נרדמת – טכנו, גגות וחופים.',
  },
];

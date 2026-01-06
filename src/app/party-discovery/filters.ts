export type DiscoveryFilter = {
  id: string;
  title: string;
  description?: string;
  basePath?: string;
  filters: {
    genre?: string;
    audience?: string;
    area?: string;
  };
};

export const genreSections: DiscoveryFilter[] = [
  {
    id: 'techno-tel-aviv',
    title: 'מסיבות טכנו בתל אביב',
    description: 'רייבי מחסנים ומועדונים בדרום העיר עם סאונד כבד.',
    filters: { genre: 'techno', area: 'tel-aviv' },
    basePath: '/genre/techno-music',
  },
  {
    id: 'techno-north',
    title: 'טכנו בצפון והסביבה',
    description: 'אפטרים וסטים מלודיים בחיפה והגליל.',
    filters: { genre: 'techno', area: 'north' },
    basePath: '/genre/techno-music',
  },
  {
    id: 'house-sunsets',
    title: 'האוס וגרוב בשקיעות',
    description: 'גגות, ברים פתוחים ומסיבות בין ערביים.',
    filters: { genre: 'house' },
    basePath: '/genre/house-music',
  },
  {
    id: 'mainstream-city',
    title: 'מיינסטרים ופופ בעיר',
    description: 'להיטים, רגאטון וקריוקי למסיבות גדולות.',
    filters: { genre: 'mainstream', area: 'tel-aviv' },
    basePath: '/genre/mainstream-music',
  },
  {
    id: 'trance-open-air',
    title: 'מסיבות טראנס פתוחות',
    description: 'טראנס וטבע עם מרחבים פתוחים.',
    filters: { genre: 'trance' },
    basePath: '/genre/trance-music',
  },
];

export const audienceSections: DiscoveryFilter[] = [
  {
    id: 'students',
    title: 'מסיבות סטודנטים',
    description: 'ליינים אקדמיים, הנחות ושאטלים מהקמפוסים.',
    filters: { audience: 'students' },
    basePath: '/audience/student-parties',
  },
  {
    id: 'soldiers',
    title: 'מסיבות חיילים',
    description: 'הטבות שירות, שעות מאוחרות ושמירת ציוד.',
    filters: { audience: 'soldiers' },
    basePath: '/audience/soldier-parties',
  },
  {
    id: 'teens',
    title: 'מסיבות נוער מפוקחות',
    description: 'גיל כניסה ברור ואבטחה במקום.',
    filters: { audience: 'teens' },
    basePath: '/audience/teenage-parties',
  },
  {
    id: 'adults-24',
    title: 'וייב 24+',
    description: 'רחבות עם קהל בוגר וקוקטיילים.',
    filters: { audience: '24plus' },
    basePath: '/audience/24plus-parties',
  },
  {
    id: 'students-center',
    title: 'סטודנטים בגוש דן',
    description: 'סינון משולב של קהל ואזור המרכז.',
    filters: { audience: 'students', area: 'tel-aviv' },
    basePath: '/audience/student-parties',
  },
];

export const areaSections: DiscoveryFilter[] = [
  {
    id: 'tel-aviv',
    title: 'מסיבות תל אביב',
    description: 'טכנו, מיינסטרים ובר הופעות במרכז.',
    filters: { area: 'tel-aviv' },
    basePath: '/cities/tel-aviv',
  },
  {
    id: 'haifa',
    title: 'מסיבות חיפה',
    description: 'חופים, כרמל ושוק תלפיות.',
    filters: { area: 'haifa' },
    basePath: '/cities/haifa',
  },
  {
    id: 'center',
    title: 'גוש דן והמרכז',
    description: 'בר-קלאבים, גגות והאוס וגרוב.',
    filters: { area: 'center' },
    basePath: '/all-parties',
  },
  {
    id: 'north',
    title: 'צפון והעמקים',
    description: 'טבע, טראנס ומסיבות קיץ.',
    filters: { area: 'north' },
    basePath: '/cities/haifa',
  },
  {
    id: 'south',
    title: 'דרום ומדבר',
    description: 'רייבי מחסנים ובמות פתוחות.',
    filters: { area: 'south' },
    basePath: '/all-parties',
  },
];

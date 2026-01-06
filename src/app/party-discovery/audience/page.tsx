import BackButton from '@/components/BackButton';
import DiscoveryFilterGrid, { DiscoveryFilter } from '@/components/DiscoveryFilterGrid';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'עמודי קהל יעד | Parties 24/7',
  description: 'דפי גיל וקהל שמתבססים על סינון מהבקאנד בלבד, כך שקל להוסיף עוד וריאציות.',
  alternates: { canonical: '/party-discovery/audience' },
};

const audienceSections: DiscoveryFilter[] = [
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

export default async function PartyDiscoveryAudienceLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-jungle-deep via-[#0c1713] to-black text-white">
      <div className="container mx-auto px-4 pb-16 pt-14 md:pt-16 space-y-10">
        <div className="flex justify-start">
          <BackButton fallbackHref="/party-discovery" label="חזרה" />
        </div>

        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-jungle-text/80">
            עמודי משנה • לפי קהל יעד
          </p>
          <h1 className="text-4xl md:text-5xl font-display text-white leading-tight">
            מתאימים את המסיבה לקהל שלכם
          </h1>
          <p className="text-lg text-jungle-text/85 leading-relaxed">
            משתמשים באותם פרמטרים של בקאנד כדי להציג מסיבות לקהל נכון, ללא לוגיקה כפולה בפרונט.
          </p>
        </div>

        <DiscoveryFilterGrid sections={audienceSections} />
      </div>
    </div>
  );
}

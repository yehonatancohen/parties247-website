import BackButton from '@/components/BackButton';
import DiscoveryFilterGrid, { DiscoveryFilter } from '@/components/DiscoveryFilterGrid';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'עמודי ז׳אנר ממוקדים | Parties 24/7',
  description: 'מסננים מסיבות לפי ז׳אנר ישירות מהבקאנד – טכנו, האוס, טראנס או מיינסטרים.',
  alternates: { canonical: '/party-discovery/genre' },
};

const genreSections: DiscoveryFilter[] = [
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

export default async function PartyDiscoveryGenreLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-jungle-deep via-[#0c1713] to-black text-white">
      <div className="container mx-auto px-4 pb-16 pt-14 md:pt-16 space-y-10">
        <div className="flex justify-start">
          <BackButton fallbackHref="/party-discovery" label="חזרה" />
        </div>

        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-jungle-text/80">
            עמודי משנה • לפי ז׳אנר
          </p>
          <h1 className="text-4xl md:text-5xl font-display text-white leading-tight">
            מוצאים את הז׳אנר שמדליק אתכם
          </h1>
          <p className="text-lg text-jungle-text/85 leading-relaxed">
            כל כרטיס מסנן ישירות מהבקאנד לפי ז׳אנר ואזור, כך שקל להוסיף עמודים חדשים בלי קוד נוסף.
          </p>
        </div>

        <DiscoveryFilterGrid sections={genreSections} />
      </div>
    </div>
  );
}

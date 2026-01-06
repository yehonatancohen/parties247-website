import BackButton from '@/components/BackButton';
import DiscoveryFilterGrid from '@/components/DiscoveryFilterGrid';
import { Metadata } from 'next';
import { areaSections } from '../filters';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'עמודי אזור | Parties 24/7',
  description: 'דפי אזור שמסתמכים על פרמטר area של הבקאנד כדי להחזיר רק מסיבות רלוונטיות.',
  alternates: { canonical: '/party-discovery/area' },
};

export default async function PartyDiscoveryAreaLanding() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-jungle-deep via-[#0c1713] to-black text-white">
      <div className="container mx-auto px-4 pb-16 pt-14 md:pt-16 space-y-10">
        <div className="flex justify-start">
          <BackButton fallbackHref="/party-discovery" label="חזרה" />
        </div>

        <div className="mx-auto max-w-4xl space-y-4 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-jungle-text/80">
            עמודי משנה • לפי אזור
          </p>
          <h1 className="text-4xl md:text-5xl font-display text-white leading-tight">
            בוחרים מסיבות לפי אזור בארץ
          </h1>
          <p className="text-lg text-jungle-text/85 leading-relaxed">
            כל קלף יפתח עמוד נפרד שמושך את המסיבות הרלוונטיות עם פרמטר area מהבקאנד.
          </p>
        </div>

        <DiscoveryFilterGrid sections={areaSections} detailBasePath="/party-discovery/area" />
      </div>
    </div>
  );
}

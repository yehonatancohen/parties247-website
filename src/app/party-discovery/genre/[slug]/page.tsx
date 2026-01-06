import BackButton from '@/components/BackButton';
import PartyGrid from '@/components/PartyGrid';
import { getParties } from '@/services/api';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { genreSections } from '../../filters';

export const dynamic = 'force-dynamic';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const section = genreSections.find((item) => item.id === params.slug);

  if (!section) {
    return {};
  }

  return {
    title: `${section.title} | Parties 24/7`,
    description: section.description,
    alternates: { canonical: `/party-discovery/genre/${section.id}` },
  };
}

export default async function PartyDiscoveryGenreDetail({ params }: Props) {
  const section = genreSections.find((item) => item.id === params.slug);

  if (!section) {
    notFound();
  }

  const parties = await getParties({ upcoming: true, ...section.filters });

  return (
    <div className="min-h-screen bg-gradient-to-b from-jungle-deep via-[#0c1713] to-black text-white">
      <div className="container mx-auto px-4 pb-16 pt-14 md:pt-16 space-y-8">
        <div className="flex justify-start">
          <BackButton fallbackHref="/party-discovery/genre" label="חזרה" />
        </div>

        <div className="space-y-3">
          <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">עמוד ז׳אנר</p>
          <h1 className="text-4xl md:text-5xl font-display text-white leading-tight">{section.title}</h1>
          {section.description && (
            <p className="text-lg text-jungle-text/85 leading-relaxed max-w-3xl">{section.description}</p>
          )}
        </div>

        <PartyGrid
          parties={parties}
          showFilters={false}
          showSearch={false}
          basePath={section.basePath || '/all-parties'}
          syncNavigation
        />
      </div>
    </div>
  );
}

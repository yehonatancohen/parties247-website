import PartyGrid from '@/components/PartyGrid';
import { Party } from '@/data/types';
import { getParties } from '@/services/api';

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

type DiscoveryFilterGridProps = {
  sections: DiscoveryFilter[];
};

export default async function DiscoveryFilterGrid({ sections }: DiscoveryFilterGridProps) {
  const sectionsWithParties: { section: DiscoveryFilter; parties: Party[] }[] = await Promise.all(
    sections.map(async (section) => {
      const parties = await getParties({ upcoming: true, ...section.filters });
      return { section, parties };
    }),
  );

  return (
    <div className="space-y-10">
      {sectionsWithParties.map(({ section, parties }) => (
        <section
          key={section.id}
          className="rounded-3xl border border-white/10 bg-jungle-surface/60 p-5 shadow-lg backdrop-blur"
        >
          <div className="mb-4 flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-2xl font-display text-white">{section.title}</h2>
              {section.description && (
                <p className="text-sm text-jungle-text/85 leading-relaxed">{section.description}</p>
              )}
            </div>
          </div>

          <PartyGrid
            parties={parties}
            showFilters={false}
            showSearch={false}
            basePath={section.basePath || '/all-parties'}
            syncNavigation
          />
        </section>
      ))}
    </div>
  );
}

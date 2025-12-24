import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import SeoManager from '../parties247-next/components/SeoManager';
import Breadcrumbs, { BreadcrumbItem } from '../parties247-next/components/Breadcrumbs';
import { BASE_URL } from '../constants';
import type { TaxonomyConfig } from '../data/taxonomy';

export interface TaxonomyListingSection {
  title?: string;
  description?: string;
  items: TaxonomyConfig[];
}

export interface TaxonomyListingPageProps {
  title: string;
  description: string;
  intro: string;
  canonicalPath: string;
  breadcrumbs: BreadcrumbItem[];
  sections: TaxonomyListingSection[];
}

const sortByHebrewLabel = (a: TaxonomyConfig, b: TaxonomyConfig) =>
  a.label.localeCompare(b.label, 'he', { sensitivity: 'base' });

const TaxonomyListingPage: React.FC<TaxonomyListingPageProps> = ({
  title,
  description,
  intro,
  canonicalPath,
  breadcrumbs,
  sections,
}) => {
  const sortedSections = useMemo(
    () =>
      sections.map((section) => ({
        ...section,
        items: [...section.items].sort(sortByHebrewLabel),
      })),
    [sections],
  );

  const flatItems = useMemo(
    () => sortedSections.flatMap((section) => section.items),
    [sortedSections],
  );

  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      ...(crumb.path ? { item: `${BASE_URL}${crumb.path}` } : {}),
    })),
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: flatItems.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      url: `${BASE_URL}${item.path}`,
    })),
  };

  return (
    <div className="container mx-auto px-4">
      <SeoManager
        title={title}
        description={description}
        canonicalPath={canonicalPath}
        jsonLd={[breadcrumbsJsonLd, itemListJsonLd]}
      />

      <Breadcrumbs items={breadcrumbs} />

      <header className="space-y-4 mb-8">
        <h1 className="font-display text-4xl md:text-5xl text-white">{title}</h1>
        <p className="text-lg leading-7 text-jungle-text/90 max-w-3xl">{intro}</p>
      </header>

      <div className="space-y-12">
        {sortedSections.map((section, sectionIndex) => (
          <section key={sectionIndex} className="space-y-6">
            {section.title ? (
              <div className="space-y-2">
                <h2 className="font-display text-3xl text-white">{section.title}</h2>
                {section.description ? (
                  <p className="text-base text-jungle-text/80 max-w-2xl">{section.description}</p>
                ) : null}
              </div>
            ) : null}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {section.items.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group bg-jungle-surface/70 border border-wood-brown/40 rounded-2xl p-6 shadow-lg transition hover:border-jungle-accent hover:shadow-jungle-accent/20"
                  aria-label={`פתחו את עמוד ${item.label}`}
                >
                  <div className="flex flex-col h-full gap-4">
                    <div>
                      <h3 className="font-display text-2xl text-white group-hover:text-jungle-accent transition-colors">
                        {item.label}
                      </h3>
                      {item.description ? (
                        <p className="mt-2 text-sm text-jungle-text/80 leading-6">
                          {item.description}
                        </p>
                      ) : null}
                    </div>
                    <span className="mt-auto inline-flex items-center gap-2 text-jungle-accent group-hover:text-white transition-colors">
                      המשך לעמוד ›
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
};

export default TaxonomyListingPage;

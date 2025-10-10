import React from 'react';
import { Link } from 'react-router-dom';
import SeoManager from '../components/SeoManager';
import Breadcrumbs from '../components/Breadcrumbs';
import FaqBlock from '../components/FaqBlock';
import { TaxonomyIndexConfig } from '../data/taxonomyIndex';
import { BASE_URL, DEFAULT_TAXONOMY_IMAGE } from '../constants';

interface TaxonomyIndexPageProps {
  config: TaxonomyIndexConfig;
}

const TaxonomyIndexPage: React.FC<TaxonomyIndexPageProps> = ({ config }) => {
  const breadcrumbsJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: config.breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.label,
      ...(crumb.path ? { item: `${BASE_URL}${crumb.path}` } : {}),
    })),
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: config.sections
      .flatMap((section) => section.items)
      .map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: item.label,
        url: `${BASE_URL}${item.path}`,
      })),
  };

  const jsonLd = config.faq?.length
    ? [breadcrumbsJsonLd, itemListJsonLd, {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: config.faq.map((faq) => ({
          '@type': 'Question',
          name: faq.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer,
          },
        })),
      }]
    : [breadcrumbsJsonLd, itemListJsonLd];

  const handleImageError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.src = DEFAULT_TAXONOMY_IMAGE;
  };

  return (
    <div className="container mx-auto px-4">
      <SeoManager
        title={config.title}
        description={config.description}
        canonicalPath={config.path}
        ogImage={config.heroImage}
        ogType="website"
        jsonLd={jsonLd}
      />

      <Breadcrumbs items={config.breadcrumbs} />

      <header className="grid md:grid-cols-[3fr_2fr] gap-8 items-center mb-12">
        <div>
          <h1 className="font-display text-4xl md:text-5xl text-white mb-4">{config.title}</h1>
          <p className="text-lg leading-7 text-jungle-text/90 max-w-3xl">{config.intro}</p>
        </div>
        <div className="rounded-3xl overflow-hidden border border-wood-brown/40 shadow-xl">
          <img
            src={config.heroImage || DEFAULT_TAXONOMY_IMAGE}
            alt={config.title}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={handleImageError}
          />
        </div>
      </header>

      {config.sections.map((section) => (
        <section key={section.title} className="mb-14">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
            <div>
              <h2 className="font-display text-3xl text-white mb-2">{section.title}</h2>
              {section.description && (
                <p className="text-jungle-text/80 max-w-2xl">{section.description}</p>
              )}
            </div>
          </div>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {section.items.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="group rounded-3xl overflow-hidden border border-wood-brown/40 bg-jungle-surface/60 hover:border-jungle-accent/60 transition-all shadow-lg hover:shadow-jungle-glow/40"
              >
                <div className="relative h-52">
                  <img
                    src={item.imageUrl || DEFAULT_TAXONOMY_IMAGE}
                    alt={item.label}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                  <h3 className="absolute bottom-3 right-4 left-4 font-display text-2xl text-white drop-shadow-lg">
                    {item.label}
                  </h3>
                </div>
                <div className="p-5 space-y-4">
                  <p className="text-jungle-text/80 text-sm leading-6">{item.description}</p>
                  <span className="inline-flex items-center justify-center px-4 py-2 bg-jungle-accent/90 text-jungle-deep font-semibold rounded-full group-hover:bg-jungle-accent transition">
                    גלו את המסיבות ›
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      ))}

      <FaqBlock items={config.faq || []} />
    </div>
  );
};

export default TaxonomyIndexPage;

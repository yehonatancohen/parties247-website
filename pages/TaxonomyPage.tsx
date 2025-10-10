import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useParties } from '../hooks/useParties';
import SeoManager from '../components/SeoManager';
import Breadcrumbs from '../components/Breadcrumbs';
import FaqBlock from '../components/FaqBlock';
import PartyGrid from '../components/PartyGrid';
import LoadingSpinner from '../components/LoadingSpinner';
import { filterPartiesByTaxonomy, TaxonomyConfig } from '../data/taxonomy';
import { BASE_URL, DEFAULT_TAXONOMY_IMAGE } from '../constants';

const PAGE_SIZE = 20;

interface TaxonomyPageProps {
  config: TaxonomyConfig;
}

const TaxonomyPage: React.FC<TaxonomyPageProps> = ({ config }) => {
  const { parties, isLoading, error } = useParties();

  const pageNumber = useMemo(() => {
    const match = config.path.match(/\/עמוד\/(\d+)$/);
    return match ? Number(match[1]) : 1;
  }, [config.path]);

  const basePath = useMemo(() => config.path.replace(/\/עמוד\/\d+$/, ''), [config.path]);

  const filteredParties = useMemo(() => filterPartiesByTaxonomy(parties, config), [parties, config]);

  const paginatedParties = useMemo(() => {
    const start = (pageNumber - 1) * PAGE_SIZE;
    return filteredParties.slice(start, start + PAGE_SIZE);
  }, [filteredParties, pageNumber]);

  const hasNextPage = filteredParties.length > pageNumber * PAGE_SIZE;
  const prevPagePath = pageNumber > 1 ? (pageNumber === 2 ? basePath : `${basePath}/עמוד/${pageNumber - 1}`) : undefined;
  const nextPagePath = hasNextPage ? `${basePath}/עמוד/${pageNumber + 1}` : undefined;

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
    itemListElement: paginatedParties.map((party, index) => ({
      '@type': 'ListItem',
      position: (pageNumber - 1) * PAGE_SIZE + index + 1,
      url: `${BASE_URL}/event/${party.slug}`,
      name: party.name,
    })),
  };

  const faqJsonLd = config.faq.length
    ? {
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
      }
    : null;

  const jsonLd = faqJsonLd
    ? [breadcrumbsJsonLd, itemListJsonLd, faqJsonLd]
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
        ogImage={config.ogImage}
        ogType="website"
        jsonLd={jsonLd}
      />

      <Breadcrumbs items={config.breadcrumbs} />

      <header className="grid md:grid-cols-[3fr_2fr] gap-8 items-center mb-8">
        <div className="space-y-4">
          <h1 className="font-display text-4xl md:text-5xl text-white">{config.title}</h1>
          <p className="text-lg leading-7 text-jungle-text/90 max-w-3xl">{config.intro}</p>
        </div>
        <div className="rounded-3xl overflow-hidden border border-wood-brown/40 shadow-xl">
          <img
            src={config.ogImage || DEFAULT_TAXONOMY_IMAGE}
            alt={config.label}
            className="w-full h-full object-cover"
            loading="lazy"
            onError={handleImageError}
          />
        </div>
      </header>

      {config.type === 'city' && (
        <div className="mb-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-jungle-surface/70 border border-wood-brown/40 rounded-2xl p-6 shadow-lg">
            <h2 className="font-display text-2xl text-white mb-3">שכונות ומוקדי בילוי מומלצים</h2>
            <ul className="list-disc list-inside space-y-2 text-jungle-text/80">
              <li>מרכז העיר – ברים, מועדונים וגגות פעילים עד הבוקר.</li>
              <li>שכונות אמנות כמו פלורנטין, שוק תלפיות ושוק מחנה יהודה לחוויה אלטרנטיבית.</li>
              <li>חופים פתוחים ומתחמי הופעות לאירועי קיץ מיוחדים.</li>
            </ul>
          </div>
          <iframe
            title={`מפת ${config.label}`}
            loading="lazy"
            className="w-full h-72 rounded-2xl border border-wood-brown/40 shadow-lg"
            src={`https://maps.google.com/maps?q=${encodeURIComponent(config.label)}&z=12&output=embed`}
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      )}

      {config.relatedPaths?.length ? (
        <aside className="mb-10">
          <h2 className="font-display text-2xl text-white mb-3">הרחבות מומלצות</h2>
          <div className="flex flex-wrap gap-3">
            {config.relatedPaths.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className="px-4 py-2 bg-jungle-surface border border-wood-brown/40 rounded-full text-jungle-text/80 hover:text-white hover:border-jungle-accent transition"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </aside>
      ) : null}

      {isLoading ? (
        <div className="flex justify-center py-16">
          <LoadingSpinner />
        </div>
      ) : error ? (
        <div className="text-center text-red-400 py-16">שגיאה בטעינת המסיבות: {error}</div>
      ) : (
        <PartyGrid parties={paginatedParties} />
      )}

      <div className="flex justify-between items-center mt-10">
        <div>
          {prevPagePath && (
            <Link to={prevPagePath} className="text-jungle-accent hover:text-white transition">
              ‹ עמוד קודם
            </Link>
          )}
        </div>
        <div>
          {nextPagePath && (
            <Link to={nextPagePath} className="text-jungle-accent hover:text-white transition">
              עמוד הבא ›
            </Link>
          )}
        </div>
      </div>

      <FaqBlock items={config.faq} />
    </div>
  );
};

export default TaxonomyPage;

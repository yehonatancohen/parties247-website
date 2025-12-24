import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { fetchCarousels, fetchParties } from '../../parties247-next/lib/api';
import { createCarouselSlug } from '../../parties247-next/lib/carousels';
import PartyGrid from '../ui/PartyGrid';
import { taxonomyConfigs, cities, genres } from '../../parties247-next/src/data/taxonomy';
import { BASE_URL } from '../../constants';

export const revalidate = 3600;

type Props = { params: { slug: string[] } };

const allTaxonomies = [...taxonomyConfigs, ...cities, ...genres];

const findTaxonomyByPath = (path: string) => allTaxonomies.find((config) => config.path === path);

const filterByTaxonomy = (config: (typeof allTaxonomies)[number], parties: Awaited<ReturnType<typeof fetchParties>>) => {
  const now = new Date();
  const upcoming = parties.filter((party) => new Date(party.date) >= now);

  if (config.type === 'city') {
    return upcoming.filter(
      (party) =>
        party.location.name.includes(config.label) || party.location.name.includes(config.slug) || party.region.includes(config.label),
    );
  }

  if (config.type === 'genre') {
    return upcoming.filter((party) => party.tags.some((tag) => tag.includes(config.label) || tag.includes(config.slug)));
  }

  return upcoming.filter((party) => party.tags.some((tag) => tag.includes(config.label) || tag.includes(config.slug)));
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slugPath = `/${params.slug.join('/')}`;
  if (params.slug[0] === 'carousels') {
    const [, carouselSlug] = params.slug;
    const carousels = await fetchCarousels();
    const carousel = carousels.find((c) => createCarouselSlug(c.title) === carouselSlug);
    if (!carousel) return {};
    const title = `${carousel.title} | Parties 24/7`;
    const description = `כל האירועים בקרוסלה "${carousel.title}" מתעדכנים כל שעה בעזרת ISR.`;
    const canonical = `${BASE_URL}/carousels/${carouselSlug}`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: { title, description, url: canonical },
    };
  }

  const taxonomy = findTaxonomyByPath(slugPath);
  if (!taxonomy) return {};

  const title = `${taxonomy.title} | Parties 24/7`;
  const canonical = `${BASE_URL}${taxonomy.path}`;
  return {
    title,
    description: taxonomy.description,
    alternates: { canonical },
    openGraph: {
      title,
      description: taxonomy.description,
      url: canonical,
      images: taxonomy.ogImage
        ? [
            {
              url: taxonomy.ogImage,
              width: 1200,
              height: 630,
              alt: taxonomy.title,
            },
          ]
        : undefined,
    },
  };
}

export default async function CatchAllPage({ params }: Props) {
  const slugPath = `/${params.slug.join('/')}`;

  if (params.slug[0] === 'carousels') {
    const [, carouselSlug] = params.slug;
    const [parties, carousels] = await Promise.all([fetchParties(), fetchCarousels()]);
    const carousel = carousels.find((c) => createCarouselSlug(c.title) === carouselSlug);
    if (!carousel) {
      notFound();
    }
    const upcoming = parties.filter((party) => new Date(party.date) >= new Date());
    const carouselParties = upcoming.filter((party) => carousel.partyIds.includes(party.id));

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: carousel.title,
      itemListElement: carouselParties.map((party, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: party.name,
        url: `${BASE_URL}/event/${party.slug}`,
      })),
    };

    return (
      <div className="container mx-auto px-4 space-y-6">
        <header className="text-center space-y-2">
          <h1 className="text-4xl font-display text-white">{carousel.title}</h1>
          <p className="text-jungle-text/70">האירועים שמופיעים בקרוסלה זו מתעדכנים אחת לשעה.</p>
        </header>
        <PartyGrid parties={carouselParties} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </div>
    );
  }

  const taxonomy = findTaxonomyByPath(slugPath);
  if (taxonomy) {
    const parties = await fetchParties();
    const taxonomyParties = filterByTaxonomy(taxonomy, parties);

    const jsonLd = {
      '@context': 'https://schema.org',
      '@type': 'ItemList',
      name: taxonomy.title,
      itemListElement: taxonomyParties.map((party, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: party.name,
        url: `${BASE_URL}/event/${party.slug}`,
      })),
    };

    return (
      <div className="container mx-auto px-4 space-y-4">
        <nav className="text-sm text-jungle-text/60 flex gap-2 flex-wrap">
          {taxonomy.breadcrumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {crumb.path ? (
                <Link href={crumb.path} className="hover:text-white">
                  {crumb.label}
                </Link>
              ) : (
                <span>{crumb.label}</span>
              )}
              {idx < taxonomy.breadcrumbs.length - 1 && <span aria-hidden>/</span>}
            </span>
          ))}
        </nav>
        <header className="space-y-2">
          <p className="uppercase text-xs tracking-[0.2em] text-jungle-accent/80">{taxonomy.label}</p>
          <h1 className="text-4xl font-display text-white">{taxonomy.title}</h1>
          <p className="text-jungle-text/75 max-w-3xl">{taxonomy.intro}</p>
        </header>

        <div className="prose prose-invert max-w-3xl">
          <p className="text-jungle-text/80 leading-relaxed">{taxonomy.description}</p>
          {taxonomy.body && <p className="text-jungle-text/70 leading-relaxed whitespace-pre-line">{taxonomy.body}</p>}
        </div>

        <PartyGrid parties={taxonomyParties} />

        {taxonomy.relatedPaths?.length ? (
          <div className="bg-jungle-surface/70 border border-wood-brown/40 rounded-xl p-4 space-y-2">
            <h2 className="text-2xl font-display text-white">דפים קשורים</h2>
            <div className="flex flex-wrap gap-3">
              {taxonomy.relatedPaths.map((related) => (
                <Link key={related.path} href={related.path} className="text-jungle-accent hover:text-white">
                  {related.label}
                </Link>
              ))}
            </div>
          </div>
        ) : null}

        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </div>
    );
  }

  notFound();
}

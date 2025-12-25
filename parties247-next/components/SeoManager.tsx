import React from 'react';
import { Helmet } from '@/parties247-next/lib/react-helmet-async';
import { BASE_URL, BRAND_LOGO_URL, SOCIAL_LINKS } from '../src/data/constants';
import JsonLd from './JsonLd';

interface SeoManagerProps {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
  ogType?: string;
  jsonLd?: object | object[];
  alternateLocales?: { hrefLang: string; href: string }[];
}

const SeoManager: React.FC<SeoManagerProps> = ({
  title,
  description,
  canonicalPath,
  ogImage = 'https://www.parties247.co.il/preview.jpg',
  ogType = 'website',
  jsonLd,
  alternateLocales,
}) => {
  const canonicalUrl = canonicalPath.startsWith('http')
    ? canonicalPath
    : `${BASE_URL}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`;

  const locales = alternateLocales ?? [
    { hrefLang: 'he', href: canonicalUrl },
    { hrefLang: 'en', href: `${canonicalUrl}?lang=en` },
  ];

  const organizationJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${BASE_URL}#organization`,
    'name': 'Parties 24/7',
    'url': BASE_URL,
    'logo': {
      '@type': 'ImageObject',
      'url': BRAND_LOGO_URL,
    },
    'sameAs': [
      SOCIAL_LINKS.instagram,
      SOCIAL_LINKS.tiktok,
      SOCIAL_LINKS.whatsapp,
    ],
  };

  const pageJsonLd = jsonLd
    ? Array.isArray(jsonLd)
      ? jsonLd
      : [jsonLd]
    : [];

  const combinedJsonLd = [organizationJsonLd, ...pageJsonLd];

  return (
    <>
      <Helmet htmlAttributes={{ lang: 'he', dir: 'rtl' }}>
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={canonicalUrl} />

        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image" content={ogImage} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content="he_IL" />
        <meta property="og:site_name" content="Parties 24/7" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogImage} />

        {locales.map((locale) => (
          <link key={locale.hrefLang} rel="alternate" hrefLang={locale.hrefLang} href={locale.href} />
        ))}
      </Helmet>
      {combinedJsonLd.length > 0 && <JsonLd data={combinedJsonLd} />}
    </>
  );
};

export default SeoManager;

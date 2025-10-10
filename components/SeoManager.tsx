import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BASE_URL } from '../constants';
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
      {jsonLd && <JsonLd data={jsonLd} />}
    </>
  );
};

export default SeoManager;

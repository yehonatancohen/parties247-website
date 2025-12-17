import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BASE_URL, BRAND_LOGO_URL, SOCIAL_LINKS } from '../constants';
import JsonLd from './JsonLd';

const DEFAULT_OG_IMAGE_DIMENSION = '256';
const DEFAULT_OG_UPDATED_TIME = new Date().toISOString();
const OG_IMAGE_TARGET_QUALITY = '80';

const buildOptimizedOgImage = (imageUrl: string) => {
  try {
    const url = new URL(imageUrl);

    if (url.searchParams.has('w')) {
      url.searchParams.set('w', DEFAULT_OG_IMAGE_DIMENSION);
    } else {
      url.searchParams.append('w', DEFAULT_OG_IMAGE_DIMENSION);
    }
    if (url.searchParams.has('width')) {
      url.searchParams.set('width', DEFAULT_OG_IMAGE_DIMENSION);
    } else if (!url.searchParams.has('w')) {
      url.searchParams.append('width', DEFAULT_OG_IMAGE_DIMENSION);
    }

    if (url.searchParams.has('h')) {
      url.searchParams.set('h', DEFAULT_OG_IMAGE_DIMENSION);
    } else {
      url.searchParams.append('h', DEFAULT_OG_IMAGE_DIMENSION);
    }
    if (url.searchParams.has('height')) {
      url.searchParams.set('height', DEFAULT_OG_IMAGE_DIMENSION);
    } else if (!url.searchParams.has('h')) {
      url.searchParams.append('height', DEFAULT_OG_IMAGE_DIMENSION);
    }

    if (url.searchParams.has('q')) {
      url.searchParams.set('q', OG_IMAGE_TARGET_QUALITY);
    } else if (url.searchParams.has('quality')) {
      url.searchParams.set('quality', OG_IMAGE_TARGET_QUALITY);
    } else {
      url.searchParams.append('q', OG_IMAGE_TARGET_QUALITY);
    }

    return url.toString();
  } catch (error) {
    console.warn('Could not optimize og image URL, returning original.', error);
    return imageUrl;
  }
};

interface SeoManagerProps {
  title: string;
  description: string;
  canonicalPath: string;
  ogImage?: string;
  ogType?: string;
  ogUpdatedTime?: string;
  jsonLd?: object | object[];
  alternateLocales?: { hrefLang: string; href: string }[];
}

const SeoManager: React.FC<SeoManagerProps> = ({
  title,
  description,
  canonicalPath,
  ogImage = 'https://www.parties247.co.il/preview.jpg',
  ogType = 'website',
  ogUpdatedTime = DEFAULT_OG_UPDATED_TIME,
  jsonLd,
  alternateLocales,
}) => {
  const canonicalUrl = canonicalPath.startsWith('http')
    ? canonicalPath
    : `${BASE_URL}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`;

  const resolvedOgImage = ogImage.startsWith('http')
    ? ogImage
    : `${BASE_URL}/${ogImage.replace(/^\//, '')}`;
  const optimizedOgImage = buildOptimizedOgImage(resolvedOgImage);

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
        <meta property="og:image" content={optimizedOgImage} itemProp="image" />
        <meta property="og:image:width" content={DEFAULT_OG_IMAGE_DIMENSION} />
        <meta property="og:image:height" content={DEFAULT_OG_IMAGE_DIMENSION} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content="he_IL" />
        <meta property="og:site_name" content="Parties 24/7" />
        <meta property="og:updated_time" content={ogUpdatedTime} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={optimizedOgImage} />

        {locales.map((locale) => (
          <link key={locale.hrefLang} rel="alternate" hrefLang={locale.hrefLang} href={locale.href} />
        ))}
      </Helmet>
      {combinedJsonLd.length > 0 && <JsonLd data={combinedJsonLd} />}
    </>
  );
};

export default SeoManager;

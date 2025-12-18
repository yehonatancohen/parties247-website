import React from 'react';
import { Helmet } from 'react-helmet-async';
import { BASE_URL, BRAND_LOGO_URL, SOCIAL_LINKS } from '../constants';
import JsonLd from './JsonLd';

const OG_IMAGE_WIDTH = '1200';
const OG_IMAGE_HEIGHT = '630';
const DEFAULT_OG_UPDATED_TIME = new Date().toISOString();
const OG_IMAGE_ALT_FALLBACK = 'Event cover image';

const buildWhatsappOgImageUrl = (imageUrl: string, versionTag?: string) => {
  try {
    const url = new URL(imageUrl);

    url.pathname = url.pathname
      .replace('_coverImage', '_whatsappImage')
      .replace('_coverimage', '_whatsappImage');
    url.search = '';

    if (versionTag) {
      url.searchParams.set('v', versionTag);
    }

    return url.toString();
  } catch (error) {
    console.warn('Could not build OG asset URL, returning original.', error);
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
  const ogAssetImage = buildWhatsappOgImageUrl(resolvedOgImage, ogUpdatedTime);

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
        <meta property="og:image" content={ogAssetImage} itemProp="image" />
        <meta property="og:image:secure_url" content={ogAssetImage} />
        <meta property="og:image:type" content="image/jpeg" />
        <meta property="og:image:width" content={OG_IMAGE_WIDTH} />
        <meta property="og:image:height" content={OG_IMAGE_HEIGHT} />
        <meta property="og:image:alt" content={title || OG_IMAGE_ALT_FALLBACK} />
        <meta property="og:type" content={ogType} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content="he_IL" />
        <meta property="og:site_name" content="Parties 24/7" />
        <meta property="og:updated_time" content={ogUpdatedTime} />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image" content={ogAssetImage} />

        {locales.map((locale) => (
          <link key={locale.hrefLang} rel="alternate" hrefLang={locale.hrefLang} href={locale.href} />
        ))}
      </Helmet>
      {combinedJsonLd.length > 0 && <JsonLd data={combinedJsonLd} />}
    </>
  );
};

export default SeoManager;

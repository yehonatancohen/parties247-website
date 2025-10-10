import React, { useEffect } from 'react';
import { BASE_URL } from '../constants';

type Hreflang = {
  href: string;
  hrefLang: string;
};

interface SEOProps {
  title: string;
  description: string;
  canonicalPath: string; // e.g., "/event/my-cool-party"
  ogImage?: string;
  ogType?: string;
  jsonLd?: object | object[];
  prevPagePath?: string | null;
  nextPagePath?: string | null;
  feedLinks?: { title: string; href: string; type: 'application/rss+xml' | 'application/atom+xml' | 'application/json' }[];
  icsLink?: string;
}

const STATIC_MIRROR_URL = `${BASE_URL}/ssg`;

const SEO: React.FC<SEOProps> = ({ 
  title, 
  description, 
  canonicalPath,
  ogImage = 'https://parties247.co.il/preview.jpg', // Default OG image
  ogType = 'website',
  jsonLd,
  prevPagePath,
  nextPagePath,
  feedLinks,
  icsLink,
}) => {

  useEffect(() => {
    const head = document.head;
    const selectors = [
      'title',
      'meta[name="description"]',
      'link[rel="canonical"]',
      'meta[property^="og:"]',
      'meta[name^="twitter:"]',
      'link[rel="alternate"]',
      'link[rel="prev"]',
      'link[rel="next"]',
      'script[type="application/ld+json"]',
    ];
    
    // Clear previous SEO tags
    head.querySelectorAll(selectors.join(', ')).forEach(el => el.remove());
    
    const absoluteCanonical = `${STATIC_MIRROR_URL}${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`;

    // Title
    document.title = title;

    // Standard Metas
    setMeta('description', description);
    
    // OG Metas
    setMeta('og:title', title, 'property');
    setMeta('og:description', description, 'property');
    setMeta('og:url', absoluteCanonical, 'property');
    setMeta('og:image', ogImage, 'property');
    setMeta('og:type', ogType, 'property');
    setMeta('og:site_name', 'Parties 24/7', 'property');
    setMeta('og:locale', 'he_IL', 'property');

    // Twitter Card Metas
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', title);
    setMeta('twitter:description', description);
    setMeta('twitter:image', ogImage);

    // Canonical Link
    setLink('canonical', absoluteCanonical);

    // Hreflang Links
    setLink('alternate', `${STATIC_MIRROR_URL}/he${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`, 'hreflang', 'he-IL');
    setLink('alternate', `${STATIC_MIRROR_URL}/en${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`, 'hreflang', 'en');
    setLink('alternate', `${STATIC_MIRROR_URL}/he${canonicalPath.startsWith('/') ? '' : '/'}${canonicalPath}`, 'hreflang', 'x-default');

    // Pagination Links
    if(prevPagePath) setLink('prev', `${BASE_URL}/#${prevPagePath}`);
    if(nextPagePath) setLink('next', `${BASE_URL}/#${nextPagePath}`);

    // Feed Links
    if (feedLinks) {
      feedLinks.forEach(feed => {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.type = feed.type;
        link.title = feed.title;
        link.href = `${BASE_URL}${feed.href}`;
        head.appendChild(link);
      });
    }

    // ICS Calendar Link
    if (icsLink) {
        const link = document.createElement('link');
        link.rel = 'alternate';
        link.type = 'text/calendar';
        link.title = 'Add to Calendar';
        link.href = `${BASE_URL}${icsLink}`;
        head.appendChild(link);
    }
    
    // JSON-LD Script
    if (jsonLd) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.innerHTML = JSON.stringify(jsonLd);
      head.appendChild(script);
    }

    // Cleanup function
    return () => {
       head.querySelectorAll(selectors.join(', ')).forEach(el => el.remove());
    };
  }, [title, description, canonicalPath, ogImage, ogType, jsonLd, prevPagePath, nextPagePath, feedLinks, icsLink]);

  return null;
};

// Helper functions to create/update head elements
function setMeta(nameOrProperty: string, content: string, type: 'name' | 'property' = 'name') {
  let element = document.head.querySelector(`meta[${type}="${nameOrProperty}"]`) as HTMLMetaElement;
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(type, nameOrProperty);
    document.head.appendChild(element);
  }
  element.content = content;
}

function setLink(rel: string, href: string, attrKey?: string, attrValue?: string) {
    let selector = `link[rel="${rel}"]`;
    if (attrKey && attrValue) {
      selector += `[${attrKey}="${attrValue}"]`;
    }
    let element = document.head.querySelector(selector) as HTMLLinkElement;
    if (!element) {
        element = document.createElement('link');
        element.rel = rel;
        if(attrKey && attrValue) element.setAttribute(attrKey, attrValue);
        document.head.appendChild(element);
    }
    element.href = href;
}


export default SEO;
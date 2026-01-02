import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Metadata } from 'next';
import PartyGrid from '@/components/PartyGrid'; // Ensure this path is correct
import { BASE_URL } from '@/data/constants';
import { findCarouselBySlug, createCarouselSlug, filterUpcomingParties } from '@/lib/carousels';
import * as api from '@/services/api'; // Assumption: You have an API service

// Types for the Page Props
interface Props {
  params: {
    carouselSlug: string;
  };
}


async function getCarouselData(slug: string) {
  try {
    const [carousels, parties] = await Promise.all([
      api.getCarousels(),
      api.getParties()
    ]);

    const carousel = findCarouselBySlug(carousels, slug);

    if (!carousel) return null;

    const carouselParties = filterUpcomingParties(parties).filter(party =>
      carousel.partyIds.includes(party.id)
    );

    return { carousel, carouselParties };
  } catch (error) {
    console.error("Failed to fetch carousel data:", error);
    return null;
  }
}


export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const data = await getCarouselData((await params).carouselSlug);
  
  if (!data) {
    return {
      title: 'Carousel Not Found',
    };
  }

  const { carousel } = data;
  const slug = createCarouselSlug(carousel.title);
  
  return {
    title: `${carousel.title} | Parties247`,
    description: `כל המסיבות בקרוסלת "${carousel.title}". הצטרפו לרייב הבא שלכם.`,
    alternates: {
      canonical: `/carousels/${slug}`,
    },
    openGraph: {
      title: `${carousel.title} | Parties247`,
      description: `כל המסיבות בקרוסלת "${carousel.title}". הצטרפו לרייב הבא שלכם.`,
      url: `${BASE_URL}/carousels/${slug}`,
    }
  };
}

/**
 * 3. MAIN PAGE COMPONENT (Server Component)
 * This is async because it awaits data.
 */
export default async function CarouselPage({ params }: Props) {
  const data = await getCarouselData((await params).carouselSlug);

  // Handle 404 - Server Side
  if (!data) {
    // This renders the closest not-found.tsx file
    // Or you can return a custom UI here like in your original code:
    return (
      <div className="container mx-auto px-4 text-center py-16">
        <h2 className="text-2xl font-bold text-white">לא מצאנו את הקרוסלה הזו</h2>
        <p className="text-jungle-text/80 mt-2">
          ייתכן שהמסיבה כבר הסתיימה או שהקישור השתנה.
        </p>
        <Link href="/" className="mt-6 inline-block text-jungle-accent hover:text-white">
          חזרה לעמוד הבית
        </Link>
      </div>
    );
  }

  const { carousel, carouselParties } = data;
  const slug = createCarouselSlug(carousel.title);
  const canonicalPath = `/carousels/${slug}`;

  // JSON-LD Construction
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'עמוד הבית',
        item: `${BASE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: carousel.title,
        item: `${BASE_URL}${canonicalPath}`,
      },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: carouselParties.map((party, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: party.name,
      url: `${BASE_URL}/event/${party.slug}`,
    })),
  };

  return (
    <>
      {/* Inject JSON-LD directly into the HTML */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, itemListJsonLd]) }}
      />

      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-display text-center mb-2 text-white">
          {carousel.title}
        </h1>
        <p className="text-center text-jungle-text/80 mb-6 max-w-lg mx-auto">
          כל המסיבות החמות של "{carousel.title}" במקום אחד.
        </p>
        
        {/* We pass the PRE-FETCHED data to the grid. 
          If PartyGrid uses Next/Image, images will lazy load on the client.
          The text and structure are already here for SEO.
        */}
        <PartyGrid parties={carouselParties} showFilters={false} showSearch={false} />
      </div>
    </>
  );
}

import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useParties } from '../hooks/useParties';
import PartyGrid from '../components/PartyGrid';
import SEO from '../components/SeoManager';
import LoadingSpinner from '../components/LoadingSpinner';
import { Party } from '../types';
import { BASE_URL } from '../constants';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { parties, carousels, isLoading, error, loadingMessage } = useParties();

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-64 text-center">
        <LoadingSpinner />
        {loadingMessage && <p className="text-jungle-accent mt-4 animate-pulse">{loadingMessage}</p>}
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 text-center py-16">
        <h2 className="text-2xl font-bold text-red-400">Something went wrong</h2>
        <p className="text-red-300/80 mt-2">{error}</p>
      </div>
    );
  }

  const carousel = carousels.find(c => c.id === categoryId);
  const categoryParties = carousel
    ? parties.filter(p => carousel.partyIds.includes(p.id))
    : [];

  if (!carousel) {
    return (
      <div className="text-center py-16 container mx-auto px-4">
        <h1 className="text-4xl font-display text-white mb-4">אופס! קטגוריה לא נמצאה</h1>
        <p className="text-jungle-text/80">לא מצאנו את אוסף המסיבות שחיפשת.</p>
        <Link to="/" className="mt-6 inline-block text-jungle-accent hover:text-white font-semibold">חזרה לעמוד הבית</Link>
      </div>
    );
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [{
      '@type': 'ListItem',
      'position': 1,
      'name': 'עמוד הבית',
      'item': `${BASE_URL}/#/`
    },{
      '@type': 'ListItem',
      'position': 2,
      'name': carousel.title,
    }]
  };
  
  return (
    <>
      <SEO 
        title={`${carousel.title} - Parties 24/7`} 
        description={`רשימת המסיבות המלאה לקטגוריית ${carousel.title}.`}
        canonicalPath={`/category/${carousel.id}`}
        jsonLd={breadcrumbJsonLd}
      />
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-display text-center mb-8 text-white">{carousel.title}</h1>
        <PartyGrid parties={categoryParties} />
      </div>
    </>
  );
};

export default CategoryPage;

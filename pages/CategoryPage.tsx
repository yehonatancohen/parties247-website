import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useParties } from '../hooks/useParties';
import PartyGrid from '../components/PartyGrid';
import SeoManager from '../components/SeoManager';
import LoadingSpinner from '../components/LoadingSpinner';
import { Party } from '../types';

const CategoryPage: React.FC = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const { parties, carousels, isLoading } = useParties();

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><LoadingSpinner /></div>;
  }

  const carousel = carousels.find(c => c.id === categoryId);
  const categoryParties = carousel
    ? carousel.partyIds.map(id => parties.find(p => p.id === id)).filter((p): p is Party => Boolean(p))
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

  return (
    <>
      <SeoManager title={`${carousel.title} - Parties 24/7`} description={`רשימת המסיבות המלאה לקטגוריית ${carousel.title}.`} />
      <div className="container mx-auto px-4">
        <h1 className="text-5xl font-display text-center mb-8 text-white">{carousel.title}</h1>
        <PartyGrid parties={categoryParties} />
      </div>
    </>
  );
};

export default CategoryPage;
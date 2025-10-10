import React from 'react';
import SeoManager from '../components/SeoManager';
import { articles } from '../data/articles';
import ArticleCard from '../components/ArticleCard';
import { BASE_URL } from '../constants';

const BlogPage: React.FC = () => {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'בית',
        item: `${BASE_URL}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'כתבות',
        item: `${BASE_URL}/כתבות`,
      },
    ],
  };

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: articles.map((article, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: article.title,
      url: `${BASE_URL}/כתבות/${article.slug}`,
    })),
  };

  return (
    <>
      <SeoManager
        title="מגזין חיי הלילה - Parties 24/7"
        description="כתבות, מדריכים וטיפים על סצנת חיי הלילה בישראל."
        canonicalPath="/כתבות"
        ogType="article"
        jsonLd={[breadcrumbJsonLd, itemListJsonLd]}
      />
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-5xl font-display text-center mb-8 text-white">מגזין חיי הלילה</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default BlogPage;
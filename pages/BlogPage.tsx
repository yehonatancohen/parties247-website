import React from 'react';
import SEO from '../components/SeoManager';
import { articles } from '../data/articles';
import ArticleCard from '../components/ArticleCard';

const BlogPage: React.FC = () => {
  return (
    <>
      <SEO title="מגזין חיי הלילה - Parties 24/7" description="כתבות, מדריכים וטיפים על סצנת חיי הלילה בישראל." canonicalPath="/blog" />
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
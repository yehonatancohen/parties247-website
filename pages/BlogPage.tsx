import React from 'react';
import { Article } from '../types';
import SeoManager from '../components/SeoManager';

const articles: Article[] = [
  {
    id: '1',
    title: 'המועדונים הכי טובים בתל אביב לחיי לילה בלתי נשכחים',
    summary: 'גלו את המקומות שהופכים את תל אביב לבירת חיי הלילה של ישראל, מהאנדרגראונד ועד לגגות היוקרתיים.',
    imageUrl: 'https://picsum.photos/seed/nightlife1/600/400',
  },
  {
    id: '2',
    title: 'מדריך לפסטיבלים של קיץ 2024 בישראל',
    summary: 'כל מה שצריך לדעת על הפסטיבלים הכי חמים של הקיץ, מהצפון ועד הדרום. אל תפספסו את ההזדמנות לחגוג.',
    imageUrl: 'https://picsum.photos/seed/festival/600/400',
  },
  {
    id: '3',
    title: 'איך להתלבש למסיבה: הטיפים שיגרמו לכם לבלוט',
    summary: 'מה ללבוש כדי להרגיש בנוח וגם להיראות מעולה על רחבת הריקודים. המדריך המלא לגברים ונשים.',
    imageUrl: 'https://picsum.photos/seed/fashion/600/400',
  },
];

const BlogPage: React.FC = () => {
  return (
    <>
      <SeoManager title="מגזין חיי הלילה - Parties 24/7" description="כתבות, מדריכים וטיפים על סצנת חיי הלילה בישראל." />
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-display text-center mb-8 text-white">מגזין חיי הלילה</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articles.map(article => (
            <div key={article.id} className="bg-jungle-surface rounded-lg overflow-hidden group border border-wood-brown/50 transform hover:-translate-y-1 transition-transform duration-300">
              <img src={article.imageUrl} alt={article.title} className="w-full h-48 object-cover" />
              <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-jungle-accent transition-colors">{article.title}</h3>
                <p className="text-jungle-text/70 text-sm">{article.summary}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default BlogPage;
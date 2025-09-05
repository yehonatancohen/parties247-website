
import React from 'react';
import { Article } from '../types';

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

const BlogSection: React.FC = () => {
  return (
    <div className="mt-16">
      <h2 className="text-3xl font-bold text-center mb-8 text-white">מגזין חיי הלילה</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articles.map(article => (
          <div key={article.id} className="bg-brand-surface rounded-lg overflow-hidden group">
            <img src={article.imageUrl} alt={article.title} className="w-full h-40 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-bold text-white mb-2 group-hover:text-brand-secondary transition-colors">{article.title}</h3>
              <p className="text-gray-400 text-sm">{article.summary}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogSection;

import React from 'react';
import Link from 'next/link';
import { articles } from '../../data/articles'; 
import { BASE_URL } from '../../data/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'המגזין - Parties 24/7',
  description: 'כל הכתבות והעדכונים החמים',
  alternates: {
    canonical: `${BASE_URL}/articles`,
  },
};

export default function ArticlesIndexPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <header className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-display text-white mb-4">
          המגזין
        </h1>
        <p className="text-jungle-text/80 text-lg">
          כל מה שחם בעולם המסיבות
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <article 
            key={article.slug} 
            className="bg-jungle-surface rounded-xl overflow-hidden border border-wood-brown/30 hover:border-jungle-accent transition-all duration-300 flex flex-col"
          >
            <Link href={`/articles/${encodeURIComponent(article.slug)}`} className="block h-48 overflow-hidden">
              <img
                src={article.imageUrl}
                alt={article.title}
                loading={index < 3 ? "eager" : "lazy"}
                decoding="async"
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </Link>

            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-xl font-display text-white mb-3">
                <Link href={`/articles/${encodeURIComponent(article.slug)}`} className="hover:text-jungle-accent transition-colors">
                  {article.title}
                </Link>
              </h2>
              <p className="text-jungle-text/80 text-sm mb-4 line-clamp-3">
                {article.summary}
              </p>
              <Link
                href={`/articles/${encodeURIComponent(article.slug)}`}
                className="inline-block text-jungle-accent font-semibold hover:text-white transition-colors mt-auto"
              >
                קרא עוד &larr;
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
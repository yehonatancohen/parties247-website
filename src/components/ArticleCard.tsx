import React from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { Article } from '../data/types';

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    return (
        <Link href={`/articles/${article.slug}`} className="group flex h-full flex-col overflow-hidden rounded-[22px] bg-tile transition-colors duration-300 hover:bg-tile-hover">
            <div className="relative aspect-[2/1] overflow-hidden">
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-700 ease-apple group-hover:scale-[1.03]"
                loading="lazy"
                quality={50}
              />
            </div>
            <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h3 className="text-[19px] font-bold leading-snug text-ink">{article.title}</h3>
                <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-ink-2">{article.summary}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-[15px] text-link group-hover:underline underline-offset-4">
                  לקריאה
                  <svg viewBox="0 0 24 24" className="h-[0.8em] w-[0.8em]" fill="none" stroke="currentColor" strokeWidth={2.6} aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
                  </svg>
                </span>
            </div>
        </Link>
    );
};

export default ArticleCard;

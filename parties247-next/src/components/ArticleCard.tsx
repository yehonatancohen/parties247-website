import React from 'react';
import Image from 'next/image'
import Link from 'next/link'
import { Article } from '../data/types';

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    return (
        <Link href={`/articles/${article.slug}`} className="block bg-jungle-surface rounded-lg overflow-hidden group border border-wood-brown/50 transform hover:-translate-y-1 transition-transform duration-300">
            <Image
              src={article.imageUrl}
              alt={article.title}
              className="w-full h-48 object-cover"
              loading="lazy"
              decoding="async"
              width={640}
              height={320}
              quality={50}
            />
            <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-jungle-accent transition-colors">{article.title}</h3>
                <p className="text-jungle-text/70 text-sm">{article.summary}</p>
            </div>
        </Link>
    );
};

export default ArticleCard;
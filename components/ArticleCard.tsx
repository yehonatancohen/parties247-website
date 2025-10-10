import React from 'react';
import { Link } from 'react-router-dom';
import { Article } from '../types';
import { DEFAULT_TAXONOMY_IMAGE } from '../constants';

interface ArticleCardProps {
    article: Article;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ article }) => {
    return (
        <Link to={`/כתבות/${article.slug}`} className="block bg-jungle-surface rounded-lg overflow-hidden group border border-wood-brown/50 transform hover:-translate-y-1 transition-transform duration-300">
            <img
                src={article.imageUrl || DEFAULT_TAXONOMY_IMAGE}
                alt={article.title}
                className="w-full h-48 object-cover"
                loading="lazy"
                onError={(event) => {
                    event.currentTarget.src = DEFAULT_TAXONOMY_IMAGE;
                }}
            />
            <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-jungle-accent transition-colors">{article.title}</h3>
                <p className="text-jungle-text/70 text-sm">{article.summary}</p>
            </div>
        </Link>
    );
};

export default ArticleCard;
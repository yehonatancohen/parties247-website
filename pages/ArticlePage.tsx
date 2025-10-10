import React from 'react';
import { useParams, Link } from 'react-router-dom';
import SeoManager from '../components/SeoManager';
import { articles } from '../data/articles';
import { BASE_URL, DEFAULT_TAXONOMY_IMAGE } from '../constants';

const ArticlePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const article = articles.find(a => a.slug === slug);

  if (!article) {
    return (
      <div className="text-center py-16 container mx-auto px-4">
        <h1 className="text-4xl font-display text-white mb-4">אופס! כתבה לא נמצאה</h1>
        <p className="text-jungle-text/80">לא מצאנו את הכתבה שחיפשת.</p>
        <Link to="/כתבות" className="mt-6 inline-block text-jungle-accent hover:text-white font-semibold">חזרה למגזין</Link>
      </div>
    );
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      {
        '@type': 'ListItem',
        'position': 1,
        'name': 'בית',
        'item': `${BASE_URL}/`,
      },
      {
        '@type': 'ListItem',
        'position': 2,
        'name': 'כתבות',
        'item': `${BASE_URL}/כתבות`,
      },
      {
        '@type': 'ListItem',
        'position': 3,
        'name': article.title,
      },
    ],
  };
  
  const imageUrl = article.imageUrl || DEFAULT_TAXONOMY_IMAGE;

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    'headline': article.title,
    'image': imageUrl,
    'description': article.summary,
    'author': {
        '@type': 'Organization',
        'name': 'Parties 24/7'
    },
    'publisher': {
        '@type': 'Organization',
        'name': 'Parties 24/7',
        'logo': {
            '@type': 'ImageObject',
            'url': 'https://vjkiztnx7gionfos.public.blob.vercel-storage.com/Partieslogo.PNG'
        }
    },
    'datePublished': new Date().toISOString(), // Placeholder
  }

  return (
    <>
      <SeoManager
        title={`${article.title} - Parties 24/7`}
        description={article.summary}
        canonicalPath={`/כתבות/${article.slug}`}
        ogImage={imageUrl}
        ogType="article"
        jsonLd={[breadcrumbJsonLd, articleJsonLd]}
      />
      <div className="container mx-auto px-4">
        <article className="max-w-4xl mx-auto text-jungle-text/90">
          <header className="mb-8">
            <Link to="/כתבות" className="text-jungle-accent hover:text-white transition-colors mb-4 inline-block">
              &larr; חזרה למגזין
            </Link>
            <h1 className="text-4xl md:text-5xl font-display text-center text-white">{article.title}</h1>
          </header>
          
          <img
            src={imageUrl}
            alt={article.title}
            className="w-full aspect-video object-cover rounded-lg mb-8"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.src = DEFAULT_TAXONOMY_IMAGE;
            }}
          />
          
          <div className="prose prose-invert prose-lg max-w-none bg-jungle-surface p-8 rounded-lg border border-wood-brown/50">
            {article.content.split('\n\n').map((paragraph, index) => {
                if (paragraph.startsWith('### ')) {
                    return <h3 key={index} className="text-2xl font-display text-jungle-accent mt-6 mb-2">{paragraph.substring(4)}</h3>
                }
                return <p key={index}>{paragraph}</p>
            })}
          </div>
        </article>
      </div>
      <style>{`
        .prose-invert p {
            color: #e0f0e3;
            line-height: 1.7;
        }
        .prose-invert h3 {
            color: #76c893;
        }
      `}</style>
    </>
  );
};

export default ArticlePage;
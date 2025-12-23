import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { articles } from '../../../data/articles';
import { BASE_URL } from '../../../constants';

type Props = { params: { slug: string } };

export const dynamic = 'force-static';

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) {
    return {
      title: 'כתבה לא נמצאה | Parties 24/7',
      description: 'העמוד שחיפשת לא קיים.',
    };
  }

  const canonicalPath = `${BASE_URL}/blog/${article.slug}`;
  return {
    title: `${article.title} | Parties 24/7`,
    description: article.summary,
    alternates: { canonical: canonicalPath },
    openGraph: {
      title: article.title,
      description: article.summary,
      type: 'article',
      url: canonicalPath,
      images: [
        {
          url: article.imageUrl,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
  };
}

export default function ArticlePage({ params }: Props) {
  const article = articles.find((a) => a.slug === params.slug);
  if (!article) {
    notFound();
  }

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
        item: `${BASE_URL}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
      },
    ],
  };

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    image: article.imageUrl,
    description: article.summary,
    author: {
      '@id': `${BASE_URL}#organization`,
    },
    publisher: {
      '@id': `${BASE_URL}#organization`,
    },
    datePublished: new Date().toISOString(),
  };

  return (
    <div className="container mx-auto px-4">
      <article className="max-w-4xl mx-auto text-jungle-text/90">
        <header className="mb-8">
          <Link href="/blog" className="text-jungle-accent hover:text-white transition-colors mb-4 inline-block">
            &larr; חזרה למגזין
          </Link>
          <h1 className="text-4xl md:text-5xl font-display text-center text-white">{article.title}</h1>
        </header>

        <img
          src={article.imageUrl}
          alt={article.title}
          className="w-full aspect-video object-cover rounded-lg mb-8"
          loading="lazy"
          decoding="async"
        />

        <div className="prose prose-invert prose-lg max-w-none bg-jungle-surface p-8 rounded-lg border border-wood-brown/50">
          {article.content.split('\n\n').map((paragraph, index) => {
            if (paragraph.startsWith('### ')) {
              return (
                <h3 key={index} className="text-2xl font-display text-jungle-accent mt-6 mb-2">
                  {paragraph.substring(4)}
                </h3>
              );
            }
            return <p key={index}>{paragraph}</p>;
          })}
        </div>
      </article>

      <style>{`
        .prose-invert p {
            color: #e0f0e3;
            line-height: 1.7;
        }
        .prose-invert h3 {
            color: #76c893;
        }
      `}</style>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([breadcrumbJsonLd, articleJsonLd]) }} />
    </div>
  );
}

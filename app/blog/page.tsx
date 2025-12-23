import Link from 'next/link';
import { articles } from '../../data/articles';

export const dynamic = 'force-static';

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 space-y-8">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-display text-white">כתבות ומדריכים</h1>
        <p className="text-jungle-text/70 max-w-2xl mx-auto">
          תכנים מעודכנים על ליינים, מדריכי מסיבות וטיפים לשיפור חוויית הבילוי.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map((article) => (
          <article key={article.id} className="bg-jungle-surface/80 border border-wood-brown/50 rounded-xl overflow-hidden shadow-lg">
            <Link href={`/blog/${article.slug}`}>
              <img
                src={article.imageUrl}
                alt={article.title}
                className="w-full aspect-video object-cover"
                loading="lazy"
              />
              <div className="p-4 space-y-2">
                <h2 className="text-2xl font-display text-white">{article.title}</h2>
                <p className="text-jungle-text/70">{article.summary}</p>
                <span className="inline-flex items-center gap-2 text-jungle-accent font-semibold">
                  קראו עוד <span aria-hidden>→</span>
                </span>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}

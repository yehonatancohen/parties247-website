import { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';
import { articles } from "@/data/articles";
import { BASE_URL } from "@/data/constants";

// Inline formatting for article body text: **bold** and [label](/href) links.
// (Previously markdown links rendered as literal "[label](/href)" text — the
// cross-links that make a guide article useful for SEO never actually worked.)
const renderInline = (text: string, keyPrefix: string) => {
  const parts: ReactNode[] = [];
  const re = /\[([^\]]+)\]\((\/[^)\s]+)\)|\*\*([^*]+)\*\*/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index));
    if (m[1] && m[2]) {
      parts.push(
        <Link key={`${keyPrefix}-l-${i}`} href={m[2]} className="text-jungle-lime underline underline-offset-2 hover:text-white transition-colors">
          {m[1]}
        </Link>,
      );
    } else if (m[3]) {
      parts.push(<strong key={`${keyPrefix}-b-${i}`} className="font-bold text-white">{m[3]}</strong>);
    }
    last = m.index + m[0].length;
    i += 1;
  }
  if (last < text.length) parts.push(text.slice(last));
  return parts.length ? parts : text;
};

const renderContent = (content: string) => {
  return content.split("\n").map((line, index) => {
    if (!line.trim()) {
      return <div key={`break-${index}`} className="h-2" />;
    }

    if (line.startsWith("### ")) {
      return (
        <h3 key={`heading-${index}`} className="text-xl font-semibold text-white">
          {renderInline(line.replace("### ", ""), `h-${index}`)}
        </h3>
      );
    }

    return (
      <p key={`paragraph-${index}`} className="text-base leading-relaxed text-jungle-text/90">
        {renderInline(line, `p-${index}`)}
      </p>
    );
  });
};

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const article = articles.find((entry) =>
    entry.slug === decodedSlug || encodeURIComponent(entry.slug) === slug
  );

  if (!article) {
    return {
      title: "הכתבה לא נמצאה",
      description: "לא הצלחנו למצוא את הכתבה שביקשתם.",
    };
  }

  return {
    title: `${article.title} | המגזין`,
    description: article.summary,
    alternates: {
      canonical: `${BASE_URL}/articles/${encodeURIComponent(article.slug)}`,
    },
    openGraph: {
      title: `${article.title} | Parties 24/7`,
      description: article.summary,
      images: [article.imageUrl],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);

  const article = articles.find(
    (entry) => entry.slug === decodedSlug || encodeURIComponent(entry.slug) === slug
  );

  if (!article) notFound();

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.summary,
    'image': article.imageUrl,
    'datePublished': article.datePublished,
    'dateModified': article.dateModified,
    'author': {
      '@type': 'Organization',
      'name': 'Parties 24/7',
      'url': BASE_URL,
    },
    'publisher': {
      '@type': 'Organization',
      'name': 'Parties 24/7',
      'url': BASE_URL,
    },
    'url': `${BASE_URL}/articles/${encodeURIComponent(article.slug)}`,
  };

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-wide text-jungle-text/60">המגזין</p>
        <h1 className="text-3xl md:text-4xl font-display text-white">{article.title}</h1>
        <p className="text-jungle-text/80 text-base md:text-lg">{article.summary}</p>
      </header>

      {article.imageUrl && (
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl">
          <Image
            src={article.imageUrl}
            alt={article.title}
            className="h-[320px] w-full object-cover"
            loading="eager"
            decoding="async"
            width={800}
            height={320}
          />
        </div>
      )}

      <article className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow">
        {renderContent(article.content || "")}
      </article>

      <div className="text-center">
        <Link
          href="/articles"
          className="inline-flex items-center gap-2 rounded-full bg-jungle-accent px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
        >
          חזרה לכל הכתבות
        </Link>
      </div>
    </main>
  );
}
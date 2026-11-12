import { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from 'next/image';
import { articles } from "@/data/articles";
import { BASE_URL } from "@/data/constants";
import RelatedPartyCard from "@/components/RelatedPartyCard";
import { getParties } from "@/services/api";
import { ARTICLE_PARTY_TOPICS, pickArticleParties } from "@/lib/articleParties";
import type { Party } from "@/data/types";

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
        <Link key={`${keyPrefix}-l-${i}`} href={m[2]} className="text-link underline underline-offset-2 transition-colors">
          {m[1]}
        </Link>,
      );
    } else if (m[3]) {
      parts.push(<strong key={`${keyPrefix}-b-${i}`} className="font-bold text-ink">{m[3]}</strong>);
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
        <h3 key={`heading-${index}`} className="text-xl font-semibold text-ink">
          {renderInline(line.replace("### ", ""), `h-${index}`)}
        </h3>
      );
    }

    return (
      <p key={`paragraph-${index}`} className="text-base leading-relaxed text-ink-2">
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

  // Guides end in parties you can buy, not a dead end (seo-update 2026-11-12).
  // A failed feed just hides the block; the article itself never depends on it.
  const partyTopic = ARTICLE_PARTY_TOPICS[article.slug];
  let topicParties: Party[] = [];
  if (partyTopic) {
    try {
      topicParties = pickArticleParties(await getParties(), partyTopic);
    } catch (error) {
      console.error("Failed to load parties for article", error);
    }
  }

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
    <main className="font-apple mx-auto max-w-[860px] px-4 py-12 sm:px-6 sm:py-20 space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <header className="space-y-4 text-center">
        <h1 className="text-[34px] font-bold leading-tight text-ink sm:text-[48px]">{article.title}</h1>
        <p className="text-ink-2 text-base md:text-lg">{article.summary}</p>
      </header>

      {article.imageUrl && (
        <div className="overflow-hidden rounded-[22px] border border-hairline">
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

      <article className="space-y-4 rounded-[22px] border border-hairline bg-tile p-6 shadow">
        {renderContent(article.content || "")}
      </article>

      {partyTopic && topicParties.length > 0 && (
        <section aria-labelledby="article-parties" className="pt-4">
          <h2 id="article-parties" className="mb-6 text-center text-[24px] font-bold text-ink sm:text-[32px]">
            {partyTopic.heading}
          </h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-4">
            {topicParties.map((party) => (
              <RelatedPartyCard key={party.id} party={party} />
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href={partyTopic.moreHref} className="text-link font-semibold hover:underline">
              {partyTopic.moreLabel}
            </Link>
          </div>
        </section>
      )}

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
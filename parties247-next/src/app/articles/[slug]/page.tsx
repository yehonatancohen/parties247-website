import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { articles } from "@/data/articles";
import { BASE_URL } from "@/data/constants";

const renderContent = (content: string) => {
  return content.split("\n").map((line, index) => {
    if (!line.trim()) {
      return <div key={`break-${index}`} className="h-2" />;
    }

    if (line.startsWith("### ")) {
      return (
        <h3 key={`heading-${index}`} className="text-xl font-semibold text-white">
          {line.replace("### ", "")}
        </h3>
      );
    }

    return (
      <p key={`paragraph-${index}`} className="text-base leading-relaxed text-jungle-text/90">
        {line}
      </p>
    );
  });
};

export async function generateStaticParams() {
  return articles.map((article) => ({ slug: encodeURIComponent(article.slug) }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug);
  const article = articles.find((entry) =>
    entry.slug === decodedSlug || encodeURIComponent(entry.slug) === params.slug
  );

  if (!article) {
    return {
      title: "הכתבה לא נמצאה | Parties 24/7",
      description: "לא הצלחנו למצוא את הכתבה שביקשתם.",
    };
  }

  return {
    title: `${article.title} | המגזין של Parties 24/7`,
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

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug);
  const article = articles.find((entry) =>
    entry.slug === decodedSlug || encodeURIComponent(entry.slug) === params.slug
  );

  if (!article) {
    notFound();
  }

  return (
    <main className="container mx-auto max-w-4xl px-4 py-12 space-y-8">
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-wide text-jungle-text/60">המגזין</p>
        <h1 className="text-3xl md:text-4xl font-display text-white">{article?.title}</h1>
        <p className="text-jungle-text/80 text-base md:text-lg">{article?.summary}</p>
      </header>

      {article?.imageUrl && (
        <div className="overflow-hidden rounded-2xl border border-white/10 shadow-xl">
          <img
            src={article.imageUrl}
            alt={article.title}
            className="h-[320px] w-full object-cover"
            loading="eager"
            decoding="async"
          />
        </div>
      )}

      <article className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 shadow">
        {renderContent(article?.content || "")}
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

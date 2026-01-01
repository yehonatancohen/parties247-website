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
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((entry) => entry.slug === slug);

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
      canonical: `${BASE_URL}/articles/${article.slug}`,
    },
    openGraph: {
      title: `${article.title} | Parties 24/7`,
      description: article.summary,
      images: [article.imageUrl],
    },
  };
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  const article = articles.find((entry) => entry.slug === slug);
  const related = articles.filter((entry) => entry.slug !== slug).slice(0, 3);

  if (!article) {
    notFound();
  }

  return (
    <main className="bg-gradient-to-b from-jungle-deep via-jungle-surface/40 to-jungle-deep">
      <div className="mx-auto max-w-5xl px-4 pb-16 pt-10 space-y-10">
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-jungle-text/70">המגזין</p>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-display text-white drop-shadow-sm">{article?.title}</h1>
          <p className="text-jungle-text/80 text-base md:text-lg max-w-3xl mx-auto leading-relaxed">{article?.summary}</p>
        </header>

        {article?.imageUrl && (
          <div className="overflow-hidden rounded-3xl border border-white/10 shadow-2xl">
            <img
              src={article.imageUrl}
              alt={article.title}
              className="h-[360px] w-full object-cover"
              loading="eager"
              decoding="async"
            />
          </div>
        )}

        <article className="space-y-5 rounded-3xl border border-white/10 bg-white/5 p-6 md:p-10 shadow-2xl backdrop-blur-sm">
          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-wide text-jungle-text/60">
            <span className="rounded-full border border-jungle-accent/40 bg-jungle-accent/15 px-3 py-1 text-jungle-accent">קריאה מומלצת</span>
            <span className="rounded-full border border-white/10 px-3 py-1 text-white/70">מתוך מאגר הכתבות שלנו</span>
          </div>
          <div className="space-y-4 text-lg leading-relaxed text-jungle-text/90">
            {renderContent(article?.content || "")}
          </div>
        </article>

        {related.length > 0 && (
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-jungle-text/60">עוד בנושא</p>
                <h2 className="text-2xl md:text-3xl font-display text-white">עוד כתבות שכדאי לקרוא</h2>
              </div>
              <Link
                href="/articles"
                className="hidden sm:inline-flex items-center gap-2 rounded-full border border-jungle-accent/50 px-4 py-2 text-sm font-semibold text-jungle-accent hover:bg-jungle-accent hover:text-black transition"
              >
                חזרה לארכיון
              </Link>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {related.map((item) => (
                <article
                  key={item.slug}
                  className="group h-full overflow-hidden rounded-2xl border border-white/10 bg-black/30 shadow-xl transition hover:-translate-y-1 hover:border-jungle-accent/60"
                >
                  <Link href={`/articles/${item.slug}`} className="block h-40 overflow-hidden">
                    <img
                      src={item.imageUrl}
                      alt={item.title}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                    />
                  </Link>
                  <div className="p-4 space-y-2">
                    <h3 className="text-lg font-display text-white leading-tight">
                      <Link href={`/articles/${item.slug}`} className="hover:text-jungle-accent transition-colors">
                        {item.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-jungle-text/70 line-clamp-3">{item.summary}</p>
                    <Link
                      href={`/articles/${item.slug}`}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-jungle-accent hover:text-white"
                    >
                      קראו עוד ↗
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}

        <div className="text-center">
          <Link
            href="/articles"
            className="inline-flex items-center gap-2 rounded-full bg-jungle-accent px-5 py-3 text-sm font-semibold text-black shadow-lg shadow-jungle-accent/30 transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            חזרה לכל הכתבות
          </Link>
        </div>
      </div>
    </main>
  );
}

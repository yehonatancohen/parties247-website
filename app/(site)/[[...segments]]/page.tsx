import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { EventCard } from "@/components/EventCard";
import { FAQSection } from "@/components/FAQSection";
import { JsonLd } from "@/components/JsonLd";
import { articles } from "@/data/articles";
import { buildItemListSchema } from "@/lib/events";
import {
  buildBreadcrumbSchema,
  buildPageCopy,
  getPaginationInfo
} from "@/lib/page-content";
import {
  buildSegmentsFromCity,
  buildSegmentsFromCityIntent,
  buildSegmentsFromIntent,
  getAllStaticSegments,
  parseSegments
} from "@/lib/routes";
import { appendPageToSegments, segmentsToPath } from "@/lib/url";

export const revalidate = 86400;

type Params = {
  segments?: string[];
};

type Routed = ReturnType<typeof parseSegments>;

const getPaginationLink = (route: Routed, page: number) => {
  switch (route.type) {
    case "city":
      return segmentsToPath(appendPageToSegments(buildSegmentsFromCity(route.city), page));
    case "intent":
      return segmentsToPath(appendPageToSegments(buildSegmentsFromIntent(route.intent), page));
    case "city-intent":
      return segmentsToPath(
        appendPageToSegments(buildSegmentsFromCityIntent(route.city, route.intent), page)
      );
    default:
      return "#";
  }
};

export async function generateStaticParams() {
  return getAllStaticSegments()
    .filter((segments) => segments.length > 0)
    .map((segments) => ({ segments }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const route = parseSegments(params.segments);
  const copy = buildPageCopy(route);
  return {
    title: copy.metaTitle,
    description: copy.metaDescription,
    alternates: {
      canonical: copy.canonical
    },
    openGraph: {
      title: copy.h1,
      description: copy.metaDescription,
      url: copy.canonical,
      type: route.type === "article" ? "article" : "website",
      locale: "he_IL"
    }
  };
}

export default function DynamicPage({ params }: { params: Params }) {
  const route = parseSegments(params.segments);
  const copy = buildPageCopy(route);
  const pagination = getPaginationInfo(route);
  const breadcrumbSchema = buildBreadcrumbSchema(copy.breadcrumbs);

  switch (route.type) {
    case "articles": {
      return (
        <>
          <JsonLd data={breadcrumbSchema} />
          <Breadcrumbs items={copy.breadcrumbs} />
          <section className="hero">
            <h1>{copy.h1}</h1>
            <p>{copy.intro}</p>
          </section>
          <section className="grid-links">
            {articles.map((article) => (
              <ArticleCard key={article.slug} article={article} />
            ))}
          </section>
        </>
      );
    }
    case "article": {
      const article = route.article;
      return (
        <>
          <JsonLd data={breadcrumbSchema} />
          <Breadcrumbs items={copy.breadcrumbs} />
          <section className="hero">
            <h1>{copy.h1}</h1>
            <p>{copy.intro}</p>
          </section>
          <section>
            {article.body.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </section>
          <section>
            <h2>קישורים מומלצים</h2>
            <ul>
              {article.relatedIntents.map((segments) => (
                <li key={segments.join("-")}>
                  <Link href={`/${segments.join("/")}`}>לעמוד {segments.join(" / ")}</Link>
                </li>
              ))}
            </ul>
          </section>
          <FAQSection faq={copy.faq} />
        </>
      );
    }
    case "city":
    case "intent":
    case "city-intent": {
      const itemListSchema = buildItemListSchema(copy.h1, pagination.events);
      return (
        <>
          <JsonLd data={[breadcrumbSchema, itemListSchema]} />
          <Breadcrumbs items={copy.breadcrumbs} />
          <section className="hero">
            <h1>{copy.h1}</h1>
            <p>{copy.intro}</p>
          </section>
          <section>
            {pagination.events.length ? (
              <div className="event-grid">
                {pagination.events.map((event) => (
                  <EventCard key={event.slug} event={event} />
                ))}
              </div>
            ) : (
              <p>אין כרגע אירועים פעילים בקטגוריה זו. חזרו לבדוק מחר – אנו מעדכנים מדי יום.</p>
            )}
          </section>
          {pagination.totalPages > 1 && "page" in route && (
            <nav
              aria-label="דפדוף"
              style={{ display: "flex", gap: "1rem", marginTop: "2rem" }}
            >
              {route.page > 1 && (
                <Link href={getPaginationLink(route, route.page - 1)}>לעמוד קודם</Link>
              )}
              {route.page < pagination.totalPages && (
                <Link href={getPaginationLink(route, route.page + 1)}>לעמוד הבא</Link>
              )}
            </nav>
          )}
          <FAQSection faq={copy.faq} />
        </>
      );
    }
    default:
      return notFound();
  }
}

import Link from "next/link";
import { JsonLd } from "@/components/JsonLd";
import { ArticleCard } from "@/components/ArticleCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { buildPageCopy, buildBreadcrumbSchema } from "@/lib/page-content";
import { articles } from "@/data/articles";
import { cities } from "@/data/cities";
import { intents } from "@/data/intents";

export const revalidate = 86400;

export default function HomePage() {
  const copy = buildPageCopy({ type: "home" });
  const audienceIntents = intents.filter((intent) => intent.kind === "audience").slice(0, 4);
  const genreIntents = intents.filter((intent) => intent.kind === "genre").slice(0, 4);
  const timeIntents = intents.filter((intent) => intent.kind === "time").slice(0, 4);

  return (
    <>
      <JsonLd data={buildBreadcrumbSchema(copy.breadcrumbs)} />
      <Breadcrumbs items={copy.breadcrumbs} />
      <section className="hero">
        <h1>{copy.h1}</h1>
        <p>{copy.intro}</p>
      </section>

      <section>
        <h2>ערים פופולריות</h2>
        <div className="grid-links">
          {cities.slice(0, 6).map((city) => (
            <Link key={city.slug} href={`/${city.slug}`} className="card-link">
              <h3>{city.name}</h3>
              <p>{city.metaDescription}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>קהלי יעד</h2>
        <div className="grid-links">
          {audienceIntents.map((intent) => (
            <Link
              key={intent.slugSegments.join("-")}
              href={`/${intent.slugSegments.join("/")}`}
              className="card-link"
            >
              <h3>{intent.name}</h3>
              <p>{intent.metaDescription}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>ז'אנרים</h2>
        <div className="grid-links">
          {genreIntents.map((intent) => (
            <Link
              key={intent.slugSegments.join("-")}
              href={`/${intent.slugSegments.join("/")}`}
              className="card-link"
            >
              <h3>{intent.name}</h3>
              <p>{intent.metaDescription}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>זמן יציאה</h2>
        <div className="grid-links">
          {timeIntents.map((intent) => (
            <Link
              key={intent.slugSegments.join("-")}
              href={`/${intent.slugSegments.join("/")}`}
              className="card-link"
            >
              <h3>{intent.name}</h3>
              <p>{intent.metaDescription}</p>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2>כתבות טריות</h2>
        <div className="grid-links">
          {articles.map((article) => (
            <ArticleCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}

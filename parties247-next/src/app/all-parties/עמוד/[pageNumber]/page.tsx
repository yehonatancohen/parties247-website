import type { Metadata } from "next";
import AllPartiesClient from "../../_components/AllPartiesClient";
import { BASE_URL } from "../../../../data/constants";

export const revalidate = 300;

type PageProps = {
  params: { pagenumber: string };
  searchParams?: { query?: string };
};

function parsePageNumber(value: string): number {
  const n = Math.max(parseInt(value, 10) || 1, 1);
  return n;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const currentPage = parsePageNumber(params.pagenumber);
  const pageTitle = `כל המסיבות - עמוד ${currentPage} | Parties 24/7`;
  const pageDescription =
    "חיפוש וסינון בכל המסיבות, הרייבים והאירועים בישראל. מצאו את המסיבה המושלמת עבורכם לפי אזור, סגנון מוזיקה, תאריך ועוד.";

  const canonicalPath = `/all-parties/עמוד/${currentPage}`;
  const query = searchParams?.query ? `?query=${encodeURIComponent(searchParams.query)}` : "";

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: `${BASE_URL}${canonicalPath}${query}`,
    },
  };
}

export default function AllPartiesPaged({ params, searchParams }: PageProps) {
  const currentPage = parsePageNumber(params.pagenumber);
  const query = searchParams?.query ?? "";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "עמוד הבית", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "כל המסיבות", item: `${BASE_URL}/all-parties` },
      { "@type": "ListItem", position: 3, name: `עמוד ${currentPage}`, item: `${BASE_URL}/all-parties/עמוד/${currentPage}` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <AllPartiesClient currentPage={currentPage} initialQuery={query} />
    </>
  );
}
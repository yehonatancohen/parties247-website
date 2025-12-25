import type { Metadata } from "next";
import AllPartiesClient from "./_components/AllPartiesClient";
import { BASE_URL } from "../../data/constants";

export const revalidate = 300;

type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export async function generateMetadata({ searchParams }: PageProps): Promise<Metadata> {
  const currentPage = 1;
  const pageTitle = `כל המסיבות - עמוד ${currentPage} | Parties 24/7`;
  const pageDescription =
    "חיפוש וסינון בכל המסיבות, הרייבים והאירועים בישראל. מצאו את המסיבה המושלמת עבורכם לפי אזור, סגנון מוזיקה, תאריך ועוד.";

  const canonicalPath = `/all-parties`;
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.query ? `?query=${encodeURIComponent(resolvedSearchParams.query as string)}` : "";

  return {
    title: pageTitle,
    description: pageDescription,
    alternates: {
      canonical: `${BASE_URL}${canonicalPath}${query}`,
    },
  };
}

export default async function AllPartiesPage({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams.query ? `?query=${encodeURIComponent(resolvedSearchParams.query as string)}` : "";

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "עמוד הבית", item: `${BASE_URL}/` },
      { "@type": "ListItem", position: 2, name: "כל המסיבות", item: `${BASE_URL}/all-parties` },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <AllPartiesClient currentPage={1} initialQuery={query} />
    </>
  );
}
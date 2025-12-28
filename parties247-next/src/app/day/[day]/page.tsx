import { Metadata } from "next";
import { notFound } from "next/navigation";
import PartyGrid from "@/components/PartyGrid";
import { createCarouselSlug } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";

export const revalidate = 300;

const dayConfig: Record<string, { title: string; description: string; weekday: number; basePath: string }> = {
  thursday: {
    title: "מסיבות חמישי",
    description: "רחבות לפתיחת הסופ\"ש עם מיטב הסטים והאמנים.",
    weekday: 4,
    basePath: "/day/thursday",
  },
  friday: {
    title: "מסיבות שישי",
    description: "ליין-אפים לחמישי בלילה ולחגיגות הסופ\"ש המרכזיות.",
    weekday: 5,
    basePath: "/day/friday",
  },
};

export async function generateMetadata({ params }: { params: { day: string } }): Promise<Metadata> {
  const { day } = await params;
  const config = dayConfig[day];
  if (!config) {
    return {
      title: "מסיבות קרובות | Parties 24/7",
    };
  }

  return {
    title: `${config.title} | Parties 24/7`,
    description: config.description,
  };
}

export default async function DayPartiesPage({ params }: { params: { day: string } }) {
  const { day } = await params;
  const config = dayConfig[day];
  if (!config) {
    notFound();
  }

  const [parties, carousels] = await Promise.all([
    getParties(),
    getCarousels(),
  ]);

  const hotNowCarousel = carousels.find((carousel) => {
    const slug = createCarouselSlug(carousel.title);
    return slug === "hot-now" || slug.includes("hot") || slug.includes("חם-עכשיו");
  });

  const hotPartyIds = new Set(hotNowCarousel?.partyIds || []);

  return (
    <PartyGrid
      parties={parties}
      hotPartyIds={Array.from(new Set(hotPartyIds || []))}
      showFilters={false}
      title={config.title}
      description={config.description}
      basePath={config.basePath}
      syncNavigation
    />
  );
}

import { Metadata } from "next";
import PartyGrid from "@/components/PartyGrid";
import { createCarouselSlug } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const { city } = await params;
  const cityName = decodeURIComponent(city);
  return {
    title: `מסיבות ב${cityName} | Parties247`,
    description: `גילוי מסיבות ואירועים ב${cityName}.`,
  };
}

export default async function CityPage({ params }: { params: { city: string } }) {
  const { city } = await params;
  const cityName = decodeURIComponent(city);

  const [parties, carousels] = await Promise.all([
    getParties(),
    getCarousels(),
  ]);

  const lowerCity = cityName.toLowerCase();
  const cityParties = parties.filter((party) =>
    party.location.name.toLowerCase().includes(lowerCity) ||
    party.region?.toLowerCase() === lowerCity ||
    party.tags.some((tag) => tag.toLowerCase().includes(lowerCity))
  );

  const hotNowCarousel = carousels.find((carousel) => {
    const slug = createCarouselSlug(carousel.title);
    return slug === "hot-now" || slug.includes("hot") || slug.includes("חם-עכשיו");
  });

  return (
    <PartyGrid
      parties={cityParties}
      hotPartyIds={Array.from(new Set(hotNowCarousel?.partyIds || []))}
      showFilters={false}
      title={`מסיבות ב${cityName}`}
      description="כל האירועים הקרובים בעיר שאתם אוהבים."
      basePath={`/city/${cityName}`}
      syncNavigation
    />
  );
}

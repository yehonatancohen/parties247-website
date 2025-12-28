import { Metadata } from "next";
import { notFound } from "next/navigation";
import PartyGrid from "@/components/PartyGrid";
import { createCarouselSlug } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";

export const revalidate = 300;

type GenreKey = "techno-music" | "house-music" | "mainstream-music" | "trance-music";

const genreConfig: Record<GenreKey, { title: string; description: string; filter: (party: any) => boolean; basePath: string }> = {
  "techno-music": {
    title: "מסיבות טכנו",
    description: "רייבים ומועדוני טכנו עם סטים נבחרים.",
    filter: (party) => party.musicType === "טכנו" || party.tags.some((tag: string) => tag.toLowerCase().includes("techno") || tag.includes("טכנו")),
    basePath: "/genre/techno-music",
  },
  "house-music": {
    title: "מסיבות האוס",
    description: "הופעות האוס וגרוב עם רחבות ריקודים נוחות.",
    filter: (party) => party.tags.some((tag: string) => tag.toLowerCase().includes("house") || tag.includes("האוס")),
    basePath: "/genre/house-music",
  },
  "mainstream-music": {
    title: "מיינסטרים ופופ",
    description: "להיטי המיינסטרים, פופ ורגאטון במסיבה אחת.",
    filter: (party) => party.musicType === "מיינסטרים" || party.tags.some((tag: string) => tag.toLowerCase().includes("mainstream") || tag.includes("פופ")),
    basePath: "/genre/mainstream-music",
  },
  "trance-music": {
    title: "מסיבות טראנס",
    description: "רחבות טראנס ומסיבות טבע עם ליינים ייחודיים.",
    filter: (party) => party.musicType === "טראנס" || party.tags.some((tag: string) => tag.toLowerCase().includes("trance") || tag.includes("טראנס")),
    basePath: "/genre/trance-music",
  },
};

export async function generateMetadata({ params }: { params: { genre: GenreKey } }): Promise<Metadata> {
  const { genre } = await params;
  const config = genreConfig[genre];
  return {
    title: config ? `${config.title} | Parties 24/7` : "מסיבות לפי סגנון",
    description: config?.description,
  };
}

export default async function GenrePage({ params }: { params: { genre: GenreKey } }) {
  const { genre } = await params;
  const config = genreConfig[genre];
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

  const filteredParties = parties.filter(config.filter);
  const hotPartyIds = new Set(hotNowCarousel?.partyIds || []);

  return (
    <PartyGrid
      parties={filteredParties}
      hotPartyIds={Array.from(new Set(hotPartyIds || []))}
      showFilters={false}
      showSearch={false}
      title={config.title}
      description={config.description}
      basePath={config.basePath}
      syncNavigation
    />
  );
}

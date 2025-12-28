import { Metadata } from "next";
import { notFound } from "next/navigation";
import PartyGrid from "@/components/PartyGrid";
import { createCarouselSlug } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";

export const revalidate = 300;

type AudienceKey = "teenage-parties" | "student-parties" | "soldier-parties" | "24plus-parties";

const audienceConfig: Record<AudienceKey, { title: string; description: string; filter: (party: any) => boolean; basePath: string }> = {
  "teenage-parties": {
    title: "מסיבות נוער",
    description: "אירועי נוער מפוקחים עם מידע על גיל כניסה ואבטחה.",
    filter: (party) => party.age === "נוער" || party.tags.some((tag: string) => tag.includes("נוער")),
    basePath: "/audience/teenage-parties",
  },
  "student-parties": {
    title: "מסיבות סטודנטים",
    description: "ליינים אקדמיים, הנחות מיוחדות ושאטלים מהקמפוסים.",
    filter: (party) => party.tags.some((tag: string) => tag.toLowerCase().includes("student") || tag.includes("סטוד")),
    basePath: "/audience/student-parties",
  },
  "soldier-parties": {
    title: "מסיבות חיילים",
    description: "הטבות לחיילים, שעות מאוחרות ואפשרויות שמירת ציוד.",
    filter: (party) => party.tags.some((tag: string) => tag.toLowerCase().includes("soldier") || tag.includes("חייל")),
    basePath: "/audience/soldier-parties",
  },
  "24plus-parties": {
    title: "מסיבות 24+",
    description: "רחבות עם קהל בוגר, קוקטיילים ושירות מוקפד.",
    filter: (party) => party.age === "21+" || party.tags.some((tag: string) => tag.includes("24") || tag.includes("25")),
    basePath: "/audience/24plus-parties",
  },
};

export async function generateMetadata({ params }: { params: { audience: AudienceKey } }): Promise<Metadata> {
  const config = audienceConfig[params.audience];
  return {
    title: config ? `${config.title} | Parties 24/7` : "מסיבות לפי קהל יעד",
    description: config?.description,
  };
}

export default async function AudiencePage({ params }: { params: { audience: AudienceKey } }) {
  const config = audienceConfig[params.audience];
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
      hotPartyIds={hotPartyIds}
      showFilters={false}
      title={config.title}
      description={config.description}
      basePath={config.basePath}
      syncNavigation
    />
  );
}

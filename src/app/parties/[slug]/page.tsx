import { Metadata } from "next";
import { notFound } from "next/navigation";
import PartyGrid from "@/components/PartyGrid";
import { createCarouselSlug } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";
import { SPECIFIC_PARTIES_PAGES } from "@/lib/seoparties";

// Revalidate every 5 minutes
export const revalidate = 300;

// Dynamic Metadata Generation
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params; // Await params for Next.js 15+
  const config = SPECIFIC_PARTIES_PAGES.find((p) => p.slug === slug);

  return {
    title: config ? `${config.title} | Parties 24/7` : "מסיבות ממוקדות",
    description: config?.description || "מצאו את המסיבה הבאה שלכם",
    alternates: {
      canonical: `/parties/${slug}`,
    },
  };
}

// Main Page Component
export default async function SpecificPartyPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  // 1. Find the configuration for this page
  const config = SPECIFIC_PARTIES_PAGES.find((p) => p.slug === slug);
  
  if (!config) {
    notFound();
  }

  // 2. Fetch Data (Parties filtered by the config, and Carousels for "Hot Now")
  const [parties, carousels] = await Promise.all([
    getParties(config.apiFilters),
    getCarousels(),
  ]);

  // 3. Logic to identify "Hot" parties (visual highlight in the grid)
  const hotNowCarousel = Array.isArray(carousels)
    ? carousels.find((carousel: any) => {
        const cSlug = createCarouselSlug(carousel.title);
        return cSlug === "hot-now" || cSlug.includes("hot") || cSlug.includes("חם-עכשיו");
      })
    : null;

  const hotPartyIds = new Set(hotNowCarousel?.partyIds || []);

  return (
    <div className="space-y-10 min-h-screen bg-[#0c1713]">
      {/* PartyGrid renders the Header (Title/Desc) and the Grid itself.
        We pass `showFilters={false}` because this page is already pre-filtered.
      */}
      <PartyGrid
        parties={parties}
        hotPartyIds={Array.from(hotPartyIds)}
        showFilters={false} 
        showSearch={false}
        title={config.title}
        description={config.description}
        basePath={`/parties/find/${slug}`}
        syncNavigation
      />

      {/* Info Section (Optional)
        Since we don't have a long 'body' text for every specific page in our config yet,
        we render a generic placeholder or the description again in a nice box to match the UI layout.
      */}
      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-8 text-jungle-text">
          <h2 className="text-2xl font-display text-white mb-4">אודות {config.title}</h2>
          <div className="space-y-4 leading-relaxed text-base text-jungle-text/90">
            <p>
              {config.description}
            </p>
            <p>
              עמוד זה מרכז עבורכם את כל האירועים העדכניים ביותר בקטגוריית {config.title}. 
              המערכת שלנו מתעדכנת בזמן אמת ומסננת את המסיבות כדי שתמצאו בדיוק את מה שאתם מחפשים, 
              בין אם זה לפי מיקום, גיל או סגנון מוזיקלי.
            </p>
            <p>
              מומלץ לשריין כרטיסים מראש כיוון שהביקוש לאירועים אלו גבוה, במיוחד בסופי שבוע ובחגים.
              לחיצה על כל כרטיס תוביל אתכם לפרטים המלאים ולרכישה מאובטחת.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
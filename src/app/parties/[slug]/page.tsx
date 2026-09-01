import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PartyGrid from "@/components/PartyGrid";
import { findHotNowCarousel } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";
import { SPECIFIC_PARTIES_PAGES } from "@/lib/seoparties";

// Revalidate every 5 minutes
export const revalidate = 300;

// Dynamic Metadata Generation
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const { slug } = await params; // Await params for Next.js 15+
  const config = SPECIFIC_PARTIES_PAGES.find((p) => p.slug === slug);

  return {
    title: config ? config.title : "מסיבות ממוקדות",
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
  const hotNowCarousel = Array.isArray(carousels) ? findHotNowCarousel(carousels) : null;

  const hotPartyIds = new Set(hotNowCarousel?.partyIds || []);

  const bodyParagraphs = config.body
    ? config.body.split("\n\n").filter(Boolean)
    : [
        config.description,
        `עמוד זה מרכז עבורכם את כל האירועים העדכניים ביותר בקטגוריית ${config.title}. המערכת שלנו מתעדכנת בזמן אמת ומסננת את המסיבות כדי שתמצאו בדיוק את מה שאתם מחפשים, בין אם זה לפי מיקום, גיל או סגנון מוזיקלי.`,
        `מומלץ לשריין כרטיסים מראש כיוון שהביקוש לאירועים אלו גבוה, במיוחד בסופי שבוע ובחגים. לחיצה על כל כרטיס תוביל אתכם לפרטים המלאים ולרכישה מאובטחת.`,
      ];

  const faqJsonLd = config.faqs && config.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: config.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      }
    : null;

  return (
    <div className="space-y-10 min-h-screen bg-[#0c1713]">
      {faqJsonLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      )}

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

      {config.related && config.related.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-wrap gap-2 justify-center" dir="rtl">
            {config.related.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-jungle-text/90 transition hover:border-jungle-accent hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto rounded-2xl border border-white/10 bg-white/5 p-8 text-jungle-text">
          <h2 className="text-2xl font-display text-white mb-4">אודות {config.title}</h2>
          <div className="space-y-4 leading-relaxed text-base text-jungle-text/90" dir="rtl">
            {bodyParagraphs.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>

          {config.faqs && config.faqs.length > 0 && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <h3 className="text-xl font-display text-white mb-4">שאלות נפוצות</h3>
              <div className="space-y-5">
                {config.faqs.map((f) => (
                  <div key={f.question} dir="rtl">
                    <h4 className="text-base font-bold text-white mb-1">{f.question}</h4>
                    <p className="text-jungle-text/80 leading-relaxed">{f.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
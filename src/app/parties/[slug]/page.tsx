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
    ...(config && config.index === false ? { robots: { index: false, follow: true } } : {}),
  };
}

// Main Page Component
export default async function SpecificPartyPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  // 1. Find the configuration for this page
  const config = SPECIFIC_PARTIES_PAGES.find((p) => p.slug === slug);

  if (!config) {
    notFound();
  }

  const pageParam = typeof resolvedSearchParams.page === 'string' ? parseInt(resolvedSearchParams.page, 10) : 1;
  const currentPage = Number.isFinite(pageParam) && pageParam > 0 ? pageParam : 1;

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
    <div className="space-y-10 min-h-screen bg-stage">
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
        basePath={`/parties/${slug}`}
        currentPage={currentPage}
        paginationMode="query"
        syncNavigation
      />

      {config.related && config.related.length > 0 && (
        <section className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto flex flex-wrap gap-2 justify-center" dir="rtl">
            {config.related.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-hairline px-4 py-2 text-[14px] text-ink transition-colors hover:border-white/25 hover:bg-tile"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="container mx-auto px-4 pb-16">
        <div className="max-w-4xl mx-auto rounded-[28px] bg-tile p-6 sm:p-10 text-ink">
          <h2 className="text-[24px] font-bold text-ink sm:text-[28px] mb-4">אודות {config.title}</h2>
          <div className="space-y-4 leading-relaxed text-base text-ink-2" dir="rtl">
            {bodyParagraphs.map((p) => (
              <p key={p.slice(0, 32)}>{p}</p>
            ))}
          </div>

          {config.faqs && config.faqs.length > 0 && (
            <div className="mt-8 border-t border-hairline pt-6">
              <h3 className="text-[21px] font-bold text-ink mb-4">שאלות נפוצות</h3>
              <div className="space-y-5">
                {config.faqs.map((f) => (
                  <div key={f.question} dir="rtl">
                    <h4 className="text-[16px] font-semibold text-ink mb-1">{f.question}</h4>
                    <p className="text-ink-2 leading-relaxed">{f.answer}</p>
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
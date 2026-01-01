import { Metadata } from "next";
import { notFound } from "next/navigation";
import PartyGrid from "@/components/PartyGrid";
import { createCarouselSlug } from "@/lib/carousels";
import { findTaxonomyConfig, filterPartiesByTaxonomy } from "@/data/taxonomy";
import { getCarousels, getParties } from "@/services/api";

export const revalidate = 300;

const buildClubBody = (clubName: string) =>
  `מועדון ${clubName} מקבל כאן עמוד שמרכז את כל מה שצריך לדעת לפני שמזמינים כרטיסים או קופצים לביקור ספונטני. פתחנו אותו עם הסברים על הסגנונות שמנגנים במקום, זמני השיא של הרחבה ומה קורה בשעות המוקדמות למי שמעדיף לפתוח את הערב לאט. בהמשך תמצאו גם דגשים על גיל כניסה, קודי לבוש נהוגים והמלצות לשמירת חפצים או הזמנת שולחנות מראש כדי שלא תתעכבו בתור.\n\nחשוב לנו שתוכלו לתכנן את הערב מקצה לקצה, ולכן הוספנו גם טיפים על דרכי הגעה וחניה בסביבה, אזורי עישון ונקודות מים קרובות. אם המועדון מפעיל שאטלים או שיתופי פעולה עם נהגים – נדגיש זאת לצד האירועים כדי שתדעו מראש שיש פתרון חזרה בטוח. בנוסף קישרנו לעמודי ז׳אנר וערים מתאימים, כך שאם סיימתם ב${clubName} ורוצים להמשיך לעוד ליין באזור תוכלו לעשות זאת בלחיצה אחת.\n\nהטקסט הארוך הזה מתעדכן יחד עם האירועים, ומנסה לענות על השאלות שחוזרות בכל שבוע: האם יש הנחות early-bird, מה קורה בחגים, והאם מדובר ברחבה אינטימית או מתחם גדול עם כמה קומות. כך תגיעו מוכנים למסיבה הבאה במועדון ${clubName} ותוכלו להתמקד במה שחשוב באמת – ליהנות מהמוזיקה ומהאנרגיה של המקום.`;

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const slug = decodeURIComponent((await params).slug);
  const config = findTaxonomyConfig(`/club/${slug}`);

  if (!config) {
    return {
      title: "עמוד מועדון לא נמצא | Parties 24/7",
      description: "לא הצלחנו למצוא את עמוד המועדון המבוקש.",
    };
  }

  return {
    title: `${config.title} | Parties 24/7`,
    description: config.description,
  };
}

export default async function ClubPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent((await params).slug);
  const config = findTaxonomyConfig(`/club/${slug}`);

  if (!config) {
    notFound();
  }

  const [parties, carousels] = await Promise.all([
    getParties(),
    getCarousels(),
  ]);

  const filteredParties = filterPartiesByTaxonomy(parties, config!);

  const hotNowCarousel = carousels.find((carousel) => {
    const carouselSlug = createCarouselSlug(carousel.title);
    return carouselSlug === "hot-now" || carouselSlug.includes("hot") || carouselSlug.includes("חם-עכשיו");
  });

  const body = config?.body || buildClubBody(config?.label || slug);

  return (
    <div className="space-y-10">
      <PartyGrid
        parties={filteredParties}
        hotPartyIds={Array.from(new Set(hotNowCarousel?.partyIds || []))}
        showFilters={false}
        showSearch={false}
        title={config?.title || `מועדון ${config?.label || slug}`}
        description={config?.description || "כל האירועים הקרובים במועדון."}
        basePath={config?.path || `/club/${slug}`}
        syncNavigation
      />

      <section className="container mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 text-jungle-text">
        <h2 className="text-2xl font-display text-white mb-4">הכירו את המועדון</h2>
        <div className="space-y-4 leading-relaxed text-base text-jungle-text/90">
          {body
            .split("\n\n")
            .filter(Boolean)
            .map((paragraph) => (
              <p key={paragraph.slice(0, 20)}>{paragraph}</p>
            ))}
        </div>
      </section>
    </div>
  );
}

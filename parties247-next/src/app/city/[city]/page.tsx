import { Metadata } from "next";
import PartyGrid from "@/components/PartyGrid";
import { createCarouselSlug } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";
import BackButton from "@/components/BackButton";

export const revalidate = 300;

const buildCityBody = (cityName: string) =>
  `עמוד מסיבות ${cityName} מרכז את כל מה שצריך כדי לתכנן ערב בעיר: אילו מועדונים פתוחים, איזה ליינים חוזרים ומהן ההפקות החד פעמיות שמגיעות השבוע. פתחנו את הטקסט בתיאור קצר של אזורי הבילוי המרכזיים בעיר, כדי שתדעו אם להתכוונן לדרום התעשייתי, לחוף או למרכז העירוני. כל פסקה מוסיפה עוד פרטים על אפשרויות ההגעה, שעות השיא של הרחבות וטיפים לאיך לסגור כרטיסים בלי להיתקע בתורים.\n\nכדי להגיע ליותר מ-500 תווים אספנו גם עצות על מה לעשות לפני ואחרי המסיבה: איפה לעצור לאכול משהו קטן, איך לשלב בין שתי מסיבות באותו לילה ואיך לבדוק מדיניות כניסה של מועדונים שונים בעיר ${cityName}. אם אתם מגיעים מרחוק, שימו לב להמלצות על קווי לילה, חניונים מאובטחים או שאטלים שמוצעים באירועים גדולים.\n\nהעמוד מחובר גם לעמודי ז׳אנר, קהל יעד וימים ספציפיים, כך שתוכלו לסנן את הרשימה למסיבות טכנו, היפ הופ או ערב חמישי בלבד. המטרה היא לתת לכם תיאור עשיר על העיר ${cityName} לצד כפתורי פעולה ברורים, כדי שתדעו מה מחכה ברחבות עוד לפני שהגעתם.`;

const formatCityName = (rawCity: string) =>
  rawCity
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const { city } = await params;
  const cityName = formatCityName(decodeURIComponent(city));
  return {
    title: `מסיבות ב${cityName} | Parties247`,
    description: `גילוי מסיבות ואירועים ב${cityName}.`,
  };
}

export default async function CityPage({ params }: { params: { city: string } }) {
  const { city } = await params;
  const citySlug = decodeURIComponent(city);
  const cityName = formatCityName(citySlug);

  const [parties, carousels] = await Promise.all([
    getParties(),
    getCarousels(),
  ]);

  const lowerCity = citySlug.replace(/-/g, " ").toLowerCase();
  const cityParties = parties.filter((party) =>
    party.location.name.toLowerCase().includes(lowerCity) ||
    party.region?.toLowerCase() === lowerCity ||
    party.tags.some((tag) => tag.toLowerCase().includes(lowerCity))
  );

  const hotNowCarousel = carousels.find((carousel) => {
    const slug = createCarouselSlug(carousel.title);
    return slug === "hot-now" || slug.includes("hot") || slug.includes("חם-עכשיו");
  });

  const body = buildCityBody(cityName);

  return (
    <div className="space-y-10">
      <div className="container mx-auto px-4 pt-6 md:pt-8">
        <BackButton fallbackHref="/party-discovery" label="חזרה לעמוד החיפוש" />
      </div>

      <PartyGrid
        parties={cityParties}
        hotPartyIds={Array.from(new Set(hotNowCarousel?.partyIds || []))}
        showFilters={false}
        showSearch={false}
        title={`מסיבות ב${cityName}`}
        description="כל האירועים הקרובים בעיר שאתם אוהבים."
        basePath={`/city/${citySlug}`}
        syncNavigation
      />

      <section className="container mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 text-jungle-text">
        <h2 className="text-2xl font-display text-white mb-4">למה שווה לצאת בעיר</h2>
        <div className="space-y-4 leading-relaxed text-base text-jungle-text/90">
          {body
            .split("\n\n")
            .filter(Boolean)
            .map((paragraph) => (
              <p key={paragraph.slice(0, 24)}>{paragraph}</p>
            ))}
        </div>
      </section>
    </div>
  );
}

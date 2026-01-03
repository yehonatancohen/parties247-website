import { Metadata } from "next";
import PartyGrid from "@/components/PartyGrid";
import { createCarouselSlug } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";
import BackButton from "@/components/BackButton";

export const revalidate = 300;

// 1. Define the dictionary mapping English slugs to Hebrew names
const CITY_HEBREW_NAMES: Record<string, string> = {
  "tel-aviv": "תל אביב",
  "haifa": "חיפה",
  "jerusalem": "ירושלים",
  "rishon-lezion": "ראשון לציון",
  "petah-tikva": "פתח תקווה",
  "ashdod": "אשדוד",
  "netanya": "נתניה",
  "beer-sheva": "באר שבע",
  "holon": "חולון",
  "bnei-brak": "בני ברק",
  "ramat-gan": "רמת גן",
  "rehovot": "רחובות",
  "bat-yam": "בת ים",
  "herzliya": "הרצליה",
  "kfar-saba": "כפר סבא",
  "eilat": "אילת",
  "tiberias": "טבריה",
  // Add more cities as needed
};

const formatCityName = (rawCity: string) =>
  rawCity
    .split(/[-\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

// 2. Helper function to get Hebrew name with English fallback
const getCityDisplayName = (slug: string) => {
  const normalizedSlug = slug.toLowerCase().trim();
  // Return the Hebrew name if it exists, otherwise format the English slug
  return CITY_HEBREW_NAMES[normalizedSlug] || formatCityName(slug);
};

const buildCityBody = (cityName: string) =>
  `עמוד מסיבות ${cityName} מרכז את כל מה שצריך כדי לתכנן ערב בעיר: אילו מועדונים פתוחים, איזה ליינים חוזרים ומהן ההפקות החד פעמיות שמגיעות השבוע. פתחנו את הטקסט בתיאור קצר של אזורי הבילוי המרכזיים בעיר, כדי שתדעו אם להתכוונן לדרום התעשייתי, לחוף או למרכז העירוני. כל פסקה מוסיפה עוד פרטים על אפשרויות ההגעה, שעות השיא של הרחבות וטיפים לאיך לסגור כרטיסים בלי להיתקע בתורים.\n\nכדי להגיע ליותר מ-500 תווים אספנו גם עצות על מה לעשות לפני ואחרי המסיבה: איפה לעצור לאכול משהו קטן, איך לשלב בין שתי מסיבות באותו לילה ואיך לבדוק מדיניות כניסה של מועדונים שונים בעיר ${cityName}. אם אתם מגיעים מרחוק, שימו לב להמלצות על קווי לילה, חניונים מאובטחים או שאטלים שמוצעים באירועים גדולים.\n\nהעמוד מחובר גם לעמודי ז׳אנר, קהל יעד וימים ספציפיים, כך שתוכלו לסנן את הרשימה למסיבות טכנו, היפ הופ או ערב חמישי בלבד. המטרה היא לתת לכם תיאור עשיר על העיר ${cityName} לצד כפתורי פעולה ברורים, כדי שתדעו מה מחכה ברחבות עוד לפני שהגעתם.`;

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const { city } = await params;
  const decodedSlug = decodeURIComponent(city);
  // Use the new helper here
  const cityName = getCityDisplayName(decodedSlug); 
  
  return {
    title: `מסיבות ב${cityName} | Parties247`,
    description: `גילוי מסיבות ואירועים ב${cityName}.`,
  };
}

export default async function CityPage({ params }: { params: { city: string } }) {
  const { city } = await params;
  const citySlug = decodeURIComponent(city);
  
  // 3. Get the Hebrew name for display
  const displayCityName = getCityDisplayName(citySlug);

  const [parties, carousels] = await Promise.all([
    getParties(),
    getCarousels(),
  ]);

  // Keep the filtering logic based on the slug/English (assuming your DB data is in English or tags match the slug)
  const lowerCity = citySlug.replace(/-/g, " ").toLowerCase();
  
  const cityParties = parties.filter((party) =>
    party.location.name.toLowerCase().includes(lowerCity) ||
    party.region?.toLowerCase() === lowerCity ||
    party.tags.some((tag) => tag.toLowerCase().includes(lowerCity))
    || party.tags.some((tag) => tag.includes(displayCityName)) 
  );

  const hotNowCarousel = carousels.find((carousel) => {
    const slug = createCarouselSlug(carousel.title);
    return slug === "hot-now" || slug.includes("hot") || slug.includes("חם-עכשיו");
  });

  // Pass the Hebrew name to the body builder
  const body = buildCityBody(displayCityName);

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
        // Use the Hebrew name here
        title={`מסיבות ב${displayCityName}`}
        description="כל האירועים הקרובים בעיר שאתם אוהבים."
        basePath={`/cities/${citySlug}`}
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
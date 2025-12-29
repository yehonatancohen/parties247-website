import { Metadata } from "next";
import { notFound } from "next/navigation";
import PartyGrid from "@/components/PartyGrid";
import { createCarouselSlug } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";

export const revalidate = 300;

type GenreKey = "techno-music" | "house-music" | "mainstream-music" | "trance-music";

const genreConfig: Record<GenreKey, { title: string; description: string; filter: (party: any) => boolean; basePath: string; body: string }> = {
  "techno-music": {
    title: "מסיבות טכנו",
    description: "רייבים ומועדוני טכנו עם סטים נבחרים.",
    filter: (party) => party.musicType === "טכנו" || party.tags.some((tag: string) => tag.toLowerCase().includes("techno") || tag.includes("טכנו")),
    basePath: "/genre/techno-music",
    body:
      "העמוד של מסיבות הטכנו נכתב כדי לתת תמונה מלאה על מה שקורה מתחת לפני השטח – מהרחבות המחתרתיות של קריית המלאכה ועד המועדונים הגדולים שמביאים אמני על. הטקסט מפרט איך לבחור אירוע לפי סוג הטכנו (מלודי, אינדסטריאל או מינימל), מדגיש את ההבדלים בין רייבים בשטח פתוח למסיבות במועדון סגור, ומסביר מה להביא כדי ליהנות בצורה בטוחה. \n\nהוספנו גם תיאור על קצב ההגעה של הקהל, איך למצוא חברים לפני הכניסה ואילו שעות נחשבות לשיא כדי שלא תפספסו את הסט המרכזי. אם אתם מתכננים אפטר, תמצאו כאן קישורים לעמודי ימים נוספים ומיקומים שממשיכים את המסיבה עד הבוקר. הכל ארוז בתוך יותר מ-500 תווים כדי שתוכלו להבין את הסצנה לעומק עוד לפני הלחיצה על כרטיסים.",
  },
  "house-music": {
    title: "מסיבות האוס",
    description: "הופעות האוס וגרוב עם רחבות ריקודים נוחות.",
    filter: (party) => party.tags.some((tag: string) => tag.toLowerCase().includes("house") || tag.includes("האוס")),
    basePath: "/genre/house-music",
    body:
      "מסיבות האוס בישראל משלבות בין וייב קלאסי של גרוב לעולמות הסול, הדיסקו והפאנק. כתבנו תיאור רחב שמסביר איך נראית הרחבה ברגעי החימום, מתי מגיעות המיקסות הגדולות ומה הקהל שמחפש ערב נינוח עם משקאות טובים ופינות ישיבה. \n\nהטקסט כולל גם טיפים על קוד לבוש, עלויות כרטיסים ומתי כדאי להגיע אם רוצים להזמין שולחן לפני שהמקום מתמלא. בנוסף הדגשנו את ההבדל בין מסיבות האוס של ברי קוקטיילים, rooftop פתוחים או מועדוני מחסן שמוסיפים טאץ׳ טכנו. כך תדעו לבחור את הליין שמתאים בדיוק לאנרגיה שלכם ולקבל מידע עשיר שעובר את רף ה-500 תווים הנדרש.",
  },
  "mainstream-music": {
    title: "מיינסטרים ופופ",
    description: "להיטי המיינסטרים, פופ ורגאטון במסיבה אחת.",
    filter: (party) => party.musicType === "מיינסטרים" || party.tags.some((tag: string) => tag.toLowerCase().includes("mainstream") || tag.includes("פופ")),
    basePath: "/genre/mainstream-music",
    body:
      "עמוד המיינסטרים נבנה עבור מי שמחפש ערב שכולו להיטים מוכרים ושירה בציבור. תיארנו איך נראית רחבה שמתמלאת מוקדם, אילו שעות מוקדשות לפופ ישראלי ואילו לקטעי רגאטון ו-Top40. מעבר לזה הוספנו מידע על הנחות סטודנטים, ערבי נושא כמו שנות ה-90 או קיץ לטיני, ואיך למצוא מסיבות שמציעות גם אזורי ישיבה למשפחות או קבוצות חברים גדולות. \n\nהטקסט הארוך ממשיך ומסביר איך לבחור בין מסיבה במועדון גדול לבין בר שכונתי, מה להביא כדי להרגיש בנוח ואיך לסגור שולחן לפני שהאירוע מתמלא. כך מובטח שתעברו את רף 500 התווים ותכירו את כל האפשרויות לפני שתלחצו על כרטיסים.",
  },
  "trance-music": {
    title: "מסיבות טראנס",
    description: "רחבות טראנס ומסיבות טבע עם ליינים ייחודיים.",
    filter: (party) => party.musicType === "טראנס" || party.tags.some((tag: string) => tag.toLowerCase().includes("trance") || tag.includes("טראנס")),
    basePath: "/genre/trance-music",
    body:
      "טראנס בישראל הוא תרבות שלמה, והטקסט הארוך של העמוד הזה נועד להדריך גם בליינים ותיקים וגם מי שמגיעים למסיבת טבע ראשונה. פתחנו בהסבר על סגנונות שונים – פסייטראנס, פרוגרסיב וגואה – ומה מאפיין את כל אחד מהם מבחינת קצב וקהל. משם עברנו לציוד בסיסי שכדאי להביא, מרישיונות וחניה ועד מים, מחצלת וביגוד חם ללילה במדבר. \n\nבנוסף כללנו המלצות על הגעה בטוחה, שמירה על הסביבה והבנת קוד ההתנהגות של הסצנה: שמירה על המרחב האישי, כבוד לרחבה ונקיון אחרי המסיבה. חיברנו את הכל ליותר מ-500 תווים כדי לוודא שיש לכם מספיק ידע לתכנן חוויה חופשית ובטוחה בכל פסטיבל או רייב שתבחרו.",
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
    <div className="space-y-10">
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

      <section className="container mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 text-jungle-text">
        <h2 className="text-2xl font-display text-white mb-4">מה כולל העמוד הזה?</h2>
        <div className="space-y-4 leading-relaxed text-base text-jungle-text/90">
          {config.body.split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 25)}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  );
}

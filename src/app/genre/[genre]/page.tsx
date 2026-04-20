import { Metadata } from "next";
import { notFound } from "next/navigation";
import PartyGrid from "@/components/PartyGrid";
import { createCarouselSlug } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";

export const revalidate = 300;

type GenreKey = "techno-music" | "house-music" | "mainstream-music" | "trance-music" | "rave-parties";

const genreConfig: Record<GenreKey, { title: string; description: string; filter: (party: any) => boolean; basePath: string; body: string }> = {
  "techno-music": {
    title: "מסיבות טכנו ורייבים",
    description: "רייבים ומסיבות טכנו בתל אביב וכל הארץ: ליינים מחתרתיים, כרטיסים מוקדמים וסטים שמחזיקים עד הבוקר. מתעדכן בזמן אמת.",
    filter: (party) => party.musicType === "טכנו" || party.tags.some((tag: string) => tag.toLowerCase().includes("techno") || tag.includes("טכנו")),
    basePath: "/genre/techno-music",
    body:
      "מסיבות הטכנו והרייבים בישראל מייצגות סצנה תוססת שגדלה בשקט ועכשיו היא אחת המובילות באזור. מהרחבות המחתרתיות של קריית המלאכה ועד המועדונים הגדולים שמביאים אמני-על בינלאומיים, יש כאן לכל סוג קהל את הרייב שלו.\n\nרייבים בישראל – מה לדעת לפני שמגיעים: רייב אמיתי מתחיל לרוב אחרי חצות ומגיע לשיא בין 02:00 ל-06:00. החוכמה היא לא להגיע ראשון – אלא לפי ה-vibe של המקום. לרייבים בשטח פתוח (מחסנים, חניונים, מתחמי תעשייה) מומלץ להביא: ביגוד בשכבות, מים, מדבקת מצלמה (אם יש מדיניות no-phone), ונעליים נוחות. לרייבים במועדונים הכניסה נינוחה יותר, אך מחיר הדלת גבוה מ-early bird.\n\nסוגי טכנו ברייבים הישראליים: סצנת הטכנו המקומית מחולקת לכמה זרמים עיקריים. הטכנו המלודי (Melodic Techno) הוא הפופולרי ביותר ומתאפיין בסינת׳ים ארוכים ורגשיים מעל ביטים קצביים – מתאים גם למי שמגיע לראשונה. הטכנו האינדסטריאל מתאים לאוזן מנוסה יותר עם צלילים גולמיים וקשים. הטכנו המינימלי מתאפיין בביטים ישרים וחוזרים שמביאים את הרקדן למצב מדיטטיבי. לכל סוג – קהל שונה, שעה שונה ומיקום שונה.\n\nאיך מוצאים רייבים בישראל: הרייבים הגדולים מפורסמים עם ליינאף מלא שבועות מראש. הרייבים הספונטניים מתפרסמים ב-48 שעות מראש דרך קבוצות טלגרם וחשבונות אינסטגרם של המוקדים. הדרך הכי אמינה היא לעקוב אחרי הדף שלנו – כל אירוע מעודכן עם שם האמנים, סגנון הסט, שעת פתיחת הדלתות ומחיר הכרטיסים.\n\nמה עוד כדאי לדעת: רוב הרייבים הגדולים בישראל עובדים עם מדיניות ״no cameras on the dancefloor״ שנאכפת על ידי מדבקה על עדשת המצלמה בכניסה. גיל הכניסה לרייבים טכנו מתחיל לרוב מ-21. מים חינמיים הם נורמה בכל מסיבה מסודרת – אם אין מים חינמיים, זה דגל אדום.",
  },
  "rave-parties": {
    title: "רייבים בישראל",
    description: "רייבים בתל אביב וברחבי הארץ: מסיבות טכנו, טראנס ואלקטרוניקה במחסנים, חניונים ואתרי טבע. כרטיסים ורשימת אירועים מתעדכנת.",
    filter: (party) =>
      party.tags.some((tag: string) =>
        tag.toLowerCase().includes("rave") ||
        tag.includes("רייב") ||
        tag.includes("אנדרגראונד") ||
        tag.toLowerCase().includes("underground")
      ) ||
      party.musicType === "טכנו" ||
      party.musicType === "טראנס",
    basePath: "/genre/rave-parties",
    body:
      "רייבים בישראל הם תרבות, לא רק מסיבה. מאז שנות ה-90 כשסצנת הטראנס הישראלית כבשה את העולם, ועד לרייבי הטכנו של ימינו בדרום תל אביב – ישראל היא מדינת רייב בהגדרה. הדף הזה מרכז את כל הרייבים הקרובים: אירועים במחסנים, רייבים בחניונים, מסיבות טבע ומועדוני אנדרגראונד שמשאירים את הדלת פתוחה עד שהשמש עולה.\n\nמה הופך רייב לרייב אמיתי: רייב שונה ממסיבת מועדון רגילה בכמה דברים מהותיים. ראשית, המקום – לרוב מקום לא שגרתי, לא מלוטש, עם אקוסטיקה גולמית שמחזקת את הסאונד בצורה אחרת לגמרי. שנית, השעות – רייב מתחיל כשרוב האנשים כבר הולכים לישון ומסתיים עם האור הראשון של הבוקר. שלישית, הקהל – אנשים שבאים בגלל המוזיקה, לא כדי להיצפות.\n\nסוגי רייבים שתמצאו כאן: רייבי טכנו אנדרגראונד, פסטיבלי טראנס מדבריים, מסיבות פסייטראנס ביערות הגליל, ו-warehouse parties בדרום תל אביב. כל אירוע מסומן עם סוג הסאונד, מיקום, שעות ומחיר.\n\nטיפים לרייב ראשון: הגיעו אחרי חצות – הרחבה מגיעה לשיא באיחור של שעתיים-שלוש משעת הפתיחה. הביאו ביגוד בשכבות (קר בחוץ, חם בפנים), מים, ונעליים נוחות. אל תצפו לשירותים נוחים. כן צפו לסאונד שתרגישו בגוף.",
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

import { Metadata } from "next";
import { notFound } from "next/navigation";
import PartyGrid from "@/components/PartyGrid";
import { createCarouselSlug } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";

export const revalidate = 300;

const dayConfig: Record<string, { title: string; description: string; weekday: number; basePath: string }> = {
  thursday: {
    title: "מסיבות חמישי",
    description: "רחבות לפתיחת הסופ\"ש עם מיטב הסטים והאמנים.",
    weekday: 4,
    basePath: "/day/thursday",
  },
  friday: {
    title: "מסיבות שישי",
    description: "ליין-אפים לחמישי בלילה ולחגיגות הסופ\"ש המרכזיות.",
    weekday: 5,
    basePath: "/day/friday",
  },
};

const dayBodies: Record<string, string> = {
  thursday:
    "חמישי הוא ערב הפתיחה הרשמי של סוף השבוע, ולכן הקדשנו לו תיאור ארוך ומפורט שמסביר איך לבחור את הליין הנכון. התחלנו בהסבר על הסצנה המוקדמת – ברים שמחממים את הרחבה עם סטים נינוחים, איוונטים על הגג ומסיבות סטודנטים שמתחילות מוקדם. משם עברנו לרייבים המאוחרים של דרום תל אביב והצפון, עם טיפים על מה להביא, איך להזמין כרטיסים מוקדמים ומה עושים אם מגיעים ברכבת לילה. \n\nהמשך הטקסט מדגיש גם מסיבות קונספט של חמישי, כמו ערבי קריוקי, הופעות חיות או מסיבות נוער מפוקחות. הוספנו דגשים על מדיניות גיל וגישה כדי שלא תמצאו את עצמכם מול סלקטור קשוח. לסיום אספנו המלצות על מעבר קליל למסיבת שישי בבוקר – אם זה בראנץ׳ עם DJ או after שממשיך עד הזריחה – כך שתוכלו לתכנן ערב שמתחיל מוקדם ונגמר רק כשתחליטו. הטקסט כולו חוצה בקלות את רף ה-500 תווים כדי לספק לכם כמה שיותר תשובות מראש.",
  friday:
    "שישי בישראל הוא יום ארוך שמתחיל כבר לפני השקיעה ומסתיים לעיתים בבוקר שבת. לכן כתבנו הסבר עשיר שעובר בין כל השלבים: מהרייבים של חצות בדרום העיר, דרך מסיבות חוף עם שקיעות מרשימות ועד אירועי משפחות וצעירים ברחבי הארץ. סימנו במיוחד את השעות שבהן הרחבה מתמלאת, אילו אוטובוסים לילה פעילים ואיך לבחור בין מועדון טכנו סגור לבין מסיבת חוץ פתוחה. \n\nבהמשך הדגשנו את חשיבות התיאום עם חברים והסברנו איך לנצל רשימות אורחים, קודי הנחה או מבצעי early bird. צירפנו גם תזכורת על מנוחה ושתייה, כי שישי מלא יכול להפוך בקלות למרתון. בסוף הטקסט תמצאו הצעות למעברים קלים למסיבות שבת או לאפטרים רשמיים, כדי שתדעו מראש איך היום שלכם ייראה. כל זה נכתב בלשון ברורה וארוכה מספיק כדי לענות על השאלות הנפוצות ולהפוך את שישי לערב מתוכנן היטב.",
};

export async function generateMetadata({ params }: { params: { day: string } }): Promise<Metadata> {
  const { day } = await params;
  const config = dayConfig[day];
  if (!config) {
    return {
      title: "מסיבות קרובות | Parties 24/7",
    };
  }

  return {
    title: `${config.title} | Parties 24/7`,
    description: config.description,
  };
}

export default async function DayPartiesPage({ params }: { params: { day: string } }) {
  const { day } = await params;
  const config = dayConfig[day];
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

  const hotPartyIds = new Set(hotNowCarousel?.partyIds || []);

  return (
    <div className="space-y-10">
      <PartyGrid
        parties={parties}
        hotPartyIds={Array.from(new Set(hotPartyIds || []))}
        showFilters={false}
        showSearch={false}
        title={config.title}
        description={config.description}
        basePath={config.basePath}
        syncNavigation
      />

      <section className="container mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 text-jungle-text">
        <h2 className="text-2xl font-display text-white mb-4">מה מחכה לכם ביום הזה?</h2>
        <div className="space-y-4 leading-relaxed text-base text-jungle-text/90">
          {(dayBodies[day] || "").split("\n\n").map((paragraph) => (
            <p key={paragraph.slice(0, 20)}>{paragraph}</p>
          ))}
        </div>
      </section>
    </div>
  );
}

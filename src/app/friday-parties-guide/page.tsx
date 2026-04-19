import { Metadata } from "next";
import Link from "next/link";
import { BASE_URL } from "@/data/constants";

export const metadata: Metadata = {
  title: "מסיבות יום שישי – המדריך המלא לליל שישי בישראל | Parties 24/7",
  description:
    "מסיבות יום שישי בתל אביב, חיפה וכל הארץ: ליינאפ, כרטיסים ומועדוני הלילה הכי חמים. גלו את הערב הכי גדול של השבוע.",
  alternates: {
    canonical: `${BASE_URL}/friday-parties-guide`,
  },
  openGraph: {
    title: "מסיבות יום שישי – המדריך המלא",
    description:
      "מסיבות יום שישי בתל אביב, חיפה וכל הארץ: ליינאפ, כרטיסים ומועדוני הלילה הכי חמים. גלו את הערב הכי גדול של השבוע.",
    locale: "he_IL",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EventSeries",
  name: "מסיבות יום שישי בישראל",
  description:
    "ריכוז מסיבות יום שישי בכל רחבי ישראל – תל אביב, חיפה, ירושלים ועוד",
  location: {
    "@type": "Country",
    name: "ישראל",
    addressCountry: "IL",
  },
  organizer: {
    "@type": "Organization",
    name: "Parties 24/7",
    url: BASE_URL,
  },
  url: `${BASE_URL}/friday-parties-guide`,
  eventSchedule: {
    "@type": "Schedule",
    byDay: "https://schema.org/Friday",
    repeatFrequency: "P1W",
  },
};

const faqs = [
  {
    q: "מה השעה הטובה ביותר להגיע למסיבות שישי?",
    a: "לרוב המועדונים מומלץ להגיע בין 23:00 לחצות. הגעה מוקדמת יותר (22:00) מאפשרת כניסה ללא תור ומחיר early-bird. הרחבה מגיעה לשיאה בדרך כלל בין 01:00-03:00.",
  },
  {
    q: "האם צריך להזמין כרטיסים ליום שישי מראש?",
    a: "לליינים גדולים ולמועדונים פופולריים – בהחלט כן. מסיבות שישי עם אמנים מזמינים נסגרות לרוב 48-72 שעות מראש. מסיבות קטנות ומקומיות לרוב מאפשרות כניסה בדלת.",
  },
  {
    q: "מה הם הסגנונות המוזיקליים הנפוצים ביום שישי?",
    a: "שישי בישראל מגוון מאוד: מסיבות טכנו ו-EDM בדרום תל אביב, ערבי האוס בגגות, מסיבות מיינסטרים עם היפ-הופ ופופ, ורייבים אלקטרוניים בחיפה ובגליל.",
  },
  {
    q: "כיצד חוזרים הביתה אחרי מסיבת שישי?",
    a: "קווי לילה עירוניים פועלים בסופי שבוע. שירותי מוניות ורכב שיתופי זמינים 24/7. חלק מהמסיבות הגדולות מציעות שאטל חזרה ממרכזי העיר. כדאי לתכנן מראש.",
  },
  {
    q: "יש מסיבות שישי שמתאימות לגילאי 18 בלבד?",
    a: "כן, רוב המועדונים דורשים 18+. מסיבות נוער עם פיקוח מיוחד מסומנות בנפרד. תמיד בדקו את דרישות הגיל בדף האירוע לפני הרכישה.",
  },
];

export default function FridayPartiesGuidePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="container mx-auto max-w-4xl px-4 py-12 space-y-10" dir="rtl">
        {/* Hero */}
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-wide text-jungle-text/60">מדריך</p>
          <h1 className="text-3xl md:text-4xl font-display text-white">
            מסיבות יום שישי
          </h1>
          <p className="text-jungle-text/80 text-base md:text-lg max-w-2xl mx-auto">
            יום שישי הוא ללא עוררין הלילה הגדול של ישראל. מהשקיעה ועד
            הזריחה, העיר מתמלאת בסאונד, אנרגיה וקהל שיודע למה הוא יצא.
            במדריך הזה תמצאו את כל מה שצריך לדעת כדי לבנות ערב שישי מושלם –
            מהבחירה בין מועדון לבין מסיבת חוף, דרך ההזמנה המוקדמת של כרטיסים,
            ועד תכנון ההגעה והחזרה.
          </p>
        </header>

        {/* Intro */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4 text-jungle-text/90 text-base leading-relaxed">
          <p>
            בישראל, יום שישי הוא ערב שמתחיל כבר בשעות הצהריים המאוחרות ומסתיים
            לפעמים רק ביום שבת בצהריים. הסצנה גדולה ומגוונת: טכנו כבד בדרום
            תל אביב, האוס מרים על גגות המרכז, ערבי מיינסטרים עם להיטים חמים,
            ורייבים בחוץ לאורך החוף. כל סגנון מחיה – כל טמפרמנט ומוצא את
            עצמו.
          </p>
          <p>
            Parties 24/7 מרכז את כל מסיבות יום שישי הקרוב במקום אחד, עם
            אפשרות לסינון לפי עיר, ז&apos;אנר, גיל ומחיר. כך תוכלו לחסוך זמן
            יקר ולצאת לדרך עם כרטיס ביד ולא עם ספק.
          </p>
        </section>

        {/* Sections */}
        <section className="space-y-6">
          <h2 className="text-2xl font-display text-white">
            4 עולמות של מסיבות שישי שכדאי להכיר
          </h2>

          {/* TLV */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              1. מסיבות שישי בתל אביב – מהגג עד המרתף
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              תל אביב מציעה כמעט כל סגנון אפשרי בכל שישי. הדרום – פלורנטין,
              קריית מלאכה ונמל יפו – מארח את הרייבים הגדולים עם מוזיקה
              אלקטרונית כבדה. המרכז, שדרות רוטשילד ואזור השוק, מציע ברים עם
              DJ לייב ומסיבות האוס אינטימיות. הצפון, כולל נמל תל אביב
              והרמות, מארח אירועים רחבים יותר עם קהל מגוון.
            </p>
            <p className="text-jungle-text/90 leading-relaxed">
              בשישי הממוצע, תל אביב מציעה בין 15 ל-30 אירועים מוזיקליים
              שונים – ממסיבה ביתית עם 50 אנשים ועד פסטיבל עם אלפים.
              הכרטיסים עם מחיר early-bird זמינים בדרך כלל עד 22:00 של אותו
              ערב. לאחר מכן, מחיר הכניסה עולה בדלת.
            </p>
            <p className="text-jungle-text/80 text-sm">
              סגנונות: כל הסגנונות | שעות: 22:00-08:00 | מחיר: 40-200 ₪
            </p>
          </div>

          {/* Beach Parties */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              2. מסיבות חוף שישי – שקיעה, גלים וסאונד
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              בחודשי הקיץ (אפריל עד אוקטובר) ומעבר להם, חופי ישראל הופכים
              לבמות מסיבה חיצוניות. מסיבות שישי על החוף מתחילות לרוב בשעות
              אחר הצהריים עם סט שקיעה, ממשיכות לשעות הערב ולעיתים עוברות
              למקום מקורה ממנו ממשיך המחול. הפיתוי להישאר עם הרגליים בחול
              בזמן שהבאסים מרטיטים – הוא פיתוי שקשה לעמוד בו.
            </p>
            <p className="text-jungle-text/90 leading-relaxed">
              הפקות חוף פופולריות כוללות אירועים בחופי תל אביב, הרצליה,
              נתניה וחיפה. כרטיסים אלה נמכרים לרוב מהר, וחלקם כוללים מינימום
              צריכה בבר. בדקו את פרטי האירוע לפני שמגיעים כדי לדעת מה לצפות.
            </p>
            <p className="text-jungle-text/80 text-sm">
              זמן: 15:00-23:00 | סגנון: האוס, טכנו, מיינסטרים | כרטיסים: 50-120 ₪
            </p>
          </div>

          {/* Haifa */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              3. מסיבות שישי בחיפה – הצפון שמרקיד
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              חיפה היא עיר עם סצנת לילה חזקה ומגוונת שלא תמיד מקבלת את
              הקרדיט המגיע לה. שוק תלפיות וסביבתו הפכו למוקד של מסיבות
              אלקטרוניות ורייבים, בעוד שהכרמל מציע ברים אינטימיים עם DJ
              רזידנט ומפגשים קהילתיים. העיר התחתית ונמל חיפה אף הם מוסיפים
              מקומות חדשים בכל עונה.
            </p>
            <p className="text-jungle-text/90 leading-relaxed">
              מסיבות שישי בחיפה כוללות לרוב תמהיל של קהל סטודנטים מהטכניון
              ואוניברסיטת חיפה, צעירים מקומיים ואנשים שמגיעים מהצפון. הסגנון
              הכללי נוטה לטכנו, האוס ומוזיקה אלקטרונית, אבל יש גם ערבי
              מיינסטרים ו-R&B פופולריים.
            </p>
            <p className="text-jungle-text/80 text-sm">
              עיר: חיפה | סגנון: טכנו, האוס, מיינסטרים | גיל: 18+
            </p>
          </div>

          {/* Jerusalem */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              4. מסיבות שישי בירושלים – הסצנה ששומרת על עצמה
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              ירושלים מציעה חיי לילה שונים מהותית מתל אביב – אינטימיים יותר,
              קהילתיים יותר, ולעיתים ניסיוניים ואמנותיים יותר. מחנה יהודה
              ואזור נחלאות הם לב הסצנה – עם ברים שמציעים הופעות חיות, מסיבות
              שישי קטנות ואירועי תרבות-לילה שמשלבים מוזיקה עם אמנות.
            </p>
            <p className="text-jungle-text/90 leading-relaxed">
              מסיבות שישי בירושלים מתחילות לרוב מוקדם יותר (21:00-22:00)
              ומסתיימות בשעות סבירות יותר. הן פחות מסחריות ויותר קהילתיות,
              ואלה שמגיעים לרוב יוצאים עם ידידים חדשים ושאלות ישנות.
            </p>
            <p className="text-jungle-text/80 text-sm">
              עיר: ירושלים | סגנון: מגוון, עצמאי | שעות: 21:00-03:00
            </p>
          </div>
        </section>

        {/* Internal Links */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-display text-white mb-4">
            קיצורים שימושיים
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/day/friday"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              מסיבות שישי הקרוב
            </Link>
            <Link
              href="/day/weekend"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              מסיבות סוף שבוע
            </Link>
            <Link
              href="/all-parties"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              כל המסיבות
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display text-white">
            שאלות נפוצות – מסיבות יום שישי
          </h2>
          <div className="space-y-3">
            {faqs.map(({ q, a }, i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 p-5 space-y-2"
              >
                <h3 className="font-semibold text-white">{q}</h3>
                <p className="text-jungle-text/80 text-sm leading-relaxed">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="rounded-2xl border border-jungle-accent/30 bg-jungle-accent/10 p-8 text-center space-y-4">
          <h2 className="text-2xl font-display text-white">
            מה קורה השישי הקרוב?
          </h2>
          <p className="text-jungle-text/80">
            Parties 24/7 מעדכן את כל הליינים של יום שישי בזמן אמת. חפשו
            לפי עיר וז&apos;אנר, ורכשו כרטיסים בקישור ישיר ממש עכשיו.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/day/friday"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-jungle-accent px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              לכל מסיבות יום שישי
            </Link>
            <Link
              href="/all-parties"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              לכל המסיבות
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

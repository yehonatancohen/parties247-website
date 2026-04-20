import { Metadata } from "next";
import Link from "next/link";
import { BASE_URL } from "@/data/constants";

export const metadata: Metadata = {
  title: "מסיבות בתל אביב סוף שבוע 2026 | Parties 24/7",
  description:
    "מסיבות בתל אביב סוף שבוע 2026 – המדריך המלא: טכנו, היפ-הופ ורייבים. ליינאפ, כרטיסים ומועדונים חמים לכל סוף שבוע בעיר.",
  alternates: {
    canonical: `${BASE_URL}/tel-aviv-weekend-2026`,
  },
  openGraph: {
    title: "מסיבות בתל אביב סוף שבוע 2026",
    description:
      "מסיבות בתל אביב סוף שבוע 2026 – המדריך המלא: טכנו, היפ-הופ ורייבים. ליינאפ, כרטיסים ומועדונים חמים לכל סוף שבוע.",
    locale: "he_IL",
    type: "website",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "EventSeries",
  name: "מסיבות בתל אביב סוף שבוע 2026",
  description:
    "מסיבות ורייבים שבועיים בתל אביב לאורך שנת 2026 – טכנו, האוס, היפ-הופ ואירועי בוטיק",
  location: {
    "@type": "City",
    name: "תל אביב-יפו",
    addressCountry: "IL",
  },
  organizer: {
    "@type": "Organization",
    name: "Parties 24/7",
    url: BASE_URL,
  },
  url: `${BASE_URL}/tel-aviv-weekend-2026`,
  startDate: "2026-01-01",
  endDate: "2026-12-31",
};

const faqs = [
  {
    q: "מתי כדאי להזמין כרטיסים למסיבות סוף שבוע בתל אביב?",
    a: "מומלץ להזמין לפחות 48-72 שעות מראש. ליינאפים עם אמנים בינלאומיים נסגרים לרוב שבוע מראש. כדאי לבדוק ב-Parties 24/7 אם יש מחיר early-bird שחוסך 20%-40% מהמחיר בדלת.",
  },
  {
    q: "אילו מועדונים פועלים בסוף שבוע בתל אביב 2026?",
    a: "הבלוק, גגרין, פיאי, בור ועוד עשרות מקומות מפעילים ליינים בשישי ושבת. בנוסף, יש מסיבות חוף, מסיבות גג וחלל קפ-אפ שמשתנים בכל שבוע. Parties 24/7 מרכז את כולם במקום אחד.",
  },
  {
    q: "מה גיל הכניסה למסיבות בתל אביב?",
    a: "רוב המועדונים דורשים גיל 18+. חלק מהמקומות הפרטיים עם ליינאפ בינלאומי דורשים 21+. תמיד כדאי לבדוק בדף האירוע לפני שיוצאים מהבית.",
  },
  {
    q: "כיצד מגיעים לדרום תל אביב (אזור פלורנטין-קריית מלאכה) בלילה?",
    a: "קווי לילה פועלים בסופי שבוע, ויש שפע של שירותי רכב שיתופי. חלק מהמסיבות הגדולות מציעות שאטל מסונכרן ממרכז העיר. כדאי לבדוק את פרטי ההגעה בדף האירוע.",
  },
  {
    q: "האם כדאי להגיע בשעת הפתיחה למסיבות בתל אביב?",
    a: "לרוב לא. הרחבה מתחממת בין חצות לשעה 01:00. הגעה מוקדמת בשעת הפתיחה (22:00-23:00) מתאימה לאלה שרוצים להיכנס בלי תור ולחסוך בכניסה. הסטים הטובים ביותר מגיעים לאחר חצות.",
  },
];

export default function TelAvivWeekend2026Page() {
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
            מסיבות בתל אביב סוף שבוע 2026
          </h1>
          <p className="text-jungle-text/80 text-base md:text-lg max-w-2xl mx-auto">
            תל אביב לא נרדמת – ובשנת 2026 היא נמצאת בשיא. כל סוף שבוע מביא
            גל חדש של ליינאפים, אמנים בינלאומיים ומסיבות מקומיות שמתחרות
            ברמה הגלובלית הגבוהה ביותר. המדריך שלפניכם יעזור לכם לתכנן את
            סוף השבוע המושלם – בין אם אתם ותיקי הסצנה ובין אם אתם מגיעים
            לראשונה לרחבות של העיר הלבנה.
          </p>
        </header>

        {/* Intro */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4 text-jungle-text/90 text-base leading-relaxed">
          <p>
            מסיבות בתל אביב סוף שבוע 2026 מציעות מנעד רחב להפליא: מרייבים
            טכנו אנדרגראונד של 12 שעות בדרום העיר, דרך אירועי האוס על גגות
            שדרות רוטשילד, ועד מסיבות חוף שמתחילות עם שקיעה ומסתיימות עם
            הזריחה. הסצנה בתל אביב משלבת כישרונות ישראלים מוצלחים ושמות
            בינלאומיים שמגיעים כמעט בכל שבוע.
          </p>
          <p>
            כדי לא לפספס, חשוב לעקוב אחרי עדכוני הליינאפ, לרכוש כרטיסים
            מוקדם ולדעת מה מחכה לכם בכל מקום. Parties 24/7 מרכז את כל
            האירועים העדכניים, עם קישורים לרכישת כרטיסים ומידע מלא על כל
            אירוע.
          </p>
        </section>

        {/* Venues */}
        <section className="space-y-6">
          <h2 className="text-2xl font-display text-white">
            5 מקומות וחוויות שלא כדאי לפספס בסוף שבוע
          </h2>

          {/* The Block */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              1. הבלוק (The Block) – בית הטכנו של תל אביב
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              אי אפשר לדבר על מסיבות סוף שבוע בתל אביב בלי להזכיר את הבלוק.
              מועדון הדגל של הסצנה האלקטרונית הישראלית פועל בדרום העיר עם שתי
              רחבות מרשימות ומערכת סאונד ברמה עולמית. כל שישי ושבת מארח הבלוק
              ליינאפ שמשלב שמות גדולים מהסצנה הגלובלית עם ה-DJs המקומיים
              הטובים ביותר.
            </p>
            <p className="text-jungle-text/90 leading-relaxed">
              בשנת 2026 הבלוק עדיין מוביל את הסצנה עם ליינים חוזרים ורוטציית
              אמנים עשירה. האווירה בפנים מחמירה, הקהל מבין עניין, והסטים
              נמשכים לעיתים עד הצהריים של מחרת. מומלץ להזמין כרטיסים לפחות
              שבוע מראש ללילות עם ליינאפ בינלאומי – כרטיסי בדלת אוזלים מהר.
            </p>
            <p className="text-jungle-text/80 text-sm">
              סגנון: טכנו, אינדוסטריאל, EBM | גיל: 18+ | מחיר: 60-150 ₪
            </p>
          </div>

          {/* Gagarin */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              2. גגרין (Gagarin) – הרייב שנגמר עם הזריחה
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              גגרין הוא הכתובת לאנדרגראונד האמיתי של תל אביב. המבנה
              התעשייתי הענק הזה, שהיה מפעל בעברו, מציע רחבה עצומה שמאפשרת
              הפקות מורכבות עם תאורה מרשימה ואקוסטיקה ייחודית. כאן תמצאו
              את הסטים הכבדים יותר – טכנו שחור, EBM וזרמים אנדרגראונד שלא
              מגיעים לכל מקום.
            </p>
            <p className="text-jungle-text/90 leading-relaxed">
              מסיבות גגרין מתחילות מאוחר ונמשכות לעיתים 12-16 שעות ברצף.
              הזריחות מחלון המועדון הן אגדה בפני עצמן. אם אתם מחפשים את
              החוויה הטוטאלית של סוף שבוע – גגרין הוא עצירת חובה.
            </p>
            <p className="text-jungle-text/80 text-sm">
              סגנון: טכנו, אנדרגראונד | גיל: 18+ | פועל: שישי–שבת
            </p>
          </div>

          {/* PHI */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              3. פיאי (PHI) – האינטימיות המושלמת
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              פיאי הוא תשובה לאלה שרוצים ריקוד אמיתי בלי צפיפות מאוגרת.
              המועדון שממוקם בקרבת שדרות רוטשילד כולל גן חיצוני ורחבה
              פנימית – שילוב שמאפשר לנשום אוויר לילי בין סטים. האקוסטיקה
              מוקפדת, הקהל בררני, והמוזיקה מגוונת: מטכנו ועד ל-Afro-House
              ו-Deep Techno.
            </p>
            <p className="text-jungle-text/90 leading-relaxed">
              האווירה בפיאי היא של "מסיבת בית של חברים טובים, רק עם מערכת
              הגברה רצינית". אם אתם מחפשים ערב שמשלב מוזיקה מצוינת עם יחס
              אנושי – פיאי הוא הבחירה הנכונה לסוף השבוע.
            </p>
            <p className="text-jungle-text/80 text-sm">
              סגנון: האוס, Deep Techno, Afro | גיל: 18+ | כניסה: 60-120 ₪
            </p>
          </div>

          {/* Beach Raves */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              4. מסיבות חוף – הסאנסט ריב של 2026
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              בתל אביב של 2026, מסיבות החוף הפכו לתופעה עצמאית עם מעמד
              שקשה להגזים בחשיבותו. חופי הצפון והדרום של העיר מתמלאים בכל
              סוף שבוע בהפקות הצבה שמשלבות מערכות סאונד מרשימות עם נוף של
              ים תיכון. מסיבות השקיעה, שמתחילות בשעות אחר הצהריים, הפכו
              לאחד הדברים הכי אייקוניים בסצנה הישראלית.
            </p>
            <p className="text-jungle-text/90 leading-relaxed">
              אירועי חוף כוללים לרוב DJ סט חיצוני, בר קוקטיילים, ולעיתים
              הרצאות ו-workshops של תרבות. הכרטיסים נמכרים מהר, ולאחרי
              השקיעה חלק מהמסיבות עוברות להמשך במועדון קרוב. עקבו אחרי
              הפקות כמו "Sunset Session" ו-"Beach Rave TLV".
            </p>
            <p className="text-jungle-text/80 text-sm">
              זמן: 15:00-23:00 | סגנון: מגוון | כרטיסים: 40-100 ₪
            </p>
          </div>

          {/* Boutique */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              5. מסיבות בוטיק – הסצנה הנסתרת של תל אביב
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              מי שמכיר את תל אביב לעומק יודע שהמסיבות הכי מיוחדות לא
              מפורסמות בפרסומות גדולות. מסיבות בוטיק מתקיימות בגגות, גלריות
              אמנות, מחסנים ישנים ואפילו בחצרות פנימיות. הן מאורגנות על ידי
              קולקטיבים עצמאיים שמביאים כישרונות ייחודיים ואמנים מחו"ל
              שעושים ביקורים נדירים.
            </p>
            <p className="text-jungle-text/90 leading-relaxed">
              כרטיסים לאירועים אלו מוגבלים מאוד ולרוב זולים יותר ממועדונים
              גדולים. הדרך לגלות אותם היא לעקוב אחרי קולקטיבים מקומיים
              ברשתות החברתיות ולהירשם לעדכוני Parties 24/7 – שמרכז גם
              הפקות אינדי שלא מתפרסמות בכלי המיינסטרים.
            </p>
            <p className="text-jungle-text/80 text-sm">
              מיקומים: משתנים | קהל: 18+ | כרטיסים: 30-80 ₪
            </p>
          </div>
        </section>

        {/* Internal Links */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-display text-white mb-4">
            קיצורי דרך לתכנון הסוף שבוע
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/day/friday"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              מסיבות יום שישי
            </Link>
            <Link
              href="/day/weekend"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              מסיבות סוף שבוע
            </Link>
            <Link
              href="/genre/techno-music"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              מסיבות טכנו
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
            שאלות נפוצות – מסיבות בתל אביב סוף שבוע 2026
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
            מוכנים לסוף שבוע הגדול?
          </h2>
          <p className="text-jungle-text/80">
            Parties 24/7 מעדכן בזמן אמת את כל הליינים הקרובים בתל אביב.
            חפשו לפי תאריך, ז&apos;אנר או מועדון וקבלו קישור ישיר לרכישת כרטיסים.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/day/weekend"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-jungle-accent px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              לכל מסיבות הסוף שבוע
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

import { Metadata } from "next";
import Link from "next/link";
import { BASE_URL, BRAND_LOGO_URL } from "@/data/constants";

export const metadata: Metadata = {
  title: "Moon Child – ליינאפ, כתובת וכרטיסים | Parties 24/7",
  description:
    "Moon Child מסיבות – ליינאפ עדכני, כתובת ומידע על כרטיסים לאירועי Moon Child בישראל. כל מה שצריך לדעת לפני שמגיעים.",
  alternates: {
    canonical: `${BASE_URL}/moon-child`,
  },
  openGraph: {
    title: "Moon Child – ליינאפ, כתובת וכרטיסים",
    description:
      "Moon Child מסיבות – ליינאפ עדכני, כתובת ומידע על כרטיסים לאירועי Moon Child בישראל. כל מה שצריך לדעת לפני שמגיעים.",
    locale: "he_IL",
    type: "website",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "Moon Child",
    description:
      "מסיבות Moon Child – אירועי לילה אלקטרוניים ייחודיים עם ליינאפים מגוונים ואווירה מיסטית",
    startDate: "2020-01-01",
    endDate: "2027-12-31",
    image: BRAND_LOGO_URL,
    location: {
      "@type": "Place",
      name: "תל אביב-יפו",
      address: {
        "@type": "PostalAddress",
        addressLocality: "תל אביב-יפו",
        addressCountry: "IL",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Moon Child Events",
    },
    performer: {
      "@type": "PerformingGroup",
      name: "Moon Child DJs",
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/moon-child`,
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
    },
    url: `${BASE_URL}/moon-child`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
  },
  {
    "@context": "https://schema.org",
    "@type": "MusicEvent",
    name: "Moon Child Party Series",
    description:
      "סדרת מסיבות Moon Child בישראל – אירועים אלקטרוניים עם דגש על עיצוב ואווירה",
    startDate: "2020-01-01",
    endDate: "2027-12-31",
    image: BRAND_LOGO_URL,
    location: {
      "@type": "Place",
      name: "תל אביב-יפו",
      address: {
        "@type": "PostalAddress",
        addressLocality: "תל אביב-יפו",
        addressCountry: "IL",
      },
    },
    performer: {
      "@type": "PerformingGroup",
      name: "Moon Child DJs",
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/moon-child`,
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
    },
    url: `${BASE_URL}/moon-child`,
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
  },
];

const faqs = [
  {
    q: "מה זה Moon Child?",
    a: "Moon Child הוא מותג מסיבות ואירועי לילה שפועל בישראל ומוכר בזכות הפקות ייחודיות עם דגש על עיצוב ואווירה. האירועים של Moon Child נמצאים בחזית הסצנה האלקטרונית ומאופיינים בבחירת מיקומים לא שגרתיים ובליינאפים מיועדים.",
  },
  {
    q: "היכן מתקיימות מסיבות Moon Child?",
    a: "אירועי Moon Child מתקיימים במגוון מיקומים – לעיתים מועדוני לילה מבוססים בתל אביב, ולעיתים חללים חריגים וייחודיים. המיקום משתנה מאירוע לאירוע ומפורסם עם שחרור הכרטיסים. עקבו אחרי Parties 24/7 לעדכונים.",
  },
  {
    q: "מה סגנון המוזיקה ב-Moon Child?",
    a: "Moon Child ידוע בגישה אקלקטית למוזיקה – מוזיקה אלקטרונית, טכנו, דארק-האוס ולעיתים ניסיוני ו-ambient. הסגנון משתנה בין ערב לערב ותלוי בליינאפ הספציפי. ניתן לבדוק את סגנון כל אירוע בדף האירוע.",
  },
  {
    q: "כיצד רוכשים כרטיסים לאירועי Moon Child?",
    a: "כרטיסים לאירועי Moon Child זמינים בדרך כלל דרך Parties 24/7 ודרך עמודי הרשתות החברתיות הרשמיים. כרטיסי early-bird נמכרים מהר – מומלץ להירשם לעדכוני Parties 24/7 לקבלת הודעה ראשונה על שחרור כרטיסים.",
  },
  {
    q: "האם Moon Child מתאים לאנשים שמגיעים לפעם הראשונה לסצנה?",
    a: "Moon Child מאופיין באווירה פתוחה ומכילה. האמנות, העיצוב והמוזיקה מושכים אנשים ממגוון רקעים. אם אתם חדשים בסצנה ומחפשים חוויה ייחודית ולא רק מסיבה קלאסית – Moon Child הוא מקום מצוין להתחיל בו.",
  },
];

export default function MoonChildPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="container mx-auto max-w-4xl px-4 py-12 space-y-10" dir="rtl">
        {/* Hero */}
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-wide text-jungle-text/60">מסיבות</p>
          <h1 className="text-3xl md:text-4xl font-display text-white">
            Moon Child — ליינאפ, כתובת וכרטיסים
          </h1>
          <p className="text-jungle-text/80 text-base md:text-lg max-w-2xl mx-auto">
            Moon Child הוא אחד ממותגי המסיבות המעניינים ביותר בסצנה
            הישראלית – אירועים שמשלבים מוזיקה אלקטרונית, עיצוב ייחודי
            ואווירה מיסטית שמייחדת כל הפקה. אם שמעתם על Moon Child ורוצים
            לדעת יותר – הכתובת הזאת בדיוק בשבילכם.
          </p>
        </header>

        {/* About */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4 text-jungle-text/90 text-base leading-relaxed">
          <h2 className="text-xl font-display text-white">מה זה Moon Child?</h2>
          <p>
            Moon Child הוא מותג הפקות ומסיבות שצמח מתוך הרצון ליצור חוויות
            לילה שונות מהשגרה. בעוד שרוב המסיבות מוגדרות על ידי שם המועדון
            או שם הDJ, Moon Child בנה זהות עצמאית שמעל הכל. כל אירוע הוא
            יצירה שלמה – עם עיצוב שהוכן במיוחד, תאורה שמתאימה לאווירה
            המוזיקלית, ובחירת כל פרט שנועדה להעביר את הקהל למצב ייחודי.
          </p>
          <p>
            השם "Moon Child" מצביע על הזהות: ילד הירח, מי שמגיע לחיים בלילה.
            הפלוסופיה הזאת מחלחלת לתוך כל פרט של ההפקה – מהבחירה במיקום
            (לרוב לא מקום שגרתי), דרך ליינאפ שלא ניתן לחזות מראש, ועד
            הפרטים הקטנים שעושים את ההבדל בין מסיבה לחוויה.
          </p>
        </section>

        {/* Events / Lineup types */}
        <section className="space-y-6">
          <h2 className="text-2xl font-display text-white">
            מה מחכה לכם ב-Moon Child
          </h2>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              1. ההפקה – כאשר העיצוב הוא חלק מהמוזיקה
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              אחד הדברים שמייחדים את Moon Child הוא ההשקעה בהפקה הכוללת.
              אירועים כוללים לרוב אינסטלציות אמנות, תאורה ייחודית ועיצוב
              חלל שיוצר מרחב ויזואלי שמתוכנן במיוחד עבור המוזיקה. הגעה
              ל-Moon Child היא לא רק כדי לרקוד – היא כדי לחוות.
            </p>
            <p className="text-jungle-text/80 text-sm">
              מאפיין: עיצוב מיוחד, אינסטלציות, תאורה סינכרונית
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              2. הליינאפ – מגוון שמפתיע בכל פעם
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              Moon Child בוחר DJs ומוזיקאים שמביאים משהו ייחודי לשולחן.
              לא בהכרח השמות הגדולים ביותר, אלא אלה שמתאימים ביותר לחזון
              של האירוע הספציפי. הסגנון נע בין טכנו כהה ודארק-האוס, דרך
              מוזיקה אמביינטית וניסיונית, ועד ערבים שמשלבים לייבים חיים עם
              DJ סטים. כל אירוע הוא הפתעה, וזה בדיוק מה שהופך אותו
              מיוחד.
            </p>
            <p className="text-jungle-text/80 text-sm">
              סגנונות: אלקטרוני, טכנו, דארק-האוס, ניסיוני, לייב
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              3. המיקומים – מחוץ לאזור הנוחות
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              Moon Child מתחמק ממיקומים שגרתיים. אירועים התקיימו בחללים
              תעשייתיים שעברו המרה, מחסנים ביפו, גגות עם נוף, ולעיתים
              מיקומים מחוץ לתל אביב כולה. הבחירה במיקום היא חלק
              מהסיפור של כל אירוע, ומוסיפה שכבת מסתורין שגורמת לאנשים
              לדון בכל הפקה עוד שבועות אחריה.
            </p>
            <p className="text-jungle-text/80 text-sm">
              מיקומים: חללים ייחודיים, משתנה בכל פעם | בדקו בדף האירוע
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              4. הקהל – קהילה שמגיעה בשביל החוויה
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              מי שמגיע ל-Moon Child הוא לרוב מי שיודע על מה הוא מגיע. זה
              לא מקום לאנשים שבאו כי לא הייתה להם חלופה – זה מקום שנבחר
              באופן מכוון. הקהל מגוון גיל, מגיע מהסצנה האלקטרונית,
              מעולם האמנות, ומחוגים שמחפשים בילוי שהוא יותר מסתם לרקוד.
              האנרגיה המשותפת הזאת יוצרת קהילה ייחודית.
            </p>
            <p className="text-jungle-text/80 text-sm">
              קהל: מגוון, 18+ | אווירה: פתוחה, מכילה, אמנותית
            </p>
          </div>
        </section>

        {/* Internal Links */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-display text-white mb-4">
            מסיבות נוספות שיעניינו אתכם
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/all-parties"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              כל המסיבות
            </Link>
            <Link
              href="/genre/techno-music"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              מסיבות טכנו
            </Link>
            <Link
              href="/day/weekend"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              מסיבות סוף שבוע
            </Link>
            <Link
              href="/cities/tel-aviv"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              מסיבות תל אביב
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display text-white">
            שאלות נפוצות – Moon Child
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
            מוכנים לחוויה ב-Moon Child?
          </h2>
          <p className="text-jungle-text/80">
            בדקו ב-Parties 24/7 מתי האירוע הבא של Moon Child, רכשו
            כרטיסים מוקדם לפני שמתמלאים, ותגיעו מוכנים לחוויה שלא תשכחו.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/all-parties"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-jungle-accent px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              לכל המסיבות ב-Parties 24/7
            </Link>
            <Link
              href="/genre/techno-music"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              מסיבות טכנו
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

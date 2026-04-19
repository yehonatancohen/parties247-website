import { Metadata } from "next";
import Link from "next/link";
import { BASE_URL } from "@/data/constants";

export const metadata: Metadata = {
  title: "כרטיסים למסיבות בישראל – המדריך לרכישה חכמה | Parties 24/7",
  description:
    "כרטיסים למסיבות בישראל: כיצד לרכוש, מתי לקנות early-bird, והיכן למצוא הנחות. המדריך המלא לכרטיסים לאירועי לילה.",
  alternates: {
    canonical: `${BASE_URL}/tickets-israel`,
  },
  openGraph: {
    title: "כרטיסים למסיבות בישראל – המדריך לרכישה חכמה",
    description:
      "כרטיסים למסיבות בישראל: כיצד לרכוש, מתי לקנות early-bird, והיכן למצוא הנחות. המדריך המלא לכרטיסים לאירועי לילה.",
    locale: "he_IL",
    type: "website",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "כרטיסים למסיבות בישראל",
    description:
      "מדריך לרכישת כרטיסים למסיבות ואירועי לילה בישראל – early-bird, הנחות ותכנון חכם",
    url: `${BASE_URL}/tickets-israel`,
    publisher: {
      "@type": "Organization",
      name: "Parties 24/7",
      url: BASE_URL,
    },
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "מתי כדאי לרכוש כרטיסים למסיבות בישראל?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "מומלץ לרכוש כרטיסים מוקדם ככל האפשר. מחיר early-bird זמין לרוב 1-3 שבועות לפני האירוע ויכול להיות זול ב-30%-50% ממחיר הדלת. למסיבות גדולות עם אמנים בינלאומיים, כרטיסים יכולים להימכר תוך שעות.",
        },
      },
      {
        "@type": "Question",
        name: "כיצד רוכשים כרטיסים למסיבות בישראל?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "ניתן לרכוש כרטיסים דרך Parties 24/7 – האתר מפנה לדפי הרכישה הרשמיים של כל אירוע. כמו כן ניתן לקנות דרך מנהלי הפקה, עמודי הרשתות החברתיות של המועדון, וחנויות כרטיסים מקוונות כמו Eventbrite.",
        },
      },
      {
        "@type": "Question",
        name: "האם אפשר להחזיר כרטיסים למסיבות?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "מדיניות ההחזרות משתנה מאירוע לאירוע. רוב ההפקות לא מאפשרות החזרה לאחר הרכישה, אך אפשר לעיתים להעביר כרטיס לאדם אחר. בדקו את מדיניות ההחזרה בדף הרכישה לפני שאתם קונים.",
        },
      },
    ],
  },
];

const faqs = [
  {
    q: "מתי כדאי לרכוש כרטיסים למסיבות בישראל?",
    a: "מומלץ לרכוש מוקדם ככל האפשר. מחיר early-bird זמין לרוב 1-3 שבועות לפני האירוע ויכול להיות זול ב-30%-50% ממחיר הדלת. למסיבות גדולות עם אמנים בינלאומיים, כרטיסים יכולים להימכר תוך שעות ממועד הפרסום.",
  },
  {
    q: "כיצד רוכשים כרטיסים למסיבות ואירועי לילה בישראל?",
    a: "ניתן לרכוש כרטיסים דרך Parties 24/7 – האתר מפנה לדפי הרכישה הרשמיים של כל אירוע. כמו כן ניתן לקנות דרך עמודי הרשתות החברתיות של המועדון, שירותי כרטיסים מקוונים, או במינוי מוקדם בקופת המועדון.",
  },
  {
    q: "האם יש הנחות לסטודנטים ולחיילים?",
    a: "חלק מהמסיבות מציעות הנחות לסטודנטים וחיילים. אלה מסומנות בדרך כלל בדף האירוע וניתן לקנות כרטיסים מוזלים עם הצגת תעודה בכניסה. Parties 24/7 מסמן אירועים עם הנחות כדי שתמצאו אותם בקלות.",
  },
  {
    q: "האם אפשר להחזיר כרטיסים למסיבות?",
    a: "מדיניות ההחזרות משתנה מאירוע לאירוע. רוב ההפקות לא מאפשרות החזרה לאחר הרכישה, אך לעיתים ניתן להעביר כרטיס לאדם אחר. בדקו את מדיניות ההחזרה בדף הרכישה לפני שאתם קונים.",
  },
  {
    q: "מה קורה אם מסיבה מבוטלת?",
    a: "במקרה של ביטול, ההפקה מחויבת להחזיר את עלות הכרטיס. בדרך כלל ההחזר מתבצע לאמצעי התשלום המקורי תוך מספר ימי עסקים. Parties 24/7 מעדכן בזמן אמת על שינויים ובלוגים של אירועים.",
  },
];

export default function TicketsIsraelPage() {
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
            כרטיסים למסיבות בישראל
          </h1>
          <p className="text-jungle-text/80 text-base md:text-lg max-w-2xl mx-auto">
            רכישת כרטיסים למסיבות ואירועי לילה בישראל היא אמנות בפני עצמה.
            מי שיודע מתי לקנות, איפה לחפש, ואיך לנצל הנחות – חוסך כסף,
            נכנס ללא תור ומגיע מוכן. המדריך הזה הוא כל מה שצריך לדעת כדי
            לנהל את קניית הכרטיסים שלכם בצורה חכמה.
          </p>
        </header>

        {/* Intro */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4 text-jungle-text/90 text-base leading-relaxed">
          <p>
            שוק הכרטיסים לאירועי לילה בישראל עבר שינוי משמעותי בשנים
            האחרונות. מה שפעם דרש עמידה בתורות ארוכות בקופות, מתנהל כיום
            כמעט לגמרי אונליין. הפקות פותחות מכירת כרטיסים ברשתות
            החברתיות, בשירותים ייעודיים ובאתרים כמו Parties 24/7 – שם
            ניתן למצוא את כל האירועים ולרכוש בקישור ישיר.
          </p>
          <p>
            הכלל הזהב הוא: ככל שמוקדם יותר, כך טוב יותר. מחירי early-bird
            הם לרוב ההנחה הגדולה ביותר שתוכלו לקבל. לאחר מכן המחירים עולים
            בהדרגה ככל שהאירוע מתקרב, ומחיר הדלת הוא לרוב היקר ביותר.
          </p>
        </section>

        {/* Sections */}
        <section className="space-y-6">
          <h2 className="text-2xl font-display text-white">
            5 דרכים לחסוך בכרטיסים למסיבות
          </h2>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              1. כרטיסי Early-Bird – החסכון הגדול ביותר
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              כרטיסי early-bird הם הבחירה הכי חכמה לאנשים שמתכננים מראש.
              ההפקות מציעות כרטיסים אלה בדרך כלל 2-4 שבועות לפני האירוע,
              במחיר שיכול להיות נמוך ב-30%-50% ממחיר הדלת. המגבלה היחידה
              היא שמספר הכרטיסים בשלב הזה מוגבל – בדרך כלל 50-200 כרטיסים
              בלבד, תלוי בגודל האירוע.
            </p>
            <p className="text-jungle-text/90 leading-relaxed">
              הדרך הטובה ביותר לדעת מתי early-bird יוצא היא להירשם לעדכוני
              Parties 24/7, לעקוב אחרי עמודי ההפקות ברשתות החברתיות, ולהגדיר
              התראה לאירועים שמעניינים אתכם. הכרטיסים האלה נגמרים לעיתים
              תוך שעות ממועד הפרסום.
            </p>
            <p className="text-jungle-text/80 text-sm">
              חיסכון: 30%-50% | זמינות: מוגבלת | מועד: 2-4 שבועות לפני
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              2. כרטיסים קבוצתיים ורשימות אורח
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              רבים מהמועדונים והמסיבות מציעים מחיר מיוחד לקבוצות שמגיעות
              יחד. כניסה של 6 אנשים ומעלה יכולה לזכות בהנחה משמעותית לנפש,
              בעיקר בימי אמצע שבוע ובאירועים שמעוניינים למלא את הרחבה.
              בנוסף, חלק מהמסיבות מפעילות "רשימות אורח" שבהן הכניסה זולה
              יותר למי שנרשם מראש אונליין.
            </p>
            <p className="text-jungle-text/90 leading-relaxed">
              לחפש כניסה בחינם? לעיתים נדירות אפשרי, אבל זה דורש הכרות
              עם הצוות, נוכחות פעילה ברשתות החברתיות, או עבודה אירועית.
              בדרך כלל זמינות לד&apos;ג&apos;יי מקומיים ולאמנים שמבצעים בהפקה.
            </p>
            <p className="text-jungle-text/80 text-sm">
              חיסכון: 15%-30% | לקבוצות: 6+ אנשים | רשימת אורח: בחינם/מחיר מופחת
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              3. הנחות סטודנטים, חיילים ועובדי תעשייה
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              חלק גדול מהמסיבות בישראל מציע הנחות לאוכלוסיות ייחודיות.
              סטודנטים עם תעודה תקפה, חיילים בשירות חובה, ולעיתים גם
              קהל מקצועי מתעשיית הבידור יכולים לקנות כרטיסים בזמן הרגיל
              ולשלם פחות – בהצגת תעודה בכניסה. הנחות אלו מסומנות בדרך כלל
              בדפי האירועים.
            </p>
            <p className="text-jungle-text/80 text-sm">
              זכאים: סטודנטים, חיילים, עובדי תעשייה | הצגת תעודה: בכניסה
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              4. כרטיסים אונליין לעומת כרטיסים בדלת
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              רכישה אונליין מראש היא כמעט תמיד עדיפה על רכישה בדלת. לא
              רק מבחינת מחיר (כניסה בדלת עולה לרוב 20%-40% יותר), אלא גם
              מבחינת זמן – תוכלו לדלג על תורים ארוכים ולהיכנס דרך כניסת
              כרטיסים מהירה. בנוסף, כרטיסים אונליין מאפשרים לבדוק מראש את
              פרטי האירוע ולתכנן את הערב.
            </p>
            <p className="text-jungle-text/80 text-sm">
              יתרונות: מחיר נמוך, כניסה מהירה, מידע מלא מראש
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              5. Parties 24/7 – מרכז כרטיסים ומידע
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              Parties 24/7 הוא המקום המרכזי לחפש כרטיסים לכל המסיבות
              בישראל. האתר מקשר ישירות לדפי הרכישה הרשמיים של כל אירוע,
              ומסמן בבירור אירועים עם כרטיסים אחרונים, מחירי early-bird
              שעדיין זמינים, ואירועים שצפויים להימכר מהר. ניתן לסנן לפי
              עיר, תאריך, ז&apos;אנר ומחיר כדי למצוא בדיוק את מה שמחפשים.
            </p>
            <p className="text-jungle-text/80 text-sm">
              זמין: 24/7 | מסנן: עיר, תאריך, ז&apos;אנר | עדכון: בזמן אמת
            </p>
          </div>
        </section>

        {/* Internal Links */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="text-xl font-display text-white mb-4">
            חפשו כרטיסים לפי קטגוריה
          </h2>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/all-parties"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              כל המסיבות
            </Link>
            <Link
              href="/day/weekend"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              מסיבות סוף שבוע
            </Link>
            <Link
              href="/parties"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              כל עמודי המסיבות
            </Link>
            <Link
              href="/day/friday"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              מסיבות שישי
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display text-white">
            שאלות נפוצות – כרטיסים למסיבות בישראל
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
            מוכנים לקנות כרטיסים?
          </h2>
          <p className="text-jungle-text/80">
            Parties 24/7 מרכז את כל הכרטיסים למסיבות ישראל במקום אחד.
            חפשו לפי עיר, תאריך וז&apos;אנר – ורכשו בקישור ישיר ומאובטח.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/all-parties"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-jungle-accent px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              לכל המסיבות והכרטיסים
            </Link>
            <Link
              href="/day/weekend"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              מסיבות הסוף שבוע הקרוב
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

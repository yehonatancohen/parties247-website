import { Metadata } from "next";
import Link from "next/link";
import { BASE_URL, BRAND_LOGO_URL } from "@/data/constants";

export const metadata: Metadata = {
  title: "Jimmy Who – ליינאפ, כתובת וכרטיסים | Parties 24/7",
  description:
    "Jimmy Who תל אביב – ליינאפ עדכני, כתובת המועדון, שעות פתיחה ומידע על כרטיסים. כל מה שצריך לפני שיוצאים לג'ימי הו.",
  alternates: {
    canonical: `${BASE_URL}/jimmy-who`,
  },
  openGraph: {
    title: "Jimmy Who – ליינאפ, כתובת וכרטיסים",
    description:
      "Jimmy Who תל אביב – ליינאפ עדכני, כתובת המועדון, שעות פתיחה ומידע על כרטיסים. כל מה שצריך לפני שיוצאים לג'ימי הו.",
    locale: "he_IL",
    type: "website",
  },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "MusicVenue",
    name: "Jimmy Who",
    alternateName: "ג'ימי הו",
    description:
      "מועדון Jimmy Who בתל אביב – מרחב ריקודים אייקוני עם מוזיקה מגוונת ואירועי לילה שבועיים",
    address: {
      "@type": "PostalAddress",
      addressLocality: "תל אביב-יפו",
      addressCountry: "IL",
    },
    url: `${BASE_URL}/jimmy-who`,
    sameAs: ["https://www.parties247.co.il/jimmy-who"],
  },
  {
    "@context": "https://schema.org",
    "@type": "EventSeries",
    name: "מסיבות שבועיות ב-Jimmy Who",
    description: "אירועי לילה קבועים ב-Jimmy Who תל אביב",
    startDate: "2020-01-01",
    endDate: "2027-12-31",
    image: BRAND_LOGO_URL,
    location: {
      "@type": "MusicVenue",
      name: "Jimmy Who",
      address: {
        "@type": "PostalAddress",
        addressLocality: "תל אביב-יפו",
        addressCountry: "IL",
      },
    },
    organizer: {
      "@type": "Organization",
      name: "Parties 24/7",
      url: BASE_URL,
    },
    performer: {
      "@type": "PerformingGroup",
      name: "DJs שונים",
    },
    offers: {
      "@type": "Offer",
      url: `${BASE_URL}/jimmy-who`,
      priceCurrency: "ILS",
      availability: "https://schema.org/InStock",
    },
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    eventStatus: "https://schema.org/EventScheduled",
  },
];

const faqs = [
  {
    q: "מהו Jimmy Who ולמה הוא מיוחד?",
    a: "Jimmy Who הוא אחד המועדונים הבולטים בתל אביב, המוכר בסצנת חיי הלילה הישראלית בזכות האנרגיה הייחודית שלו, המוזיקה המגוונת ואווירה שמושכת קהל נאמן. המועדון ידוע בהפקות איכותיות ובליינאפים שמשלבים אמנים מקומיים ובינלאומיים.",
  },
  {
    q: "איפה נמצא Jimmy Who בתל אביב?",
    a: "Jimmy Who נמצא בתל אביב. לכתובת המדויקת ולמידע עדכני על הגעה, מומלץ לבדוק את דף האירוע הספציפי ב-Parties 24/7 או בעמוד הרשמי של המועדון ברשתות החברתיות לפני שיוצאים.",
  },
  {
    q: "מה הסגנונות המוזיקליים ב-Jimmy Who?",
    a: "Jimmy Who מארח מגוון רחב של סגנונות: מהיפ-הופ ו-R&B, דרך מסיבות מיינסטרים עם להיטים חמים, ועד ערבי אלקטרוניים ו-House. הסגנון משתנה בין אירוע לאירוע – כדאי לבדוק את ליינאפ הערב הספציפי.",
  },
  {
    q: "כיצד רוכשים כרטיסים ל-Jimmy Who?",
    a: "כרטיסים לאירועי Jimmy Who זמינים דרך Parties 24/7. חפשו את שם המועדון או האירוע, ותקבלו קישור ישיר לרכישה. מומלץ לרכוש מראש כי הכרטיסים מתמלאים מהר, במיוחד לערבי ליינאפ מיוחדים.",
  },
  {
    q: "מה הקוד לבוש ב-Jimmy Who?",
    a: "Jimmy Who בדרך כלל מקיים מדיניות לבוש מכובדת – ללא סנדלים, כפכפים או ביגוד ספורטיבי מאוד. האווירה היא של ערב לילה מכובד. כדאי לבדוק דרישות ספציפיות לאירוע בדף האירוע לפני שיוצאים.",
  },
];

export default function JimmyWhoPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="container mx-auto max-w-4xl px-4 py-12 space-y-10" dir="rtl">
        {/* Hero */}
        <header className="space-y-4 text-center">
          <p className="text-sm uppercase tracking-wide text-jungle-text/60">מועדון</p>
          <h1 className="text-3xl md:text-4xl font-display text-white">
            Jimmy Who — ליינאפ, כתובת וכרטיסים
          </h1>
          <p className="text-jungle-text/80 text-base md:text-lg max-w-2xl mx-auto">
            Jimmy Who (ג&apos;ימי הו) הוא אחד מהשמות המזוהים ביותר בחיי הלילה של
            תל אביב. המועדון שבנה לעצמו שם בזכות ליינאפים עקביים, אווירה
            בלתי ניתנת לשכפול וקהל נאמן שחוזר שבוע אחר שבוע. מדריך זה
            מרכז את כל המידע שצריך לדעת לפני שמגיעים.
          </p>
        </header>

        {/* About */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-4 text-jungle-text/90 text-base leading-relaxed">
          <h2 className="text-xl font-display text-white">אודות Jimmy Who</h2>
          <p>
            Jimmy Who נמנה על המועדונים שעיצבו את פני סצנת הלילה בתל אביב
            בשנים האחרונות. המקום ידוע ביכולתו לאחד סגנונות שונים תחת קורת
            גג אחת – מסיבות מיינסטרים שמושכות קהל רחב, לצד ערבים מיוחדים עם
            אמנים שמגיעים ספציפית להופיע כאן. האנרגיה בתוך המועדון היא
            ייחודית: שילוב בין מערכת סאונד מרשימה, תאורה מקצועית, ורחבה
            שמרגישה גדולה מספיק לרקוד אבל קטנה מספיק להרגיש אינטימי.
          </p>
          <p>
            כמו הרבה מהמקומות הטובים בתל אביב, Jimmy Who בנה את המוניטין
            שלו על עקביות: הפקות שמתקיימות בזמן, DJ שמגיעים מוכנים, ואנשים
            שיודעים שאם הם קנו כרטיס – הם הולכים לבלות. זה לא מובן מאליו
            בסצנה שבה כל כך הרבה מסיבות באות והולכות, וזו בדיוק הסיבה שהמקום
            הפך לציון דרך בחיי הלילה הישראליים.
          </p>
        </section>

        {/* Lineup types */}
        <section className="space-y-6">
          <h2 className="text-2xl font-display text-white">
            סוגי הערבים והאמנים ב-Jimmy Who
          </h2>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              1. ערבי מיינסטרים והיפ-הופ
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              Jimmy Who מוכר במיוחד בערבי המיינסטרים שלו – ערבי היפ-הופ,
              R&B ופופ ישראלי שמושכים קהל רחב ומגוון. הפלייליסטים כוללים
              להיטים עדכניים לצד קלאסיקות אהובות, והרחבה ממלאת מהר. אלה
              הערבים שמתאימים לחבורת חברים שרוצה לצאת לבלות ללא תואנות –
              סתם לרקוד ולהנות.
            </p>
            <p className="text-jungle-text/80 text-sm">
              מתאים ל: חבורות, ימי הולדת, ערבים חברתיים | מחיר: 60-120 ₪
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              2. אירועים מיוחדים עם אמנים מוזמנים
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              לצד ערבי הלילה הקבועים, Jimmy Who מארח מפעם לפעם אמנים
              מיוחדים – ישראלים מובילים ולעיתים גם אמנים מחו&apos;ל. אירועים אלו
              מפורסמים בדרך כלל מספר שבועות מראש והכרטיסים להם מתמלאים
              מהר. מומלץ להירשם לעדכוני Parties 24/7 כדי לדעת מתי יש
              הופעה מיוחדת בתכנון.
            </p>
            <p className="text-jungle-text/80 text-sm">
              תדירות: חודשי | כרטיסים: 80-180 ₪ | מומלץ: הזמינו מראש
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              3. ערבי קונספט ואירועי נושא
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              Jimmy Who ידוע גם בנכונות לנסות פורמטים חדשים – מסיבות קונספט
              עם תמות מיוחדות, ערבי שנות ה-90 וה-2000, מסיבות אחרי ראש
              השנה ופורים, ואירועי קולקציה שיתופיים עם מותגים ואמנים. אלה
              הערבים שיוצרים זיכרונות ומחזירים אנשים שנה אחרי שנה.
            </p>
            <p className="text-jungle-text/80 text-sm">
              תדירות: ספורדי | נושאים: משתנים | עקבו: Parties 24/7
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 space-y-3">
            <h3 className="text-xl font-semibold text-white">
              4. טיפים לביקור ב-Jimmy Who
            </h3>
            <p className="text-jungle-text/90 leading-relaxed">
              לחוויה הטובה ביותר ב-Jimmy Who: הגיעו בין 23:00-00:00 כדי
              להימנע מתורים ארוכים, לבשו בהתאם לקוד הלבוש (ללא סנדלים,
              סניקרים נקיים מועדפים), ורכשו כרטיסים מראש. תכנן את החזרה
              מראש – המועדון נמצא בתל אביב ויש מגוון אפשרויות תחבורה.
            </p>
            <p className="text-jungle-text/80 text-sm">
              שעות פתיחה: 22:00 | פועל: שישי-שבת בעיקר | גיל: 18+
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
              href="/cities/tel-aviv"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              מסיבות תל אביב
            </Link>
            <Link
              href="/genre/mainstream"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              מסיבות מיינסטרים
            </Link>
            <Link
              href="/day/weekend"
              className="rounded-full border border-white/20 px-4 py-2 text-sm text-jungle-text/90 hover:bg-white/10 transition"
            >
              מסיבות סוף שבוע
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section className="space-y-4">
          <h2 className="text-2xl font-display text-white">
            שאלות נפוצות – Jimmy Who
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
            הכינו את עצמכם לג&apos;ימי
          </h2>
          <p className="text-jungle-text/80">
            בדקו את הליינאפ העדכני של Jimmy Who ב-Parties 24/7, רכשו
            כרטיסים בקישור ישיר ותגיעו מוכנים לאחד הערבים הטובים בתל אביב.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/all-parties"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-jungle-accent px-6 py-3 text-sm font-semibold text-black transition hover:opacity-90"
            >
              לכל המסיבות ב-Parties 24/7
            </Link>
            <Link
              href="/cities/tel-aviv"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              מסיבות בתל אביב
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}

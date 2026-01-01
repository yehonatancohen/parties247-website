import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'תנאי שימוש | Parties 24/7',
  description: 'תנאי השימוש והגבלת האחריות באתר Parties 24/7',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-jungle-surface/50 border border-wood-brown/30 rounded-2xl p-8 md:p-12 text-right dir-rtl" dir="rtl">
        <h1 className="text-3xl md:text-4xl font-display text-white mb-2">תנאי שימוש</h1>
        <p className="text-jungle-text/60 mb-8 text-sm">עודכן לאחרונה: ינואר 2026</p>

        <div className="space-y-8 text-jungle-text/90 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">1. כללי</h2>
            <p>
              ברוכים הבאים לאתר Parties 24/7 (להלן: "האתר"). השימוש באתר, בתכנים המוצגים בו ובשירותים השונים המוצעים בו מעיד על הסכמתך לתנאים אלה ולמדיניות הפרטיות. 
              האמור בתקנון זה מתייחס באופן שווה לבני שני המינים והשימוש בלשון זכר הוא מטעמי נוחות בלבד.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">2. מהות השירות והגבלת אחריות</h2>
            <p className="mb-2">
              <strong>חשוב להבהיר: האתר משמש כפלטפורמה המרכזת מידע אודות מסיבות ואירועי בידור, ומפנה לרכישת כרטיסים באתרים חיצוניים (Affiliate).</strong>
            </p>
            <ul className="list-disc list-inside space-y-2 mr-2">
              <li>מפעילי האתר אינם המפיקים, המארגנים או האחראים על האירועים המפורסמים באתר.</li>
              <li>כל המידע המופיע באתר נלקח מצדדים שלישיים או נמסר על ידי מפיקי האירועים. אנו עושים מאמץ לאמת את הפרטים, אך לא נישא באחריות לטעויות, שינויים בלוחות הזמנים, ביטולי מסיבות או אי-דיוקים בפרטי האירוע.</li>
              <li>האחריות הבלעדית על קיום האירוע, טיבו, בטיחות המבלים, והחזרי כספים במקרה של ביטול – חלה על מפיק האירוע ו/או חברת הכרטיסים בלבד.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">3. רכישת כרטיסים וקישורים חיצוניים</h2>
            <p>
              האתר מכיל קישורים (Links) לאתרים חיצוניים לצורך רכישת כרטיסים (כגון GoOut, Zygo ואחרים). 
              לחיצה על קישורים אלו מובילה לאתרים שאינם בשליטתנו. 
              כל עסקת רכישה מתבצעת ישירות מול ספק הכרטיסים החיצוני, ובכפוף לתנאי השימוש שלו. 
              למפעילי האתר אין צד בעסקה, ולא יהיו אחראים לכל בעיה הנובעת מהרכישה, לרבות אי-קבלת כרטיסים או בעיות חיוב.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">4. קניין רוחני</h2>
            <p>
              כל זכויות הקניין הרוחני באתר, לרבות העיצוב, קוד המקור, הלוגו, ושם המותג, הינם רכושם הבלעדי של מפעילי האתר. 
              אין להעתיק, לשכפל, להפיץ או להשתמש בתכנים אלו ללא אישור מראש ובכתב.
              זכויות היוצרים על תמונות האירועים שייכות למפיקים או לצלמים בהתאמה, והן מוצגות באתר תחת שימוש הוגן לצורך קידום האירוע.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">5. שימוש באתר</h2>
            <p>
              המשתמש מתחייב להשתמש באתר למטרות חוקיות בלבד. חל איסור מוחלט על:
            </p>
            <ul className="list-disc list-inside space-y-1 mr-2 mt-2">
              <li>הפעלת כל סוג של קוד זדוני, וירוסים או רוגלות.</li>
              <li>ביצוע סריקה או קצירה (Scraping) של נתונים מהאתר ללא אישור.</li>
              <li>פגיעה בפעילות התקינה של האתר.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">6. שינויים בתנאי השימוש</h2>
            <p>
              הנהלת האתר שומרת לעצמה את הזכות לעדכן את תנאי השימוש מעת לעת. השינויים ייכנסו לתוקף מיד עם פרסומם באתר.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">7. סמכות שיפוט</h2>
            <p>
              על תנאי שימוש אלו יחולו דיני מדינת ישראל בלבד. סמכות השיפוט הבלעדית בכל עניין הנוגע לשימוש באתר תהיה נתונה לבתי המשפט המוסמכים במחוז תל אביב-יפו.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-wood-brown/30 text-center md:text-right">
            <p className="font-bold text-white">יש לכם שאלות?</p>
            <p>ניתן ליצור קשר דרך עמוד האינסטגרם שלנו או במייל.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
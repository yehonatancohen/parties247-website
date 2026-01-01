import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'הצהרת נגישות | Parties 24/7',
  description: 'הסדרי הנגישות באתר Parties 24/7',
};

export default function AccessibilityPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-jungle-surface/50 border border-wood-brown/30 rounded-2xl p-8 md:p-12 text-right dir-rtl" dir="rtl">
        <h1 className="text-3xl md:text-4xl font-display text-white mb-2">הצהרת נגישות</h1>
        <p className="text-jungle-text/60 mb-8 text-sm">עודכן לאחרונה: ינואר 2026</p>

        <div className="space-y-8 text-jungle-text/90 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">1. כללי</h2>
            <p>
              אנו ב-Parties 24/7 רואים חשיבות עליונה בהנגשת אתר האינטרנט שלנו לאנשים עם מוגבלויות, מתוך אמונה כי לכל אדם מגיעה הזכות לחיות בשוויון, כבוד, נוחות ועצמאות.
              הושקעו משאבים בפיתוח האתר כדי להופכו לזמין, ידידותי ונוח לשימוש עבור כלל האוכלוסייה, בהתאם לתקן הישראלי (ת"י 5568) ברמה AA.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">2. התאמות הנגישות שבוצעו באתר</h2>
            <ul className="list-disc list-inside space-y-2 mr-2">
              <li>
                <strong>ניווט מקלדת:</strong> האתר מותאם לגלישה באמצעות המקלדת בלבד (Tab למעבר, Enter לבחירה), לטובת גולשים המתקשים בשימוש בעכבר.
              </li>
              <li>
                <strong>קורא מסך:</strong> האתר נבנה בקוד סמנטי (Semantic HTML) המותאם לתוכנות הקראת מסך עבור עיוורים וכבדי ראייה.
              </li>
              <li>
                <strong>ניגודיות חזותית:</strong> הקפדנו על צבעים בעלי ניגודיות גבוהה בין הטקסט לרקע כדי להקל על הקריאה.
              </li>
              <li>
                <strong>רספונסיביות:</strong> האתר מותאם לצפייה בכל סוגי המכשירים (מחשב, טאבלט וסלולר) ומאפשר הגדלת טקסט באמצעות הדפדפן ללא פגיעה בעימוד.
              </li>
              <li>
                <strong>טקסט חלופי (Alt Text):</strong> אנו משתדלים לספק תיאור מילולי לתמונות וכפתורים גרפיים.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">3. סייגים לנגישות (תוכן צד שלישי)</h2>
            <p>
              חשוב לציין כי האתר פועל כפלטפורמה המציגה מידע ממקורות חיצוניים. 
              חלק ניכר מהתמונות באתר (פליירים של מסיבות) מסופקות ישירות על ידי המפיקים והמארגנים החיצוניים. 
              לצערנו, לעיתים קרובות פליירים אלו מכילים טקסט גרפי שאינו נגיש לקורא מסך, או שאיכותם אינה בשליטתנו. 
              אנו עושים מאמץ להוסיף את המידע החיוני (שם, תאריך, מיקום) בטקסט חי לצד התמונה, אך ייתכנו מקרים בהם התמונה עצמה לא תהיה נגישה במלואה.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">4. דרכי פנייה לבקשות והצעות שיפור בנושא נגישות</h2>
            <p>
              אנו ממשיכים במאמצים לשפר את נגישות האתר כחלק ממחויבותנו לאפשר לכלל האוכלוסייה, כולל אנשים עם מוגבלויות, לקבל את השירות הנגיש ביותר.
              במידה ונתקלתם בבעיה או בתקלה בנושא הנגישות, נשמח שתעדכנו אותנו ואנו נעשה כל מאמץ למצוא פתרון מתאים ולטפל בתקלה בהקדם.
            </p>
          </section>

          <div className="mt-8 bg-jungle-bg/40 p-6 rounded-xl border border-wood-brown/20">
            <h3 className="font-bold text-white mb-2">פרטי רכז הנגישות באתר:</h3>
            <ul className="space-y-1 text-sm">
              <li><strong>שם:</strong> יהונתן כהן</li>
              <li><strong>דוא"ל:</strong> <a href="mailto:yoncohenyon@gmail.com" className="text-jungle-accent hover:underline">yoncohenyon@gmail.com</a></li>
              <li><strong>טלפון/וואטסאפ:</strong> 0586181898</li>
            </ul>
          </div>

        </div>
      </div>
    </div>
  );
}
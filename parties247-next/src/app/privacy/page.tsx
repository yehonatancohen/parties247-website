import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'מדיניות פרטיות | Parties 24/7',
  description: 'מדיניות הפרטיות והגנת המידע באתר Parties 24/7',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-jungle-surface/50 border border-wood-brown/30 rounded-2xl p-8 md:p-12 text-right dir-rtl" dir="rtl">
        <h1 className="text-3xl md:text-4xl font-display text-white mb-2">מדיניות פרטיות</h1>
        <p className="text-jungle-text/60 mb-8 text-sm">עודכן לאחרונה: ינואר 2026</p>

        <div className="space-y-8 text-jungle-text/90 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">1. מבוא</h2>
            <p>
              אנו ב-Parties 24/7 (להלן: "האתר" או "אנחנו") מכבדים את פרטיות המשתמשים שלנו ומחויבים להגן על המידע האישי שלהם. 
              מדיניות פרטיות זו מתארת את האופן שבו אנו אוספים, משתמשים ושומרים מידע בעת השימוש באתר.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">2. המידע שאנו אוספים</h2>
            <p className="mb-2">בעת השימוש באתר, אנו עשויים לאסוף את סוגי המידע הבאים:</p>
            <ul className="list-disc list-inside space-y-2 mr-2">
              <li>
                <strong>מידע טכני ואנליטי:</strong> כתובת IP, סוג דפדפן, סוג מכשיר, דפים שנצפו באתר, ופעולות שבוצעו (כגון לחיצה על כרטיסי מסיבות). מידע זה נאסף לטובת סטטיסטיקה ושיפור חווית המשתמש.
              </li>
              <li>
                <strong>פניות יזומות:</strong> אם בחרת ליצור איתנו קשר דרך המייל או הרשתות החברתיות, נשמור את פרטי ההתקשרות שמסרת לנו לצורך מענה לפנייתך.
              </li>
            </ul>
            <p className="mt-2 text-sm text-jungle-text/70">
              * איננו אוספים פרטי אשראי או מידע פיננסי. רכישת הכרטיסים מתבצעת כולה באתרים חיצוניים.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">3. עוגיות (Cookies) ומעקב</h2>
            <p>
              האתר משתמש ב"עוגיות" (Cookies) ובטכנולוגיות דומות לצורך תפעולו השוטף, איסוף נתונים סטטיסטיים אודות השימוש באתר, ואימות פרטים.
              <br />
              חלק מהעוגיות באתר עשויות להיות של צדדים שלישיים (כגון Google Analytics או רשתות שותפים) המנטרות את המעבר שלך מהאתר שלנו לאתרי הרכישה לצורך זיהוי העסקה (Affiliate Tracking).
              באפשרותך לשנות את הגדרות הדפדפן שלך ולחסום שימוש בעוגיות, אך הדבר עלול לפגוע בחווית השימוש באתר.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">4. קישורים לאתרים חיצוניים</h2>
            <p>
              האתר מכיל קישורים לאתרים חיצוניים (כגון אתרי מכירת כרטיסים). ברגע שלחצת על קישור ויצאת מהאתר שלנו, מדיניות הפרטיות שלנו אינה חלה עוד. 
              אנו ממליצים לעיין במדיניות הפרטיות של האתר החיצוני (למשל GoOut או Zygo) לפני מסירת פרטים אישיים או ביצוע רכישה.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">5. שיתוף מידע עם צדדים שלישיים</h2>
            <p>
              איננו מוכרים את המידע האישי שלך לצדדים שלישיים. אנו עשויים לשתף מידע אגרגטיבי (כללי ולא מזהה אישית) עם שותפים עסקיים לצורך ניתוח ביצועים.
              כמו כן, ייתכן שנעביר מידע אם נדרש לכך על פי חוק או צו שיפוטי.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">6. אבטחת מידע</h2>
            <p>
              אנו נוקטים באמצעי זהירות מקובלים כדי להגן על המידע באתר. עם זאת, אין אפשרות להבטיח חסינות מוחלטת מפני חדירות למחשבים או חשיפת מידע בלתי חוקית. הגלישה באתר הינה באחריות המשתמש בלבד.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">7. זכויות המשתמש</h2>
            <p>
              על פי חוק הגנת הפרטיות, לכל אדם הזכות לעיין במידע המוחזק עליו במאגר מידע. במידה ומצאת כי המידע עליך אינו נכון או אינו מעודכן, אתה רשאי לפנות אלינו בבקשה לתקנו או למחקו.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-wood-brown/30 text-center md:text-right">
            <p className="font-bold text-white">יצירת קשר</p>
            <p>בכל שאלה בנוגע למדיניות הפרטיות, ניתן לפנות אלינו בדוא"ל או בעמוד יצירת הקשר באתר.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
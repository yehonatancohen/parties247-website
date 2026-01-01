import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'הצהרת מקדמי אירועים | Parties 24/7',
  description: 'גילוי נאות ושקיפות לגבי אופן פעילות האתר כמקדמי אירועים (Promoters).',
};

export default function PromoterDisclaimerPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="bg-jungle-surface/50 border border-wood-brown/30 rounded-2xl p-8 md:p-12 text-right dir-rtl" dir="rtl">
        <h1 className="text-3xl md:text-4xl font-display text-white mb-2">הצהרת מקדמי אירועים (Promoters)</h1>
        <p className="text-jungle-text/60 mb-8 text-sm">שקיפות היא שם המשחק אצלנו.</p>

        <div className="space-y-8 text-jungle-text/90 leading-relaxed">
          
          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">1. אנחנו המתווכים, לא המפיקים</h2>
            <p>
              אתר Parties 24/7 משמש כפלטפורמה לגילוי, ריכוז והמלצה על מסיבות וחיי לילה. 
              חשוב לנו להבהיר: <strong>אנחנו לא מפיקים את האירועים בעצמנו</strong>. 
              אנחנו פועלים כ"יחצ"נים דיגיטליים" (Promoters) המקשרים ביניכם לבין חברות ההפקה והכרטיסים הרשמיות.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">2. מודל עסקי וגילוי נאות (Affiliate)</h2>
            <p>
              כחלק מהשקיפות שלנו מול הקהילה, אנו מבקשים ליידע כי חלק מהקישורים באתר הינם קישורי שותפים (Affiliate Links). 
              משמעות הדבר היא שכאשר אתם רוכשים כרטיס דרך קישור שלנו, אנו עשויים לקבל עמלה קטנה מאתר הכרטיסים או מהמפיק, ללא כל עלות נוספת מצדכם.
              מודל זה מאפשר לנו לתחזק את האתר, לעדכן את התוכן יומיום ולהמשיך לספק לכם ערך בחינם.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">3. אישורי כניסה וסלקציה – לא בידיים שלנו</h2>
            <p>
              אחת השאלות הנפוצות ביותר היא לגבי אישורי כניסה. חשוב לדעת:
            </p>
            <ul className="list-disc list-inside space-y-2 mr-2 mt-2 bg-jungle-bg/30 p-4 rounded-lg border border-wood-brown/10">
              <li><strong>ההחלטה הבלעדית היא של המפיק:</strong> לנו כאתר אין גישה למערכת אישורי הכרטיסים ואין לנו יכולת לאשר או לדחות כניסה של בליינים.</li>
              <li><strong>מדיניות הכניסה:</strong> הגילאים, קוד הלבוש והאיזון המגדרי נקבעים על ידי המועדון או המפיק בלבד.</li>
              <li><strong>סירוב כניסה:</strong> במידה ורכשתם כרטיס ולא קיבלתם אישור, או שלא הוכנסתם בכניסה למועדון, הכתובת לבירור היא מול שירות הלקוחות של אתר הכרטיסים (כגון GoOut/Zygo) או הפקת האירוע.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">4. שינויים וביטולים</h2>
            <p>
              עולם הלילה הוא דינמי. לעיתים מסיבות מתבטלות, מיקומים משתנים או ליינאפ (DJ) מתחלף ברגע האחרון.
              אנו עושים את מירב המאמצים לעדכן את המידע באתר בזמן אמת, אך <strong>המידע הקובע והסופי הוא זה שמופיע באתר רכישת הכרטיסים הרשמי</strong> אליו תועברו לפני התשלום.
              אנו ממליצים תמיד לבדוק את הפרטים הסופיים בעמוד הרכישה.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-jungle-accent mb-3">5. אחריות על הכרטיסים</h2>
            <p>
              כל עסקת רכישה, ביטול עסקה, בקשה להחזר כספי או בעיה טכנית עם הכרטיס (ברקוד שלא נסרק וכו') נמצאת באחריותה המלאה של פלטפורמת הכרטיסים ממנה רכשתם. 
              ל-Parties 24/7 אין גישה לפרטי האשראי שלכם או להיסטוריית ההזמנות שלכם.
            </p>
          </section>

          <div className="mt-12 pt-8 border-t border-wood-brown/30 text-center md:text-right">
            <p className="font-bold text-white">תודה שאתם בוחרים לחגוג דרכנו!</p>
            <p className="text-sm mt-1">אנחנו כאן כדי לעזור לכם למצוא את המסיבה הבאה, ונמשיך לעבוד קשה כדי להביא לכם את האירועים הכי טובים.</p>
          </div>

        </div>
      </div>
    </div>
  );
}
import React from 'react';
import SeoManager from '../components/SeoManager';

const AboutPage: React.FC = () => {
  return (
    <>
      <SeoManager
        title="אודות - Parties 24/7"
        description="הסיפור של Parties 24/7 - איך הפכנו למקור מספר אחת לחיי הלילה בישראל."
        canonicalPath="/about"
        ogType="profile"
      />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-jungle-text/90">
          <h1 className="text-5xl font-display text-center mb-8 text-white">הסיפור שלנו</h1>
          
          <div className="space-y-6 bg-jungle-surface p-8 rounded-lg border border-wood-brown/50">
            <p className="text-lg">
              Parties 24/7 נולד מתוך תשוקה אמיתית למוזיקה, ריקודים וחיבור בין אנשים. ראינו את סצנת חיי הלילה בישראל, תוססת ומלאת אנרגיה, אבל גם מפוזרת וקשה לניווט. החלום שלנו היה ליצור מקום אחד, פלטפורמה מרכזית שתאחד את כל המסיבות, הרייבים והפסטיבלים הכי שווים, ותנגיש אותם לקהל הרחב בצורה פשוטה, נוחה ומהנה.
            </p>
            <p>
              התחלנו כפרויקט צד קטן, צוות של חובבי מסיבות שבילו לילות באיסוף מידע על אירועים מכל קצוות הארץ. מהר מאוד, הבנו שיש צורך אמיתי במה שאנחנו עושים. הקהילה שלנו גדלה, והפכנו למקור המידע המהימן והעדכני ביותר עבור אלפי בליינים בכל שבוע.
            </p>
             <h2 className="text-3xl font-display text-jungle-accent pt-4">המשימה שלנו</h2>
            <p>
              המשימה שלנו היא פשוטה: לחבר אתכם לחוויה הבאה שלכם. אנחנו מאמינים שלכל אחד מגיע לחוות את הקסם של רחבת הריקודים, לגלות אמנים חדשים, לפגוש אנשים מדהימים וליצור זיכרונות בלתי נשכחים. אנחנו עובדים מסביב לשעון כדי להבטיח שתמיד תהיו מעודכנים, שתקבלו את הדילים הטובים ביותר, ושתהליך מציאת המסיבה ורכישת הכרטיסים יהיה קל ומהיר יותר מאי פעם.
            </p>
            <p>
              תודה שאתם חלק מהמסע שלנו. נתראה על הרחבה!
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
import React from 'react';
import SeoManager from '../../components/SeoManager';

const faqItems = [
  {
    q: 'מה זה Parties247?',
    a: 'Parties247 (Parties 24/7) היא פלטפורמת האירועים וחיי הלילה המרכזית של ישראל. האתר מרכז מסיבות, רייבים, מועדוני לילה ואירועי מוזיקה מכל הארץ – תל אביב, חיפה, ירושלים, באר שבע, אילת ועוד.',
  },
  {
    q: 'אילו סוגי מסיבות תמצאו באתר?',
    a: 'טכנו, האוס, טראנס, היפ-הופ, מיינסטרים, רייבים פתוחים, מסיבות חוף, מסיבות נוער, מסיבות סטודנטים, מסיבות 18+ ועוד. האתר כולל גם סינון לפי עיר, יום בשבוע וז\'אנר.',
  },
  {
    q: 'איך רוכשים כרטיסים?',
    a: 'כרטיסים נרכשים דרך Go-Out – פלטפורמת מכירת הכרטיסים הרשמית. לחצו על כפתור "לרכישת כרטיסים" בעמוד האירוע ותועברו ישירות לעמוד הרכישה.',
  },
  {
    q: 'האם המידע באתר מתעדכן?',
    a: 'כן. לוח האירועים מתעדכן מדי יום. האתר מציג רק מסיבות עתידיות עם כרטיסים זמינים, ומסיר אוטומטית אירועים שחלפו.',
  },
  {
    q: 'באילו ערים יש כיסוי?',
    a: 'תל אביב, חיפה, ירושלים, באר שבע, אילת ואזורים נוספים ברחבי ישראל.',
  },
];

const AboutPage: React.FC = () => {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.a,
      },
    })),
  };

  return (
    <>
      <SeoManager
        title="אודות Parties247 | מסיבות וחיי לילה בישראל"
        description="Parties247 היא פלטפורמת המסיבות המרכזית של ישראל – מסיבות, רייבים ומועדוני לילה בתל אביב, חיפה, ירושלים וכל הארץ. כרטיסים, ליינאפים ועדכונים בזמן אמת."
        canonicalPath="/about"
        ogType="profile"
        jsonLd={faqJsonLd}
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

          {/* FAQ section — also powers FAQ schema for Google & AI assistants */}
          <div className="mt-12">
            <h2 className="text-3xl font-display text-white mb-6">שאלות נפוצות</h2>
            <div className="space-y-4">
              {faqItems.map((item) => (
                <div key={item.q} className="bg-jungle-surface rounded-lg border border-wood-brown/30 p-6">
                  <h3 className="text-lg font-bold text-jungle-accent mb-2">{item.q}</h3>
                  <p className="text-jungle-text/85 leading-relaxed">{item.a}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AboutPage;
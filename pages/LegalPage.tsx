import React from 'react';
import SeoManager from '../components/SeoManager';

interface LegalPageProps {
  pageType: 'terms' | 'privacy' | 'accessibility';
}

const legalContent = {
  terms: {
    title: 'תנאי שימוש',
    description: 'תנאי השימוש של אתר Parties 24/7.',
    content: (
      <>
        <p>ברוכים הבאים ל-Parties 24/7. השימוש באתר ובשירותיו כפוף לתנאים המפורטים להלן. אנא קראו אותם בעיון.</p>
        <h2 className="text-xl font-bold text-jungle-accent mt-4 mb-2">1. כללי</h2>
        <p>האתר מספק מידע על אירועים ומסיבות ומאפשר קישור לרכישת כרטיסים דרך צדדים שלישיים. איננו אחראים על תוכן האירועים, מכירת הכרטיסים או כל היבט אחר הקשור לאירוע עצמו.</p>
        <h2 className="text-xl font-bold text-jungle-accent mt-4 mb-2">2. קניין רוחני</h2>
        <p>כל התכנים באתר, לרבות טקסט, תמונות ועיצוב, הינם רכושו של Parties 24/7 ואין לעשות בהם שימוש ללא אישור מפורש בכתב.</p>
      </>
    )
  },
  privacy: {
    title: 'מדיניות פרטיות',
    description: 'מדיניות הפרטיות של אתר Parties 24/7.',
    content: (
      <>
        <p>אנו מכבדים את פרטיות המשתמשים שלנו. מסמך זה מפרט את המידע שאנו אוספים וכיצד אנו משתמשים בו.</p>
        <h2 className="text-xl font-bold text-jungle-accent mt-4 mb-2">1. איסוף מידע</h2>
        <p>אנו עשויים לאסוף מידע לא אישי על השימוש באתר, כגון דפים שנצפו ופעולות שבוצעו, באמצעות עוגיות (cookies) וכלים אנליטיים, במטרה לשפר את חווית המשתמש.</p>
        <h2 className="text-xl font-bold text-jungle-accent mt-4 mb-2">2. שימוש במידע</h2>
        <p>המידע שנאסף משמש אותנו לניתוח סטטיסטי, שיפור השירות והתאמה אישית של התוכן. איננו חולקים מידע אישי עם צדדים שלישיים.</p>
      </>
    )
  },
  accessibility: {
    title: 'הצהרת נגישות',
    description: 'הצהרת הנגישות של אתר Parties 24/7.',
    content: (
      <>
        <p>אנו ב-Parties 24/7 רואים חשיבות עליונה בהנגשת האתר שלנו לאנשים עם מוגבלויות, על מנת לאפשר לכלל האוכלוסייה לגלוש בנוחות ובקלות.</p>
        <h2 className="text-xl font-bold text-jungle-accent mt-4 mb-2">1. רמת הנגישות</h2>
        <p>האתר שואף לעמוד בדרישות תקנות שוויון זכויות לאנשים עם מוגבלות (התאמות נגישות לשירות), התשע"ג 2013, ברמה AA.</p>
        <h2 className="text-xl font-bold text-jungle-accent mt-4 mb-2">2. יצירת קשר</h2>
        <p>אם נתקלתם בבעיית נגישות כלשהי, נשמח אם תפנו אלינו ונעשה כל שביכולתנו לתקן את הבעיה בהקדם.</p>
      </>
    )
  }
};

const LegalPage: React.FC<LegalPageProps> = ({ pageType }) => {
  const { title, description, content } = legalContent[pageType];

  return (
    <>
      <SeoManager title={`${title} - Parties 24/7`} description={description} />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-jungle-text/90">
          <h1 className="text-5xl font-display text-center mb-8 text-white">{title}</h1>
          <div className="space-y-4 bg-jungle-surface p-8 rounded-lg border border-wood-brown/50">
            {content}
          </div>
        </div>
      </div>
    </>
  );
};

export default LegalPage;
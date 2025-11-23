import React from 'react';
import SeoManager from '../components/SeoManager';

const PromoterDisclaimerPage: React.FC = () => {
  return (
    <>
      <SeoManager
        title="הבהרה משפטית - Parties 24/7"
        description="אנו פועלים כמקדמי אירועים בלבד ואיננו אחראים על קיום, איכות או בטיחות המסיבות המופיעות באתר."
        canonicalPath="/promoter-disclaimer"
        ogType="article"
      />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-jungle-text/90">
          <h1 className="text-5xl font-display text-center mb-8 text-white">הבהרה משפטית</h1>
          <div className="space-y-4 bg-jungle-surface p-8 rounded-lg border border-wood-brown/50 leading-relaxed">
            <p>
              האתר Parties 24/7 משמש כפלטפורמת קידום ושיווק לאירועים ומסיבות. אנו מפרסמים מידע המסופק על ידי מארגנים
              חיצוניים ואיננו משמשים כמפיקים או כמארגנים של האירועים עצמם.
            </p>
            <ul className="list-disc pr-5 space-y-2">
              <li>איננו אחראים על קיום האירועים, תכנים, שירותים, בטיחות, או שינויי זמנים ומיקומים.</li>
              <li>רכישת כרטיסים, אישורי כניסה והתנהלות מול מארגנים נעשית ישירות מול אותם צדדים שלישיים ועל אחריות המשתמש בלבד.</li>
              <li>כל מידע, תמונות, מחירים וקופונים עשויים להשתנות ללא התראה ואינם מהווים מצג מחייב מצד Parties 24/7.</li>
            </ul>
            <p>
              המשתמשים נדרשים לוודא ישירות מול המארגנים את פרטי האירוע, תנאי ההשתתפות והבטיחות. שימוש באתר מהווה ויתור על כל
              טענה או דרישה כלפי Parties 24/7 בכל הנוגע לאירועים המפורסמים בו.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default PromoterDisclaimerPage;

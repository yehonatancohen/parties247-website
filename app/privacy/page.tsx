export const dynamic = 'force-static';

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl space-y-4">
      <h1 className="text-4xl font-display text-white text-center mb-4">מדיניות פרטיות</h1>
      <div className="space-y-3 text-jungle-text/85 bg-jungle-surface/80 border border-wood-brown/50 p-6 rounded-xl">
        <p>אנו אוספים נתוני שימוש בסיסיים כדי לשפר את חוויית המשתמש ואת איכות האירועים המוצגים.</p>
        <p>נתוני רגישים לא נשמרים בשרתים שלנו והפניות לרכישת כרטיסים נעשות באתרי צד שלישי מאובטחים.</p>
        <p>ניתן לפנות אלינו בכל עת להסרה או עדכון של מידע אישי.</p>
      </div>
    </div>
  );
}

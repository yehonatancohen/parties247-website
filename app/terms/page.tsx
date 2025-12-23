export const dynamic = 'force-static';

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl space-y-4">
      <h1 className="text-4xl font-display text-white text-center mb-4">תנאי שימוש</h1>
      <div className="space-y-3 text-jungle-text/85 bg-jungle-surface/80 border border-wood-brown/50 p-6 rounded-xl">
        <p>ברוכים הבאים ל-Parties 24/7. השימוש באתר מהווה הסכמה לתנאים אלו.</p>
        <p>אנו מספקים מידע על אירועים ומפנים לרכישת כרטיסים באתרים חיצוניים. האחריות על רכישה ושירות היא של המארגנים.</p>
        <p>אנו מעדכנים את התכנים מעת לעת באמצעות ISR אך איננו מתחייבים לשלמות או זמינות תמידית.</p>
      </div>
    </div>
  );
}

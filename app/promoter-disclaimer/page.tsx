export const dynamic = 'force-static';

export default function PromoterDisclaimerPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl space-y-4">
      <h1 className="text-4xl font-display text-white text-center mb-4">הצהרת משווקים</h1>
      <div className="space-y-3 text-jungle-text/85 bg-jungle-surface/80 border border-wood-brown/50 p-6 rounded-xl">
        <p>חלק מהקישורים באתר עשויים לכלול קודי הפניה לשותפים. אנו בוחרים רק הפקות אמינות ומוסיפים קוד כזה כדי לממן את פעילות האתר.</p>
        <p>אין בקוד ההפניה כדי לשנות את מחיר הכרטיס עבורכם. במידת הצורך נעדכן שקיפות מלאה לגבי שיתופי פעולה מסחריים.</p>
      </div>
    </div>
  );
}

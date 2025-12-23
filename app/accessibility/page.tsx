export const dynamic = 'force-static';

export default function AccessibilityPage() {
  return (
    <div className="container mx-auto px-4 max-w-4xl space-y-4">
      <h1 className="text-4xl font-display text-white text-center mb-4">הצהרת נגישות</h1>
      <div className="space-y-3 text-jungle-text/85 bg-jungle-surface/80 border border-wood-brown/50 p-6 rounded-xl">
        <p>אנו פועלים להנגשת האתר לכלל המשתמשים, כולל התאמה לקוראי מסך, ניגודיות וצמצום תנועות.</p>
        <p>בעיות נגישות ניתן לדווח במייל: hello@parties247.co.il ונטפל בהקדם.</p>
      </div>
    </div>
  );
}

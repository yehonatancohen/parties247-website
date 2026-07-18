import React from 'react';

const TESTIMONIALS = [
  { quote: '"מצאתי את כל הליינים של סופ״ש במקום אחד. פשוט אש."', author: 'רוני מ., תל אביב' },
  { quote: '"הזמנתי כרטיסים תוך דקה, בלי כאב ראש."', author: 'דנה ל., חיפה' },
  { quote: '"מצאתי אירוע שלא הכרתי והפך לערב הכי טוב שלי."', author: 'עומר ק., ירושלים' },
];

const TrustBand: React.FC = () => {
  return (
    <div className="container mx-auto px-4 mt-4">
      <section className="bg-gradient-to-l from-jungle-accent/10 to-amber-400/5 border border-jungle-accent/20 rounded-3xl p-8 md:p-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="text-center md:text-right">
          <h2 className="font-display text-2xl md:text-3xl text-white">מעל 50,000 חוגגים כבר איתנו</h2>
        </div>
        <div className="grid sm:grid-cols-3 gap-4 w-full md:w-auto">
          {TESTIMONIALS.map((t) => (
            <div key={t.author} className="bg-jungle-deep/50 border border-white/10 rounded-2xl p-4 max-w-xs">
              <div className="text-amber-300 text-sm">★★★★★</div>
              <p className="text-jungle-text/90 text-sm leading-relaxed mt-1.5">{t.quote}</p>
              <p className="text-jungle-accent/80 text-xs font-semibold mt-2">{t.author}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TrustBand;

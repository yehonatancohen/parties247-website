import React from 'react';
import { Link } from 'react-router-dom';
import SeoManager from '../components/SeoManager';

const discoverySections = [
  {
    title: 'מסיבות לפי ערים',
    description: 'גלו אילו מסיבות מחכות לכם בתל אביב, ירושלים, חיפה, אילת ועוד. כל עיר עם הליינים הקבועים וההפקות המיוחדות שלה.',
    to: '/ערים',
    cta: 'מסיבות בכל הארץ',
  },
  {
    title: 'מסיבות לפי סגנון מוזיקלי',
    description: 'טכנו, האוס, היפ-הופ או טראנס? כנסו לכל ז׳אנר כדי למצוא את האירועים שמתאימים לטעם שלכם.',
    to: '/זאנרים',
    cta: 'בחרו סאונד שמדליק אתכם',
  },
  {
    title: 'מסיבות לפי קהל יעד',
    description: 'נוער, סטודנטים, קהילה גאה או 21+ – בחרו את הקהל שלכם וקבלו המלצות ממוקדות.',
    to: '/קהל',
    cta: 'מצאו את החבר׳ה שלכם',
  },
  {
    title: 'מסיבות לפי זמן',
    description: 'מסיבות שקורות היום, בסופ״ש הקרוב או בחגים. תכננו את היציאה המושלמת לפי התאריך שנוח לכם.',
    to: '/מתי',
    cta: 'תכננו לפי לוח הזמנים',
  },
];

const quickLinks = [
  {
    label: 'מסיבות חמישי הקרוב',
    description: 'המסיבות הכי טריות ליום חמישי הקרוב',
    to: '/thursday-parties',
  },
  {
    label: 'מסיבות שישי הקרוב',
    description: 'קפצו ישר למסיבות של שישי הקרוב',
    to: '/friday-parties',
  },
];

const PartyDiscoveryPage: React.FC = () => {
  return (
    <>
      <SeoManager
        title="חיפוש מסיבות בישראל | Parties 24/7"
        description="בחרו איך אתם רוצים למצוא את המסיבה הבאה שלכם – לפי עיר, ז׳אנר, קהל או תאריך – וקבלו קישורים מהירים למסיבות חמישי ושישי הקרובים."
        canonicalPath="/party-discovery"
      />
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-display text-white mb-4">איך תרצו לבחור את המסיבה הבאה?</h1>
          <p className="text-lg text-jungle-text/80">
            ריכזנו את כל הדרכים למצוא מסיבות חמות בישראל בעמוד אחד נוח. התחילו עם קישורי הבזק לסופ״ש הקרוב או צללו לעמודי העומק שלנו.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {quickLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group relative overflow-hidden rounded-2xl border border-wood-brown/50 bg-gradient-to-r from-jungle-accent/20 to-jungle-lime/20 p-6 text-right transition-transform hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-jungle-accent/90">קיצור דרך</span>
                <h2 className="text-2xl font-display text-white group-hover:text-jungle-accent transition-colors">{item.label}</h2>
                <p className="text-jungle-text/80">{item.description}</p>
                <span className="mt-2 inline-flex items-center justify-end gap-2 text-sm text-jungle-accent">
                  גלו את הרשימה העדכנית ביותר
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="space-y-8">
          {discoverySections.map((section) => (
            <Link
              key={section.to}
              to={section.to}
              className="block rounded-2xl border border-wood-brown/50 bg-jungle-surface/80 p-6 text-right transition-transform hover:-translate-y-1 hover:border-jungle-accent/60 hover:shadow-2xl"
            >
              <div className="flex flex-col gap-3">
                <h3 className="text-2xl font-display text-white">{section.title}</h3>
                <p className="text-jungle-text/80 leading-relaxed">{section.description}</p>
                <span className="text-sm font-semibold text-jungle-accent/90">{section.cta}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </>
  );
};

export default PartyDiscoveryPage;

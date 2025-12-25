import React from 'react';
import { Link } from 'react-router-dom';
import SeoManager from '../parties247-next/components/SeoManager';
import { useParties } from '../parties247-next/hooks/useParties';
import { createCarouselSlug } from '../parties247-next/lib/carousels';

const quickLinks = [
  {
    label: 'כל המסיבות הקרובות',
    description: 'רשימה מתעדכנת עם אפשרות חיפוש מתקדם',
    to: '/all-parties',
  },
  {
    label: 'מסיבות חמישי',
    description: 'קפיצה מהירה ללילה הפותח את הסופ״ש',
    to: '/thursday-parties',
  },
  {
    label: 'מסיבות שישי',
    description: 'רחבות הסופ״ש הכי מבוקשות',
    to: '/friday-parties',
  },
  {
    label: 'מסיבות סוף השבוע',
    description: 'כל האירועים של שישי ושבת במקום אחד',
    to: '/weekend-parties',
  },
];

const audienceLinks = [
  { title: 'מסיבות נוער', to: '/teen-parties', blurb: 'אירועים מפוקחים עם פירוט אבטחה וגיל כניסה.' },
  { title: 'מסיבות סטודנטים', to: '/student-parties', blurb: 'ליינים אקדמיים, הנחות ושאטלים מקמפוסים.' },
  { title: 'מסיבות חיילים', to: '/soldier-parties', blurb: 'הטבות חיילים, שעות מאוחרות ושמירת ציוד.' },
  { title: 'מסיבות 25+', to: '/25plus-parties', blurb: 'וייב בוגר, שירות מוקפד וקוקטיילים איכותיים.' },
];

const cityLinks = [
  { title: 'מסיבות תל אביב', to: '/tel-aviv-parties', blurb: 'טכנו בדרום, גגות במרכז והכל בעדכון יומיומי.' },
  { title: 'מסיבות חיפה', to: '/haifa-parties', blurb: 'חוף, כרמל ושוק תלפיות – כל הוייבים בדף אחד.' },
];

const styleLinks = [
  { title: 'טכנו', to: '/techno-parties', blurb: 'רייבי מחסן, חופים ומועדוני ענק.' },
  { title: 'האוס וגרוב', to: '/house-parties', blurb: 'גגות שקיעה, ברים אינטימיים וסאונד נעים.' },
  { title: 'מיינסטרים ופופ', to: '/mainstream-parties', blurb: 'להיטים, רגאטון וקריוקי עד הבוקר.' },
];

const clubLinks = [
  { title: 'ECHO Club', to: '/echo-club', blurb: 'רחבה דרומית עם טכנו, האוס והופעות לייב.' },
  { title: 'Jimmy Who', to: '/jimmy-who-club', blurb: 'בר-מועדון תל אביבי עם להיטים ורחבה שמחה.' },
];

const helperLinks = [
  { title: 'בלוג וטיפים', to: '/כתבות', blurb: 'מדריכים, ראיונות ותחקירי ליינים.' },
  { title: 'הצהרת מקדמי אירועים', to: '/promoter-disclaimer', blurb: 'שקיפות מלאה מול מפיקים ושותפים.' },
];

const PartyDiscoveryPage: React.FC = () => {
  const { carousels } = useParties();

  const carouselLinks = React.useMemo(
    () =>
      [...carousels]
        .sort((a, b) => a.order - b.order)
        .map((carousel) => ({
          title: carousel.title,
          to: `/carousels/${createCarouselSlug(carousel.title)}`,
        })),
    [carousels]
  );

  return (
    <>
      <SeoManager
        title="חיפוש מסיבות בישראל | Parties 24/7"
        description="חפשו מסיבות לפי קהל יעד, עיר, סגנון מוזיקלי או מועדון ספציפי. עמוד הניווט המהיר שלנו מציג קישורים פנימיים מסודרים לכל העמודים החמים והמתעדכנים בזמן אמת."
        canonicalPath="/party-discovery"
      />
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto text-center mb-12 space-y-4">
          <p className="text-sm uppercase tracking-wide text-jungle-accent/80">ניווט ממוקד</p>
          <h1 className="text-4xl md:text-5xl font-display text-white">איך תרצו לבחור את המסיבה הבאה?</h1>
          <p className="text-lg text-jungle-text/80 leading-relaxed">
            ריכזנו את כל הדרכים לגלות מסיבות בעמוד אחד ברור: קהל יעד, ערים, סגנונות ומועדונים ספציפיים. השתמשו בתפריט הקפיצה כדי להגיע מיד לחלק הרלוונטי, או התחילו עם קיצורי הדרך לסוף השבוע הקרוב.
          </p>
          <div className="flex flex-wrap justify-center gap-3 text-sm text-jungle-accent">
            <a href="#audiences" className="hover:text-white">קהל יעד</a>
            <span className="text-jungle-text/40">•</span>
            <a href="#cities" className="hover:text-white">ערים</a>
            <span className="text-jungle-text/40">•</span>
            <a href="#styles" className="hover:text-white">סגנונות</a>
            <span className="text-jungle-text/40">•</span>
            <a href="#clubs" className="hover:text-white">מועדונים</a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-12">
          {quickLinks.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              className="group rounded-2xl border border-wood-brown/50 bg-gradient-to-br from-jungle-surface/90 to-jungle-bg/80 p-5 text-right hover:border-jungle-accent/70 hover:-translate-y-1 transition"
            >
              <span className="text-sm font-semibold text-jungle-accent/80">קיצור דרך</span>
              <h2 className="text-2xl font-display text-white group-hover:text-jungle-accent transition-colors">{item.label}</h2>
              <p className="text-jungle-text/75 text-sm leading-relaxed">{item.description}</p>
              <span className="inline-flex items-center gap-2 text-xs text-jungle-accent mt-3">פתחו את הרשימה <span aria-hidden="true">&rarr;</span></span>
            </Link>
          ))}
        </div>

        <section id="audiences" className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-display text-white">לפי קהל יעד</h2>
            </div>
            <Link to="/קהל" className="text-jungle-accent hover:text-white text-sm">ראו את כל קהלי היעד</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {audienceLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-2xl border border-wood-brown/40 bg-jungle-surface/80 p-5 hover:border-jungle-accent/60 transition"
              >
                <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
                <p className="text-jungle-text/75 leading-relaxed">{item.blurb}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="cities" className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-display text-white">לפי עיר</h2>
            </div>
            <Link to="/ערים" className="text-jungle-accent hover:text-white text-sm">כל הערים</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {cityLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-2xl border border-wood-brown/40 bg-jungle-surface/80 p-5 hover:border-jungle-accent/60 transition"
              >
                <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
                <p className="text-jungle-text/75 leading-relaxed">{item.blurb}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="styles" className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-display text-white">לפי סגנון</h2>
            </div>
            <Link to="/זאנרים" className="text-jungle-accent hover:text-white text-sm">כל הסגנונות</Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {styleLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-2xl border border-wood-brown/40 bg-jungle-surface/80 p-5 hover:border-jungle-accent/60 transition"
              >
                <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
                <p className="text-jungle-text/75 leading-relaxed">{item.blurb}</p>
              </Link>
            ))}
          </div>
        </section>

        <section id="clubs" className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-3xl font-display text-white">מועדונים</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {clubLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-2xl border border-wood-brown/40 bg-jungle-surface/80 p-5 hover:border-jungle-accent/60 transition"
              >
                <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
                <p className="text-jungle-text/75 leading-relaxed">{item.blurb}</p>
              </Link>
            ))}
          </div>
        </section>

        {carouselLinks.length > 0 && (
          <section id="carousels" className="mb-12">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-3xl font-display text-white">קרוסלות נבחרות</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {carouselLinks.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className="rounded-2xl border border-wood-brown/40 bg-jungle-surface/80 p-5 hover:border-jungle-accent/60 transition"
                >
                  <h3 className="text-2xl font-display text-white mb-2">{item.title}</h3>
                  <p className="text-jungle-text/75 leading-relaxed">כל הליינים החמים בקרוסלה אחת.</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-16">
          <h2 className="text-2xl font-display text-white mb-3">עוד משאבים</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {helperLinks.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="rounded-2xl border border-wood-brown/40 bg-jungle-surface/80 p-5 hover:border-jungle-accent/60 transition"
              >
                <h3 className="text-xl font-display text-white">{item.title}</h3>
                <p className="text-jungle-text/75 leading-relaxed">{item.blurb}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </>
  );
};

export default PartyDiscoveryPage;

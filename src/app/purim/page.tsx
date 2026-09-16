import React from 'react';
import { Metadata } from 'next';
import HolidayPage from '@/components/HolidayPage';
import * as api from '@/services/api';
import { BASE_URL } from '@/data/constants';
import { HOLIDAYS, getHolidayWindow, filterPartiesInHolidayWindow } from '@/lib/holidays';

export const revalidate = 60;

const DEF = HOLIDAYS.purim;

const FAQS = [
  {
    question: 'מתי מסיבות פורים?',
    answer: 'החגיגות מתחילות כבר בשבוע שלפני פורים (מסיבות תחפושות, אדלויאדה) ונמשכות עד שושן פורים. פורים עצמו הוא היום הכי עמוס במסיבות ונשפי תחפושות.',
  },
  {
    question: 'איפה עורכים מסיבות פורים?',
    answer: 'בעיקר בתל אביב והמרכז, לצד פסטיבלים ורייבים בצפון ובדרום. מועדונים, גגות ומרחבים פתוחים הופכים לנשפי תחפושות ענקיים לאורך כל השבוע.',
  },
  {
    question: 'צריך תחפושת כדי להיכנס?',
    answer: 'תלוי באירוע — ברוב המסיבות תחפושת היא בונוס ולא חובה, אבל בנשפי תחפושות ייעודיים היא חלק מהחוויה. פרטי הדרס-קוד מופיעים בדף כל אירוע.',
  },
  {
    question: 'כמה עולים כרטיסים למסיבות פורים?',
    answer: 'המחירים משתנים לפי אירוע והשלב במכירה. מחיר הכרטיס העדכני מוצג בכל דף אירוע, ובדרך כלל משתלם יותר לקנות מוקדם לפני שהמחיר עולה.',
  },
];

async function getData() {
  try {
    const allParties = await api.getParties();
    return filterPartiesInHolidayWindow(allParties, DEF);
  } catch (error) {
    console.error('Failed to fetch Purim data:', error);
    // Rethrow: during ISR regeneration an error keeps the last good page cached
    // instead of replacing it with an empty one (build time is handled in api.ts).
    throw error;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { year } = getHolidayWindow(DEF);
  return {
    title: `מסיבות פורים ${year} | לוח המסיבות והפסטיבלים המלא - Parties24/7`,
    description: `כל מסיבות פורים ${year} במקום אחד! רשימת המסיבות, נשפי התחפושות והפסטיבלים הכי חמים של פורים בתל אביב ובכל הארץ. כרטיסים, הנחות ועדכונים.`,
    keywords: ['מסיבות פורים', `פורים ${year}`, 'מסיבות פורים תל אביב', 'פסטיבלים פורים', 'כרטיסים למסיבות פורים'],
    alternates: { canonical: '/purim' },
    openGraph: {
      title: `מסיבות פורים ${year} | האירועים הכי חמים בישראל`,
      description: `מחפשים לאן לצאת בפורים? כל המסיבות, הפסטיבלים ונשפי התחפושות של פורים ${year} מחכים לכם כאן. כנסו עכשיו!`,
      url: `${BASE_URL}/purim`,
      images: [{ url: `${BASE_URL}/purim-hero.png`, width: 1200, height: 630, alt: `מסיבות פורים ${year}` }],
    },
  };
}

export default async function PurimPage() {
  const window = getHolidayWindow(DEF);
  const parties = await getData();

  return (
    <HolidayPage
      def={DEF}
      window={window}
      parties={parties}
      heroImage="/purim-hero.png"
      heroTitle={`מסיבות פורים ${window.year}`}
      heroSubtitle={
        <>
          המדריך המלא למסיבות, הנשפים והפסטיבלים הכי שווים של החג.
          <br />
          <span className="font-semibold text-ink">כי בפורים הזה לא נשארים בבית!</span>
        </>
      }
      introHeading="חוגגים את פורים עם Parties24/7"
      introParagraphs={[
        'חג פורים הוא ללא ספק החג הכי שמח, צבעוני ומרים בלוח השנה הישראלי. זה הזמן שבו כולם שמים מסכות, שוכחים מהשגרה ויוצאים לחגוג עד אור הבוקר בפסטיבלים ענקיים, מסיבות טבע סוחפות ומסיבות טכנו אורבניות שהעיר מציעה.',
        <React.Fragment key="p2">
          ב-Parties24/7 ריכזנו עבורכם את כל <strong>מסיבות פורים {window.year}</strong> השוות ביותר במקום אחד. המערכת שלנו מתעדכנת בזמן אמת עם האירועים החמים ביותר בתל אביב, חיפה, והדרום. בין אם אתם מחפשים נשף תחפושות יוקרתי, רייב המוני תחת כיפת השמיים או מסיבת מחתרת אינטימית - כאן תמצאו את הבילוי המושלם לחג.
        </React.Fragment>,
        <span key="p3" className="font-semibold text-ink">
          טיפ מאיתנו: הכרטיסים למסיבות פורים נחטפים במהירות שיא. אל תחכו לרגע האחרון – שריינו מקום עוד היום!
        </span>,
      ]}
      faqs={FAQS}
    />
  );
}

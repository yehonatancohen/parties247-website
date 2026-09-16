import React from 'react';
import { Metadata } from 'next';
import HolidayPage from '@/components/HolidayPage';
import * as api from '@/services/api';
import { BASE_URL } from '@/data/constants';
import { HOLIDAYS, getHolidayWindow, filterPartiesInHolidayWindow } from '@/lib/holidays';

export const revalidate = 60;

const DEF = HOLIDAYS['yom-haatzmaut'];

const FAQS = [
  {
    question: 'מתי מסיבות יום העצמאות?',
    answer: 'יום העצמאות חל מיד לאחר יום הזיכרון, וחגיגות הרחוב והמסיבות מתחילות כבר בערב יום העצמאות (יציאת יום הזיכרון) ונמשכות עד הלילה שלמחרת.',
  },
  {
    question: 'האם יש מסיבות ביום הזיכרון עצמו?',
    answer: 'לא — יום הזיכרון הוא יום אבל ואין בו בילויים או מסיבות. החגיגות מתחילות רק עם צאת יום הזיכרון וכניסת יום העצמאות בערב.',
  },
  {
    question: 'איפה עורכים מסיבות יום העצמאות?',
    answer: 'ברחבי הארץ — מסיבות רחוב, פסטיבלים ומועדונים בתל אביב, בצפון ובדרום, לצד ברביקיו ומופעים בגנים ציבוריים.',
  },
  {
    question: 'האם המסיבות מתאימות לכל הגילאים?',
    answer: 'משתנה בין אירועים — יש חגיגות רחוב פתוחות לכל המשפחה וגם מסיבות מועדון וטכנו לגילאי 18+. גיל הכניסה מופיע תמיד בכרטיסיית האירוע.',
  },
];

async function getData() {
  try {
    const allParties = await api.getParties();
    return filterPartiesInHolidayWindow(allParties, DEF);
  } catch (error) {
    console.error('Failed to fetch Yom HaAtzmaut data:', error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { year } = getHolidayWindow(DEF);
  return {
    title: `מסיבות יום העצמאות ${year} | לוח האירועים המלא - Parties24/7`,
    description: `כל מסיבות יום העצמאות ${year} במקום אחד! חגיגות רחוב, פסטיבלים ומסיבות מועדון לכבוד יום העצמאות בתל אביב ובכל הארץ. כרטיסים ועדכונים בזמן אמת.`,
    keywords: ['מסיבות יום העצמאות', `יום העצמאות ${year}`, 'חגיגות יום העצמאות', 'מסיבות יום העצמאות תל אביב'],
    alternates: { canonical: '/yom-haatzmaut' },
    openGraph: {
      title: `מסיבות יום העצמאות ${year} | Parties24/7`,
      description: `מחפשים לאן לצאת ביום העצמאות? כל החגיגות והמסיבות של ${year} מרוכזות כאן לפי תאריך. כנסו עכשיו!`,
      url: `${BASE_URL}/yom-haatzmaut`,
      type: 'website',
    },
  };
}

export default async function YomHaatzmautPage() {
  const window = getHolidayWindow(DEF);
  const parties = await getData();

  return (
    <HolidayPage
      def={DEF}
      window={window}
      parties={parties}
      heroTitle={`מסיבות יום העצמאות ${window.year}`}
      heroSubtitle={
        <>
          חגיגות רחוב, פסטיבלים ומסיבות מועדון לכבוד יום הולדת המדינה.
          <br />
          <span className="font-semibold text-ink">מיום הזיכרון ישר לחגיגה.</span>
        </>
      }
      introHeading="חוגגים את יום העצמאות עם Parties24/7"
      introParagraphs={[
        `יום העצמאות הוא אחד מימי החגיגה הגדולים בישראל — מיד עם צאת יום הזיכרון, הרחובות, הגגות והמועדונים ברחבי הארץ מתמלאים בחגיגות, פסטיבלים ומסיבות שנמשכות עד הלילה שלמחרת.`,
        <React.Fragment key="p2">
          ב-Parties24/7 ריכזנו עבורכם את כל <strong>מסיבות יום העצמאות {window.year}</strong> במקום אחד, ממוינות לפי תאריך, עם מחיר כרטיס עדכני וקישור ישיר לרכישה.
        </React.Fragment>,
        <span key="p3" className="font-semibold text-ink">
          טיפ מאיתנו: האירועים הפופולריים נמכרים מראש — שריינו כרטיס לפני החג עצמו.
        </span>,
      ]}
      faqs={FAQS}
    />
  );
}

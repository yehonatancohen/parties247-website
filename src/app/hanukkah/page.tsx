import React from 'react';
import { Metadata } from 'next';
import HolidayPage from '@/components/HolidayPage';
import * as api from '@/services/api';
import { BASE_URL } from '@/data/constants';
import { HOLIDAYS, getHolidayWindow, filterPartiesInHolidayWindow } from '@/lib/holidays';

export const revalidate = 60;

const DEF = HOLIDAYS.hanukkah;

const FAQS = [
  {
    question: 'מתי מסיבות חנוכה?',
    answer: 'חג החנוכה נמשך שמונה ימים, ולאורכם נערכות מסיבות כמעט מדי ערב — מרוכזות בעיקר בסופי השבוע שבתוך החג ובחופשת הלימודים.',
  },
  {
    question: 'למה יש כל כך הרבה מסיבות בחנוכה?',
    answer: 'חופשת חנוכה בבתי הספר וימי חופש בעבודה הופכים את השבוע הזה לאחד מעונות השיא של תעשיית האירועים בישראל — פסטיבלים, מסיבות סטודנטים ואירועי מועדון רבים.',
  },
  {
    question: 'האם יש מסיבות חנוכה לנוער?',
    answer: 'כן, חופשת החנוכה היא אחת התקופות העמוסות ביותר במסיבות נוער. חפשו את תג הגיל בכרטיסיית כל אירוע כדי לוודא התאמה.',
  },
  {
    question: 'איך יודעים אם הכרטיסים אזלו?',
    answer: 'סטטוס הכרטיסים מתעדכן בזמן אמת בדף כל אירוע. אירוע עם תג "כרטיסים אחרונים" כדאי לרכוש לו כרטיס בהקדם.',
  },
];

async function getData() {
  try {
    const allParties = await api.getParties();
    return filterPartiesInHolidayWindow(allParties, DEF);
  } catch (error) {
    console.error('Failed to fetch Hanukkah data:', error);
    // Rethrow: during ISR regeneration an error keeps the last good page cached
    // instead of replacing it with an empty one (build time is handled in api.ts).
    throw error;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { year } = getHolidayWindow(DEF);
  return {
    title: `מסיבות חנוכה ${year} | לוח המסיבות לחופשת החנוכה - Parties24/7`,
    description: `כל מסיבות חנוכה ${year} במקום אחד! פסטיבלים, מסיבות סטודנטים ואירועי מועדון לאורך כל שמונת ימי החג. כרטיסים, מחירים ועדכונים בזמן אמת.`,
    keywords: ['מסיבות חנוכה', `חנוכה ${year}`, 'מסיבות חופשת חנוכה', 'מסיבות נוער חנוכה', 'פסטיבלים חנוכה'],
    alternates: { canonical: '/hanukkah' },
    openGraph: {
      title: `מסיבות חנוכה ${year} | Parties24/7`,
      description: `מחפשים לאן לצאת בחופשת החנוכה? כל המסיבות והפסטיבלים של ${year} מרוכזים כאן לפי תאריך. כנסו עכשיו!`,
      url: `${BASE_URL}/hanukkah`,
      type: 'website',
    },
  };
}

export default async function HanukkahPage() {
  const window = getHolidayWindow(DEF);
  const parties = await getData();

  return (
    <HolidayPage
      def={DEF}
      window={window}
      parties={parties}
      heroTitle={`מסיבות חנוכה ${window.year}`}
      heroSubtitle={
        <>
          שמונה ימי חופש, שמונה ימים של מסיבות — לפי תאריך, בכל הארץ.
          <br />
          <span className="font-semibold text-ink">מדליקים נר, יוצאים למסיבה.</span>
        </>
      }
      introHeading="חוגגים את חנוכה עם Parties24/7"
      introParagraphs={[
        `חופשת חנוכה היא אחת מעונות השיא של תעשיית האירועים בישראל — שמונה ימים רצופים שבהם בתי ספר בחופש, ומועדונים, פסטיבלים ואירועי open air ממלאים את הלוח כמעט מדי ערב.`,
        <React.Fragment key="p2">
          ב-Parties24/7 ריכזנו עבורכם את כל <strong>מסיבות חנוכה {window.year}</strong> במקום אחד, ממוינות לפי תאריך, עם מחיר כרטיס עדכני וקישור ישיר לרכישה.
        </React.Fragment>,
        <span key="p3" className="font-semibold text-ink">
          טיפ מאיתנו: סופי השבוע שבתוך חופשת החנוכה הם העמוסים ביותר — שריינו כרטיס מראש.
        </span>,
      ]}
      faqs={FAQS}
    />
  );
}

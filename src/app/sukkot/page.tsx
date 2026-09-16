import React from 'react';
import { Metadata } from 'next';
import HolidayPage from '@/components/HolidayPage';
import * as api from '@/services/api';
import { BASE_URL } from '@/data/constants';
import { HOLIDAYS, getHolidayWindow, filterPartiesInHolidayWindow } from '@/lib/holidays';

export const revalidate = 60;

const DEF = HOLIDAYS.sukkot;

const FAQS = [
  {
    question: 'מתי מסיבות סוכות?',
    answer: 'חג הסוכות נמשך שבוע שלם של חול המועד, החל מערב החג ועד שמחת תורה/שמיני עצרת. מדובר בשבוע שלם עם פסטיבלים, מסיבות טבע ואירועי open air כמעט מדי ערב.',
  },
  {
    question: 'מה ההבדל בין מסיבות סוכות למסיבות ראש השנה?',
    answer: 'ראש השנה מרוכז בסוף שבוע אחד, בעוד שסוכות נפרש על שבוע שלם של חול המועד. לכן בסוכות יש יותר פסטיבלים רב-יומיים במדבר ובצפון, לצד מסיבות המועדון הרגילות של תל אביב לאורך כל השבוע.',
  },
  {
    question: 'האם צריך לקנות כרטיסים מראש לסוכות?',
    answer: 'כן, במיוחד לפסטיבלים הגדולים. אירועי חול המועד סוכות נמכרים מראש ולעיתים אוזלים לפני החג. מומלץ לרכוש כרטיס במחיר Early Bird ברגע שסוגרים אירוע.',
  },
  {
    question: 'איך מתעדכנים באירועים חדשים של סוכות?',
    answer: 'העמוד מתעדכן אוטומטית 24/7 ככל שמפיקים מוסיפים אירועים. שווה לחזור אליו לאורך חול המועד – אירועים חדשים מתווספים לאורך כל השבוע.',
  },
];

async function getData() {
  try {
    const allParties = await api.getParties();
    return filterPartiesInHolidayWindow(allParties, DEF);
  } catch (error) {
    console.error('Failed to fetch Sukkot data:', error);
    // Rethrow: during ISR regeneration an error keeps the last good page cached
    // instead of replacing it with an empty one (build time is handled in api.ts).
    throw error;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { year } = getHolidayWindow(DEF);
  return {
    title: `מסיבות סוכות ${year} | לוח המסיבות והפסטיבלים לחול המועד - Parties24/7`,
    description: `כל מסיבות סוכות ${year} במקום אחד! פסטיבלים רב-יומיים, מסיבות טבע, רייבים ואירועי open air לכל חול המועד בתל אביב, אילת, הכנרת ובמדבר. כרטיסים, מחירים ועדכונים בזמן אמת.`,
    keywords: ['מסיבות סוכות', `מסיבות סוכות ${year}`, 'מסיבות חול המועד סוכות', 'פסטיבלים סוכות', `סוכות ${year}`, 'מסיבות טבע סוכות', 'רייבים סוכות'],
    alternates: { canonical: '/sukkot' },
    openGraph: {
      title: `מסיבות סוכות ${year} | האירועים הכי חמים בחול המועד`,
      description: `מחפשים לאן לצאת בסוכות? כל הפסטיבלים, מסיבות הטבע ואירועי ה-open air של סוכות ${year} מרוכזים כאן לפי תאריך. כנסו עכשיו!`,
      url: `${BASE_URL}/sukkot`,
      type: 'website',
    },
  };
}

export default async function SukkotPage() {
  const window = getHolidayWindow(DEF);
  const parties = await getData();

  return (
    <HolidayPage
      def={DEF}
      window={window}
      parties={parties}
      heroTitle={`מסיבות סוכות ${window.year}`}
      heroSubtitle={
        <>
          שבוע שלם של חול המועד – פסטיבלים, מסיבות טבע ואירועי open air לפי תאריך.
          <br />
          <span className="font-semibold text-ink">שבעה ימים, המון ליינים.</span>
        </>
      }
      introHeading="חוגגים את סוכות עם Parties24/7"
      introParagraphs={[
        `חג הסוכות ${window.year} נפתח בערב החג ונמשך שבוע שלם של חול המועד. בניגוד לראש השנה שמרוכז בסוף שבוע אחד, סוכות פורש על פני שבוע – מה שמאפשר פסטיבלים רב-יומיים במדבר ובצפון, לצד מסיבות מועדון, רוף-טופ ו-open air כמעט מדי ערב.`,
        <React.Fragment key="p2">
          ב-Parties24/7 ריכזנו עבורכם את כל <strong>מסיבות סוכות {window.year}</strong> במקום אחד, ממוינות לפי תאריך, עם מחיר כרטיס עדכני וקישור ישיר לרכישה. בין אם אתם מתכננים פסטיבל שלושה ימים במדבר, מסיבת טבע על הכנרת או ערב מיינסטרים בעיר – כאן תמצאו את כל האפשרויות לחול המועד.
        </React.Fragment>,
        <span key="p3" className="font-semibold text-ink">
          טיפ מאיתנו: הפסטיבלים הגדולים של סוכות נמכרים מראש ואוזלים לפני החג. שריינו כרטיס מוקדם ככל האפשר.
        </span>,
      ]}
      faqs={FAQS}
    />
  );
}

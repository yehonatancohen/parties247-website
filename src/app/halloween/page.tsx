import React from 'react';
import { Metadata } from 'next';
import HolidayPage from '@/components/HolidayPage';
import * as api from '@/services/api';
import { BASE_URL } from '@/data/constants';
import { HOLIDAYS, getHolidayWindow, filterPartiesInHolidayWindow } from '@/lib/holidays';

export const revalidate = 60;

const DEF = HOLIDAYS.halloween;

const FAQS = [
  {
    question: 'מתי מסיבות האלווין?',
    answer: 'האלווין חל תמיד ב-31 באוקטובר. מרבית מסיבות התחפושות והרייבים נערכות בסוף השבוע הקרוב ביותר לתאריך, לצד אירועים בערב עצמו.',
  },
  {
    question: 'איפה עורכים מסיבות האלווין בישראל?',
    answer: 'בעיקר בתל אביב והמרכז — מועדונים, בארים וגגות הופכים לנשפי תחפושות ל-Halloween, לצד מסיבות טכנו ורייבים תמטיים.',
  },
  {
    question: 'האם חובה תחפושת?',
    answer: 'תלוי באירוע — בחלק מהמסיבות תחפושת מזכה בהנחה או כניסה מהירה, אך היא כמעט אף פעם לא חובה. פרטי הדרס-קוד מופיעים בדף כל אירוע.',
  },
  {
    question: 'מגילאי כמה אפשר להיכנס למסיבות האלווין?',
    answer: 'משתנה בין אירועים — יש מסיבות 18+ ויש מסיבות לכל הגילאים. גיל הכניסה מופיע תמיד בכרטיסיית האירוע.',
  },
];

async function getData() {
  try {
    const allParties = await api.getParties();
    return filterPartiesInHolidayWindow(allParties, DEF);
  } catch (error) {
    console.error('Failed to fetch Halloween data:', error);
    // Rethrow: during ISR regeneration an error keeps the last good page cached
    // instead of replacing it with an empty one (build time is handled in api.ts).
    throw error;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { year, end } = getHolidayWindow(DEF);
  // trailDays is 0, so `end` is Halloween night itself. Noon UTC + timeZone UTC
  // keeps the formatted day stable regardless of the server's TZ.
  const night = new Date(`${end}T12:00:00Z`);
  const weekday = night.toLocaleDateString('he-IL', { weekday: 'long', timeZone: 'UTC' });
  const dayMonth = night.toLocaleDateString('he-IL', { day: 'numeric', month: 'long', timeZone: 'UTC' });
  return {
    title: `מסיבות האלווין ${year} | Halloween Parties - Parties24/7`,
    description: `האלווין ${year} (הלוואין) חל ב${weekday}, ${dayMonth}. כל מסיבות האלווין במקום אחד: נשפי תחפושות, רייבים ומסיבות טכנו תמטיות בתל אביב ובכל הארץ, עם כרטיסים ועדכונים בזמן אמת.`,
    keywords: ['מסיבות האלווין', `האלווין ${year}`, `הלוואין ${year}`, 'Halloween party israel', 'מסיבות תחפושות', 'מסיבות האלווין תל אביב'],
    alternates: { canonical: '/halloween' },
    openGraph: {
      title: `מסיבות האלווין ${year} | Parties24/7`,
      description: `מחפשים לאן לצאת בהאלווין? כל נשפי התחפושות והרייבים של ${year} מרוכזים כאן לפי תאריך. כנסו עכשיו!`,
      url: `${BASE_URL}/halloween`,
      type: 'website',
    },
  };
}

export default async function HalloweenPage() {
  const window = getHolidayWindow(DEF);
  const parties = await getData();

  return (
    <HolidayPage
      def={DEF}
      window={window}
      parties={parties}
      heroTitle={`מסיבות האלווין ${window.year}`}
      heroSubtitle={
        <>
          נשפי תחפושות, רייבים ומסיבות תמטיות ללילה הכי מפחיד ומטורף בשנה.
          <br />
          <span className="font-semibold text-ink">בחרו תחפושת, אנחנו נדאג למסיבה.</span>
        </>
      }
      introHeading="חוגגים את האלווין עם Parties24/7"
      introParagraphs={[
        `האלווין הפך בשנים האחרונות לאחד מלילות המסיבות הגדולים בישראל, גם בלי שהוא חג מקומי. מועדונים, בארים ורוף-טופים בתל אביב והמרכז הופכים לנשפי תחפושות, ולצידם רייבים ומסיבות טכנו בהשראת החג בכל הארץ.`,
        <React.Fragment key="p2">
          ב-Parties24/7 ריכזנו עבורכם את כל <strong>מסיבות האלווין {window.year}</strong> במקום אחד, ממוינות לפי תאריך, עם מחיר כרטיס עדכני וקישור ישיר לרכישה.
        </React.Fragment>,
        <span key="p3" className="font-semibold text-ink">
          טיפ מאיתנו: מסיבות התחפושות הפופולריות נגמרות מהר — שריינו כרטיס מראש ולא בערב האחרון.
        </span>,
      ]}
      faqs={FAQS}
    />
  );
}

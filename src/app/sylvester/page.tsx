import React from 'react';
import { Metadata } from 'next';
import HolidayPage from '@/components/HolidayPage';
import * as api from '@/services/api';
import { BASE_URL } from '@/data/constants';
import { HOLIDAYS, getHolidayWindow, filterPartiesInHolidayWindow } from '@/lib/holidays';

export const revalidate = 60;

const DEF = HOLIDAYS.sylvester;

const FAQS = [
  {
    question: 'מתי מסיבות סילבסטר?',
    answer: 'ליל הסילבסטר הוא ליל 31 בדצמבר, ומרבית המסיבות הגדולות נערכות באותו הערב ועד השעות הקטנות של ה-1 בינואר. יש גם אירועי חימום ב-30 בדצמבר.',
  },
  {
    question: 'האם סילבסטר הוא חג יהודי?',
    answer: 'לא — סילבסטר מציין את תחילת השנה האזרחית ואינו חג יהודי, אך הפך למסורת מסיבות גדולה בישראל, בעיקר בתל אביב.',
  },
  {
    question: 'איפה עורכים את מסיבות הסילבסטר הכי גדולות?',
    answer: 'בעיקר בתל אביב — מועדונים, אולמות אירועים וגגות, לצד מסיבות טכנו ופסטיבלים ברחבי הארץ.',
  },
  {
    question: 'כדאי לקנות כרטיס מראש?',
    answer: 'בהחלט — מסיבות סילבסטר הן מהאירועים הנמכרים ביותר בשנה ואוזלות מראש. כרטיס מוקדם גם משמעותית זול יותר ממחיר הדלת.',
  },
];

async function getData() {
  try {
    const allParties = await api.getParties();
    return filterPartiesInHolidayWindow(allParties, DEF);
  } catch (error) {
    console.error('Failed to fetch Sylvester data:', error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const { year } = getHolidayWindow(DEF);
  return {
    title: `מסיבות סילבסטר ${year} | לוח מסיבות ראש השנה האזרחית - Parties24/7`,
    description: `כל מסיבות הסילבסטר ${year} במקום אחד! המסיבות הגדולות של ליל 31 בדצמבר בתל אביב ובכל הארץ. כרטיסים, מחירים ועדכונים בזמן אמת.`,
    keywords: ['מסיבות סילבסטר', `סילבסטר ${year}`, 'מסיבת ראש השנה האזרחית', 'ניו איירס פארטי', 'מסיבות 31.12'],
    alternates: { canonical: '/sylvester' },
    openGraph: {
      title: `מסיבות סילבסטר ${year} | Parties24/7`,
      description: `מחפשים לאן לצאת בסילבסטר? כל המסיבות הגדולות של ליל ${year - 1}/${year} מרוכזות כאן לפי תאריך. כנסו עכשיו!`,
      url: `${BASE_URL}/sylvester`,
      type: 'website',
    },
  };
}

export default async function SylvesterPage() {
  const window = getHolidayWindow(DEF);
  const parties = await getData();

  return (
    <HolidayPage
      def={DEF}
      window={window}
      parties={parties}
      heroTitle={`מסיבות סילבסטר ${window.year}`}
      heroSubtitle={
        <>
          המסיבות הגדולות של ליל 31 בדצמבר — לפי תאריך, בכל הארץ.
          <br />
          <span className="font-semibold text-ink">נפרדים מהשנה הישנה בסטייל.</span>
        </>
      }
      introHeading="חוגגים סילבסטר עם Parties24/7"
      introParagraphs={[
        `ליל הסילבסטר הוא אחד מלילות המסיבות הכי גדולים בישראל — מועדונים, אולמות ורוף-טופים בתל אביב ובכל הארץ נערכים לערב חגיגי במיוחד, לצד פסטיבלים ומסיבות טכנו מיוחדות לרגל השנה החדשה.`,
        <React.Fragment key="p2">
          ב-Parties24/7 ריכזנו עבורכם את כל <strong>מסיבות סילבסטר {window.year}</strong> במקום אחד, ממוינות לפי תאריך, עם מחיר כרטיס עדכני וקישור ישיר לרכישה.
        </React.Fragment>,
        <span key="p3" className="font-semibold text-ink">
          טיפ מאיתנו: מסיבות הסילבסטר נמכרות מראש ואוזלות שבועות לפני החג — אל תחכו לרגע האחרון.
        </span>,
      ]}
      faqs={FAQS}
    />
  );
}

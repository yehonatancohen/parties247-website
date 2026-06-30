import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ path: string[] }>;
};

const SITE_NAME = "Parties 24/7";
const DEFAULT_TITLE = "כרטיסים למסיבות ופסטיבלים";
const DEFAULT_DESCRIPTION = "פורטל המסיבות והבילויים הגדול בישראל. הזמנת כרטיסים לאירועים הכי שווים.";

const PAGE_DESCRIPTIONS: Record<string, string> = {
  'club/echo': 'מסיבות ואירועים במועדון Echo תל אביב – ליינים מעודכנים, כרטיסים מוקדמים ופרטי כניסה לכל האירועים הקרובים. Parties 24/7.',
  'club/jimmy-who': 'אירועים ומסיבות ב-Jimmy Who תל אביב – ליינים, DJים ומחירי כרטיסים לכל ההופעות הקרובות. Parties 24/7.',
  'club/bahia': 'מסיבות ואירועים ב-Bahia הרצליה – ליינים, כרטיסים ופרטי אירועים מעודכנים לכל עונת הקיץ. Parties 24/7.',
  'genre/rave-parties': 'כל הרייבים בישראל – ליינים טכנו, האוס ואלקטרוני עם כרטיסים מוקדמים. Parties 24/7.',
  'genre/techno-parties': 'מסיבות טכנו בישראל – ליינים, מועדונים ורייבים אנדרגראונד עם כרטיסים מוקדמים. Parties 24/7.',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = ((await params).path ?? []).join('/');

  try {
    const res = await fetch(
      `${process.env.API_URL}/page?path=${slug}`,
      { cache: 'no-store' } 
    );

    if (!res.ok) {
      return {
        title: `${DEFAULT_TITLE} | ${SITE_NAME}`,
        description: DEFAULT_DESCRIPTION,
      };
    }

    const data = await res.json();

    const pageTitle = data.h1 ? `${data.h1} | ${SITE_NAME}` : `${DEFAULT_TITLE} | ${SITE_NAME}`;
    const pageDescription = PAGE_DESCRIPTIONS[slug] ?? DEFAULT_DESCRIPTION;

    return {
      title: pageTitle,
      description: pageDescription,
      openGraph: {
        title: pageTitle,
        description: pageDescription,
        url: `https://www.parties247.co.il/${slug}`,
        siteName: SITE_NAME,
        locale: 'he_IL',
        type: 'website',
      },
    };
  } catch (error) {
    return {
      title: `${DEFAULT_TITLE} | ${SITE_NAME}`,
      description: DEFAULT_DESCRIPTION,
    };
  }
}

export default async function Page({ params }: Props) {
  const slug = ((await params).path ?? []).join('/');

  const res = await fetch(
    `${process.env.API_URL}/page?path=${slug}`,
    { cache: 'no-store' }
  );

  if (!res.ok) notFound();

  const data = await res.json();

  return (
    <main>
      <h1>{data.h1}</h1>
      <div dangerouslySetInnerHTML={{ __html: data.html }} />
    </main>
  );
}
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
  params: Promise<{ path: string[] }>;
};

const SITE_NAME = "Parties 24/7";
const DEFAULT_TITLE = "כרטיסים למסיבות ופסטיבלים";
const DEFAULT_DESCRIPTION = "פורטל המסיבות והבילויים הגדול בישראל. הזמנת כרטיסים לאירועים הכי שווים.";

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

    return {
      title: pageTitle,
      description: DEFAULT_DESCRIPTION,
      openGraph: {
        title: pageTitle,
        description: DEFAULT_DESCRIPTION,
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
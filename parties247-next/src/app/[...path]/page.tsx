import { notFound } from 'next/navigation';

type Props = {
  params: { path?: string[] };
};

export async function generateMetadata({ params }: Props) {
  const slug = (params.path ?? []).join('/');

  const res = await fetch(
    `${process.env.API_URL}/seo?path=${slug}`,
    { cache: 'no-store' }
  );

  if (!res.ok) return {};

  const seo = await res.json();

  return {
    title: seo.title,
    description: seo.description,
    openGraph: {
      title: seo.title,
      description: seo.description,
      images: [seo.image],
    },
  };
}

export default async function Page({ params }: Props) {
  const slug = (params.path ?? []).join('/');

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
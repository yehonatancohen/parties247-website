import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { groupArtistEvents } from '@/lib/artistEvents';
import { ARTISTS, matchesArtist } from '@/data/artists';
import { getParties } from '@/services/api';
import { BASE_URL } from '@/data/constants';
import ExploreMoreLinks from '@/components/ExploreMoreLinks';

export const revalidate = 300;
export const metadata: Metadata = { title: 'די־ג׳ייז ואמנים – מסיבות קרובות וכרטיסים', description: 'מצאו מסיבות לפי הדי־ג׳יי או ההרכב שמופיע בליינאפ. עמרי סמדר, קינו טודו, רייזינג דאסט ועוד.', alternates: { canonical: '/djs' } };

export default async function ArtistsPage() {
  const parties = await getParties();
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'בית', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'די־ג׳ייז ואמנים', item: `${BASE_URL}/djs` },
  ] };
  return <div className="space-y-12 pb-16" dir="rtl">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumb) }} />
    <section className="mx-auto max-w-[1100px] px-4 pt-12">
      <h1 className="text-3xl sm:text-5xl font-bold text-ink">די־ג׳ייז ואמנים</h1>
      <p className="mt-4 text-ink-2 text-lg">בחרו אמן כדי לראות את המסיבות שבהן הוא מופיע בליינאפ.</p>
      <ul className="mt-8 divide-y divide-hairline border-y border-hairline">
        {ARTISTS.map(artist => {
          const count = groupArtistEvents(parties.filter(party => matchesArtist(party, artist))).length;
          return <li key={artist.slug}><Link href={`/dj/${artist.slug}`} className="flex flex-wrap items-center justify-between gap-3 py-5 text-ink hover:text-link">
            <span className="flex items-center gap-4"><Image src={`/artists/${artist.slug}.png`} alt="" width={80} height={80} className="h-20 w-20 object-contain" sizes="80px" /><span className="text-lg font-semibold">{artist.name} <span className="font-normal text-ink-2" dir="ltr">({artist.stageName})</span></span></span>
            <span className="text-sm text-ink-2">{count ? `${count} אירועים קרובים` : 'אין כרגע אירועים קרובים'}</span>
          </Link></li>;
        })}
      </ul>
    </section>
    <ExploreMoreLinks context={{ kind: 'genre', slug: 'artists' }} />
  </div>;
}

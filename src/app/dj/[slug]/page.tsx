import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { ARTISTS, matchesArtist } from '@/data/artists';
import { ARTIST_PROFILES } from '@/data/artistProfiles';
import { groupArtistEvents } from '@/lib/artistEvents';
import { BASE_URL } from '@/data/constants';
import { getParties, getCarousels } from '@/services/api';
import { findHotNowCarousel } from '@/lib/carousels';
import PartyGrid from '@/components/PartyGrid';
import ExploreMoreLinks from '@/components/ExploreMoreLinks';

export const revalidate = 300;
type Props = { params: Promise<{ slug: string }> };
export function generateStaticParams() { return ARTISTS.map(artist => ({ slug: artist.slug })); }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artist = ARTISTS.find(item => item.slug === slug);
  if (!artist) notFound();
  return {
    title: `${artist.name} (${artist.stageName}) – מסיבות קרובות וכרטיסים`,
    description: `אירועים ומסיבות שבהם ${artist.stageName} מופיע בליינאפ: תאריכים, מיקומים וכרטיסים דרך אתר המכירה הרשמי.`,
    alternates: { canonical: `/dj/${slug}` },
  };
}

export default async function ArtistPage({ params }: Props) {
  const { slug } = await params;
  const artist = ARTISTS.find(item => item.slug === slug);
  if (!artist) notFound();
  const [parties, carousels] = await Promise.all([getParties(), getCarousels()]);
  const groups = groupArtistEvents(parties.filter(party => matchesArtist(party, artist)));
  const matching = groups.map(group => group.party);
  const profile = ARTIST_PROFILES[slug];
  const title = `${artist.name} · ${artist.stageName}`;
  const schema = {
    '@context': 'https://schema.org', '@type': 'CollectionPage', name: title,
    url: `${BASE_URL}/dj/${slug}`,
    about: { '@type': ['rising-dust', 'club-de-combat'].includes(slug) ? 'MusicGroup' : 'Person', name: artist.stageName, alternateName: artist.name, description: profile?.bio, image: `${BASE_URL}/artists/${slug}.png`, sameAs: profile?.source },
    mainEntity: { '@type': 'ItemList', numberOfItems: matching.length, itemListElement: matching.map((party, i) => ({ '@type': 'ListItem', position: i + 1, name: party.name, url: `${BASE_URL}/event/${party.slug}` })) },
  };
  const breadcrumb = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'בית', item: BASE_URL },
    { '@type': 'ListItem', position: 2, name: 'די־ג׳ייז ואמנים', item: `${BASE_URL}/djs` },
    { '@type': 'ListItem', position: 3, name: artist.name, item: `${BASE_URL}/dj/${slug}` },
  ] };
  return <div className="space-y-10 pb-16" dir="rtl">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([schema, breadcrumb]).replace(/</g, '\\u003c') }} />
    <nav aria-label="פירורי לחם" className="mx-auto max-w-[1100px] px-4 pt-6 text-sm text-ink-2"><Link href="/djs" className="text-link hover:underline">די־ג׳ייז ואמנים</Link> / {artist.name}</nav>
    {profile && <section className="mx-auto grid max-w-[1100px] items-center gap-6 px-4 text-ink-2 leading-relaxed sm:grid-cols-[240px_1fr]">
      <Image src={`/artists/${slug}.png`} alt={artist.name} width={400} height={400} priority className="mx-auto h-64 w-64 object-contain sm:h-80 sm:w-full" sizes="(max-width: 640px) 256px, 240px" />
      <div>
      <h1 className="text-3xl font-bold text-ink mb-4 sm:text-5xl">{title}</h1>
      <h2 className="text-xl font-bold text-ink mb-3">אודות {artist.name}</h2>
      <p>{profile.bio}</p>
      <a href={profile.source} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block text-sm text-link hover:underline">מקור ופרטים נוספים על האמן ↗</a>
      </div>
    </section>}
    <section>
    <h2 className="mx-auto max-w-[1100px] px-4 text-2xl font-bold text-ink">מסיבות קרובות עם {artist.name}</h2>
    <PartyGrid parties={matching} hotPartyIds={findHotNowCarousel(carousels)?.partyIds || []} showFilters={false} showSearch={false} basePath={`/dj/${slug}`} />
    </section>
    <section className="mx-auto max-w-[860px] px-4 text-ink-2 leading-relaxed">
      <h2 className="text-xl font-bold text-ink mb-3">לפני שמזמינים כרטיס</h2>
      <p>הרשימה מתבססת על שמות האמנים בפרטי האירועים. בדקו בעמוד המסיבה ובאתר המכירה את הליינאפ העדכני, שעת הפתיחה וגיל הכניסה. זמני הסט עשויים להתפרסם בנפרד משעת פתיחת הדלתות.</p>
      {matching.length === 0 && <p className="mt-3">אין כרגע אירועים קרובים תואמים ברשימה. אפשר להמשיך ל<Link href="/djs" className="text-link underline">אמנים נוספים</Link> או ל<Link href="/all-parties" className="text-link underline">כל המסיבות</Link>.</p>}
    </section>
    <ExploreMoreLinks context={{ kind: 'genre', slug: 'artists' }} />
  </div>;
}

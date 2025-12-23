import Link from 'next/link';
import { fetchParties } from '../../lib/api';
import PartyGrid from '../ui/PartyGrid';

export const revalidate = 3600;

const filterParties = (parties: Awaited<ReturnType<typeof fetchParties>>, searchTerm?: string) => {
  const lowercased = searchTerm?.toLowerCase().trim();
  return parties
    .filter((party) => new Date(party.date) >= new Date())
    .filter((party) => {
      if (!lowercased) return true;
      return (
        party.name.toLowerCase().includes(lowercased) ||
        party.location.name.toLowerCase().includes(lowercased) ||
        party.description.toLowerCase().includes(lowercased)
      );
    });
};

export default async function AllPartiesPage({
  searchParams,
}: {
  searchParams?: { query?: string };
}) {
  const parties = await fetchParties();
  const filtered = filterParties(parties, searchParams?.query);

  const pageJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: filtered.map((party, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: party.name,
      url: `https://www.parties247.co.il/event/${party.slug}`,
    })),
  };

  return (
    <div className="container mx-auto px-4 space-y-6">
      <header className="text-center space-y-2">
        <p className="uppercase text-xs tracking-[0.2em] text-jungle-accent/80">חיפוש וסינון</p>
        <h1 className="text-4xl font-display text-white">כל המסיבות</h1>
        <p className="text-jungle-text/70 max-w-2xl mx-auto">
          כל הרייבים, המועדונים והאירועים הקרובים – מתעדכן כל שעה באמצעות ISR.
        </p>
      </header>

      <div className="max-w-2xl mx-auto">
        <form className="relative">
          <label className="sr-only" htmlFor="query">
            חיפוש מסיבה
          </label>
          <input
            id="query"
            name="query"
            defaultValue={searchParams?.query ?? ''}
            placeholder="חיפוש מסיבה (לפי שם, מקום או וייב)"
            className="bg-jungle-surface border border-wood-brown text-white text-sm rounded-lg focus:ring-jungle-lime focus:border-jungle-lime block w-full p-3.5 pr-4"
          />
          <button
            type="submit"
            className="absolute left-2 top-1/2 -translate-y-1/2 text-jungle-accent font-semibold"
            aria-label="חפש"
          >
            ↗
          </button>
        </form>
        {searchParams?.query && (
          <p className="mt-2 text-sm text-jungle-text/60">
            מחפשים <strong className="text-white">{searchParams.query}</strong>
          </p>
        )}
      </div>

      <PartyGrid parties={filtered} />

      <div className="text-center text-jungle-text/70 space-y-2">
        <p>לא מוצאים את מה שחיפשתם?</p>
        <Link href="/party-discovery" className="text-jungle-accent hover:text-white font-semibold">
          עברו לעמוד החיפוש המלא →
        </Link>
      </div>

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(pageJsonLd) }} />
    </div>
  );
}

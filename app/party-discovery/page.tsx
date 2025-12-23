import Link from 'next/link';
import { fetchCarousels, fetchParties } from '../../lib/api';
import { createCarouselSlug } from '../../lib/carousels';
import PartyGrid from '../ui/PartyGrid';

export const revalidate = 3600;

export default async function PartyDiscoveryPage() {
  const [parties, carousels] = await Promise.all([fetchParties(), fetchCarousels()]);
  const upcoming = parties.filter((party) => new Date(party.date) >= new Date());

  const curated = carousels
    .map((carousel) => ({
      ...carousel,
      parties: upcoming.filter((party) => carousel.partyIds.includes(party.id)),
      slug: createCarouselSlug(carousel.title),
    }))
    .filter((carousel) => carousel.parties.length > 0)
    .slice(0, 4);

  return (
    <div className="container mx-auto px-4 space-y-6">
      <header className="space-y-2 text-center">
        <p className="uppercase text-xs tracking-[0.2em] text-jungle-accent/80">חיפוש ממוקד</p>
        <h1 className="text-4xl font-display text-white">גילוי מסיבות</h1>
        <p className="text-jungle-text/70 max-w-2xl mx-auto">
          עמוד חכם שמקשר בין כרוסלות נבחרות למסיבות הקרובות. המידע מתעדכן בכל שעה באמצעות ISR.
        </p>
      </header>

      {curated.map((carousel) => (
        <section key={carousel.id} className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-display text-white">{carousel.title}</h2>
            <Link href={`/carousels/${carousel.slug}`} className="text-jungle-accent hover:text-white">
              לכל המסיבות →
            </Link>
          </div>
          <PartyGrid parties={carousel.parties} />
        </section>
      ))}

      {curated.length === 0 && (
        <div className="text-center text-jungle-text/70">
          לא נמצאו כרוסלות פעילות כרגע. נסו שוב בעוד שעה.
        </div>
      )}
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import { createCarouselSlug } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";

type Props = {
  params: Promise<{ carouselSlug: string }>;
};

export const revalidate = 300;

export default async function CarouselPage({ params }: Props) {
  const { carouselSlug } = await params;
  const [carousels, parties] = await Promise.all([getCarousels(), getParties()]);
  const carousel = carousels.find(c => createCarouselSlug(c.title) === carouselSlug);

  if (!carousel) {
    notFound();
  }

  const carouselParties = parties.filter(p => carousel.partyIds.includes(p.id));

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-white">{carousel.title}</h1>
      {carouselParties.length === 0 ? (
        <p className="text-gray-300">אין אירועים בקרוסלה זו.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {carouselParties.map(party => (
            <li key={party.id} className="rounded-xl border border-white/10 bg-white/5 p-4 shadow">
              <h2 className="text-xl font-semibold text-white">{party.name}</h2>
              <p className="text-sm text-gray-200 line-clamp-2">{party.description}</p>
              <Link className="text-lime-300 hover:text-white" href={`/event/${party.slug}`}>
                לעמוד האירוע
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

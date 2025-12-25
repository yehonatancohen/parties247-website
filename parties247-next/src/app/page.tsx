import { Metadata } from "next";
import Link from "next/link";
import { createCarouselSlug } from "@/lib/carousels";
import { getCarousels, getParties } from "@/services/api";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "מסיבות בישראל | Parties247",
  description: "כל המסיבות החמות בישראל בתל אביב, חיפה, אילת ועוד.",
};

export default async function HomePage() {
  const [parties, carousels] = await Promise.all([getParties(), getCarousels()]);
  const carouselsWithParties = carousels
    .map(carousel => ({
      ...carousel,
      parties: parties.filter(p => carousel.partyIds.includes(p.id)),
    }))
    .filter(carousel => carousel.parties.length > 0);

  return (
    <main className="space-y-10 p-6">
      <header className="text-center space-y-3">
        <h1 className="text-4xl font-bold text-white">איפה תהיה המסיבה הבאה שלך?</h1>
        <p className="text-lg text-gray-200">מסיבות חמות ומעודכנות בכל הארץ</p>
      </header>

      {carouselsWithParties.length === 0 ? (
        <p className="text-center text-gray-300">אין כרגע קרוסלות זמינות.</p>
      ) : (
        <div className="space-y-8">
          {carouselsWithParties.map(carousel => (
            <section key={carousel.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-semibold text-white">{carousel.title}</h2>
                <Link
                  className="text-sm text-lime-300 hover:text-white underline"
                  href={`/carousels/${createCarouselSlug(carousel.title)}`}
                >
                  צפייה בכל האירועים
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {carousel.parties.map(party => (
                  <article key={party.id} className="rounded-xl border border-white/10 bg-white/5 p-4 shadow">
                    <div className="flex items-center justify-between text-sm text-gray-300">
                      <span>{new Date(party.date).toLocaleDateString("he-IL", { weekday: "long", day: "2-digit", month: "2-digit" })}</span>
                      <span className="text-lime-300">{party.region}</span>
                    </div>
                    <h3 className="mt-2 text-xl font-semibold text-white">{party.name}</h3>
                    <p className="text-sm text-gray-300 line-clamp-2">{party.description}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <Link className="text-lime-300 hover:text-white" href={`/event/${party.slug}`}>
                        לעמוד האירוע
                      </Link>
                      <a
                        className="text-sm text-white/80 underline"
                        href={party.originalUrl || "#"}
                        target="_blank"
                        rel="noreferrer"
                      >
                        קניית כרטיסים
                      </a>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </main>
  );
}

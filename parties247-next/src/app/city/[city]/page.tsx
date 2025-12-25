import { Metadata } from "next";
import Link from "next/link";
import { getParties } from "@/services/api";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { city: string } }): Promise<Metadata> {
  const cityName = decodeURIComponent(params.city);
  return {
    title: `מסיבות ב${cityName} | Parties247`,
    description: `גילוי מסיבות ואירועים ב${cityName}.`,
  };
}

export default async function CityPage({ params }: { params: { city: string } }) {
  const cityName = decodeURIComponent(params.city);
  const parties = await getParties();
  const cityParties = parties.filter(p => p.region?.toLowerCase() === cityName.toLowerCase());

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-white">מסיבות ב{cityName}</h1>
      {cityParties.length === 0 ? (
        <p className="text-gray-300">לא נמצאו מסיבות בעיר זו.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cityParties.map(party => (
            <li key={party.id} className="rounded-xl border border-white/10 bg-white/5 p-4 shadow">
              <div className="text-sm text-gray-300">{new Date(party.date).toLocaleDateString("he-IL")}</div>
              <h2 className="text-xl font-semibold text-white">{party.name}</h2>
              <p className="text-sm text-gray-200 line-clamp-2">{party.description}</p>
              <Link className="text-lime-300 hover:text-white" href={`/event/${party.slug}`}>
                פרטים נוספים
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

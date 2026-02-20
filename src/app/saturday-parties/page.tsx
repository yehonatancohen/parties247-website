import Link from "next/link";
import { getParties } from "@/services/api";

export const revalidate = 300;

export default async function SaturdayPartiesPage() {
  const parties = await getParties();
  const saturday = parties.filter(p => new Date(p.date).getDay() === 6);

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-white">מסיבות שבת</h1>
      {saturday.length === 0 ? (
        <p className="text-gray-300">אין מסיבות ליום שבת.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saturday.map(party => (
            <li key={party.id} className="rounded-xl border border-white/10 bg-white/5 p-4 shadow">
              <h2 className="text-xl font-semibold text-white">{party.name}</h2>
              <p className="text-sm text-gray-200 line-clamp-2">{party.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}</p>
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

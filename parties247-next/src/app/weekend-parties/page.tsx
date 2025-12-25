import { Metadata } from "next";
import Link from "next/link";
import { getParties } from "@/services/api";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "מסיבות סוף שבוע | Parties247",
  description: "מסיבות חמות לחמישי עד שבת בישראל.",
};

export default async function WeekendPartiesPage() {
  const parties = await getParties();
  const weekend = parties.filter(party => {
    const day = new Date(party.date).getDay();
    return day === 4 || day === 5 || day === 6; // Thursday-Saturday
  });

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-white">מסיבות סוף שבוע</h1>
      {weekend.length === 0 ? (
        <p className="text-gray-300">אין מסיבות לסוף השבוע הקרוב.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {weekend.map(party => (
            <li key={party.id} className="rounded-xl border border-white/10 bg-white/5 p-4 shadow">
              <div className="text-sm text-gray-300">{new Date(party.date).toLocaleDateString("he-IL", { weekday: "long" })}</div>
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

import Link from "next/link";
import { getParties } from "@/services/api";

export const revalidate = 300;

export default async function SaturdayPartiesPage() {
  const parties = await getParties();
  const saturday = parties.filter(p => new Date(p.date).getDay() === 6);

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-ink">מסיבות שבת</h1>
      {saturday.length === 0 ? (
        <p className="text-ink-2">אין מסיבות ליום שבת.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {saturday.map(party => (
            <li key={party.id} className="rounded-xl border border-hairline bg-tile p-4 shadow">
              <h2 className="text-xl font-semibold text-ink">{party.name}</h2>
              <p className="text-sm text-ink-2 line-clamp-2">{party.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()}</p>
              <Link className="text-link hover:text-white" href={`/event/${party.slug}`}>
                לעמוד האירוע
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

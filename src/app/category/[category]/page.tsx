import { Metadata } from "next";
import Link from "next/link";
import { getParties } from "@/services/api";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const label = decodeURIComponent(params.category);
  return {
    title: `מסיבות ${label} | Parties247`,
    description: `רשימת מסיבות לקטגוריה ${label}.`,
  };
}

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const label = decodeURIComponent(params.category);
  const parties = await getParties();
  const normalized = label.toLowerCase();
  const filtered = parties.filter(party => {
    return (
      party.musicType?.toLowerCase() === normalized ||
      party.eventType?.toLowerCase() === normalized ||
      party.tags?.some(tag => tag.toLowerCase() === normalized)
    );
  });

  return (
    <main className="space-y-6 p-6">
      <h1 className="text-3xl font-bold text-white">קטגוריה: {label}</h1>
      {filtered.length === 0 ? (
        <p className="text-gray-300">אין מסיבות בקטגוריה זו.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(party => (
            <li key={party.id} className="rounded-xl border border-white/10 bg-white/5 p-4 shadow">
              <div className="text-sm text-gray-300">{party.region}</div>
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

import { Metadata } from "next";
import Link from "next/link";
import { getParties } from "@/services/api";

export const revalidate = 300;

export async function generateMetadata({ params }: { params: { category: string } }): Promise<Metadata> {
  const label = decodeURIComponent(params.category);
  return {
    title: `מסיבות ${label}`,
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
      <h1 className="text-3xl font-bold text-ink">קטגוריה: {label}</h1>
      {filtered.length === 0 ? (
        <p className="text-ink-2">אין מסיבות בקטגוריה זו.</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map(party => (
            <li key={party.id} className="rounded-xl border border-hairline bg-tile p-4 shadow">
              <div className="text-sm text-ink-2">{party.region}</div>
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

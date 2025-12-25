import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPartyBySlug } from "@/services/api";
import { Party } from "../../../../types";

export const revalidate = 60;

async function fetchParty(slug: string): Promise<Party | null> {
  try {
    return await getPartyBySlug(slug);
  } catch (error) {
    console.error("Failed to load party", error);
    return null;
  }
}

export async function generateMetadata(
  { params }: { params: { slug: string } },
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const party = await fetchParty(params.slug);
  if (!party) {
    return { title: "אירוע לא נמצא" };
  }

  return {
    title: `${party.name} | Parties247`,
    description: party.description,
    openGraph: {
      title: party.name,
      description: party.description,
      images: party.imageUrl ? [{ url: party.imageUrl }]: undefined,
    },
  };
}

export default async function EventPage({ params }: { params: { slug: string } }) {
  const party = await fetchParty(params.slug);
  if (!party) {
    notFound();
  }

  return (
    <main className="space-y-6 p-6">
      <Link className="text-lime-300 hover:text-white" href="/">
        ← חזרה למסיבות
      </Link>
      <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <article className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6 shadow">
          <p className="text-sm text-gray-300">
            {new Date(party.date).toLocaleString("he-IL", { dateStyle: "full", timeStyle: "short" })}
          </p>
          <h1 className="text-3xl font-bold text-white">{party.name}</h1>
          <p className="text-gray-200 leading-relaxed whitespace-pre-line">{party.description}</p>
          {party.tags?.length ? (
            <ul className="flex flex-wrap gap-2 text-sm">
              {party.tags.map(tag => (
                <li key={tag} className="rounded-full bg-white/10 px-3 py-1 text-gray-100">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}
        </article>
        <aside className="space-y-4 rounded-xl border border-white/10 bg-white/5 p-6 shadow">
          <h2 className="text-xl font-semibold text-white">פרטי מיקום</h2>
          <p className="text-gray-200">{party.location.name}</p>
          {party.location.address && <p className="text-gray-300">{party.location.address}</p>}
          <div className="space-x-3 rtl:space-x-reverse">
            {party.originalUrl && (
              <a
                className="inline-block rounded-full bg-lime-300 px-4 py-2 font-semibold text-black hover:bg-white"
                href={party.originalUrl}
                target="_blank"
                rel="noreferrer"
              >
                רכישת כרטיסים
              </a>
            )}
            <Link className="text-lime-300 hover:text-white" href={`/city/${encodeURIComponent(party.region)}`}>
              עוד מסיבות ב{party.region}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}

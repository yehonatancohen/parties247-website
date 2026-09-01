import Link from "next/link";
import { buildExploreLinks, type ExploreContext } from "@/lib/internalLinks";

/**
 * Server-rendered "explore more" internal-linking block. Shown on city / genre /
 * audience listing pages so the churn of event pages feeds authority into the
 * evergreen taxonomy instead of dead-ending. Link targets come from
 * `@/lib/internalLinks` — the single canonical cluster→URL map.
 */
export default function ExploreMoreLinks({ context }: { context: ExploreContext }) {
  const groups = buildExploreLinks(context);
  if (groups.length === 0) return null;

  return (
    <section
      className="container mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/5 p-8 text-jungle-text"
      dir="rtl"
    >
      <h2 className="text-2xl font-display text-white mb-6">להמשיך לגלות</h2>
      <div className="space-y-5">
        {groups.map((group) => (
          <div key={group.heading}>
            <h3 className="text-xs uppercase tracking-wider text-jungle-text/50 mb-2">
              {group.heading}
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-jungle-text/90 transition hover:border-jungle-accent hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

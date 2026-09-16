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
    <section className="mx-auto max-w-[1024px] px-4 sm:px-6" dir="rtl">
      <div className="rounded-[28px] bg-tile p-6 sm:p-10">
        <h2 className="text-[24px] font-bold text-ink sm:text-[28px]">להמשיך לגלות</h2>
        <div className="mt-6 space-y-6">
          {groups.map((group) => (
            <div key={group.heading}>
              <h3 className="mb-3 text-[13px] font-semibold text-ink-3">{group.heading}</h3>
              <div className="flex flex-wrap gap-2">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-full border border-hairline px-4 py-2 text-[14px] text-ink transition-colors hover:border-white/25 hover:bg-tile-hover"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

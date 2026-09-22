import Image from 'next/image';
import Link from 'next/link';
import { Party } from '@/data/types';
import { formatDayShort } from '@/lib/nights';

const MIN_PER_ROW = 12;

function FlyerSet({ parties, duplicate, sizes }: { parties: Party[]; duplicate: boolean; sizes: string }) {
  return (
    <ul
      className={`flex shrink-0 gap-3 pl-3 sm:gap-4 sm:pl-4 ${duplicate ? 'motion-reduce:hidden' : ''}`}
      aria-hidden={duplicate || undefined}
    >
      {parties.map((party, i) => (
        <li key={`${party.id}-${i}`} className="shrink-0">
          <Link
            href={`/event/${party.slug}`}
            tabIndex={duplicate ? -1 : undefined}
            className="group relative block h-[136px] w-[136px] overflow-hidden rounded-[16px] bg-tile transition-transform duration-500 ease-apple hover:-translate-y-1.5 hover:scale-[1.03] sm:h-[208px] sm:w-[208px] sm:rounded-[20px]"
          >
            <Image
              src={party.imageUrl}
              alt={duplicate ? '' : party.name}
              fill
              sizes={sizes}
              quality={40}
              // Eager on purpose: the duplicate set reuses the same URLs (cache hits),
              // and lazy images popping in at the loop seam is exactly what shows.
              loading="eager"
              fetchPriority="low"
              className="object-cover"
            />
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-3 pb-2.5 pt-8 text-[12px] font-semibold text-ink opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:text-[13px]">
              {formatDayShort(party.date)}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

function WallRow({ parties, reverse, duration, sizes }: { parties: Party[]; reverse?: boolean; duration: string; sizes: string }) {
  return (
    // Auto-drifts via the CSS transform animation on the inner track, but the
    // row itself stays a real native horizontal scroller (no-scrollbar just
    // hides the bar) — so a drag/swipe/wheel always overrides the animation
    // immediately, same as any other horizontal list on the site. Previously
    // this was overflow-hidden outside of prefers-reduced-motion, so touch and
    // mouse users had no way to stop or skip the rotation at all.
    <div className="wall-row no-scrollbar overflow-x-auto [touch-action:pan-x]">
      <div
        className={`flex w-max ${reverse ? 'animate-wall-reverse' : 'animate-wall'}`}
        style={{ ['--wall-duration' as string]: duration }}
      >
        <FlyerSet parties={parties} duplicate={false} sizes={sizes} />
        <FlyerSet parties={parties} duplicate sizes={sizes} />
      </div>
    </div>
  );
}

/**
 * The hero's "product shot": real upcoming flyers drifting past, each one a link
 * to its event page. Rendered on the server, animated with CSS only.
 */
export default function FlyerWall({ parties }: { parties: Party[] }) {
  if (parties.length < 6) return null;

  // A set must stay much wider than the viewport or the loop seam comes into view,
  // so thin weeks cycle their flyers until each row has at least MIN_PER_ROW tiles.
  const fill = (row: Party[]) =>
    row.length >= MIN_PER_ROW ? row : Array.from({ length: MIN_PER_ROW }, (_, i) => row[i % row.length]);
  const rowA = fill(parties.filter((_, i) => i % 2 === 0));
  const rowB = fill(parties.filter((_, i) => i % 2 === 1));

  return (
    <div
      className="animate-wall-in flex flex-col gap-3 [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)] sm:gap-4"
      aria-label="מסיבות קרובות"
      role="region"
    >
      <WallRow parties={rowA} duration={`${rowA.length * 7}s`} sizes="(min-width: 640px) 208px, 136px" />
      {/* Second row is desktop-only; the 1px mobile size keeps its hidden images near-free on phones. */}
      <div className="hidden sm:block">
        <WallRow parties={rowB} reverse duration={`${rowB.length * 8}s`} sizes="(min-width: 640px) 208px, 1px" />
      </div>
    </div>
  );
}

'use client';

const Chevron = ({ flip }: { flip?: boolean }) => (
  <svg viewBox="0 0 24 24" className={`h-5 w-5 ${flip ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 6l6 6-6 6" />
  </svg>
);

const PADDLE =
  'absolute top-[34%] hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-tile-raised/90 text-ink opacity-0 shadow-[0_4px_16px_rgba(0,0,0,0.5)] backdrop-blur-md transition-opacity duration-300 hover:bg-tile-hover focus-visible:opacity-100 group-hover/shelf:opacity-100 [@media(hover:hover)]:flex';

/** Previous/next paddles for a ShelfRow, shown on pointer devices only. */
export default function ShelfPaddles({ targetId }: { targetId: string }) {
  const page = (direction: 1 | -1) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    // RTL: moving "forward" means scrolling toward the left (negative scrollLeft).
    el.scrollBy({ left: -direction * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <>
      <button type="button" onClick={() => page(-1)} aria-label="הקודם" aria-controls={targetId} className={`${PADDLE} right-2 sm:right-8`}>
        <Chevron />
      </button>
      <button type="button" onClick={() => page(1)} aria-label="הבא" aria-controls={targetId} className={`${PADDLE} left-2 sm:left-8`}>
        <Chevron flip />
      </button>
    </>
  );
}

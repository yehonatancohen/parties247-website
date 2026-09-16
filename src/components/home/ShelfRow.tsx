import { ReactNode } from 'react';
import ShelfPaddles from './ShelfPaddles';

/**
 * Horizontal scroll-snap shelf. The list stays a server component (so its cards
 * aren't duplicated into the RSC payload); only the paddle buttons are client code.
 */
export default function ShelfRow({ children, label, id }: { children: ReactNode; label: string; id: string }) {
  return (
    <div className="group/shelf relative mx-auto max-w-[1200px] sm:px-6">
      <ul
        id={id}
        aria-label={label}
        className="no-scrollbar flex snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-2 sm:scroll-px-0 sm:gap-5 sm:px-0"
      >
        {children}
      </ul>
      <ShelfPaddles targetId={id} />
    </div>
  );
}

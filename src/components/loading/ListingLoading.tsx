/**
 * Route loading state: a quiet skeleton shaped like a listing page (title, a row
 * of chips, a grid of square flyer cards) so the layout doesn't jump when the
 * real page streams in. Server component, CSS-only shimmer.
 */
const Bar = ({ className }: { className: string }) => (
  <div className={`skeleton rounded-full ${className}`} />
);

export default function ListingLoading() {
  return (
    <div className="font-apple min-h-screen bg-stage text-ink" role="status" aria-live="polite">
      <span className="sr-only">טוען מסיבות…</span>
      <div className="relative overflow-hidden">
        <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(ellipse_55%_60%_at_50%_0%,rgba(118,200,147,0.12),transparent_72%)]" />
        <div className="relative mx-auto flex max-w-[1200px] flex-col items-center px-4 pb-10 pt-14 sm:px-6 sm:pt-20" aria-hidden>
          <Bar className="h-10 w-[70%] max-w-[520px] sm:h-14" />
          <Bar className="mt-4 h-4 w-[55%] max-w-[380px]" />
          <div className="mt-8 flex gap-2">
            {[64, 80, 72, 88].map((w, i) => (
              <div key={i} className="skeleton h-9 rounded-full" style={{ width: w }} />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto grid max-w-[1200px] grid-cols-2 gap-x-3 gap-y-8 px-4 pb-24 sm:grid-cols-3 sm:gap-x-5 sm:px-6 lg:grid-cols-4" aria-hidden>
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} style={{ animationDelay: `${i * 60}ms` }} className="animate-wall-in">
            <div className="skeleton aspect-square rounded-[18px]" />
            <Bar className="mt-3.5 h-3 w-1/3" />
            <Bar className="mt-2.5 h-4 w-4/5" />
            <Bar className="mt-2 h-3 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}

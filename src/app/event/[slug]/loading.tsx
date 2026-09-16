/**
 * Instant feedback while an event page streams in: the same buy-stage layout
 * (flyer beside title, facts and the buy button) as quiet skeletons, so a tap on
 * a party card visibly does something even when the backend is slow.
 */
const Bar = ({ className }: { className: string }) => <div className={`skeleton rounded-full ${className}`} />;

export default function EventLoading() {
  return (
    <div className="font-apple min-h-screen bg-stage text-ink" role="status" aria-live="polite">
      <span className="sr-only">טוען את פרטי המסיבה…</span>
      <div className="mx-auto max-w-[1100px] px-4 pt-6 sm:px-6 sm:pt-10" aria-hidden>
        <Bar className="h-4 w-32" />
        <div className="mt-6 grid gap-8 md:grid-cols-2 md:gap-12 lg:gap-16">
          <div className="skeleton aspect-square rounded-[28px]" />
          <div>
            <Bar className="h-7 w-20" />
            <Bar className="mt-5 h-10 w-4/5 sm:h-12" />
            <Bar className="mt-3 h-10 w-3/5 sm:h-12" />
            <div className="mt-8 space-y-6 border-y border-hairline py-6">
              <Bar className="h-5 w-2/3" />
              <Bar className="h-5 w-1/2" />
              <Bar className="h-5 w-1/3" />
            </div>
            <Bar className="mt-8 h-7 w-40" />
            <div className="skeleton mt-5 h-[58px] rounded-full" />
            <div className="mt-3 h-[54px] rounded-full border border-hairline" />
          </div>
        </div>
      </div>
    </div>
  );
}

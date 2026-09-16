/**
 * Neutral loading state for routes without a shape-specific skeleton (home,
 * discovery, articles, guides, legal…). It deliberately draws no layout — a
 * skeleton of the wrong page is worse than none — just a slim progress line
 * under the header so a tap visibly did something.
 */
export default function PageLoading() {
  return (
    <div className="font-apple min-h-[70vh] bg-stage text-ink" role="status" aria-live="polite">
      <span className="sr-only">טוען…</span>
      <div className="relative h-[2px] w-full overflow-hidden bg-hairline" aria-hidden>
        <div className="loading-line absolute inset-y-0 w-1/3 rounded-full bg-action" />
      </div>
    </div>
  );
}

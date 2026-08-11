'use client';

import { useState } from 'react';

// Clarity session recordings (2026-08-09, mainstream-friday-14-08 event page —
// a party with 11 GoOut redirects and 0 purchases in the 30d funnel) showed
// two separate users tapping this disclaimer text expecting it to do
// something, right at the purchase-decision moment. Same dead-click pattern
// as the date/location chips fixed earlier: a plain non-interactive line of
// text next to the purchase CTA invites a tap. Turning it into a real
// disclosure gives the tap useful information instead of nothing.
export default function PriceDisclaimerNote({ text }: { text: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setExpanded((v) => !v)}
      className="block w-full text-xs text-jungle-text/40 mt-1 underline decoration-dotted underline-offset-2 hover:text-jungle-text/60 transition-colors"
      aria-expanded={expanded}
    >
      {text}
      {expanded && (
        <span className="block mt-1 text-jungle-text/60 normal-case">
          המחיר הסופי, כולל עמלות, מוצג בעמוד התשלום ב-Go-Out לפני האישור הסופי — אתם לא מחויבים בכלום עד שם.
        </span>
      )}
    </button>
  );
}

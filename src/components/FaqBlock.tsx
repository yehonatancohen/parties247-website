import React from 'react';
import type { TaxonomyFAQ } from '../data/taxonomy';

interface FaqBlockProps {
  items: TaxonomyFAQ[];
  headline?: string;
}

/** FAQ accordion. `<details>` keeps every answer in the HTML for search while collapsed. */
const FaqBlock: React.FC<FaqBlockProps> = ({ items, headline = 'שאלות נפוצות' }) => {
  if (!items.length) {
    return null;
  }

  return (
    <section className="mx-auto mt-16 max-w-[860px]">
      <h2 className="text-center text-[28px] font-bold leading-tight text-ink sm:text-[36px]">{headline}</h2>
      <div className="mt-8 border-t border-hairline">
        {items.map((faq, index) => (
          <details key={`${faq.question}-${index}`} className="group border-b border-hairline">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-5 text-[17px] font-semibold text-ink [&::-webkit-details-marker]:hidden">
              {faq.question}
              <svg viewBox="0 0 24 24" className="h-5 w-5 shrink-0 text-ink-3 transition-transform duration-300 ease-apple group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                <path strokeLinecap="round" d="M12 5v14M5 12h14" />
              </svg>
            </summary>
            <p className="-mt-1 pb-6 text-[16px] leading-[1.7] text-ink-2">{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
};

export default FaqBlock;

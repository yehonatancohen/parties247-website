import React from 'react';
import type { TaxonomyFAQ } from '../src/data/taxonomy';

interface FaqBlockProps {
  items: TaxonomyFAQ[];
  headline?: string;
}

const FaqBlock: React.FC<FaqBlockProps> = ({ items, headline = 'שאלות נפוצות' }) => {
  if (!items.length) {
    return null;
  }

  return (
    <section className="mt-12 bg-jungle-surface/70 border border-wood-brown/40 rounded-2xl p-6 shadow-lg">
      <h2 className="font-display text-3xl text-white mb-4">{headline}</h2>
      <dl className="space-y-4 text-jungle-text/90">
        {items.map((faq, index) => (
          <div key={`${faq.question}-${index}`} className="border-b border-jungle-text/20 pb-4 last:border-none last:pb-0">
            <dt className="font-semibold text-lg text-jungle-accent mb-2">{faq.question}</dt>
            <dd className="leading-relaxed">{faq.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default FaqBlock;

import type { FaqEntry } from "@/data/models";
import { JsonLd } from "./JsonLd";

interface Props {
  faq: FaqEntry[];
}

export const FAQSection = ({ faq }: Props) => {
  if (!faq.length) {
    return null;
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer
      }
    }))
  };

  return (
    <section>
      <h2>שאלות נפוצות</h2>
      <JsonLd data={schema} />
      <dl className="faq">
        {faq.map((item) => (
          <div key={item.question}>
            <dt>{item.question}</dt>
            <dd>{item.answer}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

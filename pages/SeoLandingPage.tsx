import React from 'react';
import { Link } from 'react-router-dom';
import SeoManager from '../components/SeoManager';
import { SeoLandingPageConfig } from '../data/seoLandingPages';

interface SeoLandingPageProps {
  config: SeoLandingPageConfig;
}

const SeoLandingPage: React.FC<SeoLandingPageProps> = ({ config }) => {
  return (
    <>
      <SeoManager
        title={`${config.title} | Parties 24/7`}
        description={config.description}
        canonicalPath={config.canonicalPath ?? config.path}
      />

      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto space-y-10">
          <header className="bg-jungle-surface/80 border border-wood-brown/50 rounded-2xl p-8 shadow-xl">
            <p className="text-sm uppercase tracking-wide text-jungle-accent/80 mb-3">מדריך מיוחד</p>
            <h1 className="text-4xl md:text-5xl font-display text-white mb-4">{config.heroTitle}</h1>
            <p className="text-lg text-jungle-text/80 leading-relaxed">{config.heroSubtitle}</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              {config.heroHighlights.map((item) => (
                <div
                  key={item}
                  className="rounded-xl bg-gradient-to-br from-jungle-accent/15 to-jungle-lime/10 border border-wood-brown/40 p-4 text-right"
                >
                  <p className="text-base text-white font-semibold leading-relaxed">{item}</p>
                </div>
              ))}
            </div>
          </header>

          <section className="space-y-6">
            {config.sections.map((section) => (
              <div
                key={section.title}
                className="rounded-2xl border border-wood-brown/40 bg-jungle-surface/70 p-6 shadow-lg"
              >
                <div className="flex flex-col gap-3">
                  <h2 className="text-2xl font-display text-white">{section.title}</h2>
                  <p className="text-jungle-text/80 leading-relaxed">{section.body}</p>
                  {section.links && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                      {section.links.map((link) => (
                        <Link
                          key={`${section.title}-${link.to}`}
                          to={link.to}
                          className="group flex flex-col rounded-xl border border-wood-brown/30 bg-jungle-bg/60 p-4 hover:border-jungle-accent/80 transition-colors"
                        >
                          <span className="text-lg font-semibold text-white group-hover:text-jungle-accent">{link.label}</span>
                          {link.description && (
                            <span className="text-sm text-jungle-text/80">{link.description}</span>
                          )}
                          <span className="text-xs text-jungle-accent mt-2">בקרו בעמוד</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </section>

          {config.faqs && config.faqs.length > 0 && (
            <section className="rounded-2xl border border-wood-brown/50 bg-jungle-surface/70 p-6">
              <h2 className="text-2xl font-display text-white mb-4">שאלות נפוצות</h2>
              <div className="space-y-3">
                {config.faqs.map((faq) => (
                  <details
                    key={faq.question}
                    className="group rounded-xl border border-wood-brown/30 bg-jungle-bg/50 p-4"
                  >
                    <summary className="cursor-pointer text-lg font-semibold text-white flex items-center justify-between">
                      <span>{faq.question}</span>
                      <span className="text-jungle-accent group-open:rotate-90 transition-transform">›</span>
                    </summary>
                    <p className="mt-3 text-jungle-text/80 leading-relaxed">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  );
};

export default SeoLandingPage;

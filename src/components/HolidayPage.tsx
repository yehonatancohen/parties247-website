import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PartyGrid from '@/components/PartyGrid';
import JungleDecorations from '@/components/JungleDecorations';
import WhatsappNudge from '@/components/WhatsappNudge';
import ExploreMoreLinks from '@/components/ExploreMoreLinks';
import { Party } from '@/data/types';
import { BASE_URL } from '@/data/constants';
import { buildEventJsonLd } from '@/lib/eventSchema';
import { HolidayDef, HolidayWindow } from '@/lib/holidays';

export interface HolidayFaq {
  question: string;
  answer: string;
}

interface HolidayPageProps {
  def: HolidayDef;
  window: HolidayWindow;
  parties: Party[];
  heroTitle: string;
  heroSubtitle: React.ReactNode;
  introHeading: string;
  introParagraphs: React.ReactNode[];
  faqs: HolidayFaq[];
  /** Optional full-bleed hero background image (e.g. `/purim-hero.png`). */
  heroImage?: string;
}

/**
 * Shared body for every holiday landing page (`/sukkot`, `/hanukkah`, ...).
 * Each route's `page.tsx` fetches its own parties (via
 * `filterPartiesInHolidayWindow`) and `generateMetadata()` (year comes from
 * `getHolidayWindow` so it's never a hardcoded literal), then renders this
 * with the holiday-specific copy/FAQ.
 */
export default function HolidayPage({
  def,
  window,
  parties,
  heroTitle,
  heroSubtitle,
  introHeading,
  introParagraphs,
  faqs,
  heroImage,
}: HolidayPageProps) {
  const pageUrl = `${BASE_URL}/${def.slug}`;

  const collectionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: heroTitle,
    url: pageUrl,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: parties.map((party, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${BASE_URL}/event/${party.slug}`,
        name: party.name,
      })),
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'בית', item: { '@type': 'Thing', '@id': BASE_URL, name: 'בית' } },
      { '@type': 'ListItem', position: 2, name: 'כל המסיבות', item: { '@type': 'Thing', '@id': `${BASE_URL}/all-parties`, name: 'כל המסיבות' } },
      { '@type': 'ListItem', position: 3, name: heroTitle },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      {parties.map((party) => (
        <script
          key={party.id}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildEventJsonLd(party)) }}
        />
      ))}

      <main className="min-h-screen bg-jungle-deep text-white pb-20 relative overflow-x-hidden -mt-20">
        <JungleDecorations />

        {/* HERO SECTION */}
        <section className="relative h-[48vh] md:h-[52vh] md:min-h-[440px] pt-10 flex flex-col items-center justify-center overflow-hidden">
          {heroImage ? (
            <div className="absolute inset-0 z-0">
              <Image
                src={heroImage}
                alt=""
                fill
                style={{ objectFit: 'cover', objectPosition: 'center' }}
                className="opacity-70 scale-[1.6] sm:scale-[1.3] md:scale-100 object-center"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-jungle-deep/50 via-jungle-deep/60 to-jungle-deep/90"></div>
            </div>
          ) : (
            <div className="absolute inset-0 z-0 bg-gradient-to-br from-jungle-deep via-jungle-surface to-jungle-deep">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(191,255,0,0.14),transparent_55%)]"></div>
              <div className="absolute inset-0 bg-gradient-to-b from-jungle-deep/40 via-jungle-deep/50 to-jungle-deep/90"></div>
            </div>
          )}

          <div className="relative z-10 container mx-auto px-4 text-center pb-8">
            <h1 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-jungle-lime to-jungle-accent drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] mb-6">
              {heroTitle}
            </h1>
            <p className="text-lg md:text-2xl text-white max-w-2xl mx-auto font-light leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {heroSubtitle}
            </p>
          </div>
        </section>

        {/* CONTENT & INFO SECTION */}
        <section className="container mx-auto px-4 mt-8 relative z-20 mb-16">
          <div className="bg-jungle-surface/80 backdrop-blur-md border border-jungle-accent/20 rounded-2xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto text-center md:text-right">
            <h2 className="text-3xl font-display text-white mb-6 text-center">{introHeading}</h2>
            <div className="space-y-4 text-lg text-jungle-text/90 leading-relaxed dir-rtl">
              {introParagraphs.map((p, i) => (
                <p key={i}>{p}</p>
              ))}
            </div>
          </div>
        </section>

        {/* PARTIES GRID */}
        <section id="parties" className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-display text-white mb-10 text-center border-b border-wood-brown/50 pb-4 inline-block mx-auto min-w-[300px]">
            לוח מסיבות {def.hebrewName}
          </h2>

          {parties.length > 0 ? (
            <PartyGrid parties={parties} showFilters={false} showSearch={false} title="" />
          ) : (
            <div className="text-center py-20 bg-jungle-surface/30 rounded-xl border border-dashed border-wood-brown/30">
              <h3 className="text-2xl text-white mb-2">טרם פורסמו מסיבות {def.hebrewName} {window.year}</h3>
              <p className="text-jungle-text mb-6">נעדכן כשייפתחו כרטיסים.</p>
              <div className="max-w-md mx-auto mb-6">
                <WhatsappNudge source="c" message="רוצים להיות הראשונים לדעת כשייפתחו כרטיסים? הצטרפו לקבוצת הוואטסאפ שלנו." />
              </div>
              <Link href="/all-parties" className="mt-2 inline-block px-6 py-3 bg-jungle-accent text-jungle-deep font-bold rounded-full hover:bg-white transition-colors">
                לכל המסיבות באתר
              </Link>
            </div>
          )}
        </section>

        {/* FAQ SECTION */}
        <section className="container mx-auto px-4 mt-16">
          <div className="bg-jungle-surface/70 backdrop-blur-md border border-jungle-accent/20 rounded-2xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto dir-rtl">
            <h2 className="text-3xl font-display text-white mb-8 text-center">שאלות נפוצות – מסיבות {def.hebrewName}</h2>
            <div className="space-y-6">
              {faqs.map((f) => (
                <div key={f.question}>
                  <h3 className="text-xl font-bold text-jungle-lime mb-2">{f.question}</h3>
                  <p className="text-jungle-text/90 leading-relaxed">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* WHATSAPP NUDGE — quiet footer block, dismissible */}
        {parties.length > 0 && (
          <section className="container mx-auto px-4 mt-10 max-w-4xl">
            <WhatsappNudge source="b" />
          </section>
        )}

        {/* CROSS-LINKS */}
        <div className="mt-12">
          <ExploreMoreLinks context={{ kind: 'genre', slug: 'mainstream-music' }} />
        </div>
      </main>
    </>
  );
}

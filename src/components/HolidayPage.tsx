import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import PartyGrid from '@/components/PartyGrid';
import FaqBlock from '@/components/FaqBlock';
import FlyerFan from '@/components/home/FlyerFan';
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
  const heroFlyers = parties.filter((p) => !p.soldOut && p.imageUrl).slice(0, 5);

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

      <main className="font-apple relative min-h-screen overflow-x-hidden bg-stage pb-20 text-ink">
        {/* HERO */}
        <section className="relative overflow-hidden pb-12 pt-12 text-center sm:pb-16 sm:pt-20">
          <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(ellipse_55%_60%_at_50%_0%,rgba(118,200,147,0.17),transparent_72%)]" />
          <div className="relative mx-auto max-w-[900px] px-4 sm:px-6">
            <h1 className="text-balance text-[clamp(36px,11vw,48px)] font-bold leading-[1.05] sm:text-[72px]">
              {heroTitle}
            </h1>
            <p className="mx-auto mt-5 max-w-[640px] text-balance text-[18px] leading-[1.5] text-ink-2 sm:text-[22px]">
              {heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-7 gap-y-4">
              <a href="#parties" className="rounded-full bg-action px-6 py-3 text-[17px] font-medium text-on-action transition-colors hover:bg-action-hover">
                ללוח המסיבות
              </a>
              {parties.length > 0 && (
                <span className="text-[15px] text-ink-3">
                  <span className="tabular-nums">{parties.length}</span> מסיבות ב{def.hebrewName} {window.year}
                </span>
              )}
            </div>
          </div>
          {heroFlyers.length >= 3 ? (
            <div className="relative mt-12 sm:mt-16">
              <FlyerFan parties={heroFlyers} size="lg" />
            </div>
          ) : heroImage ? (
            <div className="relative mx-auto mt-12 aspect-[16/9] max-w-[900px] overflow-hidden rounded-[28px] px-4 sm:px-6">
              <Image src={heroImage} alt="" fill sizes="(min-width: 900px) 900px, 100vw" className="rounded-[28px] object-cover" priority />
            </div>
          ) : null}
        </section>

        {/* PARTIES GRID */}
        <section id="parties" className="scroll-mt-16">
          <h2 className="mx-auto max-w-[1200px] px-4 pt-6 text-center text-[28px] font-bold sm:px-6 sm:text-[40px]">
            לוח מסיבות {def.hebrewName}
          </h2>

          {parties.length > 0 ? (
            <PartyGrid parties={parties} showFilters={false} showSearch={false} title="" />
          ) : (
            <div className="mx-4 mt-8 max-w-[680px] rounded-[28px] bg-tile px-6 py-14 text-center md:mx-auto">
              <h3 className="text-[24px] font-bold">טרם פורסמו מסיבות {def.hebrewName} {window.year}</h3>
              <p className="mt-2 text-[17px] text-ink-2">נעדכן כשייפתחו כרטיסים.</p>
              <div className="mx-auto mt-6 max-w-md text-right">
                <WhatsappNudge source="c" message="רוצים להיות הראשונים לדעת כשייפתחו כרטיסים? הצטרפו לקבוצת הוואטסאפ שלנו." />
              </div>
              <Link href="/all-parties" className="mt-6 inline-block rounded-full bg-action px-6 py-3 text-[17px] font-medium text-on-action transition-colors hover:bg-action-hover">
                לכל המסיבות באתר
              </Link>
            </div>
          )}
        </section>

        {/* INTRO (indexable copy) */}
        <section className="mx-auto mt-20 max-w-[760px] px-4 sm:mt-28 sm:px-6">
          <h2 className="text-center text-[28px] font-bold leading-tight sm:text-[40px]">{introHeading}</h2>
          <div className="mt-8 space-y-5 text-[17px] leading-[1.75] text-ink-2">
            {introParagraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>

        <div className="px-4 sm:px-6">
          <FaqBlock items={faqs} headline={`שאלות נפוצות – מסיבות ${def.hebrewName}`} />
        </div>

        {parties.length > 0 && (
          <section className="mx-auto mt-12 max-w-[860px] px-4 sm:px-6">
            <WhatsappNudge source="b" />
          </section>
        )}

        <div className="mt-16">
          <ExploreMoreLinks context={{ kind: 'genre', slug: 'mainstream-music' }} />
        </div>
      </main>
    </>
  );
}

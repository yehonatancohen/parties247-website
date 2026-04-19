"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import SocialsCta from "@/components/SocialsCta";
import { createCarouselSlug } from "@/lib/carousels";
import PartyCarousel from "@/components/HotEventsCarousel";
import { Carousel, Party } from "@/data/types";

const HERO_IMAGE_URL =
  "https://i.ibb.co/qMQXFTpr/Gemini-Generated-Image-a2279ca2279ca227.png";

type DisplayParty = Party & { _id?: string; city?: string };

interface HomeClientProps {
  initialParties: DisplayParty[];
  initialCarousels: Carousel[];
}

// --- Main Component ---
export default function HomeClient({ initialParties = [], initialCarousels = [] }: HomeClientProps) {
  const carouselsWithParties = useMemo(() => {
    const partyLookup = new Map(
      initialParties.map((party) => [String(party.id ?? party._id), party])
    );

    return initialCarousels
      .map((carousel) => {
        const targetIds = (carousel.partyIds ?? []).map((id) => String(id));
        const carouselParties = targetIds
          .map((id: string) => partyLookup.get(id))
          .filter((party): party is DisplayParty => Boolean(party));

        const isPurim = carousel.title.toLowerCase().includes('purim') || carousel.title.includes('פורים');
        return {
          ...carousel,
          parties: carouselParties,
          viewAllLink: isPurim ? '/purim' : `/carousels/${createCarouselSlug(carousel.title)}`,
        };
      })
      .filter((c) => c.parties.length > 0);
  }, [initialCarousels, initialParties]);

  const stats = useMemo(() => {
    const uniqueCities = new Set(
      initialParties
        .map((party) => party.city)
        .filter((city): city is string => Boolean(city))
    );

    return {
      totalParties: initialParties.length,
      totalCarousels: carouselsWithParties.length,
      cityCount: uniqueCities.size,
    };
  }, [carouselsWithParties, initialParties]);

  const categoryPills = [
    { href: "/day/today",    label: "הלילה",       emoji: "🌙" },
    { href: "/day/thursday", label: "חמישי",        emoji: "🔥" },
    { href: "/day/friday",   label: "שישי",         emoji: "✨" },
    { href: "/day/weekend",  label: "סוף שבוע",     emoji: "🎉" },
    { href: "/genre/techno-music",  label: "טכנו",  emoji: "⚡" },
    { href: "/genre/house-music",   label: "האוס",  emoji: "🎵" },
    { href: "/genre/trance",        label: "טראנס", emoji: "🌀" },
    { href: "/cities/tel-aviv",     label: "תל אביב", emoji: "🏙️" },
    { href: "/cities/haifa",        label: "חיפה",  emoji: "⛰️" },
  ];

  const inspirations = [
    {
      title: "ליין אלקטרוני",
      description: "סטים מעולמות הטכנו, האוס ומלודיק – עם דיג׳ייז בינלאומיים ומערכות סאונד משודרגות.",
      href: "/genre/techno-music",
    },
    {
      title: "מסיבות גגות וחופים",
      description: "שקיעות, בריזה ודרינקים קלילים. הלוקיישנים הכי יפים בתל אביב ובאזור המרכז.",
      href: "/cities/tel-aviv",
    },
    {
      title: "חוויות בוטיק",
      description: "לילות קוקטיילים, קוד לבוש מוקפד ומוזיקה חצופה שמושמעת רק למביני עניין.",
      href: "/audience/24plus-parties",
    },
  ];

  return (
    <>
      {/* ─── Hero Section ─── */}
      <section className="relative mb-16 min-h-[88vh] flex flex-col justify-end overflow-hidden bg-jungle-deep">

        {/* Background image */}
        <picture className="absolute inset-0">
          <source srcSet={`${HERO_IMAGE_URL}&fm=avif`} type="image/avif" />
          <Image
            src={HERO_IMAGE_URL}
            alt="קהל חוגג במסיבה לילית"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            fill
            className="object-cover brightness-50"
          />
        </picture>

        {/* Gradient overlays */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {/* top vignette */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-transparent" />
          {/* bottom fade into page */}
          <div className="absolute bottom-0 inset-x-0 h-[55%] bg-gradient-to-t from-jungle-deep via-jungle-deep/80 to-transparent" />
          {/* subtle accent glows */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_60%_80%,rgba(47,197,165,0.14),transparent_55%),radial-gradient(ellipse_at_30%_20%,rgba(255,255,255,0.07),transparent_40%)]" />
        </div>

        {/* Content — anchored to bottom */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-5 pb-14 pt-32 flex flex-col items-center gap-7 text-center">

          {/* Live badge */}
          <div className="flex items-center gap-2 rounded-full border border-jungle-accent/40 bg-black/40 backdrop-blur-sm px-4 py-1.5 text-xs font-semibold text-jungle-accent tracking-widest uppercase">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-jungle-accent animate-pulse" />
            {stats.totalParties > 0 ? `${stats.totalParties}+ אירועים פעילים` : "PARTIES 24/7"} &nbsp;•&nbsp; עדכון יומי
          </div>

          {/* Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.05] text-white drop-shadow-2xl" dir="rtl">
            המסיבה הבאה שלך{" "}
            <span className="text-jungle-accent">מתחילה כאן</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-white/75 max-w-xl leading-relaxed" dir="rtl">
            גלו אירועי לילה, רייבים ופסטיבלים ברחבי ישראל — לפי יום, עיר וז׳אנר
          </p>

          {/* Category pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-2.5" dir="rtl">
            {categoryPills.map(({ href, label, emoji }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-1.5 rounded-full border border-white/20 bg-black/30 backdrop-blur-sm px-3.5 py-2 text-sm font-medium text-white/90 transition hover:border-jungle-accent hover:bg-jungle-accent/20 hover:text-white hover:scale-105 active:scale-95"
              >
                <span className="text-base leading-none">{emoji}</span>
                {label}
              </Link>
            ))}
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <Link
              href="/all-parties"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-jungle-accent px-7 py-3.5 text-sm font-bold text-jungle-deep shadow-lg shadow-jungle-accent/30 transition hover:scale-105 hover:shadow-jungle-glow active:scale-95"
            >
              לכל האירועים
              <svg className="w-4 h-4 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <Link
              href="/day/weekend"
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 backdrop-blur-sm px-7 py-3.5 text-sm font-bold text-white transition hover:border-white/60 hover:bg-white/20 hover:scale-105 active:scale-95"
            >
              מסיבות הסוף שבוע
            </Link>
          </div>

          {/* Stats strip */}
          {stats.cityCount > 0 && (
            <div className="flex items-center gap-4 text-xs text-white/50 tracking-wide" dir="rtl">
              <span>{stats.totalParties}+ אירועים</span>
              <span className="w-px h-3 bg-white/20" />
              <span>{stats.cityCount} ערים</span>
              <span className="w-px h-3 bg-white/20" />
              <span>עדכון יומי</span>
            </div>
          )}

        </div>
      </section>

      {/* Carousels Section */}
      <div id="hot-now-carousels" className="space-y-16 scroll-mt-28">

        {carouselsWithParties.map((carousel, index) => (
          <React.Fragment key={carousel.id}>
            {/* Render ALL carousels with SSR. 
                pass priority={index === 0} so only the top carousel preloads images 
            */}
            <PartyCarousel
              title={carousel.title}
              parties={carousel.parties}
              viewAllLink={carousel.viewAllLink}
              variant={index === 0 ? "coverflow" : "standard"}
              priority={index === 0}
            />

            {/* Quick Search section removed */}
          </React.Fragment>
        ))}

      </div>

      {/* Inspiration Section */}
      <div className="container mx-auto px-4 mt-4">
        <section className="bg-gradient-to-r from-jungle-surface/80 via-jungle-deep/85 to-jungle-surface/80 border border-wood-brown/50 rounded-3xl p-8 md:p-10 shadow-2xl space-y-6">
          <div className="flex flex-col gap-2 text-center md:text-right">
            <p className="text-xs uppercase tracking-[0.2em] text-jungle-accent/80">השראה ללילה הבא</p>
            <h2 className="text-3xl md:text-4xl font-display text-white">בוחרים וייב וממריאים</h2>
            <p className="text-jungle-text/80 max-w-4xl md:ml-auto">
              ריכזנו עבורכם כמה רעיונות מהירים שמקפיצים את האנרגיות. כנסו, ראו אילו אירועים בולטים בכל וייב, ושמרו את מה שמדליק אתכם.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {inspirations.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-black/20 p-6 shadow-xl backdrop-blur transition hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition bg-gradient-to-br from-jungle-accent/20 via-transparent to-white/10" aria-hidden="true" />
                <div className="relative space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-display text-white">{item.title}</h3>
                    <span className="text-xl text-jungle-accent group-hover:translate-x-1 transition">↗</span>
                  </div>
                  <p className="text-jungle-text/80 leading-relaxed">{item.description}</p>
                  <div className="inline-flex items-center gap-2 text-sm text-jungle-accent border border-jungle-accent/40 rounded-full px-3 py-1">
                    <span>לצפייה במסיבות</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* SEO Text Section */}
      <div className="container mx-auto px-4 mt-16">
        <section className="max-w-5xl mx-auto bg-jungle-surface/80 border border-wood-brown/50 rounded-2xl p-8 shadow-xl space-y-4">
          <h2 className="text-3xl font-display text-white">למה לבחור ב- Parties 24/7?</h2>
          <p className="text-jungle-text/85 leading-relaxed">
            Parties 24/7 הוא המקום שבו חיי הלילה בישראל מתחברים לנקודה אחת ברורה, פשוטה ונוחה. במקום לבזבז זמן על חיפושים מפוזרים, עמודי אינסטגרם, קבוצות וואטסאפ או המלצות מפה לאוזן – כאן אפשר למצוא מסיבות, אירועים וליינאפים נבחרים מכל רחבי הארץ, עם דגש על תל אביב והמרכז. האתר מרכז מסיבות מיינסטרים, טכנו, טראנס, אירועי סילבסטר, חגים, מסיבות אלכוהול חופשי ואירועים מיוחדים, ומאפשר לבחור את המסיבה שמתאימה בדיוק לסגנון, ליום ולוייב שאתם מחפשים.
            אנחנו עובדים ישירות עם מפיקים, יחסי ציבור ודיג&apos;יים, ומביאים רק אירועים שאנחנו מאמינים בהם – בלי ספאם ובלי עומס מיותר. המטרה שלנו היא לחסוך לכם זמן, להוריד חוסר ודאות, ולתת לכם חוויית גילוי נוחה, מהירה וברורה, שמובילה להחלטה ולקנייה בצורה טבעית. בנוסף, Parties 24/7 מחובר לקהילות חיי לילה, עדכונים שוטפים ותוכן שמגיע מהשטח, כדי שתמיד תהיו עם היד על הדופק ותדעו מה קורה הלילה, מחר ובסוף השבוע. אם אתם מחפשים מסיבות בישראל ולא רוצים לפספס את האירועים החזקים באמת – זה המקום להתחיל בו.
          </p>
          <p className="text-jungle-text/85 leading-relaxed">
            בקרו ב{" "}
            <Link href="/genre/techno-music" className="text-jungle-accent hover:text-white">
              דף הטכנו
            </Link>
            , ב{" "}
            <Link href="/cities/tel-aviv" className="text-jungle-accent hover:text-white">
              מדריך תל אביב
            </Link>{" "}
            או ב{" "}
            <Link href="/audience/student-parties" className="text-jungle-accent hover:text-white">
              מסיבות הסטודנטים
            </Link>{" "}
            כדי לתכנן את הלילה הבא שלכם.
          </p>
          <p className="text-jungle-text/80 leading-relaxed">
            קיצורי הדרך בראש העמוד מחברים אתכם למסיבות היום, חמישי ושישי, בעוד עמוד החיפוש המצומצם מציג את כל הקטגוריות החדשות – כולל דפי מועדון ל-
            <Link href="/club/echo" className="text-jungle-accent hover:text-white">
              ECHO
            </Link>
            ,
            <Link href="/club/jimmy-who" className="text-jungle-accent hover:text-white">
              Jimmy Who
            </Link>
            ,
            <Link href="/club/gagarin" className="text-jungle-accent hover:text-white">
              Gagarin
            </Link>{" "}
            ו-
            <Link href="/club/moon-child" className="text-jungle-accent hover:text-white">
              Moon Child
            </Link>
            . שמרו את העמוד במועדפים וחזרו מדי שבוע כדי לא לפספס שום רייב.
          </p>
        </section>
      </div>

      <SocialsCta />
    </>
  );
}
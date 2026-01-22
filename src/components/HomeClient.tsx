"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import SocialsCta from "@/components/SocialsCta";
import { createCarouselSlug } from "@/lib/carousels";
// We use the SSR component for ALL carousels now
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

  const quickLinks = [
    { href: "/all-parties", label: "כל האירועים" },
    { href: "/day/weekend", label: "מסיבות סוף שבוע" },
    { href: "/day/today", label: "מסיבות היום" },
    { href: "/party-discovery", label: "חיפוש מתקדם" },
    { href: "/day/thursday", label: "חמישי" },
    { href: "/day/friday", label: "שישי" },
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
      {/* Hero Section */}
      <section
        className="relative text-center mb-16 pt-16 md:pt-20 min-h-[78vh] sm:min-h-[75vh] lg:min-h-[85vh] flex items-center justify-center overflow-hidden bg-jungle-deep"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(47, 197, 165, 0.18), transparent 40%), radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.08), transparent 45%)",
        }}
      >
        <picture className="absolute inset-0">
          <source srcSet={`${HERO_IMAGE_URL}&fm=avif`} type="image/avif" />
          <Image
            src={HERO_IMAGE_URL}
            alt="קהל חוגג במסיבה לילית"
            loading="eager"
            fetchPriority="high"
            decoding="async"
            width={1600}
            height={900}
            className="w-full h-full object-cover brightness-[0.6]"
          />
        </picture>
        <div className="absolute inset-0 bg-gradient-to-t from-jungle-deep via-transparent to-jungle-deep/50" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-transparent to-black/60" aria-hidden="true" />
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
        >
          <div className="absolute inset-x-[-20%] bottom-[-10%] h-[40vh] sm:h-[45vh] bg-gradient-to-t from-jungle-deep via-black/60 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(167,255,131,0.12),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.12),transparent_30%)]" />
        </div>
        <div className="relative z-10 p-6 max-w-6xl mx-auto flex flex-col items-center gap-6">
          <h1
            className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-8xl mb-2 text-white drop-shadow-xl"
            style={{ textShadow: "3px 3px 8px rgba(0,0,0,0.7)" }}
          >
            איפה תהיה המסיבה הבאה שלך?
          </h1>
          <p className="text-lg sm:text-xl text-jungle-text max-w-3xl">
            Parties 24/7 מחבר אתכם לאירועים הכי חמים בכל הארץ – ממועדוני ענק ועד ליינים אינטימיים. מצאו את הוייב שמתאים לכם.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link
              href="/party-discovery"
              className="inline-flex items-center gap-2 rounded-full bg-jungle-accent text-black font-semibold px-6 py-3 shadow-lg shadow-jungle-accent/40 hover:-translate-y-0.5 hover:shadow-xl hover:bg-white transition"
            >
              <span>לעמוד החיפוש</span>
              <span aria-hidden="true">↗</span>
            </Link>
            <Link
              href="/all-parties"
              className="inline-flex items-center gap-2 rounded-full border border-white/40 text-white px-6 py-3 font-semibold backdrop-blur hover:bg-white/10 hover:-translate-y-0.5 transition"
            >
              <span>צפו בכל האירועים</span>
            </Link>
            <Link
              href="#hot-now-carousels"
              className="inline-flex items-center gap-2 rounded-full border border-white/20 text-white/80 px-4 py-2 text-sm backdrop-blur hover:text-white hover:border-jungle-accent transition"
              scroll={false}
              onClick={(event) => {
                event.preventDefault();
                const target = document.getElementById("hot-now-carousels");
                if (target) {
                  target.scrollIntoView({ behavior: "smooth", block: "start" });
                }
              }}
            >
              <span>למסיבות החמות</span>
            </Link>
          </div>
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

            {/* Render the Quick Search section ONLY after the first carousel */}
            {index === 0 && (
              <section className="bg-gradient-to-r from-jungle-surface/80 via-jungle-deep/85 to-jungle-surface/80 border-y border-wood-brown/50 shadow-[0_10px_40px_rgba(0,0,0,0.35)]">
                <div className="container mx-auto px-4 py-10 grid lg:grid-cols-3 gap-8 items-center">
                  <div className="lg:col-span-2 text-center lg:text-right space-y-3">
                    <p className="text-xs uppercase tracking-[0.2em] text-jungle-accent/80">חיפוש מהיר</p>
                    <h2 className="text-3xl md:text-4xl font-display text-white">מצאו את המסיבה המושלמת בשבילכם</h2>
                    <p className="text-jungle-text/80 max-w-4xl lg:ml-auto lg:pl-10">
                      מסננים לפי עיר, וייב, מועדון או תאריך ומקבלים רשימה מתעדכנת של כל האירועים הקרובים. התחילו עם המסננים הפופולריים או גללו עוד כדי לראות השראות.
                    </p>
                    <div className="flex flex-wrap justify-center lg:justify-start gap-2 mt-4">
                      {quickLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="inline-flex items-center gap-2 rounded-full border border-jungle-accent/50 text-jungle-accent bg-black/20 px-4 py-2 text-sm hover:bg-jungle-accent hover:text-black transition"
                        >
                          <span>{link.label}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                  <div className="bg-black/20 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-jungle-accent/90 flex items-center justify-center text-black text-xl font-bold shadow-lg">✨</div>
                      <div>
                        <p className="text-sm text-jungle-text/80">חסכו זמן</p>
                        <p className="text-lg text-white font-semibold">מסלול אישי תוך שניות</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-jungle-text/80 text-sm">
                      <p>• סינון לפי עיר, וייב, קהל יעד ומועדון.</p>
                      <p>• חיווי על אירועים חמים ומקומות שנשארו.</p>
                      <p>• קישורים ישירים לרכישת כרטיסים או הרשמה.</p>
                    </div>
                    <Link
                      href="/party-discovery"
                      className="inline-flex w-full justify-center items-center gap-2 rounded-xl bg-jungle-accent text-black font-semibold px-4 py-3 shadow-lg shadow-jungle-accent/40 hover:-translate-y-0.5 hover:shadow-xl hover:bg-white transition"
                    >
                      <span>פתחו את המסנן</span>
                      <span aria-hidden="true">↗</span>
                    </Link>
                  </div>
                </div>
              </section>
            )}
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
            אנחנו עובדים ישירות עם מפיקים, יחסי ציבור ודיג’יים, ומביאים רק אירועים שאנחנו מאמינים בהם – בלי ספאם ובלי עומס מיותר. המטרה שלנו היא לחסוך לכם זמן, להוריד חוסר ודאות, ולתת לכם חוויית גילוי נוחה, מהירה וברורה, שמובילה להחלטה ולקנייה בצורה טבעית. בנוסף, Parties 24/7 מחובר לקהילות חיי לילה, עדכונים שוטפים ותוכן שמגיע מהשטח, כדי שתמיד תהיו עם היד על הדופק ותדעו מה קורה הלילה, מחר ובסוף השבוע. אם אתם מחפשים מסיבות בישראל ולא רוצים לפספס את האירועים החזקים באמת – זה המקום להתחיל בו.            <Link href="/genre/techno-music" className="text-jungle-accent hover:text-white">
              דף הטכנו
            </Link>
            , את{" "}
            <Link href="/cities/tel-aviv" className="text-jungle-accent hover:text-white">
              מדריך תל אביב
            </Link>{" "}
            או את{" "}
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
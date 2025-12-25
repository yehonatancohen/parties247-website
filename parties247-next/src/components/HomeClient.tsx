"use client";

import React, { Suspense, useMemo } from "react";
import Link from "next/link";
import LoadingSpinner from "@/components/LoadingSpinner";
import SocialsCta from "@/components/SocialsCta";
import { createCarouselSlug } from "@/lib/carousels";
import PartyCarouselHighPriority from "@/components/HotEventsCarousel";

const PartyCarouselLazy = React.lazy(() => import("@/components/HotEventsCarousel"));

const HERO_IMAGE_URL =
  "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1600&q=70";

interface HomeClientProps {
  initialParties: any[];
  initialCarousels: any[];
}

// --- Components ---
const CarouselSkeleton: React.FC<{ title: string }> = ({ title }) => (
  <div className="py-4 animate-pulse">
    <div className="container mx-auto px-4">
      <div className="flex justify-between items-center mb-4">
        <div className="h-8 w-40 bg-jungle-surface/60 rounded-lg" aria-hidden="true" />
        <div className="flex gap-2">
          <div className="h-10 w-10 bg-jungle-surface/60 rounded-full" aria-hidden="true" />
          <div className="h-10 w-10 bg-jungle-surface/60 rounded-full" aria-hidden="true" />
        </div>
      </div>
    </div>
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {Array.from({ length: 6 }).map((_, idx) => (
          <div
            key={`${title}-skeleton-${idx}`}
            className="aspect-[2/3] bg-jungle-surface/50 rounded-xl"
            aria-hidden="true"
          />
        ))}
      </div>
    </div>
  </div>
);

// --- Main Component ---
export default function HomeClient({ initialParties = [], initialCarousels = [] }: HomeClientProps) {  const carouselsWithParties = useMemo(
    () =>
      initialCarousels
        .map((carousel) => {
          const targetIds = carousel.partyIds.map((_id: any) => String(_id));
          
          const carouselParties = initialParties.filter((p) => 
            targetIds.includes(String(p.id))
          );

          return {
            ...carousel,
            parties: carouselParties,
            viewAllLink: `/carousels/${createCarouselSlug(carousel.title)}`,
          };
        })
        .filter((c) => c.parties.length > 0),
    [initialCarousels, initialParties]
  );

  return (
    <>
      {/* Hero Section */}
      <section
        className="relative text-center mb-12 -mt-8 h-[70vh] sm:h-[60vh] flex items-center justify-center overflow-hidden bg-jungle-deep"
        style={{
          backgroundImage:
            "radial-gradient(circle at 30% 20%, rgba(47, 197, 165, 0.18), transparent 40%), radial-gradient(circle at 70% 60%, rgba(255, 255, 255, 0.08), transparent 45%)",
        }}
      >
        <picture className="absolute inset-0">
          <source srcSet={`${HERO_IMAGE_URL}&fm=avif`} type="image/avif" />
          <img
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
        <div className="relative z-10 p-4">
          <h1
            className="font-display text-5xl sm:text-6xl md:text-8xl mb-4 text-white"
            style={{ textShadow: "3px 3px 8px rgba(0,0,0,0.7)" }}
          >
            איפה תהיה המסיבה הבאה שלך?
          </h1>
          <p className="text-lg sm:text-xl text-jungle-text">אתר המסיבות של ישראל</p>
        </div>
      </section>

      {/* Carousels Section */}
      <div className="space-y-16">
        
        {carouselsWithParties.map((carousel, index) => {
          // STRATEGY: 
          // If it's the first carousel (index 0), render directly.
          // If it's the others, render lazily.
          
          if (index === 0) {
            return (
              <React.Fragment key={carousel.id}>
                {/* HIGH PRIORITY: Renders HTML on server. Google loves this. */}
                <PartyCarouselHighPriority
                  title={carousel.title}
                  parties={carousel.parties}
                  viewAllLink={carousel.viewAllLink}
                  variant="coverflow"
                />
                
                {/* Your Quick Search Section */}
                <section className="...">
                   {/* ... content ... */}
                </section>
              </React.Fragment>
            );
          }

          // LOWER PRIORITY: Renders only when JS loads. Browsers love this.
          return (
            <React.Fragment key={carousel.id}>
              <Suspense fallback={<CarouselSkeleton title={carousel.title} />}>
                <PartyCarouselLazy
                  title={carousel.title}
                  parties={carousel.parties}
                  viewAllLink={carousel.viewAllLink}
                  variant="standard"
                />
              </Suspense>
            </React.Fragment>
          );
        })}

      </div>

      {/* SEO Text Section */}
      <div className="container mx-auto px-4 mt-16">
        <section className="max-w-5xl mx-auto bg-jungle-surface/80 border border-wood-brown/50 rounded-2xl p-8 shadow-xl space-y-4">
          <h2 className="text-3xl font-display text-white">למה לבחור ב- Parties 24/7?</h2>
          <p className="text-jungle-text/85 leading-relaxed">
            אנחנו בונים את חוויית חיפוש המסיבות כך שתהיה מהירה ואמינה: כל דף קטגוריה מקבל כותרת H1 ברורה, 300–500 מילים של הסבר על הוייב, וקישורים פנימיים שמחברים בין ערים, ז׳אנרים וקהלים. הדפים מתעדכנים אוטומטית כך שתמיד תראו את האירועים הבאים – מטכנו בדרום תל אביב דרך האוס רגוע בחיפה ועד מסיבות סטודנטים או 25 פלוס. בדקו את{" "}
            <Link href="/techno-parties" className="text-jungle-accent hover:text-white">
              דף הטכנו
            </Link>
            , את{" "}
            <Link href="/tel-aviv-parties" className="text-jungle-accent hover:text-white">
              מדריך תל אביב
            </Link>{" "}
            או את{" "}
            <Link href="/student-parties" className="text-jungle-accent hover:text-white">
              מסיבות הסטודנטים
            </Link>{" "}
            כדי לתכנן את הלילה הבא שלכם.
          </p>
          <p className="text-jungle-text/80 leading-relaxed">
            כדי שהאתר ייטען מהר, אנחנו משתמשים בטעינת Lazy לכל התמונות, קבצי WebP קלים ו-prefetch למסלולים הפופולריים. קיצורי הדרך בראש העמוד מחברים אתכם למסיבות היום, חמישי ושישי, בעוד עמוד החיפוש המצומצם מציג את כל הקטגוריות החדשות – כולל דפי מועדון ל-
            <Link href="/echo-club" className="text-jungle-accent hover:text-white">
              ECHO
            </Link>{" "}
            ול-
            <Link href="/jimmy-who-club" className="text-jungle-accent hover:text-white">
              Jimmy Who
            </Link>
            . שמרו את העמוד במועדפים וחזרו מדי שבוע כדי לא לפספס שום רייב.
          </p>
        </section>
      </div>

      <SocialsCta />
    </>
  );
}
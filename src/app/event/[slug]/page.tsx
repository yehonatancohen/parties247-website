import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPartyBySlug, getParties } from "@/services/api";
import { Party } from "@/data/types";
import { BRAND_LOGO_URL } from "@/data/constants";
import { CalendarIcon, LocationIcon, FireIcon, PartyPopperIcon, WhatsAppIcon } from "@/components/Icons";
import ShareButtons from "@/components/ShareButtons";
import DiscountCodeReveal from "@/components/DiscountCodeReveal";
import RelatedPartyCard from "@/components/RelatedPartyCard";
import FlyerToPurchaseLink from "@/components/FlyerToPurchaseLink";
import PurchaseButton from "@/components/PurchaseButton";
import { PeopleWatching, StickyPurchaseBar } from "@/components/UrgencyComponents";
import PartyViewTracker from "@/components/PartyViewTracker";
import { BASE_URL, LAST_TICKETS_TAG } from "@/data/constants";

export const revalidate = 60;

// Converts a UTC date string to a proper ISO 8601 string in Israel local time (Asia/Jerusalem).
// Israel is UTC+2 (IST) in winter and UTC+3 (IDT) in summer.
function toIsraelISO(dateStr: string): string {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  // 'sv-SE' locale produces ISO-like "YYYY-MM-DD HH:mm:ss" output
  const localStr = new Intl.DateTimeFormat('sv-SE', {
    timeZone: 'Asia/Jerusalem',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', second: '2-digit',
  }).format(d);
  // Reconstruct a "fake UTC" timestamp from the local parts to compute actual offset
  const [datePart, timePart] = localStr.split(' ');
  const [year, month, day] = datePart.split('-').map(Number);
  const [hour, min, sec] = timePart.split(':').map(Number);
  const localAsUtcMs = Date.UTC(year, month - 1, day, hour, min, sec);
  const offsetMinutes = Math.round((localAsUtcMs - d.getTime()) / 60000);
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const abs = Math.abs(offsetMinutes);
  const hh = String(Math.floor(abs / 60)).padStart(2, '0');
  const mm = String(abs % 60).padStart(2, '0');
  return `${datePart}T${timePart}${sign}${hh}:${mm}`;
}

// Helper for Tag Colors
const getTagColor = (tag: string) => {
  if (tag === LAST_TICKETS_TAG) return 'border-red-500/30 bg-red-500/10 text-red-300';
  if (tag === 'לוהט') return 'border-red-500/30 bg-red-500/10 text-red-300';
  if (tag === 'ביקוש גבוה') return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-300';
  if (tag.includes('חינם')) return 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300';
  if (tag.includes('+')) return 'border-white/20 bg-white/5 text-gray-300';
  return 'border-jungle-lime/30 bg-jungle-lime/10 text-jungle-lime';
};

const getTagIcon = (tag: string) => {
  if (tag === LAST_TICKETS_TAG) return <FireIcon className="w-3.5 h-3.5 ml-1" />;
  if (tag === 'לוהט') return <FireIcon className="w-3.5 h-3.5 ml-1" />;
  if (tag === 'ביקוש גבוה') return <PartyPopperIcon className="w-3.5 h-3.5 ml-1" />;
  return null;
};

// Where a tag chip should send the user — an evergreen taxonomy page when one
// matches, otherwise the all-parties list filtered to that exact tag.
const getTagLink = (tag: string): string => {
  const t = tag.toLowerCase();
  if (t.includes('טכנו') || t.includes('techno')) return '/genre/techno-music';
  if (t.includes('האוס') || t.includes('house')) return '/genre/house-music';
  if (t.includes('מיינסטרים') || t.includes('mainstream') || t.includes('פופ')) return '/genre/mainstream-music';
  if (t.includes('רייב') || t.includes('rave')) return '/genre/rave-parties';
  if (t.includes('סטודנט')) return '/audience/student-parties';
  if (t.includes('חייל')) return '/audience/soldier-parties';
  if (t.includes('נוער')) return '/audience/teenage-parties';
  if (t.includes('24+') || t.includes('25+')) return '/audience/24plus-parties';
  if (t.includes('18')) return '/parties/18-plus-parties-tel-aviv';
  if (t.includes('תל אביב') || t.includes('tel aviv')) return '/cities/tel-aviv';
  if (t.includes('חיפה') || t.includes('haifa')) return '/cities/haifa';
  if (t.includes('אילת') || t.includes('eilat')) return '/cities/eilat';
  return `/all-parties?tags=${encodeURIComponent(tag)}`;
};

const getReferralUrl = (originalUrl: string, partyReferral?: string, defaultReferral?: string): string => {
  try {
    const referralCode = partyReferral || defaultReferral;
    if (!referralCode || !originalUrl) return originalUrl;
    const url = new URL(originalUrl);
    url.searchParams.delete('aff');
    url.searchParams.delete('referrer');
    url.searchParams.set('ref', referralCode);
    return url.toString();
  } catch (e) {
    return originalUrl;
  }
};

async function fetchPartyData(slug: string) {
  try {
    const [partyFromApi, allParties] = await Promise.all([
      getPartyBySlug(slug),
      getParties().catch(() => [])
    ]);

    if (!partyFromApi) return null;

    const partyFromList = allParties.find((p: Party) => p.slug === slug);

    const finalParty: Party = {
      ...partyFromApi,
      imageUrl: partyFromApi.imageUrl || partyFromList?.imageUrl || '',
      id: partyFromApi.id || partyFromList?.id || '',
    };

    const relatedParties = allParties.filter((p: Party) => {
      if (p.id === finalParty.id) return false;
      if (new Date(p.date) < new Date()) return false;
      const inSameCity = p.location.name === finalParty.location.name;
      const hasSharedTag = p.tags.some(tag => finalParty.tags.includes(tag));
      return inSameCity || hasSharedTag;
    }).slice(0, 4);

    return { party: finalParty, relatedParties };
  } catch (error) {
    console.error("Failed to load party", error);
    return null;
  }
}

const getWhatsappOgImage = (imageUrl?: string) => {
  if (!imageUrl) return BRAND_LOGO_URL;
  if (imageUrl.includes("_whatsappImage")) return imageUrl;
  if (imageUrl.includes("_coverImage")) return imageUrl.replace("_coverImage", "_whatsappImage");
  return imageUrl;
};

export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> },
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  const { slug } = await params;
  const data = await fetchPartyData(slug);

  if (!data?.party) return { title: "אירוע לא נמצא" };
  const { party } = data;
  const ogImage = getWhatsappOgImage(party.imageUrl);
  const plainDescription = party.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const eventDate = new Date(party.date);
  const heDate = new Intl.DateTimeFormat('he-IL', { day: 'numeric', month: 'long', timeZone: 'Asia/Jerusalem' }).format(eventDate);
  const heCity = party.location.name;
  const titleStr = `${party.name} - ${heCity}, ${heDate}`;
  const descStr = plainDescription.substring(0, 160) || `${party.name} ב${heCity}. קנו כרטיסים לאירוע ב-Parties 24/7.`;

  return {
    title: titleStr,
    description: descStr,
    alternates: {
      canonical: `/event/${party.slug}`,
      languages: { 'he-IL': `/event/${party.slug}` },
    },
    openGraph: {
      title: party.name,
      description: plainDescription.substring(0, 300),
      images: ogImage ? [{ url: ogImage, width: 1200, height: 630 }] : [{ url: BRAND_LOGO_URL }],
      type: "website",
      locale: "he_IL",
    },
    twitter: {
      card: "summary_large_image",
      title: party.name,
      description: plainDescription.substring(0, 160),
      images: ogImage ? [ogImage] : [BRAND_LOGO_URL],
    },
  };
}

export default async function EventPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await fetchPartyData(slug);

  if (!data || !data.party) {
    notFound();
  }

  const { party, relatedParties } = data;

  const partyDate = new Date(party.date);
  const formattedDate = new Intl.DateTimeFormat('he-IL', { dateStyle: 'full', timeZone: 'UTC' }).format(partyDate);
  const formattedTime = new Intl.DateTimeFormat('he-IL', { timeStyle: 'short', timeZone: 'UTC' }).format(partyDate);

  const referralUrl = getReferralUrl(party.originalUrl, party.referralCode);
  const hasLastTickets = party.tags.includes(LAST_TICKETS_TAG);
  const partyPageUrl = `${BASE_URL}/event/${party.slug}`;
  const whatsappMessage = encodeURIComponent(`היי, אשמח לשמור כרטיסים ל"${party.name}" ב-${formattedDate}. ${partyPageUrl}`);
  const whatsappHref = `https://wa.me/?text=${whatsappMessage}`;
  const showDiscountCode = false;

  const plainDescriptionForLd = party.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

  const eventJsonLd: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    'name': party.name,
    'startDate': toIsraelISO(party.date),
    'eventStatus': `https://schema.org/${party.eventStatus ?? 'EventScheduled'}`,
    'eventAttendanceMode': `https://schema.org/${party.eventAttendanceMode ?? 'OfflineEventAttendanceMode'}`,
    'location': {
      '@type': 'Place',
      'name': party.location.name,
      'address': {
        '@type': 'PostalAddress',
        'streetAddress': party.location.address || party.location.name,
        ...(party.region && party.region !== 'לא ידוע' ? { 'addressRegion': party.region } : {}),
        'addressCountry': 'IL',
      },
      ...(party.location.geo ? {
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': party.location.geo.latitude,
          'longitude': party.location.geo.longitude,
        },
      } : {}),
    },
    'image': [
      party.imageUrl,
    ].filter(Boolean),
    'description': plainDescriptionForLd.substring(0, 500),
    'organizer': party.organizer
      ? { '@type': 'Organization', 'name': party.organizer.name, ...(party.organizer.url ? { 'url': party.organizer.url } : {}) }
      : { '@type': 'Organization', 'name': 'Parties 24/7', 'url': BASE_URL },
    'offers': {
      '@type': 'Offer',
      'url': referralUrl,
      ...(party.ticketPrice != null ? { 'price': String(party.ticketPrice), 'priceCurrency': 'ILS' } : {}),
      'availability': hasLastTickets
        ? 'https://schema.org/LimitedAvailability'
        : party.soldOut
          ? 'https://schema.org/SoldOut'
          : 'https://schema.org/InStock',
    },
  };
  if (party.performer?.name) {
    eventJsonLd['performer'] = { '@type': 'PerformingGroup', 'name': party.performer.name };
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': [
      { '@type': 'ListItem', 'position': 1, 'name': 'בית', 'item': { '@type': 'Thing', '@id': BASE_URL, 'name': 'בית' } },
      { '@type': 'ListItem', 'position': 2, 'name': 'כל המסיבות', 'item': { '@type': 'Thing', '@id': `${BASE_URL}/all-parties`, 'name': 'כל המסיבות' } },
      { '@type': 'ListItem', 'position': 3, 'name': party.name },
    ],
  };

  return (
    <div className="min-h-screen bg-jungle-deep text-white overflow-x-hidden pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <PartyViewTracker partyId={party.id} slug={party.slug} />

      <div className="max-w-3xl mx-auto px-4 pt-6 pb-8">

        {/* Back link */}
        <div className="mb-5">
          <Link
            className="inline-flex items-center gap-2 text-jungle-accent hover:text-white text-sm font-semibold transition-colors"
            href="/all-parties"
          >
            ← חזרה למסיבות
          </Link>
        </div>

        {/* ═══════════════════════════════════════════════════
            SECTION 1: FULL PARTY FLYER / IMAGE
        ═══════════════════════════════════════════════════ */}
        <FlyerToPurchaseLink
          ariaLabel={`לכרטיסים ל${party.name}`}
          className="block rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-8 transition-transform duration-300 active:scale-[0.98]"
        >
          <Image
            src={party.imageUrl}
            alt={party.name}
            title={party.name}
            className="w-full h-auto object-contain bg-black"
            width={800}
            height={1000}
            priority
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </FlyerToPurchaseLink>

        {/* ═══════════════════════════════════════════════════
            SECTION 2: PARTY NAME + TAGS + SOCIAL PROOF
        ═══════════════════════════════════════════════════ */}
        <div className="mb-8">
          {/* Tags */}
          {party.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {party.tags.map(tag => (
                <Link
                  key={tag}
                  href={getTagLink(tag)}
                  title={`עוד מסיבות ${tag}`}
                  className={`${getTagColor(tag)} text-xs font-medium px-2.5 py-1 rounded border flex items-center w-fit transition-colors hover:brightness-125`}
                >
                  {getTagIcon(tag)}
                  {tag}
                </Link>
              ))}
            </div>
          )}

          <h1 className="font-display text-4xl md:text-5xl text-white mb-3 leading-tight">
            {party.name}
          </h1>

          {/* Social proof */}
          <div className="mb-4">
            <PeopleWatching />
          </div>

          {hasLastTickets && (
            <div className="inline-flex items-center gap-2 rounded-xl border border-red-400/50 bg-red-500/10 px-4 py-2.5 text-red-200 text-sm font-bold">
              <FireIcon className="w-4 h-4 text-red-400" />
              <span>כרטיסים אחרונים – מומלץ לשריין מקום עכשיו</span>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════
            QUICK INFO STRIP: Date / Location / Age
        ═══════════════════════════════════════════════════ */}
        <div className="flex flex-wrap gap-3 mb-6" dir="rtl">
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-jungle-surface/60 px-4 py-2.5 text-sm">
            <CalendarIcon className="w-4 h-4 text-jungle-lime flex-shrink-0" />
            <span className="text-white font-semibold">{formattedDate}</span>
            <span className="text-jungle-text/60">·</span>
            <span className="text-jungle-text/70">{formattedTime}</span>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-jungle-surface/60 px-4 py-2.5 text-sm">
            <LocationIcon className="w-4 h-4 text-jungle-lime flex-shrink-0" />
            <span className="text-white font-semibold">{party.location.name}</span>
          </div>
          {party.age && party.age !== 'כל הגילאים' && (
            <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-jungle-surface/60 px-4 py-2.5 text-sm">
              <span className="text-jungle-lime font-bold text-base leading-none">🔞</span>
              <span className="text-white font-semibold">{party.age}</span>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════
            MAIN CALL TO ACTION (Moved up for better conversion)
        ═══════════════════════════════════════════════════ */}
        <div className="rounded-2xl border border-jungle-accent/25 bg-gradient-to-br from-jungle-surface via-jungle-surface/80 to-jungle-deep p-6 md:p-8 mb-8" id="main-purchase-button">
          {party.soldOut ? (
            <div className="text-center mb-4">
              <span className="inline-block bg-white/5 text-white/50 border border-white/10 px-4 py-1.5 rounded-full font-bold text-lg">
                הכרטיסים אזלו
              </span>
            </div>
          ) : party.ticketPrice ? (
            <div className="text-center mb-4">
              <span className="inline-block bg-jungle-lime/10 text-jungle-lime border border-jungle-lime/20 px-4 py-1.5 rounded-full font-bold text-lg shadow-[0_0_15px_rgba(163,230,53,0.1)]">
                כרטיסים החל מ-{party.ticketPrice} ₪
              </span>
            </div>
          ) : null}
          {!party.soldOut && (
            <p className="text-center text-jungle-text/70 text-sm mb-5">
              הכרטיסים נמכרים דרך אתר GO-OUT. לחצו למעבר 👇
              {party.ticketPrice && (
                <span className="block text-xs text-jungle-text/40 mt-1">* המחיר המוצג הוא מחיר התחלתי ועשוי להשתנות — המחיר הסופי נקבע ב-Go-Out</span>
              )}
            </p>
          )}

          <div className="flex flex-col gap-3">
            <PurchaseButton partyId={party.id} slug={party.slug} href={referralUrl} partyName={party.name} price={party.ticketPrice} soldOut={party.soldOut} />

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 rounded-xl border border-green-400/30 bg-green-500/10 px-6 py-3.5 text-lg font-bold text-green-100 transition-all hover:bg-green-500/20 hover:border-green-400/50"
            >
              <WhatsAppIcon className="w-5 h-5" />
              שלחו לחבר בווטסאפ
            </a>
          </div>

          {/* Share */}
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-white/10">
            <ShareButtons partyName={party.name} shareUrl={referralUrl} />
            {hasLastTickets && (
              <span className="inline-flex items-center gap-1.5 text-xs text-red-300 font-semibold animate-pulse">
                <FireIcon className="w-3.5 h-3.5" />
                כרטיסים אחרונים
              </span>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            SECTION 3: EVENT DETAILS
        ═══════════════════════════════════════════════════ */}
        <div className="rounded-2xl border border-white/10 bg-jungle-surface/50 p-6 md:p-8 mb-8">

          {/* Date & Time */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-11 h-11 rounded-xl bg-jungle-lime/10 border border-jungle-lime/20 flex items-center justify-center flex-shrink-0">
              <CalendarIcon className="h-5 w-5 text-jungle-lime" />
            </div>
            <div>
              <p className="text-xs text-jungle-text/50 uppercase tracking-wider mb-0.5">תאריך ושעה</p>
              <p className="font-bold text-white text-lg">{formattedDate}</p>
              <p className="text-jungle-text/70">{formattedTime}</p>
            </div>
          </div>

          {/* Location */}
          <div className="flex items-start gap-4 mb-5">
            <div className="w-11 h-11 rounded-xl bg-jungle-lime/10 border border-jungle-lime/20 flex items-center justify-center flex-shrink-0">
              <LocationIcon className="h-5 w-5 text-jungle-lime" />
            </div>
            <div>
              <p className="text-xs text-jungle-text/50 uppercase tracking-wider mb-0.5">מיקום</p>
              <p className="font-bold text-white text-lg">{party.location.name}</p>
              {party.location.address && <p className="text-jungle-text/70">{party.location.address}</p>}
            </div>
          </div>


        </div>

        {/* ═══════════════════════════════════════════════════
            SECTION 4: DESCRIPTION
        ═══════════════════════════════════════════════════ */}
        {party.description && (
          <div className="rounded-2xl border border-white/10 bg-jungle-surface/50 p-6 md:p-8 mb-8">
            <div
              className="text-jungle-text/85 leading-relaxed text-center
                [&_h2]:text-white [&_h2]:font-display [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:tracking-tight [&_h2]:mb-3 [&_h2]:mt-6 [&_h2:first-child]:mt-0
                [&_h3]:text-white [&_h3]:font-black [&_h3]:text-xl [&_h3]:tracking-tight [&_h3]:mb-2 [&_h3]:mt-4 [&_h3:first-child]:mt-0
                [&_p]:mb-3 [&_p:last-child]:mb-0
                [&_ul]:list-none [&_ul]:my-3 [&_ul]:space-y-2
                [&_li]:text-white [&_li]:font-semibold [&_li]:text-lg"
              dangerouslySetInnerHTML={{ __html: party.description }}
            />
          </div>
        )}

        {showDiscountCode && (
          <div className="mb-8">
            <DiscountCodeReveal variant="expanded" />
          </div>
        )}



        {/* ═══════════════════════════════════════════════════
            SECTION 6: MAP
        ═══════════════════════════════════════════════════ */}
        <div className="rounded-2xl border border-white/10 bg-jungle-surface/50 overflow-hidden mb-8">
          <div className="p-5">
            <h2 className="text-xl font-display text-white flex items-center gap-2">
              <span className="w-1 h-5 bg-jungle-lime rounded-full inline-block" />
              מיקום על המפה
            </h2>
          </div>
          <div className="aspect-[16/9]">
            <iframe
              src={`https://maps.google.com/maps?q=${encodeURIComponent(party.location.name)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
              style={{ filter: "invert(90%) hue-rotate(180deg) contrast(85%) grayscale(20%)" }}
              suppressHydrationWarning={true}
              className="w-full h-full border-0"
              allowFullScreen={false}
              loading="lazy"
              title={`Map of ${party.location.name}`}
            ></iframe>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════
            SECTION 6.5: CROSS-LINKS (city + genre aggregation)
        ═══════════════════════════════════════════════════ */}
        {(() => {
          const CITY_SLUG_MAP: Record<string, string> = {
            'תל אביב': 'tel-aviv', 'תל-אביב': 'tel-aviv',
            'חיפה': 'haifa', 'ירושלים': 'jerusalem',
            'אילת': 'eilat', 'באר שבע': 'beer-sheva',
            'הרצליה': 'herzliya', 'נתניה': 'netanya',
            'ראשון לציון': 'rishon-lezion',
          };
          const MUSIC_GENRE_SLUG_MAP: Record<string, string> = {
            'טכנו': 'techno-music', 'טראנס': 'trance-music',
            'האוס': 'house-music', 'מיינסטרים': 'mainstream-music',
          };
          const citySlug = CITY_SLUG_MAP[party.location.name] || null;
          const genreSlug = MUSIC_GENRE_SLUG_MAP[party.musicType] || null;
          if (!citySlug && !genreSlug) return null;
          return (
            <div className="rounded-2xl border border-white/10 bg-jungle-surface/50 p-6 mb-8">
              <h2 className="text-lg font-display text-white mb-4">עוד מסיבות שיכולות לעניין אותך</h2>
              <div className="flex flex-wrap gap-3">
                {citySlug && (
                  <Link
                    href={`/cities/${citySlug}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-jungle-lime/30 bg-jungle-lime/10 px-4 py-2.5 text-sm font-semibold text-jungle-lime hover:bg-jungle-lime/20 transition-colors"
                  >
                    עוד מסיבות ב{party.location.name} ←
                  </Link>
                )}
                {genreSlug && (
                  <Link
                    href={`/genre/${genreSlug}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-jungle-accent/30 bg-jungle-accent/10 px-4 py-2.5 text-sm font-semibold text-jungle-accent hover:bg-jungle-accent/20 transition-colors"
                  >
                    עוד מסיבות {party.musicType} ←
                  </Link>
                )}
              </div>
            </div>
          );
        })()}

        {/* ═══════════════════════════════════════════════════
            SECTION 7: RELATED PARTIES
        ═══════════════════════════════════════════════════ */}
        {relatedParties.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl md:text-3xl font-display text-white text-center mb-2">מסיבות דומות שאולי תאהבו</h2>
            <p className="text-jungle-text/50 text-sm text-center mb-6">אירועים נוספים שיכולים לעניין אותך</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedParties.map(relatedParty => (
                <RelatedPartyCard key={relatedParty.id} party={relatedParty} />
              ))}
            </div>
          </div>
        )}
      </div>

      <StickyPurchaseBar
        href={referralUrl}
        triggerId="main-purchase-button"
        partyId={party.id}
        slug={party.slug}
        partyName={party.name}
        priceLabel={party.soldOut ? 'הכרטיסים אזלו' : party.ticketPrice ? `לרכישת כרטיסים החל מ-${party.ticketPrice} ₪` : undefined}
      soldOut={party.soldOut}
      />

    </div >
  );
}

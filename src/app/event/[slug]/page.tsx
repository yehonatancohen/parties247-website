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
import PriceDisclaimerNote from "@/components/PriceDisclaimerNote";
import { StickyPurchaseBar } from "@/components/UrgencyComponents";
import PartyViewTracker from "@/components/PartyViewTracker";
import WhatsappNudge from "@/components/WhatsappNudge";
import { BASE_URL, LAST_TICKETS_TAG, isCouponEligible } from "@/data/constants";
import { resolveCitySlug, resolveAudienceSlug, CITY_HEBREW_NAMES, AUDIENCE_HE_LABEL } from "@/lib/internalLinks";
import { toIsraelISO } from "@/lib/dates";
import { formatLongDate, formatTime } from "@/lib/nights";
import { venueOf } from "@/components/home/homeData";
import { HOLIDAYS, getHolidayWindow } from "@/lib/holidays";

export const revalidate = 60;

// Helper for Tag Colors
const getTagColor = (tag: string) => {
  if (tag === LAST_TICKETS_TAG || tag === 'לוהט') return 'border-[#ff8a80]/35 text-[#ffb4ab] hover:bg-[#ff8a80]/10';
  return 'border-hairline text-ink-2 hover:border-white/25 hover:text-ink';
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
    // The per-slug endpoint can be very slow cold (~20s measured 2026-09-16), and
    // every tap on a party card waited on it with no feedback. It is only slightly
    // richer than the upcoming list (geo when the scraper has it), so give it a short
    // head start and fall back to the list entry, which almost every page keeps warm
    // in the Data Cache. The slow fetch still completes in the background and fills
    // the cache for the next render. Hidden/just-past events aren't in the list, so
    // for those we wait for the slug endpoint as before.
    const listPromise = getParties().catch((): Party[] => []);
    const slugPromise = getPartyBySlug(slug).catch(() => null);
    const allParties: Party[] = await listPromise;
    const partyFromList = allParties.find((p: Party) => p.slug === slug);
    const SLUG_HEAD_START_MS = 1200;
    const partyFromApi = partyFromList
      ? (await Promise.race([
          slugPromise,
          new Promise<null>((resolve) => setTimeout(() => resolve(null), SLUG_HEAD_START_MS)),
        ])) ?? partyFromList
      : await slugPromise;

    if (!partyFromApi) return null;

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

// Clarity session recordings (2026-08-02, 5 dead clicks in one session) show users
// repeatedly tapping the date/time chip expecting it to do something — it was a plain
// non-interactive div. Turning it into a real "add to calendar" link gives the tap real
// utility instead of leaving it dead.
function toGCalUTC(d: Date): string {
  return d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
}

function buildGoogleCalendarUrl(party: Party, plainDescription: string): string {
  const start = new Date(party.date);
  const end = new Date(start.getTime() + 4 * 60 * 60 * 1000);
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: party.name,
    dates: `${toGCalUTC(start)}/${toGCalUTC(end)}`,
    details: plainDescription.substring(0, 200),
    location: party.location.address || party.location.name,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Same pattern as the date/time chip above: Clarity session recording (2026-08-06,
// mess-jerusalem event page) showed 4 dead clicks in ~2s on this chip before the user
// gave up and just selected the text — a plain non-interactive div next to a real link
// invites the same tap. Google Maps search URL from the same address data already used
// in the Place JSON-LD above.
function buildGoogleMapsUrl(party: Party): string {
  const query = party.location.address || party.location.name;
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
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

  // The /event -> /archive redirect for events whose date has passed is
  // handled in middleware.ts (redirect()/permanentRedirect() from a page
  // Server Component doesn't produce a real HTTP redirect on this Next.js
  // version — reproduced with a minimal isolated test page, in both dev and
  // production builds; the NEXT_REDIRECT signal leaks into the rendered
  // HTML instead of becoming a 3xx response).

  const formattedDate = formatLongDate(party.date.slice(0, 10));
  const formattedTime = formatTime(party.date);

  const referralUrl = getReferralUrl(party.originalUrl, party.referralCode);
  const hasLastTickets = party.tags.includes(LAST_TICKETS_TAG);

  // Route the "back" link (and its internal-link equity) to the relevant city
  // listing page rather than /all-parties (position ~25, absorbs a link from
  // every event page). Falls back to /all-parties when the city isn't resolvable.
  const backCitySlug = resolveCitySlug({
    areas: party.areas,
    tags: party.tags,
    locationName: party.location?.name,
  });
  const backHref = backCitySlug ? `/cities/${backCitySlug}` : "/all-parties";
  const backLabel = backCitySlug
    ? `← עוד מסיבות ב${CITY_HEBREW_NAMES[backCitySlug] ?? ''}`.trim()
    : "← חזרה למסיבות";
  const audienceSlug = resolveAudienceSlug({ age: party.age, tags: party.tags });
  const partyPageUrl = `${BASE_URL}/event/${party.slug}`;
  const whatsappMessage = encodeURIComponent(`היי, אשמח לשמור כרטיסים ל"${party.name}" ב-${formattedDate}. ${partyPageUrl}`);
  const whatsappHref = `https://wa.me/?text=${whatsappMessage}`;
  const showDiscountCode = isCouponEligible(party.referralCode);

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

  const tile = "rounded-[28px] bg-tile p-6 sm:p-8";
  const chevron = (
    <svg viewBox="0 0 24 24" className="h-[0.8em] w-[0.8em]" fill="none" stroke="currentColor" strokeWidth={2.6} aria-hidden>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
    </svg>
  );

  return (
    <div className="font-apple min-h-screen overflow-x-hidden bg-stage pb-28 text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <PartyViewTracker partyId={party.id} slug={party.slug} />

      <div className="mx-auto max-w-[1100px] px-4 pt-6 sm:px-6 sm:pt-10">
        <Link className="inline-flex items-center gap-1 text-[15px] text-link hover:underline underline-offset-4" href={backHref}>
          {backLabel.replace(/^←\s*/, '')}
          {chevron}
        </Link>

        {/* ═══ Buy stage: flyer + everything needed to decide ═══ */}
        <div className="mt-6 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-12 lg:gap-16">
          <div className="md:sticky md:top-20 md:self-start">
            <FlyerToPurchaseLink
              ariaLabel={`לכרטיסים ל${party.name}`}
              className="block overflow-hidden rounded-[28px] bg-tile shadow-[0_30px_80px_rgba(0,0,0,0.45)] transition-transform duration-300 active:scale-[0.99]"
            >
              <Image
                src={party.imageUrl}
                alt={party.name}
                title={party.name}
                className="h-auto w-full object-contain"
                width={800}
                height={800}
                priority
                sizes="(max-width: 768px) 100vw, 520px"
              />
            </FlyerToPurchaseLink>
          </div>

          <div>
            {party.tags.length > 0 && (
              <div className="mb-4 flex flex-wrap gap-2">
                {party.tags.map(tag => (
                  <Link
                    key={tag}
                    href={getTagLink(tag)}
                    title={`עוד מסיבות ${tag}`}
                    className={`flex w-fit items-center rounded-full border px-3 py-1 text-[13px] font-medium transition-colors ${getTagColor(tag)}`}
                  >
                    {getTagIcon(tag)}
                    {tag}
                  </Link>
                ))}
              </div>
            )}

            <h1 className="text-balance text-[34px] font-bold leading-[1.1] sm:text-[48px]" dir="auto">
              {party.name.replace(/(תל|באר|ראשון|רמת) (אביב|שבע|לציון|גן|השרון)/g, '$1\u00a0$2')}
            </h1>

            {hasLastTickets && (
              <p className="mt-3 inline-flex items-center gap-1.5 text-[15px] font-semibold text-[#ff8a80]">
                <FireIcon className="h-4 w-4" />
                כרטיסים אחרונים – מומלץ לשריין מקום עכשיו
              </p>
            )}

            {/* Quick facts — each row is a real link (calendar / maps): Clarity showed
                dead clicks on the old non-interactive date and location text. */}
            <div className="mt-6 divide-y divide-hairline border-y border-hairline" dir="rtl">
              <a
                href={buildGoogleCalendarUrl(party, plainDescriptionForLd)}
                target="_blank"
                rel="noopener noreferrer"
                title="הוסיפו ליומן Google"
                className="group flex items-center gap-4 py-4"
              >
                <CalendarIcon className="h-5 w-5 flex-shrink-0 text-action" />
                <span className="flex-1">
                  <span className="block text-[17px] font-semibold">{formattedDate}</span>
                  <span className="block text-[15px] text-ink-2">{formattedTime}</span>
                </span>
                <span className="text-[13px] text-link opacity-80 group-hover:opacity-100">הוספה ליומן</span>
              </a>
              <a
                href={buildGoogleMapsUrl(party)}
                target="_blank"
                rel="noopener noreferrer"
                title="פתחו במפות Google"
                className="group flex items-center gap-4 py-4"
              >
                <LocationIcon className="h-5 w-5 flex-shrink-0 text-action" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[17px] font-semibold">{venueOf(party) || party.location.name}</span>
                  {party.location.address && party.location.address !== party.location.name && (
                    <span className="block truncate text-[15px] text-ink-2">{party.location.address}</span>
                  )}
                </span>
                <span className="text-[13px] text-link opacity-80 group-hover:opacity-100">ניווט</span>
              </a>
              {party.age && party.age !== 'כל הגילאים' && (
                <div className="flex items-center gap-4 py-4">
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border border-action text-[9px] font-bold text-action">
                    {party.age.replace(/\D/g, '') || '18'}
                  </span>
                  <span className="text-[17px] font-semibold">גיל כניסה {party.age}</span>
                </div>
              )}
            </div>

            {/* ═══ Main call to action ═══ */}
            <div className="mt-6 rounded-[28px] transition-shadow duration-300" id="main-purchase-button">
              {party.soldOut ? (
                <p className="mb-4 text-[21px] font-semibold text-ink-2">הכרטיסים אזלו</p>
              ) : party.ticketPrice ? (
                <p className="mb-4 text-[17px] text-ink-2">
                  כרטיסים החל מ-<span className="text-[28px] font-bold tabular-nums text-ink">{party.ticketPrice} ₪</span>
                </p>
              ) : null}

              <div className="flex flex-col gap-3">
                <PurchaseButton partyId={party.id} slug={party.slug} href={referralUrl} partyName={party.name} price={party.ticketPrice} soldOut={party.soldOut} couponEligible={showDiscountCode} showPriceInLabel={false} />

                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2.5 rounded-full border border-hairline px-6 py-3.5 text-[17px] font-medium text-ink transition-colors hover:bg-tile"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                  שלחו לחבר בווטסאפ
                </a>
              </div>

              {!party.soldOut && (
                <div className="mt-3 text-center text-[13px] text-ink-3">
                  הכרטיסים נמכרים באתר GO-OUT הרשמי.
                  {party.ticketPrice && (
                    <PriceDisclaimerNote text="* המחיר המוצג הוא מחיר התחלתי ועשוי להשתנות — המחיר הסופי נקבע ב-Go-Out" />
                  )}
                </div>
              )}

              <div className="mt-6 flex items-center justify-between border-t border-hairline pt-5">
                <ShareButtons partyName={party.name} shareUrl={referralUrl} />
              </div>
            </div>

            {showDiscountCode && (
              <div className="mt-6">
                <DiscountCodeReveal variant="expanded" partyId={party.id} />
              </div>
            )}
          </div>
        </div>

        {/* ═══ Details ═══ */}
        <div className="mx-auto mt-16 max-w-[860px] space-y-4 sm:mt-24">
          {party.description && (
            <section className={tile}>
              <h2 className="mb-4 text-[24px] font-bold">על האירוע</h2>
              <div
                className="text-[17px] leading-[1.75] text-ink-2 [&_h2]:mb-3 [&_h2]:mt-6 [&_h2]:text-[21px] [&_h2]:font-bold [&_h2]:text-ink [&_h2:first-child]:mt-0 [&_h3]:mb-2 [&_h3]:mt-4 [&_h3]:text-[19px] [&_h3]:font-bold [&_h3]:text-ink [&_h3:first-child]:mt-0 [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:my-3 [&_ul]:list-none [&_ul]:space-y-1.5 [&_li]:font-medium [&_li]:text-ink"
                dangerouslySetInnerHTML={{ __html: party.description }}
              />
            </section>
          )}

          <section className="overflow-hidden rounded-[28px] bg-tile">
            <h2 className="p-6 pb-4 text-[24px] font-bold sm:px-8">מיקום על המפה</h2>
            <div className="aspect-[16/9]">
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(party.location.name)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                style={{ filter: "invert(90%) hue-rotate(180deg) contrast(85%) grayscale(20%)" }}
                suppressHydrationWarning={true}
                className="h-full w-full border-0"
                allowFullScreen={false}
                loading="lazy"
                title={`Map of ${party.location.name}`}
              ></iframe>
            </div>
          </section>

          <WhatsappNudge source="b" />

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
            const partyYmd = (party.date || '').slice(0, 10);
            const activeHoliday = Object.values(HOLIDAYS).find((def) => {
              const w = getHolidayWindow(def);
              return partyYmd >= w.start && partyYmd <= w.end;
            });
            if (!citySlug && !genreSlug && !audienceSlug && !activeHoliday) return null;
            const chip = "inline-flex items-center gap-1 rounded-full border border-hairline px-4 py-2 text-[15px] text-ink transition-colors hover:border-white/25 hover:bg-tile-hover";
            return (
              <section className={tile}>
                <h2 className="mb-4 text-[21px] font-bold">עוד מסיבות שיכולות לעניין אותך</h2>
                <div className="flex flex-wrap gap-2.5">
                  {activeHoliday && (
                    <Link href={`/${activeHoliday.slug}`} className={chip}>
                      עוד מסיבות {activeHoliday.hebrewName} {chevron}
                    </Link>
                  )}
                  {citySlug && (
                    <Link href={`/cities/${citySlug}`} className={chip}>
                      עוד מסיבות ב{party.location.name} {chevron}
                    </Link>
                  )}
                  {genreSlug && (
                    <Link href={`/genre/${genreSlug}`} className={chip}>
                      עוד מסיבות {party.musicType} {chevron}
                    </Link>
                  )}
                  {audienceSlug && (
                    <Link href={`/audience/${audienceSlug}`} className={chip}>
                      {AUDIENCE_HE_LABEL[audienceSlug] ?? 'עוד מסיבות'} {chevron}
                    </Link>
                  )}
                </div>
              </section>
            );
          })()}
        </div>

        {/* ═══ Related parties ═══ */}
        {relatedParties.length > 0 && (
          <section className="mt-20 sm:mt-28">
            <h2 className="mb-8 text-center text-[28px] font-bold sm:text-[40px]">מסיבות דומות שאולי תאהבו</h2>
            <div className="grid grid-cols-2 gap-x-3 gap-y-8 sm:gap-x-5 md:grid-cols-4">
              {relatedParties.map(relatedParty => (
                <RelatedPartyCard key={relatedParty.id} party={relatedParty} />
              ))}
            </div>
          </section>
        )}
      </div>

      <StickyPurchaseBar
        href={referralUrl}
        triggerId="main-purchase-button"
        partyId={party.id}
        slug={party.slug}
        partyName={party.name}
        priceLabel={party.soldOut ? 'הכרטיסים אזלו' : party.ticketPrice ? `כרטיסים החל מ-${party.ticketPrice} ₪` : 'לרכישת כרטיסים'}
        soldOut={party.soldOut}
        couponEligible={showDiscountCode}
      />
    </div>
  );
}

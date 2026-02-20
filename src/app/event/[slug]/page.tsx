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
import PurchaseButton from "@/components/PurchaseButton";
import { PeopleWatching, StickyPurchaseBar } from "@/components/UrgencyComponents";
import PartyViewTracker from "@/components/PartyViewTracker";
import { BASE_URL, LAST_TICKETS_TAG } from "@/data/constants";
import PartySpecificPixel from "@/components/PartySpecificPixel";

export const revalidate = 60;

// Helper for Tag Colors
const getTagColor = (tag: string) => {
  if (tag === LAST_TICKETS_TAG) return 'bg-red-500/90 text-white';
  if (tag === 'לוהט') return 'bg-red-500/80 text-white';
  if (tag === 'ביקוש גבוה') return 'bg-yellow-500/80 text-jungle-deep';
  if (tag.includes('חינם')) return 'bg-emerald-500/80 text-white';
  if (tag.includes('+')) return 'bg-wood-brown/80 text-jungle-text';
  return 'bg-jungle-accent/80 text-jungle-deep';
};

const getTagIcon = (tag: string) => {
  if (tag === LAST_TICKETS_TAG) return <FireIcon className="w-3.5 h-3.5 ml-1" />;
  if (tag === 'לוהט') return <FireIcon className="w-3.5 h-3.5 ml-1" />;
  if (tag === 'ביקוש גבוה') return <PartyPopperIcon className="w-3.5 h-3.5 ml-1" />;
  return null;
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

  return {
    title: `${party.name} | Parties 24/7`,
    description: party.description.substring(0, 160),
    openGraph: {
      title: party.name,
      description: party.description,
      images: ogImage ? [{ url: ogImage }] : [{ url: BRAND_LOGO_URL }],
      type: "article",
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

  const eventJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Event',
    'name': party.name,
    'startDate': party.date,
    'location': {
      '@type': 'Place',
      'name': party.location.name,
      'address': party.location.address || party.location.name,
    },
    'image': [party.imageUrl],
    'description': party.description,
    'offers': {
      '@type': 'Offer',
      'url': referralUrl,
      'price': '0',
      'priceCurrency': 'ILS',
      'availability': 'https://schema.org/InStock',
    }
  };

  return (
    <div className="min-h-screen bg-jungle-deep text-white overflow-x-hidden pb-24">
      <PartySpecificPixel pixelId={party.pixelId} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
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
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-8">
          <Image
            src={party.imageUrl}
            alt={party.name}
            className="w-full h-auto object-contain bg-black"
            width={800}
            height={1000}
            priority
            sizes="(max-width: 768px) 100vw, 720px"
          />
        </div>

        {/* ═══════════════════════════════════════════════════
            SECTION 2: PARTY NAME + TAGS + SOCIAL PROOF
        ═══════════════════════════════════════════════════ */}
        <div className="mb-8">
          {/* Tags */}
          {party.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {party.tags.map(tag => (
                <span
                  key={tag}
                  className={`${getTagColor(tag)} text-xs font-bold px-3 py-1.5 rounded-full flex items-center w-fit`}
                >
                  {getTagIcon(tag)}
                  {tag}
                </span>
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
            SECTION 5: CTA — AFTER all the details
        ═══════════════════════════════════════════════════ */}
        <div className="rounded-2xl border border-jungle-accent/25 bg-gradient-to-br from-jungle-surface via-jungle-surface/80 to-jungle-deep p-6 md:p-8 mb-8" id="main-purchase-button">
          {party.ticketPrice && (
            <div className="text-center mb-4">
              <span className="inline-block bg-jungle-lime/10 text-jungle-lime border border-jungle-lime/20 px-4 py-1.5 rounded-full font-bold text-lg shadow-[0_0_15px_rgba(163,230,53,0.1)]">
                כרטיסים החל מ-{party.ticketPrice} ₪
              </span>
            </div>
          )}
          <p className="text-center text-jungle-text/70 text-sm mb-5">
            הכרטיסים נמכרים דרך אתר GO-OUT. לחצו למעבר 👇
          </p>

          <div className="flex flex-col gap-3">
            <PurchaseButton partyId={party.id} slug={party.slug} href={referralUrl} pixelId={party.pixelId} partyName={party.name} price={party.ticketPrice} />

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
        pixelId={party.pixelId}
        partyName={party.name}
        priceLabel={party.ticketPrice ? `לרכישת כרטיסים החל מ-${party.ticketPrice} ₪` : undefined}
      />

    </div >
  );
}

import { Metadata, ResolvingMetadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPartyBySlug, getParties } from "@/services/api"; // Ensure getParties is exported
import { Party } from "@/data/types";
import { BRAND_LOGO_URL } from "@/data/constants";
import { CalendarIcon, LocationIcon, FireIcon, PartyPopperIcon, WhatsAppIcon } from "@/components/Icons"; // Adjust imports
import ShareButtons from "@/components/ShareButtons"; // Ensure this handles 'use client' internally if it has state
import DiscountCodeReveal from "@/components/DiscountCodeReveal"; // Ensure this handles 'use client' internally
import RelatedPartyCard from "@/components/RelatedPartyCard"; 
import PurchaseButton from "@/components/PurchaseButton"; 
import { BASE_URL, LAST_TICKETS_TAG } from "@/data/constants";

// Force dynamic rendering if API data changes often, or use revalidate
export const revalidate = 60;

// Helper to calculate "Hot Now" (Server Side Logic)
function isHotNow(partyId: string) {
  // You might need to fetch carousels here or hardcode the logic if carousels aren't available globally
  // For now, defaulting to false to prevent crash, or implement your carousel fetching logic here.
  return false; 
}

// Helper for Tag Colors
const getTagColor = (tag: string) => {
  if (tag === LAST_TICKETS_TAG) return 'bg-red-500/90 text-white';
  if (tag === 'לוהט') return 'bg-red-500/80 text-white';
  if (tag === 'ביקוש גבוה') return 'bg-yellow-500/80 text-jungle-deep';
  return 'bg-jungle-accent/80 text-jungle-deep';
};

// Helper for Referral URL
const getReferralUrl = (originalUrl: string, partyReferral?: string, defaultReferral?: string): string => {
    try {
      const referralCode = partyReferral || defaultReferral;
      if (!referralCode || !originalUrl) return originalUrl;
      const url = new URL(originalUrl);
      // Clean existing params
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
    // Parallel fetch: Get specific party AND all parties (for related logic + image merging)
    const [partyFromApi, allParties] = await Promise.all([
      getPartyBySlug(slug),
      getParties().catch(() => []) // Fallback to empty array if this fails
    ]);

    if (!partyFromApi) return null;

    // Merge logic from your Vite App (fixing missing images using the list)
    const partyFromList = allParties.find((p: Party) => p.slug === slug);
    
    const finalParty: Party = {
       ...partyFromApi,
       imageUrl: partyFromApi.imageUrl || partyFromList?.imageUrl || '',
       id: partyFromApi.id || partyFromList?.id || '',
    };

    // Calculate Related Parties
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

  // Formatting dates
  const partyDate = new Date(party.date);
  const formattedDate = new Intl.DateTimeFormat('he-IL', { dateStyle: 'full', timeZone: 'Asia/Jerusalem' }).format(partyDate);
  const formattedTime = new Intl.DateTimeFormat('he-IL', { timeStyle: 'short', timeZone: 'Asia/Jerusalem' }).format(partyDate);

  const referralUrl = getReferralUrl(party.originalUrl, party.referralCode);
  const hasLastTickets = party.tags.includes(LAST_TICKETS_TAG);
  const partyPageUrl = `${BASE_URL}/event/${party.slug}`;
  const whatsappMessage = encodeURIComponent(`היי, אשמח לשמור כרטיסים ל"${party.name}" ב-${formattedDate}. ${partyPageUrl}`);
  const whatsappHref = `https://wa.me/?text=${whatsappMessage}`;
  // Note: hotNow logic requires fetching carousels. Passing false for now.
  const showDiscountCode = false;

  // JSON-LD Schema
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
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      
      <div className="container mx-auto px-4 py-6">
        {/* Breadcrumb / Back Link */}
        <div className="mb-4">
            <Link className="text-lime-300 hover:text-white" href="/all-parties">
                ← חזרה למסיבות
            </Link>
        </div>

        <div className="max-w-5xl mx-auto bg-jungle-surface rounded-xl overflow-hidden shadow-lg border border-wood-brown/50">
            <div className="md:grid md:grid-cols-5 md:gap-8">
                {/* Image Section */}
                <div className="md:col-span-2">
                    <Image
                      src={party.imageUrl}
                      alt={party.name}
                      className="w-full h-64 md:h-full object-cover"
                      loading="lazy"
                      decoding="async"
                      width={600}
                      height={400}
                    />
                </div>

                {/* Content Section */}
                <div className="md:col-span-3 p-6 md:p-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {party.tags.map(tag => (
                            <span key={tag} className={`${getTagColor(tag)} text-xs font-bold px-3 py-1 rounded-full flex items-center`}>
                               {tag === LAST_TICKETS_TAG && <FireIcon className="w-4 h-4 ml-1" />}
                               {tag === 'לוהט' && <FireIcon className="w-4 h-4 ml-1" />}
                               {tag === 'ביקוש גבוה' && <PartyPopperIcon className="w-4 h-4 ml-1" />}
                               {tag}
                            </span>
                        ))}
                    </div>

                    {hasLastTickets && (
                      <div className="mb-4 inline-flex items-center gap-2 rounded-lg border border-red-400/60 bg-red-500/10 px-3 py-2 text-red-100">
                        <FireIcon className="w-5 h-5" />
                        <span>כרטיסים אחרונים - מומלץ לשריין כרטיס עכשיו</span>
                      </div>
                    )}
                    
                    <h1 className="font-display text-4xl md:text-5xl text-white mb-4">{party.name}</h1>
                    
                    <div className="space-y-4 text-jungle-text mb-6">
                        <div className="flex items-start gap-3">
                            <CalendarIcon className="h-6 w-6 text-jungle-accent mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-bold">{formattedDate}</p>
                                <p className="text-sm">{formattedTime}</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <LocationIcon className="h-6 w-6 text-jungle-accent mt-1 flex-shrink-0" />
                            <div>
                                <p className="font-bold">{party.location.name}</p>
                                {party.location.address && <p className="text-sm">{party.location.address}</p>}
                            </div>
                        </div>
                    </div>

                    <p className="text-jungle-text/90 whitespace-pre-line mb-6">{party.description}</p>

                    {showDiscountCode && <DiscountCodeReveal variant="expanded" className="mb-6" />}

                    <div className="flex flex-col gap-3 mb-6">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <ShareButtons partyName={party.name} shareUrl={referralUrl} />
                        {hasLastTickets && (
                          <span className="inline-flex items-center gap-1 text-sm text-red-200">
                            <FireIcon className="w-4 h-4" />
                            כרטיסים אחרונים
                          </span>
                        )}
                      </div>

                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="w-full sm:flex-1">
                          <PurchaseButton partyId={party.id} slug={party.slug} href={referralUrl} />
                        </div>
                        <a
                          href={whatsappHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full sm:flex-1 inline-flex items-center justify-center gap-3 rounded-lg border border-green-300/70 bg-green-500/10 px-6 py-4 text-2xl sm:text-3xl font-semibold text-green-100 transition hover:bg-green-500/20"
                        >
                          <WhatsAppIcon className="w-5 h-5" />
                          שלחו לי בווטסאפ
                        </a>
                      </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="p-6 md:p-8 border-t border-wood-brown/50">
              <h3 className="text-xl font-display text-white mb-4">מיקום על המפה</h3>
              <div className="p-6 md:p-8 border-t border-wood-brown/50">
              <div className="aspect-[16/9] rounded-lg overflow-hidden border-2 border-wood-brown/50">
                <iframe
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(party.location.name)}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  style={{ filter: "invert(90%) hue-rotate(180deg) contrast(85%) grayscale(20%)" }}
                  suppressHydrationWarning={true}
                  className="w-full h-full border-0 rounded-lg" 
                  allowFullScreen={false}
                  loading="lazy"
                  title={`Map of ${party.location.name}`}
                ></iframe>
              </div>
            </div>
            </div>
        </div>

        {/* Related Parties Section */}
        {relatedParties.length > 0 && (
          <div className="max-w-5xl mx-auto mt-12">
            <h2 className="text-3xl font-display text-center mb-6 text-white">מסיבות דומות שאולי תאהבו</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedParties.map(relatedParty => (
                <RelatedPartyCard key={relatedParty.id} party={relatedParty} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
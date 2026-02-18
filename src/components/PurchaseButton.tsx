// src/app/events/[slug]/PurchaseButton.tsx
"use client";



import { trackPartyRedirect } from "@/lib/analytics"; // Adjust path
import { trackPurchaseClick } from "@/lib/metaPixel";

export default function PurchaseButton({
  partyId,
  slug,
  href,
  pixelId,
  partyName,
  price
}: {
  partyId: string;
  slug: string;
  href: string;
  pixelId?: string;
  partyName?: string;
  price?: number;
}) {
  const handleClick = () => {
    // Track internal analytics
    trackPartyRedirect(partyId, slug);

    // Fire Meta Pixel event if pixel ID is configured
    if (pixelId) {
      trackPurchaseClick(pixelId, partyName, partyId);
    }
  };

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group/btn relative w-full flex items-center justify-center gap-3 text-center bg-gradient-to-r from-jungle-lime to-jungle-accent text-jungle-deep font-display text-2xl sm:text-3xl py-4 px-6 rounded-xl transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] tracking-wider shadow-lg shadow-jungle-lime/20 hover:shadow-jungle-lime/40 overflow-hidden"
    >
      {/* Shimmer effect */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 ease-in-out" />
      <span className="relative z-10 flex items-center gap-3">
        <span>
          {price ? `לרכישת כרטיסים החל מ-${price} ₪` : 'מעבר לרכישת כרטיסים'}
        </span>
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
      </span>
    </a>
  );
}

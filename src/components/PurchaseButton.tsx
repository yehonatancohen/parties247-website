// src/app/events/[slug]/PurchaseButton.tsx
"use client";

import { useState } from "react";
import { trackPartyRedirect } from "@/lib/analytics"; // Adjust path
import { trackPurchaseClick } from "@/lib/metaPixel";

export default function PurchaseButton({
  partyId,
  slug,
  href,
  partyName,
  price
}: {
  partyId: string;
  slug: string;
  href: string;
  partyName?: string;
  price?: number;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Track internal analytics
    trackPartyRedirect(partyId, slug);

    // Fire Meta Pixel event if pixel ID is configured
    if (pixelId) {
      trackPurchaseClick(pixelId, partyName, partyId);
    }

    // Show loading screen if going to go-out
    if (href.includes('go-out.co') || href.includes('go-out.co.il')) {
      e.preventDefault();
      setIsLoading(true);

      // Redirect after a short delay
      setTimeout(() => {
        window.location.href = href;
      }, 1500);
    }
  };

  return (
    <>
      <a
        href={href}
        target={href.includes('go-out') ? "_self" : "_blank"}
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

      {/* Modern Loading Overlay for go-out */}
      {isLoading && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-jungle-deep/80 backdrop-blur-md transition-opacity duration-300" dir="rtl">
          <div className="flex flex-col items-center gap-6 p-8 bg-jungle-surface/90 rounded-2xl border border-jungle-lime/30 shadow-2xl shadow-jungle-lime/20 max-w-sm mx-4 transform animate-in fade-in zoom-in duration-300">
            <div className="relative">
              {/* Spinner */}
              <div className="w-16 h-16 rounded-full border-4 border-jungle-lime/20 border-t-jungle-lime animate-spin"></div>
              {/* Secure Lock Icon inside spinner */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-5 h-5 text-jungle-lime" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </div>

            <div className="flex flex-col gap-2 text-center">
              <h3 className="text-xl font-display text-white font-bold tracking-wide">
                מעביר אותך ל-Go-Out
              </h3>
              <p className="text-jungle-lime/90 font-medium">
                לרכישת כרטיסים מאובטחת...
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

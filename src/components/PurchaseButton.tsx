// src/app/events/[slug]/PurchaseButton.tsx
"use client";

import { useState } from "react";
import { trackPartyRedirect, trackBuyClickWithCoupon, trackWhatsappClick } from "@/lib/analytics";
import { trackPurchaseButtonClick } from "@/lib/gtm";
import { COUPON_CODE } from "@/data/constants";
import { SOCIAL_LINKS } from "@/data/constants";
import { WhatsAppIcon } from "./Icons";

export default function PurchaseButton({
  partyId,
  slug,
  href,
  partyName,
  price,
  soldOut = false,
  couponEligible = false,
}: {
  partyId: string;
  slug: string;
  href: string;
  partyName?: string;
  price?: number;
  soldOut?: boolean;
  /** account1 event — auto-copies the discount code to the clipboard on click. */
  couponEligible?: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [couponCopied, setCouponCopied] = useState(false);

  if (soldOut) {
    return (
      <div className="w-full flex items-center justify-center gap-3 text-center bg-white/5 border border-white/10 text-white/40 font-display text-2xl sm:text-3xl py-4 px-6 rounded-xl tracking-wider cursor-not-allowed select-none">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
        <span>הכרטיסים אזלו</span>
      </div>
    );
  }

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    trackPurchaseButtonClick(partyName, partyId, price);

    if (couponEligible) {
      trackBuyClickWithCoupon(partyId);
      try {
        navigator.clipboard?.writeText(COUPON_CODE).then(() => setCouponCopied(true));
      } catch {
        // Clipboard access denied/unavailable — the visible badge with a manual
        // copy button (DiscountCodeReveal) is still there as a fallback.
      }
    }

    if (href.includes('go-out.co') || href.includes('go-out.co.il')) {
      e.preventDefault();
      setIsLoading(true);
      setTimeout(() => {
        // Fire right before the actual navigation, not at click time, so a
        // "purchase" is only recorded if the user actually stuck around
        // long enough to be redirected (e.g. didn't back out or background
        // the tab during the loading screen).
        trackPartyRedirect(partyId, slug);
        window.location.href = href;
      }, 400);
    } else {
      trackPartyRedirect(partyId, slug);
    }
  };

  return (
    <>
      {couponEligible && (
        <div className="flex items-center justify-center gap-1.5 mb-2 text-xs font-bold text-jungle-lime">
          <span>🎟️</span>
          <span>הנחה עם קוד</span>
        </div>
      )}
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
              {couponEligible && couponCopied && (
                <p className="text-sm text-jungle-lime font-semibold">
                  הקוד {COUPON_CODE} הועתק, הדבק אותו בקופה
                </p>
              )}
            </div>

            <a
              href={SOCIAL_LINKS.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackWhatsappClick('a')}
              className="flex items-center gap-2 text-sm text-green-200/80 hover:text-green-100 transition-colors"
            >
              <WhatsAppIcon className="w-4 h-4" />
              רוצה לשמוע ראשון על ההפקות הבאות?
            </a>
          </div>
        </div>
      )}
    </>
  );
}

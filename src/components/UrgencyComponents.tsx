"use client";

import { useEffect, useState } from "react";
import { trackPartyRedirect, trackBuyClickWithCoupon, trackWhatsappClick } from "@/lib/analytics";
import { trackPurchaseButtonClick } from "@/lib/gtm";
import { COUPON_CODE, SOCIAL_LINKS } from "@/data/constants";
import { TicketIcon, WhatsAppIcon } from "./Icons";
import RedirectOverlay from "./RedirectOverlay";

// --- Sticky Purchase Bar ---
export function StickyPurchaseBar({
    href,
    priceLabel = "מעבר לרכישת כרטיסים →",
    triggerId,
    partyId,
    slug,
    partyName,
    soldOut = false,
    couponEligible = false,
}: {
    href: string;
    priceLabel?: string;
    triggerId?: string;
    partyId: string;
    slug: string;
    partyName?: string;
    soldOut?: boolean;
    couponEligible?: boolean;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [couponCopied, setCouponCopied] = useState(false);

    // `window.location.href = href` navigates the same tab to GoOut, so hitting the
    // browser's back button afterwards restores this page from bfcache — with
    // `isLoading` still frozen `true` from right before the navigation. Without this,
    // the "מעביר אותך ל-Go-Out" overlay is stuck on screen forever after going back.
    useEffect(() => {
        const handlePageShow = (event: PageTransitionEvent) => {
            if (event.persisted) {
                setIsLoading(false);
            }
        };
        window.addEventListener("pageshow", handlePageShow);
        return () => window.removeEventListener("pageshow", handlePageShow);
    }, []);

    useEffect(() => {
        // If no trigger ID, fall back to scroll position
        if (!triggerId) {
            const handleScroll = () => {
                setIsVisible(window.scrollY > 300);
            };
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }

        const triggerElement = document.getElementById(triggerId);
        if (!triggerElement) {
            // Fallback if element not found yet
            const handleScroll = () => {
                setIsVisible(window.scrollY > 300);
            };
            window.addEventListener("scroll", handleScroll);
            return () => window.removeEventListener("scroll", handleScroll);
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                // If the trigger element (the main button) is NOT intersecting (visible), show the sticky bar
                setIsVisible(!entry.isIntersecting);
            },
            {
                threshold: 0,
                rootMargin: "0px"
            }
        );

        observer.observe(triggerElement);

        return () => {
            if (triggerElement) observer.unobserve(triggerElement);
        };
    }, [triggerId]);

    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        // Fire GTM event
        trackPurchaseButtonClick(partyName, partyId);

        if (couponEligible) {
            trackBuyClickWithCoupon(partyId);
            try {
                navigator.clipboard?.writeText(COUPON_CODE).then(() => setCouponCopied(true));
            } catch {
                // Fails open — the visible coupon UI elsewhere on the page still works.
            }
        }

        // Show loading screen if going to go-out
        if (href.includes('go-out.co') || href.includes('go-out.co.il')) {
            e.preventDefault();
            setIsLoading(true);

            // Redirect after a short delay. Track the internal "purchase"
            // event here, right before the real navigation, not at click
            // time - so it's only recorded if the user actually stuck
            // around long enough to be redirected.
            setTimeout(() => {
                trackPartyRedirect(partyId, slug);
                window.location.href = href;
            }, 400);
        } else {
            trackPartyRedirect(partyId, slug);
        }
    };

    if (!isVisible && !isLoading) return null;

    return (
        <>
            {isVisible && (
                <div className="font-apple fixed inset-x-0 bottom-0 z-50 border-t border-hairline bg-stage/85 p-3 pb-5 backdrop-blur-xl backdrop-saturate-150 animate-slide-up sm:p-4">
                    <div className="mx-auto flex max-w-[1024px] items-center justify-between gap-4 sm:px-2">
                        <div className="hidden sm:block">
                            <p className="text-[17px] font-semibold text-ink">{partyName ?? 'שריינו מקום'}</p>
                            <p className="text-[13px] text-ink-3">
                                {couponEligible ? 'הנחה עם קוד בקופה · מעבר לאתר המכירה הרשמי' : 'מעבר לאתר המכירה הרשמי'}
                            </p>
                        </div>
                        {soldOut ? (
                            <div className="flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-full bg-tile-raised px-8 py-3 text-center text-[17px] font-semibold text-ink-3 sm:flex-none">
                                <TicketIcon className="w-5 h-5" />
                                הכרטיסים אזלו
                            </div>
                        ) : (
                            <a
                                href={href}
                                target={href.includes('go-out') ? "_self" : "_blank"}
                                rel="nofollow noreferrer"
                                onClick={handleClick}
                                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-action px-8 py-3 text-center text-[17px] font-semibold text-on-action transition-colors hover:bg-action-hover active:scale-[0.99] sm:flex-none"
                            >
                                <TicketIcon className="w-5 h-5" />
                                {priceLabel}
                            </a>
                        )}
                    </div>
                </div>
            )}

            {/* Modern Loading Overlay for go-out */}
            {isLoading && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-stage/80 backdrop-blur-md transition-opacity duration-300" dir="rtl">
                    <div className="mx-4 flex max-w-sm flex-col items-center gap-6 rounded-[28px] border border-hairline bg-tile p-8 shadow-[0_24px_60px_rgba(0,0,0,0.5)]">
                        <div className="relative">
                            {/* Spinner */}
                            <div className="w-16 h-16 rounded-full border-[3px] border-hairline border-t-action animate-spin"></div>
                            {/* Secure Lock Icon inside spinner */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="w-5 h-5 text-action" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 text-center">
                            <h3 className="text-[21px] font-semibold text-ink">
                                מעביר אותך ל-Go-Out
                            </h3>
                            <p className="text-ink-2">
                                לרכישת כרטיסים מאובטחת...
                            </p>
                            {couponEligible && couponCopied && (
                                <p className="text-[14px] font-semibold text-link">
                                    הקוד {COUPON_CODE} הועתק, הדבק אותו בקופה
                                </p>
                            )}
                        </div>

                        <a
                            href={SOCIAL_LINKS.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackWhatsappClick('a')}
                            className="flex items-center gap-2 text-[14px] text-ink-3 transition-colors hover:text-ink"
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


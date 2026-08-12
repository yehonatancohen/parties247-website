"use client";

import { useEffect, useState } from "react";
import { trackPartyRedirect } from "@/lib/analytics";
import { trackPurchaseButtonClick } from "@/lib/gtm";
import { TicketIcon } from "./Icons";
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
}: {
    href: string;
    priceLabel?: string;
    triggerId?: string;
    partyId: string;
    slug: string;
    partyName?: string;
    soldOut?: boolean;
}) {
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
                <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0c1713]/95 backdrop-blur border-t border-white/10 p-4 pb-6 sm:pb-4 shadow-2xl animate-slide-up">
                    <div className="container mx-auto flex items-center justify-between gap-4">
                        <div className="hidden sm:block">
                            <p className="text-white font-bold text-lg">שריינו מקום עכשיו</p>
                            <p className="text-sm text-gray-400">הכרטיסים נחטפים מהר!</p>
                        </div>
                        {soldOut ? (
                            <div className="flex-1 sm:flex-none bg-white/5 border border-white/10 text-white/40 font-bold text-lg py-3 px-8 rounded-xl text-center flex items-center justify-center gap-2 cursor-not-allowed">
                                <TicketIcon className="w-5 h-5" />
                                הכרטיסים אזלו
                            </div>
                        ) : (
                            <a
                                href={href}
                                target={href.includes('go-out') ? "_self" : "_blank"}
                                rel="nofollow noreferrer"
                                onClick={handleClick}
                                className="flex-1 sm:flex-none bg-gradient-to-r from-jungle-lime to-jungle-accent hover:from-jungle-lime/80 hover:to-jungle-accent/80 text-jungle-deep font-bold text-lg py-3 px-8 rounded-xl shadow-lg shadow-lime-900/20 transition transform hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-2"
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


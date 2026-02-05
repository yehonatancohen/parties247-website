"use client";

import { useEffect, useState } from "react";
import { trackPartyRedirect } from "@/lib/analytics";
import { FireIcon, TicketIcon } from "./Icons";

// --- Fake Data for Purchasing Proof ---
const NAMES = ["איתי", "נועה", "דניאל", "עומר", "רוני", "מאיה", "גיא", "תומר", "יובל", "עדי", "שחר", "גל", "ניב", "טל", "ליאור", "סתיו"];
const TIMES = ["לפני דקה", "לפני 2 דקות", "לפני 5 דקות", "לפני 12 דקות", "ממש עכשיו", "לפני חצי שעה"];

// --- 1. People Watching Badge ---
export function PeopleWatching({ min = 12, max = 80 }: { min?: number; max?: number }) {
    const [count, setCount] = useState<number | null>(null);

    useEffect(() => {
        // Deterministic random based on hour so it doesn't flicker too much, or just random on mount
        const seed = Math.floor(Math.random() * (max - min) + min);
        setCount(seed);
    }, [min, max]);

    if (!count) return null;

    return (
        <div className="inline-flex items-center gap-1.5 text-sm font-bold text-red-300 animate-pulse bg-red-900/20 px-3 py-1 rounded-full border border-red-500/30">
            <div className="w-2 h-2 bg-red-500 rounded-full" />
            {count} אנשים צופים באירוע זה כרגע
        </div>
    );
}

// --- 2. Recent Purchase Toast ---
export function RecentPurchaseToast() {
    const [visible, setVisible] = useState(false);
    const [data, setData] = useState<{ name: string; time: string } | null>(null);

    useEffect(() => {
        // Show first toast after 3-8 seconds
        const initialDelay = Math.random() * 5000 + 3000;

        const showToast = () => {
            const name = NAMES[Math.floor(Math.random() * NAMES.length)];
            const time = TIMES[Math.floor(Math.random() * TIMES.length)];
            setData({ name, time });
            setVisible(true);

            // Hide after 8 seconds
            setTimeout(() => setVisible(false), 8000);
        };

        const timeout = setTimeout(() => {
            showToast();
            // Maybe loop? The user said "add 'Itay bought...', somewhere random". 
            // A loop might be too aggressive. Let's do it once or twice.

            // Let's set an interval to show occasionally
            const interval = setInterval(() => {
                if (Math.random() > 0.5) showToast();
            }, 20000); // Check every 20s

            return () => clearInterval(interval);

        }, initialDelay);

        return () => clearTimeout(timeout);
    }, []);

    if (!visible || !data) return null;

    return (
        <div className="fixed bottom-24 left-4 z-40 bg-gray-900/90 backdrop-blur border border-lime-500/30 p-3 rounded-lg shadow-xl flex items-center gap-3 animate-slide-up text-right rtl-direction max-w-[250px]">
            <div className="bg-lime-500/20 p-2 rounded-full text-lime-400">
                <TicketIcon className="w-5 h-5" />
            </div>
            <div>
                <p className="text-white text-sm font-bold">{data.name} רכש/ה כרטיס</p>
                <p className="text-gray-400 text-xs">{data.time}</p>
            </div>
        </div>
    );
}

// --- 3. Sticky Purchase Bar ---
// --- 3. Sticky Purchase Bar ---
export function StickyPurchaseBar({
    href,
    priceLabel = "לרכישת כרטיסים",
    triggerId,
    partyId,
    slug
}: {
    href: string;
    priceLabel?: string;
    triggerId?: string;
    partyId: string;
    slug: string;
}) {
    const [isVisible, setIsVisible] = useState(false);

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

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0c1713]/95 backdrop-blur border-t border-white/10 p-4 pb-6 sm:pb-4 shadow-2xl animate-slide-up">
            <div className="container mx-auto flex items-center justify-between gap-4">
                <div className="hidden sm:block">
                    <p className="text-white font-bold text-lg">שריינו מקום עכשיו</p>
                    <p className="text-sm text-gray-400">הכרטיסים נחטפים מהר!</p>
                </div>
                <a
                    href={href}
                    target="_blank"
                    rel="nofollow noreferrer"
                    onClick={() => trackPartyRedirect(partyId, slug)}
                    className="flex-1 sm:flex-none bg-gradient-to-r from-jungle-lime to-jungle-accent hover:from-jungle-lime/80 hover:to-jungle-accent/80 text-jungle-deep font-bold text-lg py-3 px-8 rounded-xl shadow-lg shadow-lime-900/20 transition transform hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-2"
                >
                    <TicketIcon className="w-5 h-5" />
                    {priceLabel}
                </a>
            </div>
        </div>
    );
}

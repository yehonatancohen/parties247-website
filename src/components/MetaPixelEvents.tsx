"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

// Global Main Pixel ID provided by user
export const GLOBAL_PIXEL_ID = "855037240866987";

export default function MetaPixelEvents() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFirstRun = useRef(true);

    useEffect(() => {
        // Skip the first run because the Script tag in layout.tsx handles the initial PageView
        if (isFirstRun.current) {
            isFirstRun.current = false;
            return;
        }

        // Track pageview on subsequent route changes
        if (typeof window !== "undefined" && window.fbq) {
            window.fbq("track", "PageView");
        }
    }, [pathname, searchParams]);

    return null;
}

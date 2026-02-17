"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { GLOBAL_PIXEL_ID } from "../data/constants";
import { initializeMetaPixel, trackPageView } from "../lib/metaPixel";

export default function GlobalPixelTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isFirstRun = useRef(true);

    useEffect(() => {
        if (!GLOBAL_PIXEL_ID) return;

        // Initialize the global pixel
        initializeMetaPixel(GLOBAL_PIXEL_ID);

        // Track initial PageView (if not already handled by SSR/Script but since we moved logic here, we do it)
        // Actually, for SPA, we want to track pageview on mount AND on route change.
        // But usually Next.js handles the first one. 
        // For safety/consistency with the new approach, we trigger PageView validation.

        if (isFirstRun.current) {
            isFirstRun.current = false;
            trackPageView(GLOBAL_PIXEL_ID);
            return;
        }

        trackPageView(GLOBAL_PIXEL_ID);
    }, [pathname, searchParams]);

    return null;
}

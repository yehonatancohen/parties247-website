"use client";

import React, { useEffect, useRef } from "react";
import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";

import { GLOBAL_PIXEL_ID } from "@/data/constants";

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

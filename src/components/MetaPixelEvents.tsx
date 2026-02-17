"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { GLOBAL_PIXEL_ID } from "@/data/constants";
import { trackPageView } from "@/lib/metaPixel";

function MetaPixelEventsContent() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!GLOBAL_PIXEL_ID) return;
        // Track page view on route changes for global pixel
        // Note: GlobalPixelTracker handles this now via useEffect on pathname. 
        // If we keep logic in GlobalPixelTracker, this component might be redundant OR
        // we should consolidate. 
        //
        // DECISION: GlobalPixelTracker sits in RootLayout and handles observing pathname changes
        // creating a separate component just for "events" is redundant if GlobalPixelTracker
        // is already a client component observing pathname.
        // 
        // However, to strictly follow the plan: I will make this a no-op or simple return null 
        // since GlobalPixelTracker now handles the SPA tracking logic.

    }, [pathname, searchParams]);

    return null;
}

export default function MetaPixelEvents() {
    return (
        <Suspense fallback={null}>
            <MetaPixelEventsContent />
        </Suspense>
    );
}

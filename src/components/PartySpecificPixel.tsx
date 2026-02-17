"use client";

import React, { useEffect } from "react";
import { initializeMetaPixel, trackPageView } from "@/lib/metaPixel";

/**
 * Renders the Meta Pixel code for a specific party.
 * This is conditionally rendered only if the party has a pixelId.
 */
export default function PartySpecificPixel({ pixelId }: { pixelId?: string }) {
    useEffect(() => {
        if (!pixelId) return;

        // Initialize this specific party pixel
        initializeMetaPixel(pixelId);

        // Track PageView for this specific pixel
        trackPageView(pixelId);
    }, [pixelId]);

    return null;
}

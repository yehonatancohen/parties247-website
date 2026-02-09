/**
 * Meta Pixel utility functions for tracking conversions
 * This module provides functions to dynamically load and track events
 * with Meta (Facebook) Pixel for specific party purchase conversions.
 */

// Type declaration for fbq function
declare global {
    interface Window {
        fbq?: (...args: any[]) => void;
        _fbq?: (...args: any[]) => void;
    }
}

// Track which pixels have been initialized to avoid duplicates
const initializedPixels = new Set<string>();

/**
 * Initializes a Meta Pixel with the given ID if not already initialized.
 * This dynamically loads the Facebook Pixel script and initializes tracking.
 * 
 * @param pixelId - The Meta Pixel ID to initialize
 */
export function initializeMetaPixel(pixelId: string): void {
    if (!pixelId || typeof window === 'undefined') return;

    // Skip if already initialized
    if (initializedPixels.has(pixelId)) return;

    // Initialize fbq if not already present
    if (!window.fbq) {
        const n = (window.fbq = function (...args: any[]) {
            // @ts-ignore
            n.callMethod ? n.callMethod.apply(n, args) : n.queue.push(args);
        }) as any;

        if (!window._fbq) window._fbq = n;
        n.push = n;
        n.loaded = true;
        n.version = '2.0';
        n.queue = [];
    }

    // Initialize this specific pixel
    window.fbq('init', pixelId);

    // Load the pixel script if not already loaded
    if (!document.querySelector('script[src*="connect.facebook.net/en_US/fbevents.js"]')) {
        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.head.appendChild(script);
    }

    initializedPixels.add(pixelId);
}

/**
 * Tracks a Purchase/InitiateCheckout event with Meta Pixel.
 * Call this when a user clicks on a purchase button.
 * 
 * @param pixelId - The Meta Pixel ID to track with
 * @param partyName - Optional party name for content identification
 * @param partyId - Optional party ID for content identification
 */
export function trackPurchaseClick(
    pixelId: string,
    partyName?: string,
    partyId?: string
): void {
    if (!pixelId || typeof window === 'undefined') return;

    // Ensure pixel is initialized FIRST
    initializeMetaPixel(pixelId);

    // Now check if fbq exists (it should after init)
    if (!window.fbq) {
        console.warn('Meta Pixel: fbq not available after initialization');
        return;
    }

    // Track the InitiateCheckout event (user clicked to purchase)
    window.fbq('trackSingle', pixelId, 'InitiateCheckout', {
        content_name: partyName || 'Party Ticket',
        content_ids: partyId ? [partyId] : undefined,
        content_type: 'product',
        currency: 'ILS',
    });
}

/**
 * Tracks a page view event for a specific pixel
 * 
 * @param pixelId - The Meta Pixel ID to track with
 */
export function trackPageView(pixelId: string): void {
    if (!pixelId || typeof window === 'undefined' || !window.fbq) return;

    initializeMetaPixel(pixelId);
    window.fbq('trackSingle', pixelId, 'PageView');
}

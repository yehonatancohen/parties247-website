"use client";
import { useEffect, useRef } from "react";
import { initializeAnalytics, ensureSessionId } from "../lib/analytics";

const SESSION_STORAGE_KEY = "parties247.analytics.sessionId";

const AnalyticsTracker = () => {
    const isInitialized = useRef(false);

    useEffect(() => {
        if (isInitialized.current) return;

        try {
            // Ensure a session ID exists first
            let sessionId: string | null = null;
            try {
                sessionId = localStorage.getItem(SESSION_STORAGE_KEY);
            } catch {
                // SSR or restricted access
            }

            if (!sessionId) {
                sessionId = ensureSessionId();
                try {
                    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
                } catch {
                    // SSR or restricted access
                }
            }

            // Initialize analytics — this handles visitor recording with enriched data
            initializeAnalytics();
            isInitialized.current = true;
        } catch (error) {
            console.error('Analytics error:', error);
        }
    }, []);

    return null;
};

export default AnalyticsTracker;

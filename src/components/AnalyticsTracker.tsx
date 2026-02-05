"use client";

import { useEffect, useRef } from 'react';
import { recordVisitor } from '../services/api';

const SESSION_STORAGE_KEY = 'parties247_session_id';

const AnalyticsTracker = () => {
    const isInitialized = useRef(false);

    useEffect(() => {
        // Prevent double execution in strict mode or re-renders
        if (isInitialized.current) return;

        const trackVisitor = async () => {
            try {
                let sessionId = localStorage.getItem(SESSION_STORAGE_KEY);

                if (!sessionId) {
                    sessionId = crypto.randomUUID();
                    localStorage.setItem(SESSION_STORAGE_KEY, sessionId);
                }

                await recordVisitor(sessionId);
                isInitialized.current = true;
            } catch (error) {
                console.error('Analytics error:', error);
            }
        };

        trackVisitor();
    }, []);

    return null;
};

export default AnalyticsTracker;

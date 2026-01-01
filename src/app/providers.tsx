"use client";

import React, { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { PartyProvider } from '../hooks/useParties';
import { ANALYTICS_CONSENT_EVENT, initializeAnalytics } from '../lib/analytics';

export default function Providers({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    useEffect(() => {
        initializeAnalytics();
    }, [pathname]);

    useEffect(() => {
        const handleConsent = () => {
        initializeAnalytics();
        };

        window.addEventListener(ANALYTICS_CONSENT_EVENT, handleConsent);
        return () => {
        window.removeEventListener(ANALYTICS_CONSENT_EVENT, handleConsent);
        };
    }, []);

    return <PartyProvider>{children}</PartyProvider>;
}
"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { grantAnalyticsConsent, hasAnalyticsConsent, initializeAnalytics } from '../lib/analytics';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!hasAnalyticsConsent()) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    setIsVisible(false);
    grantAnalyticsConsent();
    initializeAnalytics();
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-jungle-surface/95 backdrop-blur-md p-5 z-[99] text-white border-t-2 border-jungle-lime/30 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]" dir="rtl">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-6 max-w-5xl">
        <p className="text-base text-jungle-text/90 text-center sm:text-right leading-relaxed flex-1">
          אנחנו משתמשים בעוגיות (cookies) כדי לשפר את חווית הגלישה שלך ולנתח את תנועת הגולשים באתר.
          <Link href="/privacy" className="text-jungle-lime hover:text-white transition-colors underline underline-offset-4 mr-2 font-medium">למדיניות הפרטיות</Link>
        </p>
        <button
          onClick={handleAccept}
          className="bg-jungle-lime text-jungle-deep font-bold py-3 px-10 text-lg rounded-xl shadow-lg shadow-jungle-lime/20 hover:scale-[1.05] active:scale-[0.95] flex items-center justify-center gap-2 transition-all flex-shrink-0 w-full sm:w-auto overflow-hidden relative group"
        >
          <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] skew-x-12"></span>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          <span className="relative z-10">אישור והמשך</span>
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
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
    <div className="fixed bottom-0 left-0 right-0 bg-jungle-surface/90 backdrop-blur-sm p-4 z-[99] text-white border-t-2 border-wood-brown/50" dir="rtl">
      <div className="container mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-jungle-text/80 text-center sm:text-right">
          אנחנו משתמשים בעוגיות (cookies) כדי לשפר את חווית הגלישה שלך ולנתח את תנועת הגולשים באתר.
          <Link href="/privacy" className="text-jungle-accent hover:underline mr-1">למדיניות הפרטיות</Link>
        </p>
        <button 
          onClick={handleAccept}
          className="bg-jungle-lime text-jungle-deep font-bold py-2 px-6 rounded-md hover:bg-opacity-80 transition-colors flex-shrink-0"
        >
          הבנתי
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
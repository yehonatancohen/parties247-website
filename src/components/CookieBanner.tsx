"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link'
import { grantAnalyticsConsent, hasAnalyticsConsent, initializeAnalytics, isAdminUser } from '../lib/analytics';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isAdminUser() && !hasAnalyticsConsent()) {
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
    <div
      role="region"
      aria-label="הודעת עוגיות"
      className="font-apple fixed inset-x-3 bottom-3 z-[99] mx-auto max-w-[680px] rounded-[18px] border border-hairline bg-tile/95 px-5 py-4 text-ink shadow-[0_12px_40px_rgba(0,0,0,0.5)] backdrop-blur-xl sm:bottom-5"
      dir="rtl"
    >
      <div className="flex flex-col items-center gap-3 sm:flex-row sm:gap-5">
        <p className="flex-1 text-center text-[13px] leading-relaxed text-ink-2 sm:text-right">
          אנחנו משתמשים בעוגיות (cookies) כדי לשפר את חווית הגלישה ולנתח את תנועת הגולשים באתר.{' '}
          <Link href="/privacy" className="whitespace-nowrap text-link hover:underline underline-offset-2">
            למדיניות הפרטיות
          </Link>
        </p>
        <button
          type="button"
          onClick={handleAccept}
          className="w-full shrink-0 rounded-full bg-action px-6 py-2 text-[14px] font-medium text-on-action transition-colors hover:bg-action-hover sm:w-auto"
        >
          אישור
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
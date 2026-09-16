'use client';
import React, { useState } from 'react';
import { COUPON_CODE } from '@/data/constants';
import { trackCouponCopy } from '@/lib/analytics';

interface DiscountCodeRevealProps {
  couponCode?: string;
  variant?: 'compact' | 'expanded';
  className?: string;
  /** When given, a successful copy fires the `coupon_copy` Clarity event for this party. */
  partyId?: string;
}

const DiscountCodeReveal: React.FC<DiscountCodeRevealProps> = ({
  couponCode = COUPON_CODE,
  variant = 'compact',
  className,
  partyId,
}) => {
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);

  const containerClassName = className ? `${className}` : undefined;

  const handleReveal = () => {
    setRevealed(true);
    setCopied(false);
  };

  const handleCopy = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(couponCode);
      } else if (typeof document !== 'undefined') {
        const textarea = document.createElement('textarea');
        textarea.value = couponCode;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      } else {
        throw new Error('Clipboard API not available');
      }
      setCopied(true);
      if (partyId) trackCouponCopy(partyId);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy coupon code', error);
      setCopied(false);
    }
  };

  if (!revealed) {
    const buttonClass =
      variant === 'expanded'
        ? 'w-full rounded-full border border-action/50 py-4 px-6 text-[18px] font-semibold text-link transition-colors hover:bg-action/10'
        : 'w-full py-1 text-[14px] font-medium text-link transition-colors hover:underline underline-offset-4';

    return (
      <div className={containerClassName}>
        <button type="button" onClick={handleReveal} className={buttonClass}>
          {variant === 'expanded' ? 'הצגת קוד הנחה למסיבה' : 'הצגת קוד הנחה'}
        </button>
      </div>
    );
  }

  if (variant === 'expanded') {
    return (
      <div className={containerClassName}>
        <div className="rounded-[22px] bg-tile p-5 text-center">
          <p className="mb-3 text-[14px] text-ink-2">
            לחצו על הקופון כדי להעתיק ולהשתמש ברכישת הכרטיסים
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="w-full rounded-[16px] bg-action py-3 px-4 text-on-action transition-colors hover:bg-action-hover"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="text-[24px] font-bold tracking-[0.12em]" dir="ltr">{couponCode}</span>
              <span className="text-sm font-semibold">{copied ? 'הקופון הועתק!' : 'העתיקו בלחיצה'}</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <div className="rounded-[16px] bg-tile px-3 py-2.5 text-center text-[14px] text-ink">
        <p className="mb-1.5 text-[13px] font-semibold text-ink-2">קוד ההנחה שלנו</p>
        <button
          type="button"
          onClick={handleCopy}
          className="w-full rounded-full bg-action py-2 text-[16px] font-bold tracking-[0.08em] text-on-action transition-colors hover:bg-action-hover"
        >
          {couponCode}
        </button>
        <p className="mt-1.5 text-[12px] text-ink-3">{copied ? 'הקופון הועתק!' : 'העתיקו בלחיצה אחת'}</p>
      </div>
    </div>
  );
};

export default DiscountCodeReveal;

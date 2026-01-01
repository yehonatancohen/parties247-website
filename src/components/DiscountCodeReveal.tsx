'use client';
import React, { useState } from 'react';

interface DiscountCodeRevealProps {
  couponCode?: string;
  variant?: 'compact' | 'expanded';
  className?: string;
}

const DiscountCodeReveal: React.FC<DiscountCodeRevealProps> = ({
  couponCode = 'parties24.7',
  variant = 'compact',
  className,
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
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy coupon code', error);
      setCopied(false);
    }
  };

  if (!revealed) {
    const buttonClass =
      variant === 'expanded'
        ? 'w-full rounded-xl border border-jungle-accent/60 bg-gradient-to-r from-jungle-lime/80 to-jungle-accent/80 py-4 px-6 text-2xl font-display text-jungle-deep shadow-lg transition-transform hover:-translate-y-1'
        : 'w-full rounded-lg border border-jungle-accent/60 bg-jungle-surface/70 py-2.5 px-3 text-sm font-semibold text-jungle-accent transition-transform hover:-translate-y-0.5 hover:bg-jungle-surface/90';

    return (
      <div className={containerClassName}>
        <button type="button" onClick={handleReveal} className={buttonClass}>
          {variant === 'expanded' ? '🔥 חשפו קופון למסיבה' : '🎉 הצג קוד הנחה'}
        </button>
      </div>
    );
  }

  if (variant === 'expanded') {
    return (
      <div className={containerClassName}>
        <div className="rounded-2xl border border-jungle-accent/60 bg-jungle-surface/80 p-5 text-center shadow-lg">
          <p className="mb-3 text-sm text-jungle-text/80">
            לחצו על הקופון כדי להעתיק ולהשתמש ברכישת הכרטיסים
          </p>
          <button
            type="button"
            onClick={handleCopy}
            className="w-full rounded-xl bg-gradient-to-r from-jungle-accent to-jungle-lime py-3 px-4 text-jungle-deep transition-transform hover:scale-[1.02]"
          >
            <div className="flex flex-col items-center gap-1">
              <span className="font-mono text-2xl tracking-[0.3em]">{couponCode}</span>
              <span className="text-sm font-semibold">{copied ? 'הקופון הועתק!' : 'העתיקו בלחיצה'}</span>
            </div>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <div className="rounded-lg border border-jungle-accent/40 bg-jungle-surface/70 px-3 py-2 text-center text-sm text-jungle-text">
        <p className="mb-1 font-semibold text-jungle-accent">קוד ההנחה שלנו</p>
        <button
          type="button"
          onClick={handleCopy}
          className="w-full rounded-md bg-gradient-to-r from-jungle-accent/80 to-jungle-lime/80 py-2 text-base font-mono tracking-[0.3em] text-jungle-deep transition-transform hover:scale-[1.01]"
        >
          {couponCode}
        </button>
        <p className="mt-1 text-xs text-jungle-text/70">{copied ? 'הקופון הועתק!' : 'העתיקו בלחיצה אחת'}</p>
      </div>
    </div>
  );
};

export default DiscountCodeReveal;

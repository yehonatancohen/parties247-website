'use client';

import React from 'react';

interface FlyerToPurchaseLinkProps {
  ariaLabel: string;
  className?: string;
  children: React.ReactNode;
}

// Wraps the event flyer: tapping it smooth-scrolls to the purchase CTA and
// briefly glows it, instead of the old dead pointer-events-none image.
const FlyerToPurchaseLink: React.FC<FlyerToPurchaseLinkProps> = ({ ariaLabel, className, children }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById('main-purchase-button');
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('animate-pulse-glow', 'ring-2', 'ring-jungle-lime/70');
    window.setTimeout(() => {
      target.classList.remove('animate-pulse-glow', 'ring-2', 'ring-jungle-lime/70');
    }, 1600);
  };

  return (
    <a href="#main-purchase-button" aria-label={ariaLabel} className={className} onClick={handleClick}>
      {children}
    </a>
  );
};

export default FlyerToPurchaseLink;

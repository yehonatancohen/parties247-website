'use client';

import React from 'react';

interface FlyerToRelatedLinkProps {
  ariaLabel: string;
  className?: string;
  targetId: string;
  children: React.ReactNode;
}

// Archive-page counterpart to FlyerToPurchaseLink: tapping the flyer of a
// past event has nothing to purchase, so instead it smooth-scrolls to the
// "upcoming related events" section — routes the same tap-intent forward
// instead of leaving it as a dead click (was the top dead-click offender
// in Clarity, since the image had no handler at all).
const FlyerToRelatedLink: React.FC<FlyerToRelatedLinkProps> = ({ ariaLabel, className, targetId, children }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const target = document.getElementById(targetId);
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.classList.add('animate-pulse-glow', 'ring-2', 'ring-jungle-lime/70');
    window.setTimeout(() => {
      target.classList.remove('animate-pulse-glow', 'ring-2', 'ring-jungle-lime/70');
    }, 1600);
  };

  return (
    <a href={`#${targetId}`} aria-label={ariaLabel} className={className} onClick={handleClick}>
      {children}
    </a>
  );
};

export default FlyerToRelatedLink;

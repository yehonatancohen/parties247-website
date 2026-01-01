// src/app/events/[slug]/PurchaseButton.tsx
"use client";

import { LeafIcon } from "@/components/Icons"; // Adjust path to your icons
import { trackPartyRedirect } from "@/lib/analytics"; // Adjust path

export default function PurchaseButton({ 
  partyId, 
  slug, 
  href 
}: { 
  partyId: string; 
  slug: string; 
  href: string 
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => trackPartyRedirect(partyId, slug)}
      className="w-full flex items-center justify-center gap-3 text-center bg-gradient-to-r from-jungle-lime to-jungle-accent hover:from-jungle-lime/80 hover:to-jungle-accent/80 text-jungle-deep font-display text-3xl py-4 px-6 rounded-lg transition-transform hover:scale-105 tracking-wider"
    >
      <span>לרכישת כרטיסים</span>
      <LeafIcon className="w-6 h-6" />
    </a>
  );
}
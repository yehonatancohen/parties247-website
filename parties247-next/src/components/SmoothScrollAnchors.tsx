"use client";

import { useEffect } from "react";

interface SmoothScrollAnchorsProps {
  selector?: string;
}

export default function SmoothScrollAnchors({ selector = "a[href^='#']" }: SmoothScrollAnchorsProps) {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest<HTMLAnchorElement>(selector);

      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const destination = document.querySelector(href);
      if (!destination) return;

      event.preventDefault();
      destination.scrollIntoView({ behavior: "smooth", block: "start" });

      const normalizedHash = href === "#" ? "" : href;
      if (normalizedHash && typeof window !== "undefined" && window.history?.replaceState) {
        window.history.replaceState(null, "", normalizedHash);
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [selector]);

  return null;
}

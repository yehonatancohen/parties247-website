"use client";

import { useEffect } from "react";

export default function RedirectOverlay({
  isOpen,
  href,
}: {
  isOpen: boolean;
  href: string;
}) {
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      window.open(href, "_blank", "noopener,noreferrer");
    }, 1800);

    return () => clearTimeout(timer);
  }, [isOpen, href]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm">
      <div className="flex flex-col items-center gap-6 text-center px-6">
        {/* Spinner */}
        <div className="w-14 h-14 border-4 border-jungle-lime/30 border-t-jungle-lime rounded-full animate-spin" />
        <p className="text-white text-xl sm:text-2xl font-display tracking-wide" dir="rtl">
          מעביר אותך לעמוד הרכישה המאובטח של Go-Out...
        </p>
      </div>
    </div>
  );
}

"use client";

import { useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@/components/Icons";

interface BackButtonProps {
  fallbackHref?: string;
  label?: string;
  className?: string;
}

/**
 * Lightweight back button that prefers the browser history and
 * falls back to a provided href when history is unavailable.
 */
export default function BackButton({
  fallbackHref = "/",
  label = "חזרה",
  className = "",
}: BackButtonProps) {
  const router = useRouter();

  const handleClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.push(fallbackHref);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm font-semibold text-white transition hover:border-jungle-accent hover:bg-white/10 ${className}`}
    >
      <ArrowLeftIcon className="h-4 w-4" />
      <span>{label}</span>
    </button>
  );
}

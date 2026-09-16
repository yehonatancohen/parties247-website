'use client';

import { useEffect, useState } from 'react';
import { WhatsAppIcon } from './Icons';
import { SOCIAL_LINKS } from '@/data/constants';
import { trackWhatsappClick } from '@/lib/analytics';

const DISMISS_UNTIL_KEY = 'parties247.whatsappNudge.dismissedUntil';
const JOINED_KEY = 'parties247.whatsappNudge.joined';
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

interface WhatsappNudgeProps {
  /** b = quiet footer block on event/holiday pages, c = holiday page empty state. */
  source: 'b' | 'c';
  message?: string;
  className?: string;
}

/**
 * Low-intrusion WhatsApp group nudge — never a popup or a floating button, only
 * rendered inline at the specific spots the user asked for. Dismissing it hides
 * it for 30 days (localStorage, try/catch — per-viewer convenience, not state
 * we need to read back); actually joining hides it permanently on this device.
 */
export default function WhatsappNudge({ source, message, className }: WhatsappNudgeProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (window.localStorage.getItem(JOINED_KEY) === 'true') return;
      const until = Number(window.localStorage.getItem(DISMISS_UNTIL_KEY) || '0');
      if (Date.now() < until) return;
    } catch {
      // Storage unavailable (private mode, blocked, etc.) — fail open and show it.
    }
    setVisible(true);
  }, []);

  if (!visible) return null;

  const handleJoin = () => {
    trackWhatsappClick(source);
    try {
      window.localStorage.setItem(JOINED_KEY, 'true');
    } catch {
      // Best-effort only.
    }
  };

  const handleDismiss = () => {
    try {
      window.localStorage.setItem(DISMISS_UNTIL_KEY, String(Date.now() + THIRTY_DAYS_MS));
    } catch {
      // Best-effort only.
    }
    setVisible(false);
  };

  return (
    <div
      dir="rtl"
      className={`relative flex items-center gap-3 rounded-2xl border border-green-400/25 bg-green-500/5 p-4 md:p-5 ${className ?? ''}`}
    >
      <WhatsAppIcon className="w-6 h-6 text-green-400 flex-shrink-0" />
      <p className="flex-1 min-w-0 text-sm text-green-100/90">
        {message ?? 'רוצים לשמוע ראשונים על הפקות חדשות? הצטרפו לקבוצת הוואטסאפ שלנו.'}
      </p>
      <a
        href={SOCIAL_LINKS.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleJoin}
        className="flex-shrink-0 rounded-lg border border-green-400/40 bg-green-500/20 px-3 py-1.5 text-sm font-bold text-green-100 transition-colors hover:bg-green-500/30"
      >
        הצטרפות
      </a>
      <button
        type="button"
        onClick={handleDismiss}
        aria-label="סגירה"
        className="flex-shrink-0 px-1 text-lg leading-none text-green-100/50 transition-colors hover:text-green-100"
      >
        ×
      </button>
    </div>
  );
}

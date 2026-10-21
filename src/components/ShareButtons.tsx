'use client';
import React, { useSyncExternalStore } from 'react';
import { FacebookIcon, ShareIcon, TwitterIcon } from './Icons';

interface ShareButtonsProps {
  partyName: string;
  /** Our own event page (UTM-tagged), never the GoOut link — shares should land on the site. */
  shareUrl: string;
}

/**
 * Secondary share row. WhatsApp is deliberately not here: the event page has one
 * WhatsApp share button (Hebrew text, same page link) and two of them sent
 * different text to different places.
 */
const ShareButtons: React.FC<ShareButtonsProps> = ({ partyName, shareUrl }) => {
  const text = `${partyName} – בא לך?`;
  // false on the server and during hydration, the real answer after.
  const supportsNativeShare = useSyncExternalStore(
    () => () => {},
    () => typeof navigator.share === 'function',
    () => false,
  );

  const platforms = [
    { name: 'פייסבוק', icon: <FacebookIcon className="w-5 h-5" />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'X', icon: <TwitterIcon className="w-5 h-5" />, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}` },
  ];

  const handleNativeShare = async () => {
    try {
      await navigator.share({ title: partyName, text, url: shareUrl });
    } catch {
      // The user closed the share sheet.
    }
  };

  return (
    <div className="flex items-center gap-2">
      <span className="text-[14px] text-ink-3">שתפו</span>
      {platforms.map(platform => (
        <a
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`שיתוף ב${platform.name}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-tile text-ink transition-colors hover:bg-tile-raised"
        >
          {platform.icon}
        </a>
      ))}
      {supportsNativeShare && (
         <button
           onClick={handleNativeShare}
           aria-label="אפשרויות שיתוף נוספות"
           className="flex h-10 w-10 items-center justify-center rounded-full bg-tile text-ink transition-colors hover:bg-tile-raised"
         >
           <ShareIcon className="w-5 h-5" />
         </button>
      )}
    </div>
  );
};

export default ShareButtons;

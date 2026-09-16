import React, { useMemo } from 'react';
import { FacebookIcon, ShareIcon, TwitterIcon, WhatsAppIcon } from './Icons';

interface ShareButtonsProps {
  partyName: string;
  shareUrl: string;
}

const ShareButtons: React.FC<ShareButtonsProps> = ({ partyName, shareUrl }) => {
  const title = `Check out this party: ${partyName}!`;

  const platforms = useMemo(() => ([
    { name: 'WhatsApp', icon: <WhatsAppIcon className="w-5 h-5" />, url: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + shareUrl)}` },
    { name: 'Facebook', icon: <FacebookIcon className="w-5 h-5" />, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'Twitter', icon: <TwitterIcon className="w-5 h-5" />, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title)}` },
  ]), [shareUrl, title]);

  const supportsNativeShare = typeof navigator !== 'undefined' && typeof navigator.share === 'function';

  const handleNativeShare = async () => {
    if (!supportsNativeShare) {
      return;
    }

    try {
      await navigator.share({
        title: partyName,
        text: `Check out this party: ${partyName}`,
        url: shareUrl,
      });
    } catch (error) {
      console.error('Error sharing natively:', error);
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
          aria-label={`Share on ${platform.name}`}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-tile text-ink transition-colors hover:bg-tile-raised"
        >
          {platform.icon}
        </a>
      ))}
      {supportsNativeShare && (
         <button
           onClick={handleNativeShare}
           aria-label="More share options"
           className="flex h-10 w-10 items-center justify-center rounded-full bg-tile text-ink transition-colors hover:bg-tile-raised"
         >
           <ShareIcon className="w-5 h-5" />
         </button>
      )}
    </div>
  );
};

export default ShareButtons;

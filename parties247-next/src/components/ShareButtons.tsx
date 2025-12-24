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
      <span className="text-sm font-semibold text-jungle-text/80">שתפו:</span>
      {platforms.map(platform => (
        <a
          key={platform.name}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Share on ${platform.name}`}
          className="bg-jungle-deep p-2 rounded-full hover:bg-jungle-accent hover:text-jungle-deep transition-colors text-white"
        >
          {platform.icon}
        </a>
      ))}
      {supportsNativeShare && (
         <button
           onClick={handleNativeShare}
           aria-label="More share options"
           className="bg-jungle-deep p-2 rounded-full hover:bg-jungle-accent hover:text-jungle-deep transition-colors text-white"
         >
           <ShareIcon className="w-5 h-5" />
         </button>
      )}
    </div>
  );
};

export default ShareButtons;

import React, { useState, useEffect } from 'react';
import { SOCIAL_LINKS } from '../src/data/constants';
import { InstagramIcon, TikTokIcon, WhatsAppIcon, CloseIcon } from './Icons';

const POPUP_STORAGE_KEY = 'communityPopupDismissed_v2';

const CommunityPopup: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasDismissed = localStorage.getItem(POPUP_STORAGE_KEY);
    if (!hasDismissed) {
      // Delay popup to not be intrusive on page load
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(POPUP_STORAGE_KEY, 'true');
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-[100]" dir="rtl">
      <div className="bg-jungle-surface rounded-xl shadow-lg w-full max-w-md m-4 p-8 text-center relative transform transition-all animate-fade-in-up border-2 border-wood-brown">
        <button onClick={handleClose} className="absolute top-4 left-4 text-jungle-text/70 hover:text-white transition-colors">
          <CloseIcon className="h-6 w-6" />
        </button>
        
        <h2 className="text-4xl font-display mb-2 text-white">הצטרפו לקהילה!</h2>
        <p className="text-lg text-jungle-text/80 mb-6">אל תפספסו אף מסיבה, עדכון או הטבה מיוחדת.</p>
        
        <div className="flex flex-col gap-4">
          <a
            href={SOCIAL_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="flex items-center justify-center gap-2 bg-emerald-500 text-white font-semibold px-6 py-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <WhatsAppIcon className="h-6 w-6" />
            <span>הצטרפו לקהילת הוואטסאפ</span>
          </a>
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold px-6 py-4 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <InstagramIcon className="h-6 w-6" />
            <span>עקבו באינסטגרם</span>
          </a>
          <a
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClose}
            className="flex items-center justify-center gap-2 bg-black text-white font-semibold px-6 py-3 rounded-lg hover:scale-105 transition-transform border border-white/20"
          >
            <TikTokIcon className="h-5 w-5" />
            <span>או בטיקטוק</span>
          </a>
        </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CommunityPopup;

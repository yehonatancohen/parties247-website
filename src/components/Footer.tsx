import React from 'react';
import Link from 'next/link'
import { SOCIAL_LINKS } from '../data/constants';
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-jungle-surface mt-12 text-jungle-text/70 border-t-2 border-wood-brown/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center md:text-right">
          <div>
            <h3 className="font-display text-xl text-white mb-4">מסיבות לפי עיר</h3>
            <ul className="space-y-2">
              <li><Link href="/cities/tel-aviv" className="hover:text-jungle-accent transition-colors">מסיבות בתל אביב</Link></li>
              <li><Link href="/cities/haifa" className="hover:text-jungle-accent transition-colors">מסיבות בחיפה</Link></li>
              <li><Link href="/cities/jerusalem" className="hover:text-jungle-accent transition-colors">מסיבות בירושלים</Link></li>
              <li><Link href="/cities/eilat" className="hover:text-jungle-accent transition-colors">מסיבות באילת</Link></li>
              <li><Link href="/cities/beer-sheva" className="hover:text-jungle-accent transition-colors">מסיבות בבאר שבע</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-xl text-white mb-4">מסיבות לפי סגנון</h3>
            <ul className="space-y-2">
              <li><Link href="/genre/techno-music" className="hover:text-jungle-accent transition-colors">מסיבות טכנו</Link></li>
              <li><Link href="/genre/rave-parties" className="hover:text-jungle-accent transition-colors">רייבים בישראל</Link></li>
              <li><Link href="/genre/trance-music" className="hover:text-jungle-accent transition-colors">מסיבות טראנס</Link></li>
              <li><Link href="/genre/house-music" className="hover:text-jungle-accent transition-colors">מסיבות האוס</Link></li>
              <li><Link href="/genre/mainstream-music" className="hover:text-jungle-accent transition-colors">מסיבות מיינסטרים</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-xl text-white mb-4">מידע ומשפטי</h3>
            <ul className="space-y-2">
              <li><Link href="/terms" className="hover:text-jungle-accent transition-colors">תנאי שימוש</Link></li>
              <li><Link href="/privacy" className="hover:text-jungle-accent transition-colors">מדיניות פרטיות</Link></li>
              <li><Link href="/accessibility" className="hover:text-jungle-accent transition-colors">הצהרת נגישות</Link></li>
              <li><Link href="/promoter-disclaimer" className="hover:text-jungle-accent transition-colors">הבהרה: האתר כמקדמי אירועים</Link></li>
            </ul>
          </div>
          <div className="text-center md:text-right">
             <h3 className="font-display text-xl text-white mb-4">עקבו אחרינו</h3>
             <div className="flex justify-center md:justify-start items-center gap-6">
                <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <InstagramIcon className="h-6 w-6" />
                </a>
                <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <TikTokIcon className="h-6 w-6" />
                </a>
                <a href={SOCIAL_LINKS.whatsapp} target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                  <WhatsAppIcon className="h-6 w-6" />
                </a>
              </div>
          </div>
        </div>
        <div className="border-t border-wood-brown/50 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Parties 24/7. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
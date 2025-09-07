import React from 'react';
import { Link } from 'react-router-dom';
import { SOCIAL_LINKS } from '../constants';
import { InstagramIcon, TikTokIcon } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-jungle-surface mt-12 text-jungle-text/70 border-t-2 border-wood-brown/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-right">
          <div>
            <h3 className="font-display text-xl text-white mb-4">ניווט מהיר</h3>
            <ul className="space-y-2">
              <li><Link to="/" className="hover:text-jungle-accent transition-colors">עמוד הבית</Link></li>
              <li><Link to="/all-parties" className="hover:text-jungle-accent transition-colors">כל המסיבות</Link></li>
              <li><Link to="/about" className="hover:text-jungle-accent transition-colors">עלינו</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-display text-xl text-white mb-4">מידע ומשפטי</h3>
            <ul className="space-y-2">
              <li><Link to="/terms" className="hover:text-jungle-accent transition-colors">תנאי שימוש</Link></li>
              <li><Link to="/privacy" className="hover:text-jungle-accent transition-colors">מדיניות פרטיות</Link></li>
              <li><Link to="/accessibility" className="hover:text-jungle-accent transition-colors">הצהרת נגישות</Link></li>
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
              </div>
          </div>
        </div>
        <div className="border-t border-wood-brown/50 mt-8 pt-6 text-center text-sm">
          <p>&copy; {new Date().getFullYear()} Party 24/7. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
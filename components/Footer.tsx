
import React from 'react';
import { SOCIAL_LINKS } from '../constants';
import { InstagramIcon, TikTokIcon } from './Icons';

const Footer: React.FC = () => {
  return (
    <footer className="bg-brand-surface mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-400">
        <div className="flex justify-center items-center gap-6 mb-4">
          <a href={SOCIAL_LINKS.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-brand-primary transition-colors">
            <InstagramIcon className="h-6 w-6" />
          </a>
          <a href={SOCIAL_LINKS.tiktok} target="_blank" rel="noopener noreferrer" className="hover:text-brand-secondary transition-colors">
            <TikTokIcon className="h-6 w-6" />
          </a>
        </div>
        <p className="text-sm">&copy; {new Date().getFullYear()} Party 24/7. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;

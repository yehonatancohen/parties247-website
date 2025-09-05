import React from 'react';
import { SOCIAL_LINKS } from '../constants';
import { InstagramIcon, TikTokIcon } from './Icons';

const SocialsCta: React.FC = () => {
  return (
    <section className="bg-brand-surface py-12 mt-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-2 text-white">אל תפספסו אף מסיבה!</h2>
        <p className="text-lg text-gray-300 mb-6">הצטרפו ל-50,000+ העוקבים שלנו בסושיאל</p>
        <div className="flex justify-center items-center gap-4">
          <a
            href={SOCIAL_LINKS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform"
          >
            <InstagramIcon className="h-6 w-6" />
            <span>אינסטגרם</span>
          </a>
          <a
            href={SOCIAL_LINKS.tiktok}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-black text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:scale-105 transition-transform border border-white/20"
          >
            <TikTokIcon className="h-6 w-6" />
            <span>טיקטוק</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default SocialsCta;
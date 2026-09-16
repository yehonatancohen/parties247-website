import React from 'react';
import Link from 'next/link';
import { SOCIAL_LINKS } from '../data/constants';
import { InstagramIcon, TikTokIcon, WhatsAppIcon } from './Icons';

const COLUMNS: { title: string; links: { href: string; label: string }[] }[] = [
  {
    title: 'מסיבות לפי עיר',
    links: [
      { href: '/cities/tel-aviv', label: 'מסיבות בתל אביב' },
      { href: '/cities/haifa', label: 'מסיבות בחיפה' },
      { href: '/cities/jerusalem', label: 'מסיבות בירושלים' },
      { href: '/cities/eilat', label: 'מסיבות באילת' },
      { href: '/cities/beer-sheva', label: 'מסיבות בבאר שבע' },
    ],
  },
  {
    title: 'מסיבות לפי סגנון',
    links: [
      { href: '/genre/techno-music', label: 'מסיבות טכנו' },
      { href: '/genre/rave-parties', label: 'רייבים בישראל' },
      { href: '/genre/trance-music', label: 'מסיבות טראנס' },
      { href: '/genre/house-music', label: 'מסיבות האוס' },
      { href: '/genre/mainstream-music', label: 'מסיבות מיינסטרים' },
    ],
  },
  {
    title: 'מידע ומשפטי',
    links: [
      { href: '/terms', label: 'תנאי שימוש' },
      { href: '/privacy', label: 'מדיניות פרטיות' },
      { href: '/accessibility', label: 'הצהרת נגישות' },
      { href: '/promoter-disclaimer', label: 'הבהרה: האתר כמקדמי אירועים' },
    ],
  },
];

const SOCIALS = [
  { href: SOCIAL_LINKS.instagram, label: 'אינסטגרם', Icon: InstagramIcon },
  { href: SOCIAL_LINKS.tiktok, label: 'טיקטוק', Icon: TikTokIcon },
  { href: SOCIAL_LINKS.whatsapp, label: 'וואטסאפ', Icon: WhatsAppIcon },
];

const Footer: React.FC = () => {
  return (
    <footer className="font-apple border-t border-hairline bg-[#040c09] text-[12px] leading-[1.35] text-ink-3">
      <div className="mx-auto max-w-[1024px] px-4 py-10 sm:px-6">
        <p className="border-b border-hairline pb-4">
          Parties 24/7 מרכז מסיבות ואירועים מכל הארץ. הכרטיסים נמכרים באתר המכירה הרשמי של כל אירוע.
        </p>

        <div className="grid grid-cols-2 gap-x-6 gap-y-8 pt-6 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3 className="mb-2.5 font-semibold text-ink">{col.title}</h3>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="transition-colors hover:text-ink hover:underline underline-offset-2">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}

          <div>
            <h3 className="mb-2.5 font-semibold text-ink">עקבו אחרינו</h3>
            <ul className="space-y-2">
              {SOCIALS.map(({ href, label, Icon }) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:text-ink"
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-8 border-t border-hairline pt-4">
          &copy; {new Date().getFullYear()} Parties 24/7. כל הזכויות שמורות.
        </p>
      </div>
    </footer>
  );
};

export default Footer;

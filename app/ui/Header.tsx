'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { BRAND_LOGO_URL } from '../../constants';

const NAV_LINKS = [
  { href: '/', label: 'עמוד הבית' },
  { href: '/all-parties', label: 'כל המסיבות' },
  { href: '/party-discovery', label: 'חיפוש מסיבות' },
  { href: '/blog', label: 'כתבות' },
  { href: '/about', label: 'עלינו' },
];

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (logoClickCount === 5) {
      router.push('/admin');
      setLogoClickCount(0);
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    }
  }, [logoClickCount, router]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  const handleLogoClick = () => {
    setLogoClickCount((prev) => prev + 1);
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
    }
    clickTimeoutRef.current = setTimeout(() => setLogoClickCount(0), 2000);
  };

  const renderNavLinks = (onClick?: () => void) =>
    NAV_LINKS.map((link) => {
      const isActive = pathname === link.href;
      return (
        <li key={link.href}>
          <Link
            href={link.href}
            onClick={onClick}
            className={`block py-2 text-jungle-text hover:text-white transition-colors tracking-wide ${
              isActive ? 'text-jungle-accent' : ''
            }`}
          >
            {link.label}
          </Link>
        </li>
      );
    });

  return (
    <>
      <header className="bg-jungle-surface/80 backdrop-blur-sm sticky top-0 z-50 shadow-lg border-b-2 border-wood-brown/50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-20">
            <div onClick={handleLogoClick} className="cursor-pointer flex-shrink-0 z-50">
              <Link href="/" className="flex items-center">
                <img
                  src={BRAND_LOGO_URL}
                  alt="Parties 24/7 Logo"
                  className="h-16 w-auto"
                  loading="lazy"
                  decoding="async"
                />
              </Link>
            </div>

            <nav className="hidden md:block">
              <ul className="flex items-center gap-6 font-display text-xl">{renderNavLinks()}</ul>
            </nav>

            <div className="md:hidden z-50">
              <button
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-label="Toggle menu"
                className="text-white text-3xl"
              >
                {isMenuOpen ? '✕' : '☰'}
              </button>
            </div>
          </div>
        </div>
      </header>

      {isMenuOpen && (
        <div className="mobile-menu fixed inset-0 bg-jungle-deep/95 backdrop-blur-md z-40 md:hidden">
          <div className="h-full w-full max-w-sm mx-auto px-6">
            <nav className="h-full overflow-y-auto py-16">
              <ul className="min-h-full flex flex-col items-center justify-center gap-6 font-display text-3xl">
                {renderNavLinks(() => setIsMenuOpen(false))}
              </ul>
            </nav>
          </div>
        </div>
      )}
    </>
  );
}

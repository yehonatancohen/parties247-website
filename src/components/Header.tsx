"use client";
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import NavLink from './NavLink';

const NAV_ITEMS = [
  { href: '/', label: 'עמוד הבית', end: true },
  { href: '/all-parties', label: 'כל המסיבות' },
  { href: '/party-discovery', label: 'חיפוש מסיבות' },
  { href: '/articles', label: 'כתבות' },
  { href: '/about', label: 'עלינו' },
];

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Prevent body scroll when mobile menu is open
    document.body.style.overflow = isMenuOpen ? 'hidden' : 'unset';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isMenuOpen]);

  return (
    <>
    <header
      className="font-apple sticky top-0 z-50 border-b border-hairline bg-stage/80 backdrop-blur-xl backdrop-saturate-[1.8]"
      aria-label="Main Navigation"
    >
      <div className="mx-auto flex h-12 max-w-[1024px] items-center justify-between px-4 sm:px-6">
        <Link href="/" className="relative z-50 flex shrink-0 items-center" aria-label="Parties 24/7 — עמוד הבית">
          <Image
            src="https://vjkiztnx7gionfos.public.blob.vercel-storage.com/Partieslogo.PNG"
            alt="Parties 24/7"
            className="h-11 w-auto"
            priority
            width={110}
            height={44}
          />
        </Link>

        {/* Desktop navigation */}
        <nav className="hidden md:block" aria-label="ניווט ראשי">
          <ul className="flex items-center gap-8 text-[13px]">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <NavLink
                  href={item.href}
                  end={item.end}
                  className={({ isActive }) =>
                    `transition-colors duration-200 ${isActive ? 'text-ink' : 'text-ink/75 hover:text-ink'}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/all-parties"
          className="hidden rounded-full bg-action px-3.5 py-1 text-[12px] font-medium text-on-action transition-colors hover:bg-action-hover md:inline-block"
        >
          לכל המסיבות
        </Link>

        {/* Mobile menu button: two bars morph into a cross */}
        <button
          type="button"
          onClick={() => setIsMenuOpen((open) => !open)}
          aria-label={isMenuOpen ? 'סגירת תפריט' : 'פתיחת תפריט'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          className="relative z-50 -ml-2 flex h-11 w-11 items-center justify-center md:hidden"
        >
          <span className="relative block h-3 w-[18px]">
            <span
              className={`absolute left-0 h-[1.5px] w-full rounded-full bg-ink transition-transform duration-300 ease-apple ${
                isMenuOpen ? 'top-1/2 -translate-y-1/2 rotate-45' : 'top-0'
              }`}
            />
            <span
              className={`absolute left-0 h-[1.5px] w-full rounded-full bg-ink transition-transform duration-300 ease-apple ${
                isMenuOpen ? 'top-1/2 -translate-y-1/2 -rotate-45' : 'bottom-0'
              }`}
            />
          </span>
        </button>
      </div>
    </header>

      {/* Mobile menu — outside <header>: its backdrop-filter would otherwise
          become the containing block and clip this fixed overlay to 48px. */}
      <div
        id="mobile-menu"
        className={`fixed inset-x-0 top-0 z-40 h-[100dvh] bg-black transition-opacity duration-300 ease-apple md:hidden ${
          isMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
        }`}
        aria-hidden={!isMenuOpen}
      >
        <nav className="px-10 pt-20" aria-label="ניווט ראשי">
          <ul className="flex flex-col gap-4">
            {NAV_ITEMS.map((item, i) => (
              <li
                key={item.href}
                className={`transition-all duration-500 ease-apple ${isMenuOpen ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0'}`}
                style={{ transitionDelay: isMenuOpen ? `${60 + i * 35}ms` : '0ms' }}
              >
                <NavLink
                  href={item.href}
                  end={item.end}
                  tabIndex={isMenuOpen ? undefined : -1}
                  onClick={() => setIsMenuOpen(false)}
                  className={({ isActive }) =>
                    `block py-1 text-[28px] font-semibold leading-tight transition-colors ${isActive ? 'text-ink' : 'text-ink/80 hover:text-ink'}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Header;

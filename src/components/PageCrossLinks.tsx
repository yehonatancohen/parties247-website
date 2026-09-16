'use client'; // 1. Necessary because you use 'usePathname'

import React from 'react';
import { pageLinkOptions } from '../data/pageLinks';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const PageCrossLinks: React.FC = () => {
  const pathname = usePathname();

  const currentPath = pathname || '';

  const suggestedLinks = pageLinkOptions
    .filter((option) => !currentPath.startsWith(option.path))
    .slice(0, 4);

  if (suggestedLinks.length === 0) {
    return null;
  }

  return (
    <nav className="font-apple mx-auto mt-12 max-w-[1024px] px-4 pb-4 sm:px-6" aria-labelledby="cross-links-heading">
      <h2 id="cross-links-heading" className="text-[21px] font-semibold text-ink">
        עוד עמודים שכדאי לבדוק
      </h2>
      <ul className="mt-4 grid border-t border-hairline sm:grid-cols-2 sm:gap-x-8">
        {suggestedLinks.map((option) => (
          <li key={option.path} className="border-b border-hairline">
            <Link href={option.path} className="group flex items-center justify-between gap-4 py-4">
              <span>
                <span className="block text-[17px] font-medium text-ink transition-colors group-hover:text-link">{option.label}</span>
                {option.description ? (
                  <span className="mt-0.5 block text-[14px] leading-snug text-ink-3">{option.description}</span>
                ) : null}
              </span>
              <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 text-ink-3 transition-transform duration-200 group-hover:-translate-x-0.5" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
              </svg>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default PageCrossLinks;
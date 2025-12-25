'use client'; // 1. Necessary because you use 'usePathname'

import React from 'react';
import { pageLinkOptions } from '../data/pageLinks';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const PageCrossLinks: React.FC = () => {
  const pathname = usePathname();

  // Safe check for pathname (it can technically be null during build time in some edge cases)
  const currentPath = pathname || '';

  const suggestedLinks = pageLinkOptions
    .filter((option) => !currentPath.startsWith(option.path))
    .slice(0, 4);

  if (suggestedLinks.length === 0) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 mt-12">
      <div className="bg-jungle-surface/70 border border-wood-brown/50 rounded-2xl p-6 shadow-lg space-y-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h2 className="font-display text-2xl text-white">עוד עמודים שכדאי לבדוק</h2>
          <p className="text-jungle-text/70 text-sm">קישורי המשך כדי לגלות עוד מסיבות והמלצות.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {suggestedLinks.map((option) => (
            <Link
              key={option.path}
              href={option.path} // 2. Changed 'to' to 'href'
              className="block bg-jungle-deep border border-wood-brown/60 rounded-xl p-4 hover:border-jungle-accent hover:shadow-jungle-glow transition group"
            >
              <p className="font-semibold text-white group-hover:text-jungle-accent transition-colors">{option.label}</p>
              {option.description ? (
                <p className="text-sm text-jungle-text/70 mt-2 leading-snug">{option.description}</p>
              ) : null}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PageCrossLinks;
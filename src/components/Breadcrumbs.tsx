import React from 'react';
import Link from 'next/link'

export interface BreadcrumbItem {
  label: string;
  path?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = ({ items }) => {
  if (!items.length) {
    return null;
  }

  return (
    <nav aria-label="breadcrumbs" className="mb-6 text-[13px] text-ink-3">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {item.path && !isLast ? (
                <Link href={item.path} className="transition-colors hover:text-ink">
                  {item.label}
                </Link>
              ) : (
                <span className="text-ink-2" aria-current={isLast ? 'page' : undefined}>{item.label}</span>
              )}
              {!isLast && (
                <svg viewBox="0 0 24 24" className="h-3 w-3 text-ink-3/70" fill="none" stroke="currentColor" strokeWidth={2.4} aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" />
                </svg>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

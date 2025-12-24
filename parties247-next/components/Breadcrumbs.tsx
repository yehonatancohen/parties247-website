import React from 'react';
import { Link } from 'react-router-dom';

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
    <nav aria-label="breadcrumbs" className="text-sm text-jungle-text/70 mb-6">
      <ol className="flex flex-wrap gap-1 items-center">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1">
              {item.path && !isLast ? (
                <Link to={item.path} className="hover:text-jungle-accent transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-jungle-text">{item.label}</span>
              )}
              {!isLast && <span className="text-jungle-text/40">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;

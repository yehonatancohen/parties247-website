import Link from "next/link";
import type { BreadcrumbItem } from "@/lib/page-content";

interface Props {
  items: BreadcrumbItem[];
}

export const Breadcrumbs = ({ items }: Props) => (
  <nav className="breadcrumbs" aria-label="פירורי לחם">
    {items.map((item, index) => (
      <span key={`${item.href}-${item.name}`}>
        <Link href={item.href}>{item.name}</Link>
        {index < items.length - 1 && <span className="separator">›</span>}
      </span>
    ))}
  </nav>
);

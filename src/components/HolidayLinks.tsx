import Link from 'next/link';
import { HOLIDAY_PAGES } from '@/lib/musicDiscovery';

export default function HolidayLinks({ showHeading = true }: { showHeading?: boolean }) {
  return (
    <nav aria-label="מסיבות לפי חג" className="space-y-3" dir="rtl">
      {showHeading && <h2 className="text-xl font-bold text-ink">מסיבות בחגים ובמועדים</h2>}
      <div className="flex flex-wrap gap-2">
        {HOLIDAY_PAGES.map(holiday => (
          <Link key={holiday.href} href={holiday.href} prefetch={false}
            className="rounded-full border border-hairline bg-tile px-4 py-2 text-sm text-ink transition-colors hover:bg-tile-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-action">
            {holiday.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

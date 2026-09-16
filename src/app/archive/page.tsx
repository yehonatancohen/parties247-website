import { Metadata } from 'next';
import Link from 'next/link';
import ArchivePartyCard from '@/components/ArchivePartyCard';
import { getPastParties, paginate, ARCHIVE_PAGE_SIZE } from '@/lib/archive';

export const revalidate = 3600;

export const metadata: Metadata = {
  title: 'ארכיון מסיבות שהתקיימו',
  description: 'סיכומים ופרטים על מסיבות ואירועים שכבר התקיימו בישראל — טכנו, האוס, מיינסטרים ועוד.',
  alternates: { canonical: '/archive' },
};

export default async function ArchiveIndexPage() {
  const pastParties = await getPastParties();
  const pageItems = paginate(pastParties, 1);
  const totalPages = Math.max(1, Math.ceil(pastParties.length / ARCHIVE_PAGE_SIZE));

  return (
    <div className="container mx-auto px-4 pt-10 md:pt-14 pb-16">
      <div className="text-center mb-8">
        <h1 className="text-[34px] font-bold leading-tight text-ink sm:text-[48px] mb-2">ארכיון מסיבות</h1>
        <p className="text-ink-2 max-w-xl mx-auto">מסיבות ואירועים שכבר התקיימו — לחיפוש מסיבה ספציפית או להשראה למסיבה הבאה שלכם.</p>
      </div>

      {pageItems.length === 0 ? (
        <p className="text-center text-ink-3 py-10">עדיין אין אירועים בארכיון.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {pageItems.map(party => (
            <ArchivePartyCard key={party.id} party={party} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center mt-10">
          <Link
            href="/archive/page-num/2"
            className="px-4 py-2 text-sm bg-tile hover:bg-white/10 text-ink-2 rounded-md border border-hairline transition"
          >
            הבא ←
          </Link>
        </div>
      )}
    </div>
  );
}

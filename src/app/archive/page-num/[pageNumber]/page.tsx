import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ArchivePartyCard from '@/components/ArchivePartyCard';
import { getPastParties, paginate, ARCHIVE_PAGE_SIZE } from '@/lib/archive';

export const revalidate = 3600;

interface Props {
  params: Promise<{ pageNumber: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageNumber } = await params;
  return {
    title: `ארכיון מסיבות — עמוד ${pageNumber}`,
    description: 'סיכומים ופרטים על מסיבות ואירועים שכבר התקיימו בישראל.',
    alternates: { canonical: `/archive/page-num/${pageNumber}` },
  };
}

export default async function ArchivePaginatedPage({ params }: Props) {
  const { pageNumber } = await params;
  const currentPage = parseInt(pageNumber, 10);
  if (isNaN(currentPage) || currentPage < 1) {
    notFound();
  }

  const pastParties = await getPastParties();
  const totalPages = Math.max(1, Math.ceil(pastParties.length / ARCHIVE_PAGE_SIZE));

  // A thin/empty tail page has no unique content worth indexing.
  if (currentPage > totalPages) {
    notFound();
  }

  const pageItems = paginate(pastParties, currentPage);

  return (
    <div className="container mx-auto px-4 pt-10 md:pt-14 pb-16">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-display text-white mb-2">ארכיון מסיבות</h1>
        <p className="text-jungle-text/80 max-w-xl mx-auto">מסיבות ואירועים שכבר התקיימו — עמוד {currentPage}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {pageItems.map(party => (
          <ArchivePartyCard key={party.id} party={party} />
        ))}
      </div>

      <div className="flex justify-center gap-3 mt-10">
        <Link
          href={currentPage - 1 === 1 ? '/archive' : `/archive/page-num/${currentPage - 1}`}
          className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 text-gray-300 rounded-md border border-white/10 transition"
        >
          → הקודם
        </Link>
        {currentPage < totalPages && (
          <Link
            href={`/archive/page-num/${currentPage + 1}`}
            className="px-4 py-2 text-sm bg-white/5 hover:bg-white/10 text-gray-300 rounded-md border border-white/10 transition"
          >
            הבא ←
          </Link>
        )}
      </div>
    </div>
  );
}

import Link from 'next/link';
import { DiscoveryFilter } from '@/app/party-discovery/filters';

type DiscoveryFilterGridProps = {
  sections: DiscoveryFilter[];
  detailBasePath: string;
};

export default function DiscoveryFilterGrid({ sections, detailBasePath }: DiscoveryFilterGridProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2">
      {sections.map((section) => (
        <Link
          key={section.id}
          href={`${detailBasePath}/${section.id}`}
          prefetch={false}
          className="group flex h-full flex-col justify-between rounded-3xl border border-white/10 bg-jungle-surface/60 p-5 shadow-lg transition hover:-translate-y-1 hover:border-emerald-300/30 hover:shadow-emerald-500/20"
        >
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-emerald-200/70">דף מסיבה ייעודי</p>
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <h2 className="text-2xl font-display text-white">{section.title}</h2>
                {section.description && (
                  <p className="text-sm text-jungle-text/85 leading-relaxed">{section.description}</p>
                )}
              </div>
              <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white/90">
                מסיבות חיות
              </span>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-emerald-200 transition group-hover:translate-x-1">
            <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-emerald-50">ראה מסיבות</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-4"
              aria-hidden
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}

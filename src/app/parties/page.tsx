import Link from 'next/link';
import { Metadata } from 'next';
import BackButton from '@/components/BackButton';
import { SPECIFIC_PARTIES_PAGES } from '@/lib/seoparties';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'מסיבות לפי נושא | Parties 24/7',
  description:
    'גלו מסיבות לפי סגנון מוזיקה, קהל יעד או מיקום. טכנו בתל אביב, מסיבות לחיילים, אלכוהול חופשי ועוד.',
  alternates: { canonical: '/parties' },
};

export default function PartyDiscoverySpecificLanding() {

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0c1713] via-[#0c1713] to-black text-white">
      <div className="container mx-auto px-4 pb-16 pt-14 md:pt-16">

        {/* Navigation */}
        <div className="mb-6 flex justify-start">
          <BackButton fallbackHref="/party-discovery" label="חזרה" />
        </div>

        {/* Header */}
        <div className="mx-auto mb-12 max-w-5xl space-y-4 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-emerald-950/50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-emerald-300 border border-emerald-900/20">
            קטגוריות מיוחדות
          </p>
          <h1 className="text-4xl md:text-5xl font-display text-white leading-tight">
            מצאו את המסיבה המדויקת שלכם
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            אנחנו יודעים בדיוק מה אתם מחפשים. יצרנו עבורכם רשימות ממוקדות לפי ז'אנר,
            אזור, גיל וסגנון בילוי. בחרו את הקטגוריה ותתחילו לחגוג.
          </p>
        </div>

        {/* Grid of Links */}
        <section className="mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {SPECIFIC_PARTIES_PAGES.map((page) => (
              <Link
                key={page.slug}
                // We use '/parties/' to avoid collision with specific party slugs
                // Example: /parties/techno-tel-aviv
                href={`/parties/${page.slug}`}
                prefetch={false}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 via-white/5 to-transparent p-6 text-right shadow-lg backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-emerald-500/20 hover:border-emerald-500/30"
              >
                {/* Hover Effect Background - Green Radial Gradient */}
                <div className="absolute inset-0 opacity-0 transition group-hover:opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(16,185,129,0.4),transparent_50%)]" />

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h2 className="text-2xl font-display text-white group-hover:text-emerald-300 transition-colors mb-2">
                      {page.title}
                    </h2>
                    <p className="text-sm text-gray-400 leading-relaxed">
                      {page.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider group-hover:text-emerald-300">
                      צפה במסיבות <span aria-hidden="true" className="transition-transform group-hover:-translate-x-1">←</span>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Footer Text */}
        <section className="text-center mt-20 border-t border-white/5 pt-10">
          <p className="text-sm text-gray-500">
            לא מצאתם את מה שחיפשתם? נסו את <Link href="/party-discovery" className="text-emerald-400 hover:underline">מנוע החיפוש הראשי</Link> שלנו.
          </p>
        </section>
      </div>
    </div>
  );
}
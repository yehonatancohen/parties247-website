import Link from 'next/link';
import { Metadata } from 'next';
import BackButton from '@/components/BackButton';
import { SPECIFIC_PARTIES_PAGES } from '@/lib/seoparties';

export const dynamic = 'force-static';

export const metadata: Metadata = {
  title: 'מסיבות לפי נושא',
  description:
    'גלו מסיבות לפי סגנון מוזיקה, קהל יעד או מיקום. טכנו בתל אביב, מסיבות לחיילים, אלכוהול חופשי ועוד.',
  alternates: { canonical: '/parties' },
};

export default function PartyDiscoverySpecificLanding() {

  return (
    <div className="font-apple min-h-screen bg-stage text-ink">
      <div className="container mx-auto px-4 pb-16 pt-14 md:pt-16">

        {/* Navigation */}
        <div className="mb-6 flex justify-start">
          <BackButton fallbackHref="/party-discovery" label="חזרה" />
        </div>

        {/* Header */}
        <div className="mx-auto mb-12 max-w-5xl space-y-4 text-center">
          <h1 className="text-[34px] font-bold leading-tight text-ink sm:text-[48px] leading-tight">
            מצאו את המסיבה המדויקת שלכם
          </h1>
          <p className="text-lg text-ink-2 leading-relaxed max-w-2xl mx-auto">
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
                className="group flex flex-col rounded-[22px] bg-tile p-6 text-right transition-colors duration-300 hover:bg-tile-hover"
              >

                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h2 className="text-[24px] font-bold text-ink sm:text-[28px] group-hover:text-link transition-colors mb-2">
                      {page.title}
                    </h2>
                    <p className="text-sm text-ink-3 leading-relaxed">
                      {page.description}
                    </p>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 text-[15px] text-link group-hover:underline underline-offset-4">
                      לצפייה במסיבות <svg viewBox="0 0 24 24" className="h-[0.8em] w-[0.8em]" fill="none" stroke="currentColor" strokeWidth={2.6} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" /></svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* SEO Footer Text */}
        <section className="text-center mt-20 border-t border-hairline pt-10">
          <p className="text-sm text-ink-3">
            לא מצאתם את מה שחיפשתם? נסו את <Link href="/party-discovery" className="text-link hover:underline">מנוע החיפוש הראשי</Link> שלנו.
          </p>
        </section>
      </div>
    </div>
  );
}
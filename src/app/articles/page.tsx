import Image from "next/image";
import Link from 'next/link';
import { articles } from '../../data/articles'; 
import { BASE_URL } from '../../data/constants';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'המגזין | מדריכי מסיבות וחיי לילה בישראל',
  description: 'מדריכי מסיבות, טיפים לרייב ראשון, מועדוני טכנו בתל אביב וכתבות על סצנת חיי הלילה בישראל – הכל במקום אחד.',
  alternates: {
    canonical: `${BASE_URL}/articles`,
  },
};

const guides = [
  {
    title: 'רייבים בישראל – המדריך המלא',
    description: 'סוגי רייבים, מה להביא, איך מוצאים אירועים ועוד טיפים לרייב ראשון.',
    href: '/genre/rave-parties',
    emoji: '🔊',
  },
  {
    title: 'מסיבות טכנו ורייבים',
    description: 'סצנת הטכנו בישראל: מהרחבות המחתרתיות ועד המועדונים הגדולים.',
    href: '/genre/techno-music',
    emoji: '🎛️',
  },
  {
    title: 'Jimmy Who – ליינאפ, כתובת וכרטיסים',
    description: 'כרטיסים, ליינאפ עדכני, שעות פתיחה וכל מה שצריך לפני שיוצאים לג׳ימי הו.',
    href: '/jimmy-who',
    emoji: '🎤',
  },
  {
    title: 'Moon Child – ליינאפ, כתובת וכרטיסים',
    description: 'ליינאפ עדכני, כתובת ומידע על כרטיסים לאירועי Moon Child בישראל.',
    href: '/moon-child',
    emoji: '🌙',
  },
  {
    title: 'מסיבות יום שישי – המדריך המלא',
    description: 'ליינאפ, כרטיסים ומועדוני הלילה הכי חמים לליל שישי בתל אביב וכל הארץ.',
    href: '/friday-parties-guide',
    emoji: '🎉',
  },
  {
    title: 'מסיבות בתל אביב סוף שבוע 2026',
    description: 'המדריך המלא למסיבות סוף שבוע בתל אביב 2026 – טכנו, היפ-הופ ורייבים.',
    href: '/tel-aviv-weekend-2026',
    emoji: '🏙️',
  },
  {
    title: 'כרטיסים למסיבות בישראל',
    description: 'כיצד לרכוש כרטיסים, מתי לקנות early-bird והיכן למצוא הנחות לאירועי לילה.',
    href: '/tickets-israel',
    emoji: '🎟️',
  },
];

export default function ArticlesIndexPage() {
  return (
    <div className="font-apple mx-auto max-w-[1100px] px-4 py-12 sm:px-6 sm:py-20">
      <header className="text-center mb-12">
        <h1 className="text-[34px] font-bold leading-tight text-ink sm:text-[48px] mb-4">
          המגזין
        </h1>
        <p className="text-ink-2 text-lg">
          כל מה שחם בעולם המסיבות
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article, index) => (
          <article 
            key={article.slug} 
            className="group flex flex-col overflow-hidden rounded-[22px] bg-tile transition-colors duration-300 hover:bg-tile-hover"
          >
            <Link
              href={`/articles/${encodeURIComponent(article.slug)}`}
              className="relative block h-48 overflow-hidden" 
            >
              <Image
                src={article.imageUrl}
                alt={article.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                quality={40}
                priority={index < 3}
                className="object-cover transition-transform duration-700 ease-apple group-hover:scale-[1.03]"
              />
            </Link>

            <div className="p-6 flex flex-col flex-grow">
              <h2 className="text-[21px] font-bold text-ink mb-3">
                <Link href={`/articles/${encodeURIComponent(article.slug)}`} className="transition-colors hover:text-link">
                  {article.title}
                </Link>
              </h2>
              <p className="text-ink-2 text-sm mb-4 line-clamp-3">
                {article.summary}
              </p>
              <Link
                href={`/articles/${encodeURIComponent(article.slug)}`}
                className="mt-auto inline-flex items-center gap-1 text-[15px] text-link hover:underline underline-offset-4"
              >
                לקריאה <svg viewBox="0 0 24 24" className="h-[0.8em] w-[0.8em]" fill="none" stroke="currentColor" strokeWidth={2.6} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" /></svg>
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Guides section */}
      <section className="mt-16">
        <h2 className="text-[28px] font-bold text-ink sm:text-[36px] mb-2">מדריכים ועמודי ז׳אנר</h2>
        <p className="text-ink-3 text-sm mb-8">עמודי תוכן מעמיקים על מועדונים, ז׳אנרים וסצנות</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {guides.map((guide) => (
            <Link
              key={guide.href}
              href={guide.href}
              className="group flex flex-col gap-2 rounded-[22px] bg-tile p-5 transition-colors hover:bg-tile-hover"
            >
              <h3 className="text-[19px] font-bold text-ink">
                {guide.title}
              </h3>
              <p className="text-sm text-ink-3 leading-relaxed flex-grow">{guide.description}</p>
              <span className="inline-flex items-center gap-1 text-[15px] text-link group-hover:underline underline-offset-4">לקריאה <svg viewBox="0 0 24 24" className="h-[0.8em] w-[0.8em]" fill="none" stroke="currentColor" strokeWidth={2.6} aria-hidden><path strokeLinecap="round" strokeLinejoin="round" d="M15 6l-6 6 6 6" /></svg></span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
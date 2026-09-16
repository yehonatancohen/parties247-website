import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Party } from "@/data/types";
import PartyGrid from '@/components/PartyGrid';
import * as api from '@/services/api';
import { BASE_URL } from '@/data/constants';

export const revalidate = 60;

const HOLIDAY_TERMS = ['ראש השנה', 'ראש-השנה', 'רֹאשׁ הַשָּׁנָה', 'rosh hashana', 'rosh hashanah', 'rosh-hashana'];

const FAQS = [
    {
        question: 'מתי מסיבות ראש השנה 2026?',
        answer: 'ערב ראש השנה תשפ״ז חל ביום שישי, 11 בספטמבר 2026, והחג נמשך עד מוצאי שבת 13 בספטמבר. רוב המסיבות והפסטיבלים מתקיימים בליל החג (10–11.9) ובמוצ״ש (12.9), עם אירועי בראנץ׳ וסאנסט לאורך כל סוף השבוע הארוך.',
    },
    {
        question: 'איפה הכי כדאי לחגוג את ראש השנה?',
        answer: 'תל אביב מרכזת את מרבית מסיבות המועדונים והרוף-טופ, אילת והכנרת מארחות פסטיבלי טבע וטראנס לאורך כל החג, ובצפון ובדרום נפתחים אירועי open air. בעמוד הזה מרוכזים כל האירועים לפי תאריך כדי שתמצאו את מה שקרוב אליכם.',
    },
    {
        question: 'האם צריך לקנות כרטיסים מראש לראש השנה?',
        answer: 'כן. סוף השבוע של ראש השנה הוא מהעמוסים בשנה וליינים מובילים נמכרים מראש, לרוב במחירי Early Bird שנגמרים מוקדם. מומלץ לרכוש כרטיס ברגע שסוגרים אירוע.',
    },
    {
        question: 'איך מתעדכנים באירועים חדשים של ראש השנה?',
        answer: 'העמוד מתעדכן אוטומטית 24/7 ככל שמפיקים מוסיפים אירועים. שווה לחזור אליו בימים שלפני החג – אירועים ומסיבות מתווספים כמעט מדי יום.',
    },
];

async function getRoshHashanaData() {
    try {
        const [carousels, allParties] = await Promise.all([
            api.getCarousels(),
            api.getParties()
        ]);

        const matchesHoliday = (text: string) => {
            const lower = (text || '').toLowerCase();
            return HOLIDAY_TERMS.some((term) => lower.includes(term.toLowerCase()));
        };

        const holidayCarousel = carousels.find((c) => matchesHoliday(c.title));

        let holidayParties: Party[] = [];

        if (holidayCarousel) {
            holidayParties = allParties.filter((party) =>
                holidayCarousel.partyIds.includes(party.id)
            );
        }

        if (holidayParties.length === 0) {
            holidayParties = allParties.filter((party) =>
                party.tags.some((t) => matchesHoliday(t)) ||
                matchesHoliday(party.name)
            );
        }

        holidayParties.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return { holidayParties };
    } catch (error) {
        console.error("Failed to fetch Rosh Hashana data:", error);
        return { holidayParties: [] };
    }
}

export const metadata: Metadata = {
    title: 'מסיבות ראש השנה 2026 | לוח המסיבות והפסטיבלים המלא - Parties24/7',
    description: 'כל מסיבות ראש השנה 2026 במקום אחד! פסטיבלים, מסיבות מועדון, רוף-טופ ואירועי טבע לליל החג ולמוצ״ש בתל אביב, אילת ובכל הארץ. כרטיסים, מחירים ועדכונים בזמן אמת.',
    keywords: ['מסיבות ראש השנה', 'מסיבות ראש השנה 2026', 'מסיבות ראש השנה תל אביב', 'פסטיבלים ראש השנה', 'ראש השנה 2026', 'כרטיסים למסיבות ראש השנה', 'מסיבות ראש השנה אילת'],
    alternates: {
        canonical: '/rosh-hashana',
    },
    openGraph: {
        title: 'מסיבות ראש השנה 2026 | האירועים הכי חמים בישראל',
        description: 'מחפשים לאן לצאת בראש השנה? כל המסיבות, הפסטיבלים ואירועי הטבע של ראש השנה 2026 מרוכזים כאן לפי תאריך. כנסו עכשיו!',
        url: `${BASE_URL}/rosh-hashana`,
        type: 'website',
    },
};

export default async function RoshHashanaPage() {
    const { holidayParties } = await getRoshHashanaData();

    const collectionJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "מסיבות ראש השנה 2026",
        "description": "לוח המסיבות, הפסטיבלים ואירועי הטבע המלא לחג ראש השנה 2026 בישראל.",
        "url": `${BASE_URL}/rosh-hashana`,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": holidayParties.map((party, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${BASE_URL}/event/${party.slug}`,
                "name": party.name
            }))
        }
    };

    const faqJsonLd = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": FAQS.map((f) => ({
            "@type": "Question",
            "name": f.question,
            "acceptedAnswer": { "@type": "Answer", "text": f.answer },
        })),
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionJsonLd) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
            />

            <main className="font-apple min-h-screen bg-stage text-ink pb-20 relative overflow-x-hidden">

                {/* HERO SECTION */}
                <section className="relative overflow-hidden pb-12 pt-12 text-center sm:pb-16 sm:pt-20">
                    <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[460px] bg-[radial-gradient(ellipse_55%_60%_at_50%_0%,rgba(118,200,147,0.17),transparent_72%)]" />

                    <div className="relative z-10 container mx-auto px-4 text-center pb-8">
                        <h1 className="text-balance text-[clamp(36px,11vw,48px)] font-bold leading-[1.05] sm:text-[72px]">
                            מסיבות ראש השנה 2026
                        </h1>
                        <p className="mx-auto mt-5 max-w-[640px] text-balance text-[18px] leading-[1.5] text-ink-2 sm:text-[22px]">
                            כל הפסטיבלים, מסיבות המועדון ואירועי הטבע של החג – מרוכזים לפי תאריך.
                            <br />
                            <span className="font-semibold text-ink">סוף שבוע ארוך אחד, אינסוף אפשרויות.</span>
                        </p>
                    </div>
                </section>

                {/* CONTENT & INFO SECTION */}
                <section className="container mx-auto px-4 mt-8 relative z-20 mb-16">
                    <div className="rounded-[28px] bg-tile p-6 sm:p-10 max-w-4xl mx-auto text-center md:text-right">
                        <h2 className="text-[28px] font-bold text-ink sm:text-[36px] mb-6 text-center">חוגגים את ראש השנה עם Parties24/7</h2>

                        <div className="space-y-4 text-lg text-ink-2 leading-relaxed dir-rtl">
                            <p>
                                ראש השנה 2026 חל בסוף שבוע ארוך – ערב החג ביום שישי, 11 בספטמבר, והחג נמשך עד מוצאי שבת. זה אחד מעומסי היציאה הגדולים של השנה: פסטיבלי טבע וטראנס באילת ובכנרת, מסיבות מועדון ורוף-טופ בתל אביב, ואירועי open air בצפון ובדרום – הכל מתרכז לאותם שלושה ימים.
                            </p>
                            <p>
                                ב-Parties24/7 ריכזנו עבורכם את כל <strong>מסיבות ראש השנה 2026</strong> במקום אחד, ממוינות לפי תאריך. המערכת מתעדכנת בזמן אמת עם האירועים החמים ביותר, כולל מחיר כרטיס עדכני וקישור ישיר לרכישה. בין אם אתם מחפשים פסטיבל מדברי, מסיבת סאנסט על הגג או ליין מיינסטרים בלב העיר – כאן תמצאו את הבילוי המתאים לחג.
                            </p>
                            <p className="font-semibold text-ink">
                                טיפ מאיתנו: סוף השבוע של ראש השנה נמכר מראש כמעט תמיד. שריינו כרטיס ברגע שסוגרים אירוע – מחירי ה-Early Bird נגמרים מוקדם.
                            </p>
                        </div>
                    </div>
                </section>

                {/* PARTIES GRID */}
                <section id="parties" className="container mx-auto px-4">
                    <h2 className="mb-2 text-center text-[28px] font-bold text-ink sm:text-[40px]">
                        לוח מסיבות ראש השנה
                    </h2>

                    {holidayParties.length > 0 ? (
                        <PartyGrid
                            parties={holidayParties}
                            showFilters={false}
                            showSearch={false}
                            title=""
                        />
                    ) : (
                        <div className="mx-auto max-w-[680px] rounded-[28px] bg-tile px-6 py-14 text-center">
                            <h3 className="text-2xl text-ink mb-2">טרם פורסמו מסיבות לראש השנה 2026</h3>
                            <p className="text-ink">המערכת מתעדכנת 24/7. שווה לחזור ולהתעדכן בקרוב!</p>
                            <Link href="/all-parties" className="mt-6 inline-block px-6 py-3 bg-action text-on-action font-medium rounded-full hover:bg-action-hover transition-colors">
                                לכל המסיבות באתר
                            </Link>
                        </div>
                    )}
                </section>

                {/* FAQ SECTION */}
                <section className="container mx-auto px-4 mt-16">
                    <div className="rounded-[28px] bg-tile p-6 sm:p-10 max-w-4xl mx-auto dir-rtl">
                        <h2 className="text-[28px] font-bold text-ink sm:text-[36px] mb-8 text-center">שאלות נפוצות – מסיבות ראש השנה</h2>
                        <div className="space-y-6">
                            {FAQS.map((f) => (
                                <div key={f.question}>
                                    <h3 className="mb-2 text-[17px] font-semibold text-ink">{f.question}</h3>
                                    <p className="text-ink-2 leading-relaxed">{f.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}

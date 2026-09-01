import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { Party } from "@/data/types";
import PartyGrid from '@/components/PartyGrid';
import JungleDecorations from '@/components/JungleDecorations';
import * as api from '@/services/api';
import { BASE_URL } from '@/data/constants';

export const revalidate = 60;

const HOLIDAY_TERMS = ['סוכות', 'סֻכּוֹת', 'חג הסוכות', 'sukkot', 'succot', 'sukkoth'];

const FAQS = [
    {
        question: 'מתי מסיבות סוכות 2026?',
        answer: 'חג הסוכות תשפ״ז מתחיל בערב שישי, 25 בספטמבר 2026, ונמשך עד 2–3 באוקטובר (הושענא רבה ושמחת תורה). מדובר בשבוע שלם של חול המועד עם פסטיבלים, מסיבות טבע ואירועי open air כמעט מדי ערב.',
    },
    {
        question: 'מה ההבדל בין מסיבות סוכות למסיבות ראש השנה?',
        answer: 'ראש השנה מרוכז בסוף שבוע אחד, בעוד שסוכות נפרש על שבוע שלם של חול המועד. לכן בסוכות יש יותר פסטיבלים רב-יומיים במדבר ובצפון, לצד מסיבות המועדון הרגילות של תל אביב לאורך כל השבוע.',
    },
    {
        question: 'האם צריך לקנות כרטיסים מראש לסוכות?',
        answer: 'כן, במיוחד לפסטיבלים הגדולים. אירועי חול המועד סוכות נמכרים מראש ולעיתים אוזלים לפני החג. מומלץ לרכוש כרטיס במחיר Early Bird ברגע שסוגרים אירוע.',
    },
    {
        question: 'איך מתעדכנים באירועים חדשים של סוכות?',
        answer: 'העמוד מתעדכן אוטומטית 24/7 ככל שמפיקים מוסיפים אירועים. שווה לחזור אליו לאורך חול המועד – אירועים חדשים מתווספים לאורך כל השבוע.',
    },
];

async function getSukkotData() {
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
        console.error("Failed to fetch Sukkot data:", error);
        return { holidayParties: [] };
    }
}

export const metadata: Metadata = {
    title: 'מסיבות סוכות 2026 | לוח המסיבות והפסטיבלים לחול המועד - Parties24/7',
    description: 'כל מסיבות סוכות 2026 במקום אחד! פסטיבלים רב-יומיים, מסיבות טבע, רייבים ואירועי open air לכל חול המועד בתל אביב, אילת, הכנרת ובמדבר. כרטיסים, מחירים ועדכונים בזמן אמת.',
    keywords: ['מסיבות סוכות', 'מסיבות סוכות 2026', 'מסיבות חול המועד סוכות', 'פסטיבלים סוכות', 'סוכות 2026', 'מסיבות טבע סוכות', 'רייבים סוכות'],
    alternates: {
        canonical: '/sukkot',
    },
    openGraph: {
        title: 'מסיבות סוכות 2026 | האירועים הכי חמים בחול המועד',
        description: 'מחפשים לאן לצאת בסוכות? כל הפסטיבלים, מסיבות הטבע ואירועי ה-open air של סוכות 2026 מרוכזים כאן לפי תאריך. כנסו עכשיו!',
        url: `${BASE_URL}/sukkot`,
        type: 'website',
    },
};

export default async function SukkotPage() {
    const { holidayParties } = await getSukkotData();

    const collectionJsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "מסיבות סוכות 2026",
        "description": "לוח המסיבות, הפסטיבלים ואירועי הטבע המלא לחג הסוכות וחול המועד 2026 בישראל.",
        "url": `${BASE_URL}/sukkot`,
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

            <main className="min-h-screen bg-jungle-deep text-white pb-20 relative overflow-x-hidden -mt-20">
                <JungleDecorations />

                {/* HERO SECTION */}
                <section className="relative h-[48vh] md:h-[52vh] md:min-h-[440px] pt-10 flex flex-col items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 z-0 bg-gradient-to-br from-jungle-deep via-jungle-surface to-jungle-deep">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(191,255,0,0.14),transparent_55%)]"></div>
                        <div className="absolute inset-0 bg-gradient-to-b from-jungle-deep/40 via-jungle-deep/50 to-jungle-deep/90"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-4 text-center pb-8">
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-jungle-lime to-jungle-accent drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)] mb-6">
                            מסיבות סוכות 2026
                        </h1>
                        <p className="text-lg md:text-2xl text-white max-w-2xl mx-auto font-light leading-relaxed drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                            שבוע שלם של חול המועד – פסטיבלים, מסיבות טבע ואירועי open air לפי תאריך.
                            <br />
                            <span className="font-bold text-jungle-lime">שבעה ימים, המון ליינים.</span>
                        </p>
                    </div>
                </section>

                {/* CONTENT & INFO SECTION */}
                <section className="container mx-auto px-4 mt-8 relative z-20 mb-16">
                    <div className="bg-jungle-surface/80 backdrop-blur-md border border-jungle-accent/20 rounded-2xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto text-center md:text-right">
                        <h2 className="text-3xl font-display text-white mb-6 text-center">חוגגים את סוכות עם Parties24/7</h2>

                        <div className="space-y-4 text-lg text-jungle-text/90 leading-relaxed dir-rtl">
                            <p>
                                חג הסוכות 2026 נפתח בערב שישי, 25 בספטמבר, ונמשך שבוע שלם של חול המועד עד תחילת אוקטובר. בניגוד לראש השנה שמרוכז בסוף שבוע אחד, סוכות פורש על פני שבוע – מה שמאפשר פסטיבלים רב-יומיים במדבר ובצפון, לצד מסיבות מועדון, רוף-טופ ו-open air כמעט מדי ערב.
                            </p>
                            <p>
                                ב-Parties24/7 ריכזנו עבורכם את כל <strong>מסיבות סוכות 2026</strong> במקום אחד, ממוינות לפי תאריך, עם מחיר כרטיס עדכני וקישור ישיר לרכישה. בין אם אתם מתכננים פסטיבל שלושה ימים במדבר, מסיבת טבע על הכנרת או ערב מיינסטרים בעיר – כאן תמצאו את כל האפשרויות לחול המועד.
                            </p>
                            <p className="font-bold text-jungle-lime">
                                טיפ מאיתנו: הפסטיבלים הגדולים של סוכות נמכרים מראש ואוזלים לפני החג. שריינו כרטיס מוקדם ככל האפשר.
                            </p>
                        </div>
                    </div>
                </section>

                {/* PARTIES GRID */}
                <section id="parties" className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-display text-white mb-10 text-center border-b border-wood-brown/50 pb-4 inline-block mx-auto min-w-[300px]">
                        לוח מסיבות סוכות
                    </h2>

                    {holidayParties.length > 0 ? (
                        <PartyGrid
                            parties={holidayParties}
                            showFilters={false}
                            showSearch={false}
                            title=""
                        />
                    ) : (
                        <div className="text-center py-20 bg-jungle-surface/30 rounded-xl border border-dashed border-wood-brown/30">
                            <h3 className="text-2xl text-white mb-2">טרם פורסמו מסיבות לסוכות 2026</h3>
                            <p className="text-jungle-text">המערכת מתעדכנת 24/7. שווה לחזור ולהתעדכן בקרוב!</p>
                            <Link href="/all-parties" className="mt-6 inline-block px-6 py-3 bg-jungle-accent text-jungle-deep font-bold rounded-full hover:bg-white transition-colors">
                                לכל המסיבות באתר
                            </Link>
                        </div>
                    )}
                </section>

                {/* FAQ SECTION */}
                <section className="container mx-auto px-4 mt-16">
                    <div className="bg-jungle-surface/70 backdrop-blur-md border border-jungle-accent/20 rounded-2xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto dir-rtl">
                        <h2 className="text-3xl font-display text-white mb-8 text-center">שאלות נפוצות – מסיבות סוכות</h2>
                        <div className="space-y-6">
                            {FAQS.map((f) => (
                                <div key={f.question}>
                                    <h3 className="text-xl font-bold text-jungle-lime mb-2">{f.question}</h3>
                                    <p className="text-jungle-text/90 leading-relaxed">{f.answer}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </main>
        </>
    );
}

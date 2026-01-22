import React from 'react';
import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import PartyGrid from '@/components/PartyGrid';
import JungleDecorations from '@/components/JungleDecorations';
import * as api from '@/services/api';
import { BASE_URL } from '@/data/constants';

export const revalidate = 60;

export const metadata: Metadata = {
    title: 'מסיבות פורים 2026 | לוח המסיבות והפסטיבלים המלא - Parties24/7',
    description: 'כל מסיבות פורים 2026 במקום אחד! רשימת המסיבות, נשפי התחפושות והפסטיבלים הכי חמים של פורים בתל אביב ובכל הארץ. כרטיסים, הנחות ועדכונים.',
    keywords: ['מסיבות פורים', 'פורים 2026', 'מסיבות פורים תל אביב', 'פסטיבלים פורים', 'כרטיסים למסיבות פורים'],
    alternates: {
        canonical: '/purim',
    },
    openGraph: {
        title: 'מסיבות פורים 2026 | האירועים הכי חמים בישראל',
        description: 'מחפשים לאן לצאת בפורים? כל המסיבות, הפסטיבלים ונשפי התחפושות של פורים 2026 מחכים לכם כאן. כנסו עכשיו!',
        url: `${BASE_URL}/purim`,
        images: [
            {
                url: `${BASE_URL}/purim-hero.png`,
                width: 1200,
                height: 630,
                alt: 'מסיבות פורים 2026',
            },
        ],
    },
};

async function getPurimData() {
    try {
        const [carousels, allParties] = await Promise.all([
            api.getCarousels(),
            api.getParties()
        ]);

        // 1. Try to find a specific Purim carousel
        let purimCarousel = carousels.find(c =>
            c.title.includes('פורים') || c.title.toLowerCase().includes('purim')
        );

        let purimParties = [];

        if (purimCarousel) {
            // If we have a carousel, prioritize its logic
            purimParties = allParties.filter(party =>
                purimCarousel!.partyIds.includes(party.id)
            );
        }

        // 2. Fallback or Supplement: Filter by tag/name if carousel is empty or missing
        // We want to make sure this page is populated even if the admin didn't make a carousel yet.
        if (purimParties.length === 0) {
            purimParties = allParties.filter(party =>
                party.tags.some(t => t.includes('פורים') || t.toLowerCase().includes('purim')) ||
                party.name.includes('פורים') ||
                party.name.toLowerCase().includes('purim')
            );
        }

        // Sort by date
        purimParties.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        return { purimParties, purimCarousel };

    } catch (error) {
        console.error("Failed to fetch Purim data:", error);
        return { purimParties: [], purimCarousel: null };
    }
}

export default async function PurimPage() {
    const { purimParties } = await getPurimData();

    // Defines JSON-LD for the Event Series or Collection
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "מסיבות פורים 2026",
        "description": "לוח המסיבות והאירועים המלא לחג פורים 2026 בישראל.",
        "url": `${BASE_URL}/purim`,
        "mainEntity": {
            "@type": "ItemList",
            "itemListElement": purimParties.map((party, index) => ({
                "@type": "ListItem",
                "position": index + 1,
                "url": `${BASE_URL}/event/${party.slug}`,
                "name": party.name
            }))
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <main className="min-h-screen bg-jungle-deep text-white pb-20 relative overflow-x-hidden">
                <JungleDecorations />

                {/* HERO SECTION */}
                <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
                    {/* Background Image */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/purim-hero.png"
                            alt="Purim Rave Background"
                            fill
                            className="object-cover opacity-60"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-jungle-deep/30 via-jungle-deep/60 to-jungle-deep"></div>
                    </div>

                    <div className="relative z-10 container mx-auto px-4 text-center mt-10">
                        <h1 className="text-5xl md:text-7xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-jungle-lime to-jungle-accent drop-shadow-[0_2px_10px_rgba(118,200,147,0.5)] mb-6">
                            מסיבות פורים 2026
                        </h1>
                        <p className="text-xl md:text-2xl text-jungle-text max-w-2xl mx-auto font-light leading-relaxed">
                            המדריך המלא למסיבות, הנשפים והפסטיבלים הכי שווים של החג.
                            <br />
                            <span className="font-bold text-white">כי בפורים הזה לא נשארים בבית!</span>
                        </p>
                    </div>
                </section>

                {/* CONTENT & INFO SECTION */}
                <section className="container mx-auto px-4 -mt-10 relative z-20 mb-16">
                    <div className="bg-jungle-surface/80 backdrop-blur-md border border-jungle-accent/20 rounded-2xl p-8 md:p-12 shadow-2xl max-w-4xl mx-auto text-center md:text-right">
                        <h2 className="text-3xl font-display text-white mb-6 text-center">חוגגים את פורים עם Parties24/7</h2>

                        <div className="space-y-4 text-lg text-jungle-text/90 leading-relaxed dir-rtl">
                            <p>
                                חג פורים הוא ללא ספק החג הכי שמח, צבעוני ומרים בלוח השנה הישראלי. זה הזמן שבו כולם שמים מסכות, שוכחים מהשגרה ויוצאים לחגוג עד אור הבוקר בפסטיבלים ענקיים, מסיבות טבע סוחפות ומסיבות טכנו אורבניות שהעיר מציעה.
                            </p>
                            <p>
                                ב-Parties24/7 ריכזנו עבורכם את כל <strong>מסיבות פורים 2026</strong> השוות ביותר במקום אחד. המערכת שלנו מתעדכנת בזמן אמת עם האירועים החמים ביותר בתל אביב, חיפה, והדרום. בין אם אתם מחפשים נשף תחפושות יוקרתי, רייב המוני תחת כיפת השמיים או מסיבת מחתרת אינטימית - כאן תמצאו את הבילוי המושלם לחג.
                            </p>
                            <p className="font-bold text-jungle-lime">
                                טיפ מאיתנו: הכרטיסים למסיבות פורים נחטפים במהירות שיא. אל תחכו לרגע האחרון – שריינו מקום עוד היום!
                            </p>
                        </div>
                    </div>
                </section>

                {/* PARTIES GRID */}
                <section id="parties" className="container mx-auto px-4">
                    <h2 className="text-3xl md:text-4xl font-display text-white mb-10 text-center border-b border-wood-brown/50 pb-4 inline-block mx-auto min-w-[300px]">
                        לוח מסיבות פורים
                    </h2>

                    {purimParties.length > 0 ? (
                        <PartyGrid
                            parties={purimParties}
                            showFilters={false}
                            showSearch={false}
                            title=""
                        />
                    ) : (
                        <div className="text-center py-20 bg-jungle-surface/30 rounded-xl border border-dashed border-wood-brown/30">
                            <h3 className="text-2xl text-white mb-2">טרם פורסמו מסיבות לפורים 2026</h3>
                            <p className="text-jungle-text">המערכת מתעדכנת 24/7. שווה לחזור ולהתעדכן בקרוב!</p>
                            <Link href="/all-parties" className="mt-6 inline-block px-6 py-3 bg-jungle-accent text-jungle-deep font-bold rounded-full hover:bg-white transition-colors">
                                לכל המסיבות באתר
                            </Link>
                        </div>
                    )}
                </section>

            </main>
        </>
    );
}

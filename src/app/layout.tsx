// app/layout.tsx
import type { Metadata } from "next";
import "../styles/tailwind.css"; // Ensure this path is correct
import Providers from "./providers";
import SwiperRegister from "../components/SwiperRegister";
import { Assistant, Rubik } from "next/font/google";
import { BASE_URL, BRAND_LOGO_URL } from "@/data/constants";
import Script from "next/script";

// Component Imports
import Header from '../components/Header';
import Footer from '../components/Footer';
import JungleDecorations from '../components/JungleDecorations';

import CookieBanner from '../components/CookieBanner';
import ScrollToTop from '../components/ScrollToTop';
import PrefetchLinks from '../components/PrefetchLinks';
import PageCrossLinks from '../components/PageCrossLinks';
import AnalyticsTracker from '../components/AnalyticsTracker';

const assistant = Assistant({
  subsets: ["latin", "hebrew"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-assistant",
});

const rubik = Rubik({
  subsets: ["latin", "hebrew"],
  weight: ["800"],
  display: "swap",
  variable: "--font-rubik",
});

export const metadata: Metadata = {
  title: {
    default: "Parties247 | מסיבות וחיי לילה בישראל",
    template: "%s | Parties247",
  },
  description: "Parties247 – כל המסיבות, האירועים וחיי הלילה בישראל במקום אחד. תל אביב, חיפה, ירושלים ועוד.",
  metadataBase: new URL(BASE_URL),
  icons: {
    icon: [
      {
        url: "https://www.parties247.co.il/icon-144-favicon.png",
        sizes: "144x144",
        type: "image/png",
      }
    ],
    apple: "https://www.parties247.co.il/icon-144-favicon.png",
  },
  openGraph: {
    siteName: "Parties 24/7",
    type: "website",
    locale: "he_IL",
    images: [
      {
        url: BRAND_LOGO_URL,
        width: 1200,
        height: 630,
        alt: "Parties 24/7 – מסיבות בישראל",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@parties_247",
    images: [BRAND_LOGO_URL],
  },
};

import { SOCIAL_LINKS } from "@/data/constants";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Parties 24/7",
  url: BASE_URL,
  logo: BRAND_LOGO_URL,
  sameAs: [
    SOCIAL_LINKS.instagram,
    SOCIAL_LINKS.tiktok,
  ],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    availableLanguage: "Hebrew",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl" className={`${assistant.variable} ${rubik.variable}`}>
      {/* Google Tag Manager */}
      <Script id="gtm-head" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-K6CHZLLX');`}
      </Script>
      <body suppressHydrationWarning className="font-sans">
        {/* Google Tag Manager (noscript fallback) */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-K6CHZLLX"
            height="0"
            width="0"
            style={{ display: 'none', visibility: 'hidden' }}
          />
        </noscript>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <SwiperRegister />
        <Providers>
          {/* Global Decorations/Logic */}
          <PrefetchLinks />
          <AnalyticsTracker />
          <ScrollToTop />
          <JungleDecorations />

          {/* Main Layout Structure */}
          <div className="min-h-screen flex flex-col relative z-10">
            <Header />

            <main className="flex-grow pb-8">
              {/* Page Transition Wrapper */}
              <div className="page-transition">
                {children}
              </div>
              <PageCrossLinks />
            </main>

            <Footer />
          </div>

          {/* Global Modals/Overlays */}

          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}

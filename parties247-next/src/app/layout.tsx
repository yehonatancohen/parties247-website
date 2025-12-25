// app/layout.tsx
import type { Metadata } from "next";
import "../styles/tailwind.css"; // Ensure this path is correct
import Providers from "./providers";
import SwiperRegister from "./_components/SwiperRegister";

// Component Imports
import Header from '../components/Header';
import Footer from '../components/Footer';
import JungleDecorations from '../components/JungleDecorations';
import CommunityPopup from '../components/CommunityPopup';
import CookieBanner from '../components/CookieBanner';
import ScrollToTop from '../components/ScrollToTop';
import PrefetchLinks from '../components/PrefetchLinks';
import PageCrossLinks from '../components/PageCrossLinks';

export const metadata: Metadata = {
  title: {
    default: "Parties247",
    template: "%s | Parties247",
  },
  description: "Find parties and nightlife events in Israel.",
  metadataBase: new URL("https://www.parties247.co.il"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he" dir="rtl">
      <body suppressHydrationWarning>
        <SwiperRegister />
        <Providers>
          {/* Global Decorations/Logic */}
          <PrefetchLinks />
          <ScrollToTop />
          <JungleDecorations />

          {/* Main Layout Structure */}
          <div className="min-h-screen flex flex-col relative z-10">
            <Header />
            
            <main className="flex-grow py-8">
              {/* Page Transition Wrapper */}
              <div className="page-transition">
                {children}
              </div>
              <PageCrossLinks />
            </main>

            <Footer />
          </div>

          {/* Global Modals/Overlays */}
          <CommunityPopup />
          <CookieBanner />
        </Providers>
      </body>
    </html>
  );
}
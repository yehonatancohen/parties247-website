import type { Metadata } from "next";

import "../styles/tailwind.css";
import CommunityPopup from "@/components/CommunityPopup";
import CookieBanner from "@/components/CookieBanner";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import JungleDecorations from "@/components/JungleDecorations";
import PageCrossLinks from "@/components/PageCrossLinks";
import PrefetchLinks from "@/components/PrefetchLinks";
import ScrollToTop from "@/components/ScrollToTop";
import Providers from "./providers";
import SwiperRegister from "./_components/SwiperRegister";

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
      <head>
        <PrefetchLinks />
      </head>
      <body suppressHydrationWarning>
        <SwiperRegister />
        <Providers>
          <JungleDecorations />
          <div className="min-h-screen flex flex-col relative z-10">
            <Header />
            <main className="flex-grow py-8">
              <div className="page-transition">{children}</div>
              <PageCrossLinks />
            </main>
            <Footer />
          </div>
          <CommunityPopup />
          <CookieBanner />
          <ScrollToTop />
        </Providers>
      </body>
    </html>
  );
}

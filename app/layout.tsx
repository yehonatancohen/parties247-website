import type { Metadata } from 'next';
import './globals.css';
import { BASE_URL, BRAND_LOGO_URL, SOCIAL_LINKS } from '../constants';
import Header from './ui/Header';
import Footer from './ui/Footer';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    default: 'Parties 24/7 | כל המסיבות החמות בישראל',
    template: '%s | Parties 24/7',
  },
  description: 'מסיבות, רייבים ופסטיבלים בכל הארץ – מתעדכן כל הזמן.',
  openGraph: {
    type: 'website',
    siteName: 'Parties 24/7',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Parties 24/7',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@parties247',
  },
  alternates: {
    languages: {
      he: '/',
      en: '/?lang=en',
    },
  },
};

const ORGANIZATION_JSON_LD = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  '@id': `${BASE_URL}#organization`,
  name: 'Parties 24/7',
  url: BASE_URL,
  logo: {
    '@type': 'ImageObject',
    url: BRAND_LOGO_URL,
  },
  sameAs: [SOCIAL_LINKS.instagram, SOCIAL_LINKS.tiktok, SOCIAL_LINKS.whatsapp],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="he" dir="rtl">
      <body>
        <Header />
        <main className="min-h-screen page-transition">{children}</main>
        <Footer />
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORGANIZATION_JSON_LD) }}
        />
      </body>
    </html>
  );
}

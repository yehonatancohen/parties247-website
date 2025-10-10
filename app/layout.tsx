import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

const SITE_URL = new URL("https://www.parties247.co.il");

export const metadata: Metadata = {
  metadataBase: SITE_URL,
  title: {
    default: "Parties 24/7 | מסיבות ואירועים בישראל",
    template: "%s | Parties 24/7"
  },
  description:
    "Parties 24/7 מציג את המסיבות הכי עדכניות בישראל עם דפי עיר, קהל וזן מוזיקלי שמאורגנים לניווט מהיר בעברית.",
  openGraph: {
    type: "website",
    locale: "he_IL",
    siteName: "Parties 24/7",
    url: SITE_URL
  },
  twitter: {
    card: "summary_large_image",
    site: "@parties247",
    title: "Parties 24/7",
    description:
      "כל המסיבות בישראל בדפים מהירים לניווט: ערים, קהלים, ז'אנרים ולוח אירועים מעודכן."
  },
  alternates: {
    canonical: SITE_URL,
    languages: {
      "he-IL": SITE_URL.toString()
    }
  }
};

const primaryNav = [
  { href: "/תל-אביב", label: "תל אביב" },
  { href: "/ירושלים", label: "ירושלים" },
  { href: "/חיפה", label: "חיפה" },
  { href: "/מסיבות-נוער", label: "מסיבות נוער" },
  { href: "/טכנו", label: "טכנו" },
  { href: "/היום", label: "היום" }
];

const footerShortcuts = [
  { href: "/תל-אביב/היום", label: "מסיבות בתל אביב היום" },
  { href: "/תל-אביב/טכנו", label: "טכנו בתל אביב" },
  { href: "/מסיבות-סטודנטים", label: "מסיבות לסטודנטים" },
  { href: "/מסיבות-נוער", label: "מסיבות לנוער" }
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Parties 24/7",
  url: "https://www.parties247.co.il",
  logo: "https://www.parties247.co.il/logo.png",
  sameAs: [
    "https://www.instagram.com/parties247",
    "https://www.facebook.com/parties247"
  ],
  areaServed: "IL",
  knowsAbout: [
    "מסיבות",
    "מסיבות בתל אביב",
    "מסיבות טכנו",
    "מסיבות סטודנטים",
    "מסיבות נוער"
  ]
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Parties 24/7",
  url: "https://www.parties247.co.il",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.parties247.co.il/חיפוש?query={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="he" dir="rtl">
      <head>
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://fonts.googleapis.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Assistant:wght@400;600;700&family=Rubik:wght@400;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(organizationSchema)
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(websiteSchema)
          }}
        />
      </head>
      <body>
        <header style={{ padding: "1.5rem", textAlign: "center" }}>
          <Link href="/" style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Parties 24/7
          </Link>
          <nav
            style={{
              marginTop: "1rem",
              display: "flex",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "0.75rem"
            }}
            aria-label="ניווט ראשי"
          >
            {primaryNav.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main>{children}</main>
        <footer className="footer">
          <p>
            Parties 24/7 · רחוב המסיבה 5, תל אביב · 03-555-2470 · שירות לקוחות:
            info@parties247.co.il
          </p>
          <nav aria-label="קישורי פוטר">
            {footerShortcuts.map((link) => (
              <Link key={link.href} href={link.href}>
                {link.label}
              </Link>
            ))}
          </nav>
          <p style={{ marginTop: "1rem" }}>
            © {new Date().getFullYear()} Parties 24/7. כל הזכויות שמורות. האתר
            פועל כעסק שירות בכל הארץ עם התמקדות בגוש דן.
          </p>
        </footer>
      </body>
    </html>
  );
}

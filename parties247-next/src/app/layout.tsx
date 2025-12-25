import type { Metadata } from "next";

// Keep your existing global styles from the Vite app.
// If your project uses a different global stylesheet path, update this import.
import "../styles/tailwind.css";

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
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}

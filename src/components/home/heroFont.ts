import { Rubik } from 'next/font/google';

// Display face for the home hero headline only; the rest of the site stays Heebo.
// Latin is listed for the full stop, which the Hebrew subset doesn't cover.
export const heroFont = Rubik({
  subsets: ['hebrew', 'latin'],
  weight: '800',
  display: 'swap',
});

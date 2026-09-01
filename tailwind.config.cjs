/** @type {import('tailwindcss').Config} */
module.exports = {
  // Wrap every hover: / group-hover: utility in `@media (hover: hover)` so hover
  // styles never fire on touch. Fixes the "tap once to hover, tap again to
  // activate" bug — Clarity session recordings (2026-09-01) showed the PartyCard
  // "פרטים וכרטיסים" CTA registering a dead click on the first tap because the
  // card's group-hover transform shifted the button under the finger mid-tap.
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}", 
    "./src/hooks/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/data/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/services/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'jungle-deep': '#0a1a1a',
        'jungle-surface': '#162b2b',
        'jungle-accent': '#76c893',
        'jungle-lime': '#a7ff83',
        'jungle-text': '#e0f0e3',
        'wood-brown': '#4d3b2a',
      },
      fontFamily: {
        sans: ['var(--font-assistant)', '"Assistant"', 'sans-serif'],
        display: ['var(--font-rubik)', '"Rubik"', 'sans-serif'],
      },
      boxShadow: {
        'jungle-glow':
          '0 0 15px theme("colors.jungle-lime"), 0 0 25px theme("colors.jungle-lime/60")',
      },
    },
  },
  plugins: [],
};
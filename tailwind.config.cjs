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
        // Jungle-night launch world — see DESIGN.md. Legacy jungle-* names are
        // kept as aliases so older markup lands on the same palette.
        stage: '#06110d',
        tile: '#0f1f19',
        'tile-hover': '#132720',
        'tile-raised': '#1a3129',
        ink: '#eef6f0',
        'ink-2': '#a9bdb2',
        'ink-3': '#8aa197',
        hairline: 'rgba(196, 255, 218, 0.11)',
        action: '#76c893',
        'action-hover': '#8fd8a8',
        'on-action': '#04120c',
        link: '#8ddca6',
        'jungle-deep': '#06110d',
        'jungle-surface': '#0f1f19',
        'jungle-accent': '#76c893',
        'jungle-lime': '#9fe6b4',
        'jungle-text': '#eef6f0',
        'wood-brown': '#23392f',
      },
      fontFamily: {
        sans: ['var(--font-heebo)', '"Heebo"', 'system-ui', 'sans-serif'],
        display: ['var(--font-heebo)', '"Heebo"', 'system-ui', 'sans-serif'],
        apple: ['var(--font-heebo)', '"Heebo"', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        apple: 'cubic-bezier(0.28, 0.11, 0.32, 1)',
      },
      boxShadow: {
        'jungle-glow':
          '0 10px 30px rgba(0, 0, 0, 0.45)',
      },
    },
  },
  plugins: [],
};
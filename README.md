# Parties24/7 Website

This repo contains the Parties24/7 marketing site rebuilt on **Next.js 14** with the App Router. Pages that list parties use ISR with hourly revalidation, and static informational pages (about/legal/etc.) are pre-rendered for maximum edge caching and SEO.

## Prerequisites
- Node.js 18+
- npm

## Getting Started
1. Install dependencies
   ```bash
   npm install
   ```
2. Run the development server
   ```bash
   npm run dev
   ```
   The app starts on http://localhost:3000.

## Production Build
Build and start the optimized production server:
```bash
npm run build
npm start
```

## Project Structure
- `app/` – Next.js App Router pages, layouts, and UI components
- `lib/` – server-side API helpers
- `data/` – static article and taxonomy data for ISR/SSG pages
- `public/` – static assets served by Next.js
- `constants.ts` – shared site metadata (base URL, social links, logo)

Legacy Vite/SPA files were removed in favor of the Next.js implementation.

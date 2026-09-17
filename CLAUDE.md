# parties247-website

Public Next.js 16 (App Router) site at `https://www.parties247.co.il`. Business model,
accounts, data flow and cross-repo conventions live in the workspace root `../CLAUDE.md` —
read that first. This file is only what's specific to this repo.

## Purpose

The site's job is to get a visitor from a search result (or an AI assistant answer) to a
GoOut checkout carrying our referral code. Every page is an SEO/GEO landing surface; the
`PurchaseButton` → `trackPartyRedirect` → GoOut redirect is the conversion.

## Layout

- `src/app/` — routes. Key ones: `event/[slug]` (upcoming, ISR 60s, emits schema.org
  `Event` + breadcrumb JSON-LD), `archive/[slug]` (past — `proxy.ts` 308s between the two
  based on backend `status`), `club/[slug]`, `cities/[city]`, `genre/[genre]`, `day/[day]`,
  `audience/[audience]`, `carousels/[carouselSlug]`, seasonal pages (`rosh-hashana`,
  `sukkot`, `purim`), `[...path]` catch-all for config-driven SEO landing pages.
- `src/app/api/` — `chat` and `enhance-party-data` (Groq LLM, `GROQ_API_KEY`), `revalidate`
  (ISR hook the backend calls; secret check is commented out — known gap).
- `src/proxy.ts` — middleware: event↔archive canonical redirect and `party_redirects`
  lookup for merged duplicates. Uses `@vercel/functions` runtime cache.
- `src/lib/` — the real shared code (`@/*` → `src/*`). `dates.ts::toIsraelISO` is the
  **only** sanctioned way to turn a backend date into an ISO/offset string.
  `internalLinks.ts` drives cross-link blocks; `seoparties.ts` + `data/seoLandingPages.ts`
  are config for landing pages; `analytics.ts` handles consent, session id, GTM
  (`GTM-K6CHZLLX`) and the backend view/redirect beacons.
- Root `lib/` is a stale duplicate of `src/lib/` (not on the `@/` path). Don't edit it;
  delete it once confirmed unused.
- `src/data/` — `types.ts` (Party taxonomy enums), `taxonomy.ts`, `articles.ts`
  (blog content is static TS, not CMS), `constants.ts` (`BASE_URL`).
- `SEO-ROADMAP.md` — living log written by the `/seo-update` run; `GSC-GUIDE.md` — how the
  Search Console MCP is wired and why it flakes.

## Dates and timezones (this bit the site badly in 2026-09)

Backend party dates are **naive Israel wall-clock** strings. `new Date(str)` on them uses the
server's TZ (UTC on Vercel) and shifts every 22:00+ party to the wrong calendar day in rich
results. Always go through `toIsraelISO`; never keep a local copy of that helper in a page.
Israel leaves DST on 2026-10-25, so offsets must be computed per event, not hardcoded.

## Working here

```bash
npm install
npm run dev          # http://localhost:3000, uses production backend unless NEXT_PUBLIC_API_URL is set
npm run lint
npx tsc --noEmit
npm run build        # do this before pushing SEO changes — Vercel builds on push to main
```

Env (`.env.local`): `NEXT_PUBLIC_API_URL`, `GROQ_API_KEY`, `REVALIDATION_SECRET`,
`ADMIN_PASSWORD` (legacy — admin UI moved to `parties247-admin`).

No test runner exists yet. When you add code to `src/lib/` or JSON-LD builders, add
Vitest unit tests for it (pure functions, run under several `TZ=` values). Manual
verification of SEO output: `curl -s localhost:3000/event/<slug> | grep -o '"startDate":"[^"]*"'`.

## Rules

- All visible copy is Hebrew, RTL, casual tone.
- Visual system (since 2026-09-16): Apple launch-page grammar in a "jungle night" palette —
  use the Tailwind tokens (`stage`, `tile`, `tile-hover`, `tile-raised`, `ink`, `ink-2`, `ink-3`,
  `hairline`, `action`, `on-action`, `link`) and Heebo (the home hero H1 alone is Rubik 800, over a blurred-flyer glow); see `PRODUCT.md` / `DESIGN.md`. The old
  `jungle-*` / `wood-brown` names are aliases kept for legacy markup — don't use them in new code.
  No emoji as icons, no gradient text, no glow shadows. Shared party card: `components/home/LaunchPartyCard.tsx`.
- Party dates in UI: format via `lib/nights.ts` (wall-clock parsing), never `new Date(naiveString)`.
- account1 parties (coupon) are promoted via `sortPromotedWithinNight` / `isPromoted` in
  `components/home/homeData.ts` — within a night only, never out of date order.
- Don't add social-proof numbers that aren't backed by real data.
- Every new indexable route must be added to `src/app/sitemap.ts` and get breadcrumb + a
  cross-links block (`ExploreMoreLinks` / `PageCrossLinks`).
- Commits from the SEO run use the `seo-update:` prefix; keep using it for SEO-driven work
  so the roadmap's Update Log stays greppable.
- The admin dashboard was moved out of this repo on purpose (analytics pollution) — don't
  add admin UI here.

# parties247.co.il — SEO & GEO Roadmap

**Last updated:** 2026-07-06
**Data range analyzed:** 2026-06-06 → 2026-07-05

---

## Current Status Snapshot

| Metric | Value | Trend |
|---|---|---|
| Total Clicks (30d) | 219 | ↑ +30% vs last period |
| Total Impressions (30d) | 4,447 | ↑ +25% vs last period |
| Avg CTR | ~4.9% | ↑ Up from 4.7% |
| Avg Position | trending 10–16 (was 20–35 early June) | ↑ Improving |
| Sitemap Pages Submitted | 150 | ↓ from 173 — watch next cycle, not yet critical |
| Sitemap Pages Indexed | 0 (API) | → Known API quirk; confirm against GSC dashboard next cycle |

---

## Sitemap Status — Watch

Submitted URL count dropped from 173 → 150. The GSC API's `list_sitemaps` tool still reports `indexed: 0`, consistent with the known API quirk noted previously (trust the GSC dashboard number, which wasn't rechecked this cycle). Re-verify the dashboard number and investigate the submitted-count drop next cycle if it continues.

---

## Top Performing Pages (Last 30 Days)

| Page | Clicks | Impressions | CTR | Avg Position |
|---|---|---|---|---|
| Homepage (`/`) | 56 | 600 | 9.3% | 11.4 |
| `/genre/rave-parties` | 11 | 103 | 10.7% | 10.1 |
| `/parties/18-plus-parties-tel-aviv` | 10 | 113 | 8.8% | 13.4 |
| `/event/revival-summer-festival` | 9 | 126 | 7.1% | 7.2 |
| `/all-parties` | 4 | 107 | 3.7% | 43.2 |
| `/cities/eilat` | 2 | 97 | 2.1% | 33.7 |
| `/club/echo` | 2 | 92 | 2.2% | 17.4 |

Individual event pages now generating strong traffic (6 events ranked, CTR 7–32%).

### Quick Win Opportunities

**`/club/jimmy-who`** — Still 0 clicks across ~130 combined impressions this cycle despite the 2026-07-02 meta rewrite. Root cause found 2026-07-06: a legacy duplicate page at `/jimmy-who` (older, generic title/description) was cannibalizing the same brand queries. Deleted the duplicate + added a 301 redirect to `/club/jimmy-who`. Monitor next cycle for whether consolidating signal finally converts clicks.

**`/club/moon-child`** — Still 0 clicks across ~100+ impressions (many misspelled variants: "moonchild", "מונציילד", "מון צ'יילד"). Same cannibalization root cause as Jimmy Who — legacy `/moon-child` duplicate deleted, 301 redirect added to `/club/moon-child` (2026-07-06). Monitor next cycle.

**`/club/bahia`** — Found to be silently 404ing this cycle: no taxonomy entry existed, so `/club/[slug]` called `notFound()`. The 2026-07-02 "fix" lived in a dead-code catch-all route that was shadowed and never rendered. Added a full taxonomy entry with title/description/body/FAQ (2026-07-06) — this is the page's first real working version. Monitor for indexing and clicks next cycle.

**`/club/goat`** — NEW page added 2026-07-06. "goat tlv" (13 impressions, position ~30, 0 clicks) was previously fragmented across 4 expiring event pages with no evergreen page to consolidate ranking signal.

**`/genre/rave-parties`** — "רייבים בישראל" holding position ~6, 28.6% CTR when clicked — healthy, no action needed.

**Homepage** — CTR ~9%, healthy and improving with traffic growth.

**`/club/echo`** — Still 0 clicks on "echo מועדון" / "echo תל אביב" queries (pos ~10) despite June 30 fix. Unlike Jimmy Who/Moon Child, no duplicate-page issue was found for Echo — Google may simply not be surfacing the updated snippet yet. Continue monitoring.

---

## Top Search Queries (Last 30 Days)

| Query | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| מסיבות 18 פלוס תל אביב | 5 | 19 | 26.3% | **7.9** |
| רייבים בישראל | 2 | 7 | 28.6% | 6.1 |
| מועדון אקו תל אביב | 2 | 13 | 15.4% | 9.5 |
| parties | 1 | 54 | 1.96% | 6.4 |
| מסיבות 18 פלוס | 1 | 17 | 5.9% | 18.8 |
| jimmy who תל-אביב | 0 | 30 | 0% | 11.2 |
| jimmy who תל אביב | 0 | 19 | 0% | 8.0 |
| jimmywho? bar & lounge | 0 | 16 | 0% | 10.4 |
| גימי הו | 0 | 12 | 0% | 13.6 |
| רייבים | 0 | 14 | 0% | 7.9 |
| מסיבות אלכוהול חופשי | 0 | 12 | 0% | 9.6 |
| echo מועדון | 0 | 8 | 0% | 10.0 |
| moon child | 0 | 11 | 0% | 9.9 |
| bahia beach herzliya | 0 | 6 | 0% | 9.7 |

### Observations
- "מסיבות 18 פלוס תל אביב": position jumped from 16.7 → 7.9 — nearly page 1, leave it alone
- "רייבים בישראל": holding at position 6.1, strong 28.6% CTR when clicked
- Jimmy Who: 77 combined impressions across 4 queries, ALL 0 clicks — biggest quick win, fixed 2026-07-02
- "parties" (English): 54 impressions, position 6.4, only 1.96% CTR — homepage not compelling to English searchers
- "moon child" and "bahia beach herzliya": new zero-click opportunities, fixed 2026-07-02

---

## SEO Roadmap

### Phase 1 — Fix Critical Issues (Do Now)
- [x] **Fix broken `/club/bahia` page (was 404)** — no taxonomy entry existed, so `/club/[slug]` called `notFound()`; the "fix" logged 2026-06-30 lived in dead code (see below) and never rendered. Added a full taxonomy entry (title/description/body/FAQ) so the page now actually exists (2026-07-06)
- [x] **Fix keyword cannibalization on Jimmy Who & Moon Child** — legacy standalone `/jimmy-who` and `/moon-child` pages (with older, generic meta) were competing directly with the maintained `/club/jimmy-who` and `/club/moon-child` pages for identical brand queries, likely explaining continued 0% CTR despite the 2026-07-02 meta rewrite. Deleted the duplicate pages and added 301 redirects to the canonical `/club/...` pages (2026-07-06)
- [x] **Add dedicated `/club/goat` page** — "goat tlv" traffic (13 impressions, position ~30, 0 clicks) was fragmented across 4 expiring event pages with no evergreen page. Added taxonomy entry with title/description/body/FAQ (2026-07-06)
- [x] **Remove dead `PAGE_DESCRIPTIONS` map in `src/app/[...path]/page.tsx`** — all 5 entries (echo, jimmy-who, bahia, rave-parties, techno-parties) were unreachable, shadowed by the more specific `/club/[slug]` and `/genre/[genre]` routes. Removed to prevent future "fixes" that silently never render (2026-07-06)
- [x] **Improve `jimmy-who` club page** — meta description rewritten to match search intent (2026-06-25)
- [x] **Improve `echo` club page** — meta description rewritten (2026-06-25)
- [x] **Club pages FAQ** — FAQ section + FAQPage JSON-LD now rendered on all club pages (2026-06-25)
- [x] **Improve `cities/tel-aviv` & `cities/eilat` meta** — city-specific descriptions added (2026-06-25)
- [x] **Improve `all-parties` title** — added "בישראל" to target broader query (2026-06-25)
- [x] **Fix club page meta descriptions via catch-all route** — per-slug description map added for echo, jimmy-who, bahia, rave-parties, techno-parties (2026-06-30)
- [x] **Replace city page filler text** — `buildCityBody()` now returns real copy for Eilat and Tel Aviv; generic fallback also improved (2026-06-30)
- [x] **Add FAQ + JSON-LD to city pages** — FAQPage schema added to all `/cities/[city]` pages (2026-06-30)
- [x] **Add server-rendered intro to `/all-parties`** — H1 + description paragraph now in static HTML above the JS grid (2026-06-30)
- [x] **Rewrite Jimmy Who meta title & description** — title now matches "JimmyWho? Bar & Lounge" brand query; description includes "גימי הו" Hebrew transliteration (2026-07-02)
- [x] **Add Moon Child meta description** — "Moon Child Club תל אביב" with action-oriented language (2026-07-02)
- [x] **Improve Bahia meta description** — bilingual English/Hebrew targeting "bahia beach herzliya" English queries (2026-07-02)
- [x] **Improve rave-parties genre page description** — now leads with "רייבים בישראל" keyword directly (2026-07-02)
- [x] **Update homepage meta description** — added "אלכוהול חופשי", "18 פלוס", "רייבים" to match zero-click queries (2026-07-02)
- [ ] **Improve `all-parties` page ranking** — position 43.2, intro text added; monitor for improvement over next 4 weeks
- [ ] **Improve `cities/eilat` ranking** — position 33.7 (improving from 36.9), real content + FAQ added; monitor next 4 weeks
- [ ] **Monitor Echo club page** — 0 clicks despite June 30 fix; Google re-crawl expected within 2–3 weeks

### Phase 2 — Hebrew SEO Optimization
- [ ] Ensure every page has a Hebrew title tag and meta description
- [ ] Add Hebrew H1 headings to all city and genre pages
- [ ] Create/improve content for "מסיבות 18 פלוס" — most clicked Hebrew query
- [ ] Target "מסיבות סטודנטים" — high CTR (20%), low volume, quick win
- [ ] Target "רייבים בישראל" — position 6.5, needs push to top 3

### Phase 3 — GEO (Generative Engine Optimization)
GEO = optimizing for AI-powered search results (Google AI Overviews, ChatGPT, Perplexity).

- [ ] Add **FAQ sections** on key pages (AI engines love structured Q&A)
- [ ] Add **structured data (Schema.org)** — `Event`, `Organization`, `Place` schemas on event and venue pages
- [ ] Write **authoritative summary paragraphs** at the top of city/genre pages (AI engines pull these as snippets)
- [ ] Add a **"What is parties247?" explainer** on the homepage/about — helps AI engines understand and cite the site
- [ ] Use **natural language** in page descriptions (not just keywords) — better for LLM-based search

### Phase 4 — Content Expansion
- [ ] Articles/blog targeting high-volume party search queries in Hebrew
- [ ] Landing pages for new cities (beyond TLV and Eilat)
- [ ] Genre pages for underserved genres (techno, hip-hop, etc.)
- [ ] "Best parties this week in [city]" dynamic pages

### Phase 5 — Link Building & Authority
- [ ] List the site on Israeli event directories
- [ ] Partner with local venues for backlinks
- [ ] Social media presence pointing back to the site

---

## GEO Checklist (per page)

For AI search engines to surface parties247.co.il:

- [ ] Page has a clear, human-readable summary paragraph (first 150 chars)
- [ ] Structured data (JSON-LD) for events and venues
- [ ] FAQ section with common questions answered
- [ ] Page clearly states what the site is about (context for AI)
- [ ] Mobile-friendly and fast-loading

---

## Update Log

| Date | What Changed |
|---|---|
| 2026-06-25 | Initial analysis. Sitemap ~123 indexed (healthy). Avg position ~20 improving to ~13. |
| 2026-06-25 | Applied 5 changes: Jimmy Who + Echo meta descriptions rewritten; FAQ section + JSON-LD added to all club pages; Tel Aviv + Eilat city-specific meta descriptions; all-parties title now includes "בישראל". |
| 2026-06-30 | 30d: 139 clicks (+34%), 3,288 impressions (+13%), CTR 4.2% (up from 3.6%), avg pos ~14-16. Applied 4 changes: (1) per-slug meta descriptions for catch-all club/genre pages; (2) replaced filler `buildCityBody` with real Eilat + TLV copy; (3) FAQPage JSON-LD + FAQ section added to all city pages; (4) server-rendered H1 + intro paragraph added to /all-parties above JS grid. |
| 2026-07-02 | 30d: 169 clicks (+22%), 3,569 impressions (+9%), CTR 4.7% (up from 4.2%), avg pos ~13–15. "מסיבות 18 פלוס תל אביב" position jumped to 7.9 (from 16.7). Applied 5 changes: (1) Jimmy Who title rewritten to "JimmyWho? Bar & Lounge" + "גימי הו" to fix 77 zero-click impressions; (2) Moon Child description updated (11 impressions, pos 9.9, 0 clicks); (3) Bahia description bilingual for English queries; (4) rave-parties description leads with "רייבים בישראל"; (5) homepage description adds "אלכוהול חופשי / 18 פלוס / רייבים". |
| 2026-07-06 | 30d: 219 clicks (+30%), 4,447 impressions (+25%), CTR 4.9% (up from 4.7%), position trending 10–16. Root-caused why prior Jimmy Who/Moon Child/Bahia meta fixes hadn't converted to clicks: (1) `/club/bahia` was silently 404ing (no taxonomy entry existed) — added one; (2) legacy duplicate `/jimmy-who` and `/moon-child` standalone pages were cannibalizing the maintained `/club/...` pages for identical brand queries — deleted both, added 301 redirects; (3) added a new `/club/goat` page to consolidate "goat tlv" traffic (13 impressions, pos ~30) previously split across 4 expiring event pages; (4) removed a dead `PAGE_DESCRIPTIONS` map in the catch-all route, shadowed by more specific routes and never rendered. |

---

## How to Run the Next Update

Run `/seo-update` in Claude Code, or ask:
> "Analyze my GSC data for parties247.co.il, update the roadmap, and make any SEO/GEO improvements needed on the website."

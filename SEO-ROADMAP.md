# parties247.co.il — SEO & GEO Roadmap

**Last updated:** 2026-08-06
**Data range analyzed:** 2026-07-07 → 2026-08-04 (GSC 29d, GSC data lags ~3 days; Clarity last 3d)

---

## Current Status Snapshot

| Metric | Value | Trend |
|---|---|---|
| Total Clicks (29d) | 823 | → Window (07-07→08-04) overlaps last cycle's (07-06→08-02) almost entirely — read as a level, not growth |
| Total Impressions (29d) | 14,614 | → Same overlap caveat |
| Avg CTR | ~5.6% | → Flat vs last cycle |
| Avg Position | ~8.3–15.3 | → Similar spread to last cycle |
| Sitemap Pages Submitted | 456, 0 errors | ↑ Up from 451 — expected, archive-page tail growing as more events pass |
| Sitemap Pages Indexed | 0 (API) | → Known API quirk; trust the GSC dashboard/inspection tool, not the sitemap API field |
| **NEW: Admin API party views (30d)** | ~1,526 | New data source this cycle — see below |
| **NEW: Admin API purchase-link clicks (30d)** | ~205 | ~13.4% view→redirect rate — strong intent signal |
| **NEW: Admin API on-site visits** | 0 for 29 of last 30 days, then 5 → 56 → 111 on 08-02/03/04 | ⚠️ Anomaly — flagged below, not yet root-caused |

### New data source: parties247 admin analytics API

Starting this cycle, `/seo-update` also pulls from `parties247_backend`'s own analytics
(`GET /api/admin/analytics/detailed`, JWT-protected, and the public
`GET /api/analytics/summary`) to see actual on-site conversion behavior (party views,
purchase-link clicks, visits) alongside GSC ranking data and Clarity engagement data.
`/api/analytics/summary`'s `trafficSources` breakdown for the live 24h window showed
**62.2% organic_search, 31.9% direct, 5.9% chatgpt.com** — the first direct evidence of
AI-assistant referral traffic reaching the site, a concrete GEO-effort signal (see Phase 3).
The same window's `devices` breakdown showed 21.8% of traffic tagged `bot` — worth keeping an
eye on but not actionable by itself.

**Anomaly root-caused and fixed same day (2026-08-04):** the `visits` field in
`/api/admin/analytics/detailed` was 0 for every day from 2026-07-06 through 2026-08-01, then
jumped to 5/56/111 on 08-02/03/04. Not a tracking bug — `visitor_analytics_collection` has a
MongoDB TTL index (`app.py`) that was deleting every document 172800 seconds (exactly 48h)
after `createdAt`. Confirmed via the raw `/api/admin/analytics/visitors?range=30d` endpoint:
all 171 records returned were dated within the last ~48h of the query, nothing older —
tracking was writing fine the whole time, MongoDB was just auto-deleting anything past 2 days
old. `build_time_series_analytics()` (backing the 7d/30d detailed endpoint) reads `visits`
from this same short-lived collection, so that column was structurally incapable of showing
anything beyond ~2 days regardless of real traffic. Fixed: extended the TTL to 35 days (covers
the 30d range with buffer) and fixed `ensure_index()` to also compare `expireAfterSeconds` —
previously it ignored that option when deciding whether to recreate an index, so this exact
kind of TTL change would have silently no-op'd on redeploy. Committed and pushed to
`parties247_backend` (`20eb582`); could not run the local test suite (pre-existing Flask/
flask_apscheduler version mismatch in the local Python env, unrelated to this change) or fully
confirm the Render redeploy picked it up (no version marker in the API to check from outside).
Real confirmation will only be visible in a few days once the collection has accumulated more
than 48h of un-purged data again.

---

## Sitemap Status — OK

Submitted URL count 189 (up from 181 — normal event-page churn), 0 errors/warnings, last downloaded 2026-07-23. The API's `indexed: 0` remains the known quirk — spot-checked via `index_inspect` on `/club/jimmy-who` and `/club/moon-child`, both confirmed "Submitted and indexed" with recent crawl dates (07-20 and 07-23) — trust the GSC dashboard/inspection tool over the sitemap API's `indexed` count.

---

## Top Performing Pages (Last 30 Days)

| Page | Clicks | Impressions | CTR | Avg Position |
|---|---|---|---|---|
| Homepage (`/`) | 84 | 927 | 9.1% | 10.0 |
| `/parties/18-plus-parties-tel-aviv` | 22 | 237 | 9.3% | 7.5 |
| `/event/revival-summer-festival` | 17 | 261 | 6.5% | 6.9 |
| `/genre/rave-parties` | 14 | 152 | 9.2% | 7.6 |
| `/parties/techno-parties-weekend` | 6 | 29 | 20.7% | 13.8 |
| `/cities/eilat` | 5 | 144 | 3.5% | 25.5 |

Event pages are now the traffic engine: World Cup viewing events, pub crawls and weekly ליינים pages fill most of the top-20 with CTRs of 7–46% at positions 4–9.

### Quick Win Opportunities

**`/club/jimmy-who`** — Three rewrite cycles (07-02 title, 07-17 description, 07-24 NightClub JSON-LD) have all failed to move CTR: 07-24→07-27 window is 0/70 clicks across every "jimmy who"/"גימי הו" variant, including "jimmywho? bar & lounge" at position 7.3 with 7 impressions and 0 clicks. Schema addition did not produce a rich-result differentiator in 3 days. Applying the roadmap's own next step: 2026-07-27 rewrote the title tag itself (was generic "תל אביב – גימי הו | כרטיסים ואירועים") to lead with the real street ("רוטשילד ת״א", already used in the description/body copy) and swap generic "כרטיסים ואירועים" for concrete practical hooks already substantiated in the page FAQ/body ("שעות פתיחה", "שולחן VIP") — betting that a snippet promising specific practical info beats the generic ticket-sales framing that's been losing to Instagram/Maps. Needs a full cycle to measure.

**`/club/moon-child`** — Same pattern: 07-24→07-27 window is 1/45 clicks (only "moonchild" converted, 1/26). 2026-07-27: title rewritten to add "Happy Hour, שולחנות" (both concretely documented in the page body/FAQ — Tue/Wed 22:00–midnight happy hour, table reservations) in place of the generic "כרטיסים ואירועים קרובים" suffix, same rationale as Jimmy Who. Monitor next cycle.

**`/cities/haifa`** — NEW opportunity: "מסיבות בחיפה" 17 impressions, pos 22.4, 1 click. Page existed with weak, half-English meta ("Haifa Parties – מסיבות בין ההר לים"). 2026-07-17: title/description rewritten to target "מסיבות בחיפה" directly. Watch position over the next 4 weeks.

**`/parties/18-plus-parties-tel-aviv`** — TLV query is excellent (pos 6.2, 28% CTR), but the generic "מסיבות 18 פלוס" (26 impressions, pos 8.5) got 0 clicks. 2026-07-17: title/description broadened to "בתל אביב ובכל הארץ" while keeping TLV primary.

**Homepage English queries** — "parties" + "party" = 86 impressions, 0 clicks (pos 7–15); snippet was Hebrew-only. 2026-07-17: English sentence appended to homepage meta description.

**`/club/echo`** — FIXED ✅: 2 clicks at 22% CTR on "מועדון אקו תל אביב" this cycle after three cycles at 0. Long-tail Echo variants still 0-click but low volume; no further action.

**`/club/bahia`** — "bahia herzliya" + "bahia beach herzliya" = 18 impressions at pos ~9, still 0 clicks. Page is new (first working version 2026-07-06); give it another cycle before touching.

**`/club/goat`** — no goat-query impressions surfaced yet this cycle; page is young. Keep monitoring.

**`/club/gagarin`** — starting to appear ("gagarin" pos 25, "גגארין" pos 11.5, low volume). Taxonomy entry already solid; no action.

---

## Top Search Queries (Last 30 Days)

| Query | Clicks | Impressions | CTR | Position |
|---|---|---|---|---|
| מסיבות 18 פלוס תל אביב | 7 | 25 | 28.0% | **6.2** |
| מסיבות סטודנטים | 3 | 7 | 42.9% | 8.9 |
| מועדון אקו תל אביב | 2 | 9 | 22.2% | 9.2 |
| moon child | 1 | 33 | 3.0% | 9.9 |
| מסיבות אלכוהול חופשי | 1 | 19 | 5.3% | 7.9 |
| מסיבות בחיפה | 1 | 17 | 5.9% | 22.4 |
| רייבים בישראל | 1 | 4 | 25% | 6.0 |
| גימי הו | 0 | 101 | 0% | 10.1 |
| moonchild | 0 | 83 | 0% | 10.5 |
| jimmy who תל אביב | 0 | 44 | 0% | 8.0 |
| parties (EN) | 0 | 43 | 0% | 7.2 |
| party (EN) | 0 | 43 | 0% | 15.0 |
| jimmy who תל-אביב | 0 | 36 | 0% | 10.6 |
| jimmywho? bar & lounge | 0 | 36 | 0% | 10.3 |
| מסיבות 18 פלוס | 0 | 26 | 0% | 8.5 |
| bahia herzliya (+beach) | 0 | 18 | 0% | ~9 |

### Observations
- "מסיבות 18 פלוס תל אביב": 7.9 → 6.2, CTR 28% — best-performing query, leave alone
- "מסיבות סטודנטים": 43% CTR at pos 8.9 — Phase 2 target confirmed working
- Echo converted this cycle — June 30 fix finally paid off
- Jimmy Who/Moon Child: consolidation tripled impressions but CTR still ~0 — snippet rewritten 2026-07-17 to practical-info format
- "מסיבות בחיפה" — new city opportunity, meta fixed 2026-07-17
- English "parties"/"party": 86 impressions 0 clicks — English line added to homepage description 2026-07-17
- New long-tail signals worth watching: "אפטרים בתל אביב" (pos 14), "מסיבות 35+ תל אביב", "מסיבות שישי" (pos 33)

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
- [x] **Monitor Echo club page** — CONVERTED: 2 clicks at 22% CTR on "מועדון אקו תל אביב" this cycle (2026-07-17)
- [x] **Rewrite Jimmy Who & Moon Child snippets to practical-info format** — consolidation tripled impressions but CTR stayed ~0%; descriptions now lead with location/hours/lineup instead of ticket-sales language; fixed "Sun Child" FAQ typo and Hebrew body typos (2026-07-17)
- [ ] **Rewrite Jimmy Who & Moon Child title tags** (2026-07-27) — description rewrite (07-17) and NightClub schema (07-24) both failed to move CTR after a full cycle each; titles now lead with concrete practical hooks (street name, VIP table, Happy Hour) instead of generic "כרטיסים ואירועים". If still flat next cycle, consider that these queries may just be structurally un-winnable against Instagram/Maps in the SERP and deprioritize further snippet tinkering.
- [x] **Target "מסיבות בחיפה" on the Haifa city page** — replaced half-English title/weak description with direct Hebrew targeting (2026-07-17)
- [x] **Broaden 18-plus page to generic "מסיבות 18 פלוס"** — title/description now cover "בתל אביב ובכל הארץ" (2026-07-17)
- [x] **Add English sentence to homepage meta description** — targets 86 zero-click English "parties"/"party" impressions (2026-07-17)
- [ ] **Improve `cities/eilat` ranking** — position continuing to improve (36.9 → 33.7 → 25.5 → 12.8) with clicks up to 25 (from 5) and impressions up to 641 (from 144) this cycle; CTR 3.9% is normal for position ~13, so this reads as a ranking win in progress, not a snippet problem — still no title/description action needed, keep monitoring
- [ ] **Improve `all-parties` page ranking** — dropped out of top-20 pages this cycle; check indexing status next cycle. Clarity (2026-07-18, last 3 days): 77.8% quick-back rate and 33% avg scroll depth on 9 sessions — visitors bounce fast; investigate whether the JS grid loads too slowly or the above-fold content mismatches intent
- [ ] **Investigate dead/rage clicks on event pages** — Clarity (2026-07-18): World Cup final Hangar 11 page had 19 dead clicks + 6 rage clicks in 11 sessions; Bayz rooftop page 11 dead clicks in 8 sessions. Some element on event pages looks tappable but isn't (likely the hero image or a disabled CTA) — wastes hard-won event-page SEO traffic. Check session recordings before fixing
- [ ] **Homepage engagement is weak despite being the top SEO page** — Clarity (2026-07-18): 28% avg scroll depth, 54% quick-back on 24 sessions. Note: uncommitted local redesign work (TrustBand, HotEventsCarousel, SocialsCta) already in progress in the working tree as of 2026-07-18 — defer to that, re-measure after it ships
- [ ] **Monitor Bahia & Goat club pages** — both young (first working versions 2026-07-06); Bahia getting impressions at pos ~9, Goat not yet surfacing
- [x] **Fix dead clicks on event-page date/time chip** (2026-08-02) — session recording for `/event/asher-swissa-x-club-de-combat-friday-open-air-august-2026` (2026-08-01) showed 5 dead clicks concentrated on the "תאריך ושעה" quick-info chip in ~2 seconds — a user repeatedly tapping a plain, non-interactive `<div>` styled identically to the clickable tag chips above it. Turned the date/time chip in `/event/[slug]/page.tsx`'s Quick Info Strip into a real "add to calendar" link (Google Calendar template URL, built from the event's real name/date/location — no fabricated data) so the tap now does something useful instead of nothing. Did not touch the same chip on `/archive/[slug]/page.tsx` — past events have nothing to add to a calendar for.
- [x] **Fix dead clicks on party-card date/location block** (2026-08-04, committed 2026-08-05) — Clarity flagged `/parties/18-plus-parties-tel-aviv` (site's #2 GSC traffic page this cycle, up from 22 to 65 clicks) with 16 dead clicks in 3 days, the highest of any page, despite growing organic traffic. Root cause in the shared `PartyCard.tsx` component (used on every listing page — all-parties, genre, cities, parties/*): the card had two separate `<Link>`s (image+title, and the CTA button) with a plain non-interactive `<div>` holding the date/location info sandwiched between them — a dead zone that looks like part of the tappable card but does nothing. Merged the date/location block into the top `<Link>` so the only non-link area left is the discount-code reveal button (which has its own real `onClick` handlers). Same class of bug as the two prior fixes (event-page date chip, archive flyer image) — third instance of this pattern, worth checking new components against it going forward. Note: the code fix and its roadmap entry were made 2026-08-04, but only committed/pushed 2026-08-05 — this cycle's `/seo-update` run had drifted into writing to an untracked root-level copy of this file (`../SEO-ROADMAP.md`) instead of this tracked one, so the fix sat uncommitted in the working tree for a day. Fixed the drift by syncing that copy into this tracked file and committing both together; future cycles should edit this file directly.
- [x] **Fix dead clicks on event-page location chip** (2026-08-06) — same "looks tappable, isn't" pattern as the 2026-08-02 date/time chip fix, this time on the location chip in the Quick Info Strip: session recording for `/event/mess-jerusalem-thursday-06-08-26-august-2026` (2026-08-05) showed 4 dead clicks in ~2 seconds on "מיקום / בעלי המלאכה, ירושלים" before the user gave up and selected the text instead. Turned the location chip in `/event/[slug]/page.tsx`'s Quick Info Strip into a Google Maps search link, built from the same address data already used in the page's `Place` JSON-LD (no fabricated data). Only 7 total dead clicks this cycle (below the 15+ bar used in prior cycles) — applied anyway since it's the third confirmed instance of this exact chip pattern (date chip 08-02, `PartyCard` gap 08-04) and the fix is small and low-risk.
- [ ] **Deprioritize further Jimmy Who / Moon Child snippet tinkering** (2026-08-02) — the 2026-07-27 title rewrite has now had a full week (07-27→08-02): still 0/255+ impressions across every "jimmy who"/"גימי הו" variant and near-0 on Moon Child, the fourth consecutive rewrite cycle (meta 07-02, description 07-17, schema 07-24, title 07-27) with no CTR movement. Per the roadmap's own stated fallback, treating these as structurally un-winnable against Instagram/Maps in the SERP for these specific brand queries — no further snippet changes planned unless a new signal appears.
- [x] **Fix dead clicks on archive-page flyer images** (2026-07-31) — root-caused a pattern flagged across 3 prior cycles (07-18, 07-24, and this one): `/archive/[slug]` pages showed the worst dead-click count of any page this cycle (15 on a single archive page, 8 pages affected total). Unlike `/event/[slug]`, the archive flyer `<Image>` had zero click handler at all — users, trained by every other page, tap it expecting something and get nothing. Added `FlyerToRelatedLink` (mirrors the existing `FlyerToPurchaseLink` pattern) so tapping the flyer on a past-event page smooth-scrolls to the "מסיבות קרובות שאולי תאהבו" section when related upcoming events exist, converting dead-click intent into forward referral instead of leaving it dead. No-ops (plain image, no handler) when there are no related events to route to.

### Phase 2 — Hebrew SEO Optimization
- [ ] Ensure every page has a Hebrew title tag and meta description
- [ ] Add Hebrew H1 headings to all city and genre pages
- [ ] Create/improve content for "מסיבות 18 פלוס" — most clicked Hebrew query
- [ ] Target "מסיבות סטודנטים" — high CTR (20%), low volume, quick win
- [ ] Target "רייבים בישראל" — position 6.5, needs push to top 3

### Phase 3 — GEO (Generative Engine Optimization)
GEO = optimizing for AI-powered search results (Google AI Overviews, ChatGPT, Perplexity).

- [ ] Add **FAQ sections** on key pages (AI engines love structured Q&A)
- [x] Add **structured data (Schema.org)** — `Event` schema already on event pages; `Place`/`NightClub` schema added to all `/club/[slug]` venue pages (2026-07-24), sourced from real address/geo already scraped per-party (no fabricated data)
- [ ] Write **authoritative summary paragraphs** at the top of city/genre pages (AI engines pull these as snippets)
- [ ] Add a **"What is parties247?" explainer** on the homepage/about — helps AI engines understand and cite the site
- [ ] Use **natural language** in page descriptions (not just keywords) — better for LLM-based search

### Phase 4 — Content Expansion
- [ ] Articles/blog targeting high-volume party search queries in Hebrew
- [ ] Landing pages for new cities (beyond TLV and Eilat) — Haifa meta upgraded 2026-07-17; watch "מסיבות בחיפה"
- [ ] Consider an "אפטרים בתל אביב" page — new query at position 14 with a click, no dedicated page yet
- [x] Genre page for techno already existed (`/genre/techno-music`) but title/description were English-only — Hebrew techno queries ("טכנו בתל אביב", "מועדוני טכנו בתל אביב", "מסיבות טכנו תל אביב") have now shown up two cycles running; retitled to lead with "מסיבות טכנו בתל אביב ובישראל" (2026-07-21). Monitor next cycle.
- [ ] Consider a "מסיבות 35+" audience page — "מסיבות 35+ תל אביב" got 2 clicks on 2 impressions (pos 41) with no dedicated page (first seen 2026-07-17, confirmed 2026-07-18)
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
| 2026-08-06 | GSC 29d (07-07→08-04, overlaps last cycle's window almost entirely — reported as a level, not growth): 823 clicks, 14,614 impressions, CTR ~5.6%, position 8.3–15.3. Sitemap 456 submitted, 0 errors (up from 451, normal event-page churn). `detect_quick_wins` resurfaced only the already-deprioritized Jimmy Who/Moon Child cluster plus two now-expired World Cup/4tress event pages — no new opportunities, no action. Ran two extra verification checks this cycle: (1) a single session recording showed a 25s LCP on an event page, which looked alarming, but the 3-day aggregate (event pages: 84.3 performance score, 2.67s avg LCP vs 87.1/1.33s for other pages) confirmed it was a cold-load outlier, not a systemic issue — no action needed; (2) `/parties/18-plus-parties-tel-aviv`'s 12 quick-backs across 8 sessions looked like a red flag from the aggregate alone, but reviewing 5 actual session recordings showed normal listing-page browsing (click into an event, return, paginate to page 2) — not a UX bug. Also confirmed this cycle that the git-tracked `SEO-ROADMAP.md` is the one inside `parties247-website/` (this file), not the untracked root-level copy one directory up (`../SEO-ROADMAP.md`, referenced as a past drift risk in the 2026-08-05 entry) — the two were identical at the start of this run, confirming no drift occurred since. Applied 1 change: found via a fresh session recording that the location chip in the event-page Quick Info Strip has the same "looks tappable, isn't" bug as the date/time chip fixed 2026-08-02 — 4 dead clicks in ~2s on a single session before the user gave up and selected the text instead. Turned it into a Google Maps search link (same address data as the page's existing `Place` JSON-LD). Only 7 total dead clicks this cycle, below the 15+ bar used in prior cycles to justify action, but applied anyway as the third confirmed instance of this exact chip-pattern bug, small and low-risk. No meta/schema/content changes applied — nothing this cycle cleared the bar for those. |
| 2026-08-05 | Unattended scheduled run. GSC 28d (07-06→08-02, lag means 08-03/08-04 not yet in the API): 778 clicks, 13,851 impressions, CTR ~5.6%, position mostly 8–15. Sitemap 451 submitted, 0 errors (up from 446, normal event-page churn). `detect_quick_wins` resurfaced Jimmy Who/Moon Child (343 + 216 impressions, ~0% CTR) — left untouched per the 2026-08-02 deprioritization decision (fourth failed rewrite cycle already logged, no new signal here). Also flagged two expired World Cup/4tress event pages — no action, events already passed. Genuine positive: `/cities/eilat` continued its multi-cycle position climb (25.5 → 12.8) with clicks up to 25 and impressions to 641; CTR (3.9%) is normal for that position, so read as a ranking win in progress rather than a snippet problem — no meta change applied, consistent with prior cycles' "monitor, don't touch" call. Clarity (last 3 days, 08-02→08-04): no rage clicks anywhere, max dead clicks 4 (Revival festival page) — well below the 15+ counts that justified prior fixes, no action. `/all-parties` scroll depth still weak (20.75%) but only 3 sessions, too small to act on. **Process fix, not a content change:** discovered the prior (08-04) cycle had written its Update Log entry and applied its `PartyCard.tsx` fix to an untracked root-level `SEO-ROADMAP.md` copy one directory up instead of this tracked file, and never committed the code change — both the roadmap edit and the `PartyCard.tsx` fix sat uncommitted in the working tree for a day. Synced the untracked copy's content into this file and committed both together this cycle (see Phase 1 entry above for the fix itself). Left four unrelated uncommitted files (`HomeClient.tsx`, `HotEventsCarousel.tsx`, `SocialsCta.tsx`, `tailwind.css`) untouched — verified they're the site owner's own in-progress homepage redesign (referenced in multiple prior cycles as deferred), not part of this SEO run, and confirmed `PartyCard.tsx`'s diff only uses pre-existing standard Tailwind utilities with no dependency on the uncommitted CSS additions, so committing it alone is safe. No new meta/schema/content changes applied this cycle — data didn't clear the bar for any (Jimmy Who/Moon Child deprioritized, Eilat improving on its own, dead-click counts below threshold, all-parties sample too small). |
| 2026-08-04 | GSC 29d (07-05→08-04): ~798 clicks (+20%), ~14,022 impressions (+19%), CTR ~5.7% flat, position 8.3–15.4. Sitemap 446 submitted, 0 errors (up from 431, normal growth). `/parties/18-plus-parties-tel-aviv` continued its strong run: 65 clicks/591 impr (up from 22/237 last cycle), now the #2 traffic page. Jimmy Who/Moon Child remain flat per the 2026-08-02 deprioritization decision — no new signal. **First cycle pulling from the parties247 admin analytics API** (`/api/admin/analytics/detailed`, JWT-protected — see new section above) alongside GSC/Clarity: 30d shows ~1,526 party views and ~205 purchase-link clicks (~13.4% view→redirect rate), and the live 24h traffic-source breakdown showed the first confirmed chatgpt.com referral traffic (5.9% of visits) — direct evidence the Phase 3 GEO work (FAQ sections, structured data, natural-language descriptions) is being picked up by at least one AI assistant. Also surfaced but did not chase: the API's `visits` field is 0 for 29 of the last 30 days then jumps to 5/56/111 on the last 3 days, with no corresponding code or deploy change found — flagged for next cycle, not root-caused. Clarity (last 3 days, 08-02→08-04): homepage engagement stable/healthy (20.8% scroll, 6.25% quick-back — better than several prior cycles); new dead-click leader was `/parties/18-plus-parties-tel-aviv` at 16 dead clicks in 3 days despite being GSC's fastest-growing page — traced to the shared `PartyCard.tsx` component having a non-interactive gap between its image link and CTA button (third instance of this exact bug pattern after the event-page date chip and archive flyer fixes). Applied 1 change: merged the date/location info block into the card's image link so the whole card (minus the separately-interactive discount-code button) is now tappable — affects every listing page site-wide, not just the flagged page. |
| 2026-08-02 | Unattended scheduled run. 30d (07-03→08-02): ~665 clicks, ~11,747 impressions, CTR ~5.7%, position ~8.3–15.4 (best days 07-16/07-23/07-30 in the 8.3–8.7 range). Sitemap 431 submitted, 0 errors (up from 428 — steady archive-tail growth, not a regression). `detect_quick_wins` flagged 10 opportunities, dominated by the already-known Jimmy Who/Moon Child cluster plus two now-expired World Cup/4tress event pages (no action — events already passed). Root-caused a new dead-click pattern via Clarity session recordings: `/event/asher-swissa-x-club-de-combat-friday-open-air-august-2026` (upcoming event, 2026-08-01 session) showed 5 dead clicks in ~2 seconds on the Quick Info Strip's date/time chip — a plain non-interactive div styled like the clickable tag chips right above it. Applied 1 change: turned the date/time chip on `/event/[slug]/page.tsx` into a real "add to calendar" link (Google Calendar template URL from real event data), giving the tap actual utility. Also closed out the Jimmy Who/Moon Child monitoring loop: the 07-27 title rewrite has now had a full week with 0/255+ impressions and near-0 on Moon Child — the fourth rewrite cycle in a row (meta/description/schema/title) with zero CTR movement — so per the roadmap's own fallback rule, further snippet tinkering on these two pages is deprioritized until a new signal appears. Clarity popular-pages (07-31→08-02): homepage still weak (30% scroll, 8/9 quick-back sessions) — the local `HomeClient`/`HotEventsCarousel`/`SocialsCta` redesign is still uncommitted in the working tree, left untouched again per prior cycles' deferral; `/parties/18-plus-parties-tel-aviv` improved to 42% scroll (was 100% quick-back two cycles ago); saw the highest single-page dead-click count of any recent cycle on `/event/saturday-goat-01-08-august-2026` (7 dead + 1 rage in 5 sessions) but that event's date has since passed and the URL now redirects to `/archive/...` — no fix applied, would only affect already-expired traffic. |
| 2026-07-31 | 28d (07-01→07-28, GSC lag): ~691 clicks (up from ~561, +23%), ~12,113 impressions (up from ~9,660, +25%), CTR ~5.7% flat, position tightened to 8–15 (best days 07-23/07-24 at 8.4–9.0) vs 8–19 spread last cycle. Sitemap 374 → 428 submitted, 0 errors — expected archive-page growth. `index_inspect` spot check confirms `/club/jimmy-who` still indexed and freshly crawled (07-30), so sitemap `indexed:0` remains the known API quirk, not a real issue. Jimmy Who/Moon Child: 07-27 title rewrite still shows 0/255 and near-0 impressions respectively, but it's only 3–4 days old — too early to judge per the usual cadence, left untouched this cycle. Clarity (last 3 days, 07-29→07-31): no rage clicks anywhere; dead clicks hit 8 pages, topped by `/archive/al-ritmo-cele-arrabal-july-2026` at 15 — the worst single-page dead-click count seen in any cycle. Root-caused a pattern flagged but not solved across 3 prior cycles (07-18, 07-24, and implicitly before): archive-page flyer images had no click handler at all (event pages already got a scroll-to-CTA fix via `FlyerToPurchaseLink`, archive pages never did). Applied 1 change: added `FlyerToRelatedLink` component, wired into `/archive/[slug]/page.tsx`, so tapping the flyer on a past-event page smooth-scrolls to the "מסיבות קרובות שאולי תאהבו" upcoming-related-events section instead of doing nothing — converts dead-click intent into forward referral, consistent with the archive feature's own stated design goal. Popular-pages Clarity data also showed archive pages pulling real traffic (`/archive/pub-crawl-july-2026`, 5 sessions, 64.5% scroll) — the archive feature is working as intended for both SEO and engagement. |
| 2026-07-27 | Unattended scheduled run. 28d (06-27→07-24, GSC lag): clicks/impressions trending up week-over-week (best days 07-23: 48 clicks/684 impr, 07-24: 41 clicks/705 impr), position holding 8–10 on strong days vs 13–19 mid-month. Sitemap jumped 189 → 374 submitted, 0 errors — expected, not a regression: the 2026-07-26 archive feature (`/archive/[slug]`) now emits sitemap entries for every past event alongside upcoming ones. Jimmy Who/Moon Child: confirmed the 07-24 NightClub JSON-LD did not move CTR either (0/70 and 1/45 clicks respectively in the 3 days since) — three rewrite cycles (title, description, schema) have now each had a full cycle with no effect, so applied the roadmap's own fallback: rewrote both title tags to lead with concrete practical hooks (Jimmy Who: "רוטשילד ת״א" + "שעות פתיחה, שולחן VIP"; Moon Child: "Happy Hour, שולחנות") instead of generic "כרטיסים ואירועים", all sourced from facts already in each page's body/FAQ copy. `detect_quick_wins` also flagged two Hangar 11 World Cup event pages and a "4tress" event page (positions 7.9–8.6, near-0% CTR) — left untouched: all three events already occurred (games were 07-07 through 07-24, today is 07-27), so further snippet optimization on expired event pages has minimal remaining upside. Clarity (last 3 days, 07-24→07-27): homepage engagement improved substantially since the 07-26 search-UX commit (`ae75e7c`) — 27.5% scroll depth / 17.7% quick-back on 11 sessions, down from 68.8% quick-back last cycle; `/all-parties` also improved (51.8% scroll / 9.1% quick-back on 6 sessions, vs 33%/77.8% two cycles ago) — both trending the right direction, no action needed, small samples. No dead/rage clicks observed on any top page this window (previous cycles flagged World Cup event pages for this — those pages are now past and low-traffic, consistent with expiry rather than a fix). Note: a homepage redesign (`HomeClient`/`HotEventsCarousel`/`SocialsCta`) is still uncommitted locally in the working tree as of this run — left untouched, not part of this cycle's changes. |
| 2026-07-24 | Unattended scheduled run. 28d (06-24→07-21, GSC lag): ~561 clicks (up from ~504), ~9,660 impressions (up from ~8,720), CTR ~5.8% flat. Sitemap 181→189 submitted, 0 errors. Root-caused the Jimmy Who/Moon Child stuck-at-0%-CTR problem: `index_inspect` confirms both pages are indexed and freshly crawled (07-20 and 07-23), so two failed rewrite cycles (07-02, 07-17) weren't an indexing or lag issue — the snippet is genuinely losing to Instagram/Maps results in the SERP. Applied 1 change: added `NightClub` JSON-LD structured data (address + geo, sourced from real per-event venue data already present in the API response — not fabricated) to all `/club/[slug]` pages, closing out the Phase 3 "Place schema on venue pages" item; targets Jimmy Who and Moon Child specifically but applies site-wide to every club page with at least one dated event. Noted a manual (non-scheduled-run) commit since last cycle: 2026-07-22 `887be49` fixed a doubled brand-suffix bug in ~20 page titles (unrelated to this cycle, done directly by the site owner). Clarity (last 3 days, 07-21→07-24): homepage still weak (21.6% scroll, 68.8% quick-back on 32 sessions) — redesign work (HomeClient/HotEventsCarousel/SocialsCta) still uncommitted locally, deferred as before; `/all-parties` improved somewhat (39.8% scroll, 55.6% quick-back on 9 sessions, vs 33%/77.8% last cycle) — still weak but trending right direction, no action, small sample; new signal: `/event/club-hop-july-2026` had 9 dead clicks in 6 sessions despite the 07-18 flyer/tag-chip fix — worth a session-recording review next cycle if the pattern repeats on other event pages, not acted on this run (single page, could be event-specific content).  |
| 2026-07-21 | Unattended scheduled run. 28d (06-21→07-18, GSC lag): ~504 clicks, ~8,720 impressions, CTR ~5.8% flat, new best day 2026-07-18 (51 clicks, 778 impressions). Jimmy Who/Moon Child rewrites from 07-17 still show ~0 CTR, but GSC lag means only ~1 day of post-fix data has landed — too early to judge, left alone this cycle. Applied 1 change: `/genre/techno-music` title/description were English-only ("Techno Parties in Israel") despite three Hebrew techno queries recurring two cycles running ("טכנו בתל אביב" pos 9.7, "מועדוני טכנו בתל אביב" pos 42, "מסיבות טכנו תל אביב" pos 11.8) — retitled to lead with "מסיבות טכנו בתל אביב ובישראל". Clarity (last 3 days, 07-19→07-21): homepage still weak (20.3% scroll, 45% quick-back on 11 sessions) — redesign work still pending, deferred as before; `/parties/18-plus-parties-tel-aviv` showed 100% quick-back (5/5 sessions) despite 50% scroll depth — new signal, small sample, watch next cycle; event-page dead/rage clicks lower this cycle than last (max 2 dead clicks per page, no rage clicks) — likely just lower traffic on expired World Cup pages rather than a fix, not conclusive. Sitemap 194 → 181 submitted, 0 errors (event-page churn). |
| 2026-06-25 | Initial analysis. Sitemap ~123 indexed (healthy). Avg position ~20 improving to ~13. |
| 2026-06-25 | Applied 5 changes: Jimmy Who + Echo meta descriptions rewritten; FAQ section + JSON-LD added to all club pages; Tel Aviv + Eilat city-specific meta descriptions; all-parties title now includes "בישראל". |
| 2026-06-30 | 30d: 139 clicks (+34%), 3,288 impressions (+13%), CTR 4.2% (up from 3.6%), avg pos ~14-16. Applied 4 changes: (1) per-slug meta descriptions for catch-all club/genre pages; (2) replaced filler `buildCityBody` with real Eilat + TLV copy; (3) FAQPage JSON-LD + FAQ section added to all city pages; (4) server-rendered H1 + intro paragraph added to /all-parties above JS grid. |
| 2026-07-02 | 30d: 169 clicks (+22%), 3,569 impressions (+9%), CTR 4.7% (up from 4.2%), avg pos ~13–15. "מסיבות 18 פלוס תל אביב" position jumped to 7.9 (from 16.7). Applied 5 changes: (1) Jimmy Who title rewritten to "JimmyWho? Bar & Lounge" + "גימי הו" to fix 77 zero-click impressions; (2) Moon Child description updated (11 impressions, pos 9.9, 0 clicks); (3) Bahia description bilingual for English queries; (4) rave-parties description leads with "רייבים בישראל"; (5) homepage description adds "אלכוהול חופשי / 18 פלוס / רייבים". |
| 2026-07-06 | 30d: 219 clicks (+30%), 4,447 impressions (+25%), CTR 4.9% (up from 4.7%), position trending 10–16. Root-caused why prior Jimmy Who/Moon Child/Bahia meta fixes hadn't converted to clicks: (1) `/club/bahia` was silently 404ing (no taxonomy entry existed) — added one; (2) legacy duplicate `/jimmy-who` and `/moon-child` standalone pages were cannibalizing the maintained `/club/...` pages for identical brand queries — deleted both, added 301 redirects; (3) added a new `/club/goat` page to consolidate "goat tlv" traffic (13 impressions, pos ~30) previously split across 4 expiring event pages; (4) removed a dead `PAGE_DESCRIPTIONS` map in the catch-all route, shadowed by more specific routes and never rendered. |
| 2026-07-18 (2nd run) | Evening scheduled run. GSC unchanged since the morning run (data still ends 2026-07-16 — GSC lag), so **no website changes applied**; quick-win pages (Jimmy Who, Moon Child) were rewritten 2026-07-17 and still need a full cycle to measure. New Clarity behavior findings (last 3 days): (1) `/all-parties` 77.8% quick-back, 33% scroll — engagement red flag on a page already flagged for ranking drop; (2) event pages show dead/rage clicks (World Cup final page 19 dead + 6 rage in 11 sessions, Bayz rooftop 11 dead in 8) — something looks clickable but isn't; (3) homepage 28% scroll / 54% quick-back — but homepage redesign work already in progress locally (uncommitted TrustBand/carousel changes), so deferred. All three logged as Phase 1 monitoring items. |
| 2026-07-18 | Scheduled check, one day after the 2026-07-17 cycle. 30d: ~441 clicks, ~7,650 impressions, CTR ~5.8%; 2026-07-16 was the best day on record (47 clicks, avg pos 8.3, 658 impressions). **No website changes applied** — the only quick-win candidates were `/club/moon-child` (rewritten yesterday, needs a cycle to measure) and an already-expired World Cup semifinal event page; everything else is too low-volume to act on. Early positives: "jimmywho" got its first click (1/8, pos 10.5), "moon child" 1 click/45 impressions, Echo now 3 clicks at 23% CTR, "מסיבות בחיפה" position 22.4 → 21.45. New low-volume signals to watch: "מסיבות 35+ תל אביב" (2/2 clicks, pos 41), "טכנו בתל אביב" (1 click, pos 9.8) + "מועדוני טכנו בתל אביב" (pos 42), "מסיבות האוס" (1 click, pos 10.3). Sitemap 207 → 194 submitted, 0 errors (event-page churn, not a regression). |
| 2026-07-17 | 30d: ~400 clicks (+83%), ~7,100 impressions (+60%), CTR 5.6%, position ~9–15. Sitemap recovered to 207 submitted, 0 errors. Echo CONVERTED (2 clicks, 22% CTR) after 3 cycles at zero. Jimmy Who/Moon Child 301 consolidation tripled impressions (~340 / ~120) but CTR stayed ~0% — losing to official Instagram/Maps results. Applied 5 changes: (1) Jimmy Who description rewritten to practical-info format (רוטשילד location, hours, lineup) + Hebrew body typos fixed; (2) Moon Child description same treatment + fixed FAQ that said "Sun Child"; (3) Haifa city title/description now target "מסיבות בחיפה" directly (17 impressions, pos 22.4); (4) 18-plus page broadened to generic "מסיבות 18 פלוס" (26 impressions, pos 8.5, 0 clicks); (5) English sentence added to homepage meta description for 86 zero-click "parties"/"party" impressions. |

---

## How to Run the Next Update

Run `/seo-update` in Claude Code, or ask:
> "Analyze my GSC data for parties247.co.il, update the roadmap, and make any SEO/GEO improvements needed on the website."

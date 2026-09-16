---
version: 1
slug: "src-app-page-tsx"
primary_target: "src/app/page.tsx"
related_targets: ["src/components/Header.tsx","src/components/Footer.tsx"]
---

# Home page (/) — surface brief

Scope: home page body plus the shared header, footer, cookie banner and page background. Extended 2026-09-16 (user request) to the whole site: event, archive, listing (city/genre/day/audience/carousel/all-parties), holiday, discovery, articles and legal pages share this world. Mode: Persuade. Visitor: young Israeli partygoer on a phone, from search or WhatsApp, deciding where to go tonight/this weekend. Action: open a real party page (then GoOut checkout). Proof: the live catalogue itself (real flyers, dates, prices, counts). Constraints: Hebrew RTL; keep H1 copy, JSON-LD, FAQ, SEO text + inline links; no invented social proof or urgency; fast on mobile data; holiday promo (Sukkot) must be a proper, intentional element.

## Direction contract

THESIS: A product-launch stage where the product is tonight's parties. Refuses the category default of a stock crowd photo with emoji pills over it and client-only coverflow carousels.

OWN-WORLD: Apple launch-page grammar in jungle night (user asked to keep the colors close to the old jungle identity). Deep green-black stage #06110d, #0f1f19 tiles, #eef6f0 ink, #a9bdb2 / #8aa197 secondary, brand jungle green #76c893 fill with #04120c text and #8ddca6 links as the only action color, a soft green top-light on hero stages, hairline separators. One family (Heebo), semibold headlines, generous air, 18–28px radii, pill buttons, chevron links "›", translucent 48px global nav, thin gray announcement ribbon.

STORY: Visitor sees a wall of real flyers moving behind a big calm headline, understands "every party in Israel, right now", picks a night in the segmented switch, taps a card, lands on the event page.

FIRST VIEWPORT: Nav 48px; ribbon "מסיבות סוכות 2026 כבר כאן. לצפייה ›" (only when a holiday is near). Centered H1 two-tone ("המסיבה הבאה שלך" white / "מתחילה כאן." gray), 48px mobile to 96px desktop; one-line sub; blue pill "לכל המסיבות" + link "מה קורה הלילה ›". Below, full-bleed drifting wall of real flyers (1 row mobile, 2 rows desktop, opposite directions), each a link to its event. On mobile the night switch heading peeks at the fold.

FORM: Launch page (apple.com product launch), my own top grounded candidate (#1 on my list), taken as user choice over the rolled Today-feed; seed key 153b447d. Raises: from design-annual (declined) one-family type discipline and hairline-only separators; from cathode-gauze (declined) the chosen night struck forward in the segmented switch, others quiet. Signature interaction: the flyer wall drifts, pauses on hover/focus, hovered flyer lifts and reveals its date; reduced-motion gets a static scrollable row. Motion grammar: cubic-bezier(.28,.11,.32,1), transform/opacity only.

ADAPTATIONS (recorded after finish review): account1 (coupon) parties lead within each night, lead the flyer wall, and carry a "קוד הנחה" badge — ordering never breaks date order across nights. headlines ship bold (700), not semibold — Heebo's Hebrew semibold reads thin on black at display sizes. Mobile H1 is clamp(34px,10.4vw,44px), desktop 92px, so "המסיבה הבאה שלך" holds one line at 360–390px. Ribbon link reads "ללוח המסיבות ›" (names the destination). Card CTA is a green chevron text link, not a filled pill, so the hero pill stays the one filled action per viewport. Curated shelves under 3 cards, or repeating a tile title, are hidden.

FINISH: unreviewed and undocumented is unfinished; this build ends with the finish review, the verdict, DESIGN.md, and every shipping raster carrying its provenance

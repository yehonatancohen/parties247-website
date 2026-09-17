---
name: Parties 24/7
description: Every party in Israel, tonight. A product-launch stage in jungle night.
colors:
  stage: "#06110d"
  tile: "#0f1f19"
  tile-hover: "#132720"
  tile-raised: "#1a3129"
  ink: "#eef6f0"
  ink-2: "#a9bdb2"
  ink-3: "#8aa197"
  hairline: "rgba(196, 255, 218, 0.11)"
  action: "#76c893"
  action-hover: "#8fd8a8"
  on-action: "#04120c"
  link: "#8ddca6"
typography:
  display:
    fontFamily: "Rubik, system-ui, sans-serif"
    fontSize: "clamp(34px, 10.4vw, 44px)"
    fontWeight: 800
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Heebo, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.25
  title:
    fontFamily: "Heebo, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 600
    lineHeight: 1.3
  body:
    fontFamily: "Heebo, system-ui, sans-serif"
    fontSize: "17px"
    fontWeight: 400
    lineHeight: 1.75
  label:
    fontFamily: "Heebo, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 500
    lineHeight: 1.35
rounded:
  pill: "9999px"
  stage-tile: "28px"
  card: "22px"
  flyer: "18px"
  flyer-sm: "16px"
spacing:
  gutter: "16px"
  gutter-sm: "24px"
  grid-gap: "16px"
  section: "80px"
  section-sm: "112px"
  nav-height: "48px"
components:
  button-action:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
    rounded: "{rounded.pill}"
    padding: "12px 24px"
  button-action-hover:
    backgroundColor: "{colors.action-hover}"
    textColor: "{colors.on-action}"
  button-purchase:
    backgroundColor: "{colors.action}"
    textColor: "{colors.on-action}"
    rounded: "{rounded.pill}"
    padding: "16px 24px"
  button-quiet:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "12px 20px"
  button-quiet-hover:
    backgroundColor: "{colors.tile-raised}"
  chip:
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "10px 20px"
  chip-hover:
    backgroundColor: "{colors.tile}"
  night-switch-track:
    backgroundColor: "{colors.tile}"
    rounded: "{rounded.pill}"
    padding: "3px"
  night-switch-selected:
    backgroundColor: "{colors.tile-raised}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    height: "40px"
  stage-tile:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    rounded: "{rounded.stage-tile}"
    padding: "24px"
  stage-tile-hover:
    backgroundColor: "{colors.tile-hover}"
  party-card-image:
    backgroundColor: "{colors.tile}"
    rounded: "{rounded.flyer}"
  search-input:
    backgroundColor: "{colors.tile}"
    textColor: "{colors.ink}"
    rounded: "{rounded.pill}"
    padding: "14px 44px 14px 12px"
  nav-global:
    textColor: "{colors.ink}"
    height: "48px"
---

# Design System: Parties 24/7

## Overview

**Creative North Star: "The Launch Stage in Jungle Night"**

Apple product-launch grammar, where the product is tonight's parties. The whole site sits on a deep green-black stage. Big, calm, centered headlines float over it, and real flyers do the selling: a drifting wall of them in the hero, fanned stacks on the tiles, square covers on every card. The palette stays close to the old jungle identity, but it is disciplined. There is one green action color, three levels of ink, and hairline separators. Depth comes from light on the stage, not from ornament.

Density is generous. Sections are separated by a lot of air (80px on mobile, 112px on desktop) rather than by boxes. Rounded tiles and pills are the only containers. Color stays quiet so the flyers carry the saturation. Motion is slow and physical: one curve, movement through transform and opacity only, and state changes as short color cross-fades. Every animation has a reduced-motion fallback.

The system is Hebrew and right-to-left everywhere (`direction: rtl` on body, `color-scheme: dark`). Chevrons point left, and shelves page toward the left.

**Key Characteristics:**
- Heebo everywhere (a variable font via next/font), with one exception: the home hero H1 is Rubik 800. All other headlines are Heebo bold (700).
- One filled action color (jungle green) per viewport. Everything else is a chevron text link.
- Real flyer imagery is the hero, the proof, and the decoration.
- Pills for actions, 28px stage tiles for sections, 18–22px corners for cards and flyers.
- Hairline separators, and soft black diffuse shadows only under lifted imagery and floating chrome.
- One easing curve, cubic-bezier(0.28, 0.11, 0.32, 1).

## Colors

This is a near-monochrome green-black night. A single luminous jungle green is reserved for action and links.

### Primary
- **Jungle Green** (action): The only filled color. It is used for pill buttons (hero "לכל המסיבות", the purchase button, the cookie accept button, the header's compact CTA), the coupon badge on cards, and the icon tint on event facts (calendar, location). Text on it is always Canopy Black.
- **Lit Jungle Green** (action-hover): The hover state of every action fill. It is never a resting color.
- **Canopy Black** (on-action): Text and icons placed on Jungle Green.
- **Moss Link** (link): Chevron links, inline prose links, "כרטיסים ›" on cards, and the focus-visible outline ring.

### Neutral
- **Night Stage** (stage): The page background everywhere. The sticky header uses it at 80% with a backdrop blur.
- **Understory Tile** (tile): Section tiles, the night-switch track, the search field, quiet buttons, the image placeholder behind flyers, the announcement ribbon, and the skeleton base.
- **Understory Tile, Hover** (tile-hover): The hover fill for tiles and chips on the event page.
- **Raised Leaf** (tile-raised): The selected night segment, the hover fill for quiet buttons, the sold-out purchase slab, the fan-flyer placeholder, and shelf paddles (at 90%).
- **Moonlit Ink** (ink): Headlines, card titles, and the first line of the H1.
- **Fog Ink** (ink-2): Sub-headlines, body prose, prices before the figure, and unselected night labels.
- **Deep Fog Ink** (ink-3): The second, "quiet" line of the H1, card meta (date/time, venue), footer text, and counts.
- **Hairline** (hairline): Header and footer rules, FAQ dividers, fact-list dividers on the event page, chip borders, and the resting border around the search field.

### Named Rules
**The One Filled Action Rule.** Jungle Green fills at most one call to action per viewport: the hero pill, or the purchase button on an event page. Card CTAs are green chevron text links, never filled pills. The coupon badge is the one small exception, because it is status, not action.

**The Alias Rule.** `jungle-deep`, `jungle-surface`, `jungle-accent`, `jungle-lime`, `jungle-text` and `wood-brown` exist in the Tailwind config only as aliases, so older markup lands on this palette. They are not tokens. New code uses the names in this file.

## Typography

**Display Font:** Rubik 800, home hero H1 only (`components/home/heroFont.ts`, loaded on the home page only)
**Body Font:** Heebo (the same family, loaded once as a variable font through `--font-heebo`)

**Character:** Heebo is used and set big and bold. It is Hebrew-first and warm, and it reads like launch-page copy, not like a nightlife poster. Hierarchy comes from size and ink level (ink, ink-2, ink-3), never from a second face.

### Hierarchy
- **Display** (Rubik 800, -0.02em, clamp(34px, 10.4vw, 44px) → 68px at sm → 92px at lg, line-height 1.05, -0.01em): The home H1 only. It is two-tone: the first line in Moonlit Ink and the second in Deep Fog Ink. Sized so "המסיבה הבאה שלך" holds one line at 360–390px.
- **Headline** (700, 28px → 40px; 32px → 48px for the main section heading; line-height tight): Section headings, centered over their content. Event and listing H1s use 34px → 48px at line-height 1.1. Stage-tile titles run 34px → 56px for the holiday tile and 21px → 40px for category tiles.
- **Title** (600, 15px → 17px, line-height 1.3): Card titles (line-clamped to 2), FAQ questions, and event fact lines. 21–24px bold for headings inside tiles.
- **Body** (400, 17px, line-height 1.75, Fog Ink): Long SEO prose, max 760px wide. Lead copy under the H1 is 18px → 23px at line-height 1.45, max 680px.
- **Label** (500, 12–13px): Card date and venue meta, counts, footer text (12px, line-height 1.35), and the 13px desktop nav. Figures use `tabular-nums`.

### Named Rules
**The Two Faces Rule.** Heebo is the site's face; `font-display`, `font-sans` and `font-apple` all resolve to it. The only other face is Rubik 800 on the home hero H1 (chosen by the owner 2026-09-17). Don't add a third face or spread Rubik to other headings without asking.

**The Bold Headline Rule.** Headlines ship at 700, not semibold. Heebo's Hebrew semibold reads thin on black at display sizes.

## Layout

The page is a centered column on a full-bleed stage. The standard container is max 1200px with a 16px gutter (24px from sm). The event page uses 1100px, and the header and footer use 1024px. Prose and FAQ blocks narrow to 760–860px.

- **Rhythm:** Sections are separated by bottom padding of 80px on mobile and 112px from sm (`pb-20 sm:pb-28`), not by containers. Text-only story and follow sections get a hairline top rule instead.
- **Global nav:** 48px tall, sticky, and translucent. The mobile menu is a full-screen black sheet with 28px semibold links that stagger in (60ms + 35ms per item).
- **Announcement ribbon:** An optional thin Understory Tile strip under the nav with centered 14px Fog Ink copy and a chevron link. It appears only when a holiday is near.
- **Hero:** Centered text over a full-bleed flyer wall. The wall is 1 row on mobile (136px flyers) and 2 opposing rows from sm (208px), and its edges fade through a horizontal mask.
- **Card rails:** On mobile, cards sit in a horizontal snap row at 72vw (max 300px); at sm, 42vw or 280px. From lg the night panel becomes a 4-column grid (gap 24px × 40px). Shelves stay horizontal, with paddles on hover-capable pointers only.
- **Tiles:** A 2-column grid with gaps of 12px, or 16px from sm. The holiday tile spans both columns.
- **Event page:** Flyer and facts sit side by side from md (two equal columns, the flyer column sticky at top 80px). Content tiles follow at 860px max.
- **Breakpoints:** Tailwind defaults (sm 640, md 768, lg 1024). Hover styles apply only on hover-capable devices (`hoverOnlyWhenSupported`).

**The Air Not Boxes Rule.** Separate sections with space and at most a hairline. Don't wrap a section in a bordered card.

## Elevation & Depth

This is a hybrid system. Surfaces are flat, tonal layers (stage → tile → tile-hover → tile-raised). Real shadows appear only under imagery lifted off the stage and under chrome that floats above content. Light on the stage comes from a soft green radial top-light on the hero (`radial-gradient(ellipse 55% 60% at 50% 0%, rgba(118,200,147,0.17), transparent 72%)`). Translucent chrome (header, cookie banner, paddles, overlays, the sold-out badge) uses backdrop blur.

### Shadow Vocabulary
- **Segment lift** (`box-shadow: 0 3px 8px rgba(0,0,0,0.35)`): The selected night in the segmented switch.
- **Badge lift** (`box-shadow: 0 4px 12px rgba(0,0,0,0.35)`): The coupon badge sitting on a flyer.
- **Paddle float** (`box-shadow: 0 4px 16px rgba(0,0,0,0.5)`): Shelf paddles.
- **Banner float** (`box-shadow: 0 12px 40px rgba(0,0,0,0.5)`): Cookie banner.
- **Fan flyer** (`box-shadow: 0 18px 40px rgba(0,0,0,0.55)`): Each flyer in a FlyerFan stack.
- **Dialog** (`box-shadow: 0 24px 60px rgba(0,0,0,0.5)`): The GoOut redirect overlay card.
- **Hero flyer** (`box-shadow: 0 30px 80px rgba(0,0,0,0.45)`): The event page's main flyer.

### Named Rules
**The Black Shadow Rule.** Shadows are soft, diffuse and pure black, and they sit only under imagery or floating chrome. No colored shadows, no glows, no hard offset shadows.

**The Light Not Paint Rule.** Gradients and blur appear only as light (the hero top-light, and the hero flyer glow: the first three wall flyers blurred 56–64px at 55% opacity behind a dark scrim, `components/home/HeroGlow.tsx`), as a scrim (a black-to-transparent caption fade on flyers) or as a mask (the wall's edge fade). Never use them as a surface fill or on text.

## Shapes

Everything is rounded and soft, and nothing is square-cornered. Actions, chips, the night switch, search fields and badges are full pills. Section tiles, content tiles and dialogs use 28px corners (22px for category tiles on mobile). Card link areas use 22px, and flyer images inside cards use 18px. Flyers on the wall use 16px on mobile and 20px from sm. Fan flyers use 14px on mobile and 18px from sm. Flyer imagery is always square (`aspect-square`, object-cover). The only exception is the event page's hero flyer, which shows at its natural ratio. Separators are 1px hairlines. The only icons are inline stroke SVG chevrons (stroke 2.6, 0.8em) and a small set of line icons.

## Components

### Buttons
Buttons feel confident and calm: a single green pill surrounded by quiet text.
- **Shape:** Full pill (9999px).
- **Primary (action):** Jungle Green with Canopy Black text, 12px × 24px padding, 17px medium. The header's compact variant is 4px × 14px at 12px.
- **Purchase:** A full-width pill with 16px × 24px padding at 18–19px semibold, plus an external-link icon. The sold-out state is a Raised Leaf slab in Deep Fog Ink with a not-allowed cursor.
- **Hover / Focus:** Fills change to Lit Jungle Green over 200ms. Press scales to 0.99. The focus-visible outline is 2px Moss Link with a 3px offset.
- **Quiet:** A Understory Tile pill in Moonlit Ink (the social follow buttons) that hovers to Raised Leaf. There is also an outline variant with a hairline border that hovers to a tile fill (event page "WhatsApp").
- **Chevron link:** Moss Link text followed by a left-pointing chevron. On hover it underlines (offset 4px) and the chevron nudges 2px toward the reading direction. This is the default secondary action everywhere.

### Chips
- **Style:** A transparent pill with a hairline border, Moonlit Ink text, 15px, and 10px × 20px padding.
- **State:** On hover the border rises to white/30 and the pill fills with tile. Event-page tag chips use Fog Ink text and brighten to ink on hover.

### Cards / Containers
- **Party card (LaunchPartyCard):** The shared card site-wide. It is a borderless link: a square flyer with 18px corners on a tile placeholder. Below it sit the date · time meta (ink-3), a 2-line semibold title, the venue, then a price ("החל מ-" plus the figure in ink semibold) and a "כרטיסים ›" chevron link. On hover the image scales to 1.035 over 700ms on the ease-apple curve. For account1 parties, a Jungle Green "קוד הנחה" pill badge sits at the top left. Sold-out cards dim the flyer (60% opacity, 35% grayscale) and show a black/70 blurred badge.
- **Stage tile:** Understory Tile with 28px corners and centered content: a bold title, a Fog Ink count line, then a FlyerFan that rises 8px on hover over 700ms. The fill changes to tile-hover over 300ms.
- **Content tile:** Understory Tile, 28px corners, 24px padding (32px from sm), with no border or shadow.
- **Internal padding:** 24–32px in tiles. Cards carry only 4px side padding under the image.

### Inputs / Fields
- **Style:** A tile pill with a leading icon in Deep Fog Ink, 16–17px text and ink-3 placeholder. At rest it has a 1px hairline ring (drawn with box-shadow).
- **Focus:** The ring grows to 2px Jungle Green. No glow.

### Navigation
- **Global nav:** 48px, sticky, Night Stage at 80% with backdrop blur-xl and saturate 1.8, and a hairline bottom border. Desktop links are 13px: ink/75 at rest, ink when hovered or active. A compact green pill sits at the end. On mobile, a two-bar icon morphs into a cross and opens a full-screen black sheet with 28px semibold links.
- **Footer:** A deeper floor below the stage, set in 12px Deep Fog Ink. Four link columns with semibold ink headings; links go to ink and underline on hover. Hairline rules divide the footer.
- **Breadcrumbs / back link:** A 15px Moss Link with a chevron.

### Night Switch (signature)
A segmented radio group that needs no JavaScript. The track is a tile pill with 3px padding and a 520px max width. Each segment is 40px tall, 14–15px semibold, in Fog Ink. The chosen night is struck forward: Raised Leaf fill, Moonlit Ink text and the segment-lift shadow, animated over 300ms on ease-apple. Counts appear at 12px and 70% opacity from sm. Panels switch through `:has(:checked)`. Within each night, account1 parties lead, but ordering never breaks date order across nights.

### Flyer Wall (signature)
The hero's product shot: real flyers drifting sideways in a seamless CSS loop (7s per flyer on row A, 8s on row B, rows in opposite directions). The wall fades in over 1.2s on cubic-bezier(0.16, 1, 0.3, 1). It pauses on hover and focus-within. The hovered flyer lifts 6px, scales to 1.03 and reveals its date over a black scrim. With reduced motion it becomes a static, horizontally scrollable row. account1 parties lead the wall.

### FAQ
Native `<details>` rows between hairlines. The question is 17px semibold ink. A plus icon in ink-3 rotates 45° on open over 300ms on ease-apple. Answers are 16px Fog Ink at line-height 1.7.

### Loading
Skeletons shaped like the listing page (pills and 18px squares) on tile. A faint light sweep (rgba(196,255,218,0.06)) crosses them every 1.6s on ease-apple. The sweep is off under reduced motion.

## Do's and Don'ts

### Do:
- **Do** use the token names (stage, tile, tile-hover, tile-raised, ink, ink-2, ink-3, hairline, action, action-hover, on-action, link) in all new markup.
- **Do** keep a single filled Jungle Green pill per viewport, and make every other action a Moss Link chevron link.
- **Do** set headlines in Heebo 700 (the home hero H1 is Rubik 800), centered, with at least 80px of air between sections (112px from sm).
- **Do** let real flyers carry the color: square, 16–22px corners, on a tile placeholder.
- **Do** animate only transform and opacity on cubic-bezier(0.28, 0.11, 0.32, 1), and give every looping or entrance animation a prefers-reduced-motion fallback.
- **Do** use LaunchPartyCard for every party listing, and put account1 parties first within a night, never out of date order.
- **Do** use `tabular-nums` for counts, prices and dates.

### Don't:
- **Don't** use the `jungle-*` or `wood-brown` alias names in new code.
- **Don't** use colored or glowing shadows, glow rings, or hard offset shadows. Shadows are black and diffuse, under imagery or floating chrome only.
- **Don't** use gradient text or gradient surface fills. Gradients are for light, scrim and mask only.
- **Don't** use emoji as icons. Use inline stroke SVGs.
- **Don't** add a second typeface or semibold display headlines.
- **Don't** fill card CTAs. On cards, "כרטיסים ›" stays a text link.
- **Don't** hardcode hex values in class names. Reach for the tokens.

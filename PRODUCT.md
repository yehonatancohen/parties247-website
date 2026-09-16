# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Young Israeli partygoers, mostly on phones, arriving from a Google result, an AI assistant answer, or a WhatsApp/Instagram link. They are deciding where to go out tonight, this weekend, or over a holiday, and want to find a party and buy a ticket fast.

## Product Purpose

Parties 24/7 (parties247.co.il) collects upcoming parties, raves, festivals and holiday events across Israel in one place. The site earns when a visitor goes from a party page to the official GoOut checkout carrying our referral code. Success is visitors reaching an event page and clicking through to buy.

## Positioning

One daily-updated list of Israeli nightlife across promoters and cities, browsable by day, city, genre, audience, club and holiday, with every event linking straight to its official ticket page.

## Operating Context

- Traffic lands on every page type as an SEO/GEO landing surface, not only the home page.
- Event data comes from `parties247_backend` (Render; slow, about 5s per uncached request) and is shown through ISR pages and carousels curated in the admin dashboard.
- Seasonal holiday pages (`/sukkot`, `/rosh-hashana`, `/purim`, ...) are promoted on the home page ahead of each holiday.

## Capabilities and Constraints

- Next.js 16 App Router on Vercel; Tailwind 3. All visible copy is Hebrew, RTL.
- Conversion path: event page → `PurchaseButton` → GoOut redirect with referral.
- SEO is load-bearing: JSON-LD (WebSite, Organization, FAQPage), indexable FAQ and internal-link text must survive any redesign.
- Analytics: GTM, Clarity, backend view/redirect beacons.

## Brand Commitments

- Name: Parties 24/7. Existing logo at the Vercel blob `Partieslogo.PNG`.
- Voice: casual, friendly Hebrew.
- 2026-09-16: the user asked for the home page and shared header/footer to move to a clean "Apple-style" look (impressive but practical), replacing the jungle theme there. Other pages keep the jungle styling for now.

## Evidence on Hand

- Real: live event list (count, cities, dates, prices, flyers) from the backend; curated carousels; social links (Instagram, TikTok, WhatsApp).
- Not real, must not be shown: the "50,000+ חוגגים" and "10,000+ עוקבים" numbers and the three 5-star testimonial quotes (confirmed invented by the user 2026-09-16). No reviews, follower counts or user numbers exist to cite.

## Product Principles

1. Get the visitor to a real party in as few taps as possible; tonight and this weekend come first.
2. Show only true, live facts; no invented social proof.
3. Speed is part of the product: visitors come from search on mobile data.
4. Every page must stay a good search landing page.

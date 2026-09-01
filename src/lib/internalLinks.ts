// Single source of truth for cross-page internal linking.
//
// Two parallel taxonomies exist on this site (hand-built /genre/* + /audience/*,
// and /parties/* from seoparties.ts) and several of them target the same query
// cluster. Internal links are an instruction to Google about which URL owns which
// anchor text, so every cross-link block on the site pulls its targets from the
// ONE map below. Rule of ownership:
//   • city query cluster        → /cities/{slug}
//   • music-genre query cluster → /genre/{slug}
//   • audience query cluster    → /audience/{slug}  (18+ is the proven exception on /parties/*)
//   • time-bound / niche vibe   → /parties/{slug}
// We only ever link to a page that actually renders inventory — linking to an
// empty listing page is a net-negative quality signal.

export type CrossLink = { label: string; href: string };

// ---- City ----------------------------------------------------------------

export const CITY_HEBREW_NAMES: Record<string, string> = {
  "tel-aviv": "תל אביב",
  "haifa": "חיפה",
  "jerusalem": "ירושלים",
  "rishon-lezion": "ראשון לציון",
  "petah-tikva": "פתח תקווה",
  "ashdod": "אשדוד",
  "netanya": "נתניה",
  "beer-sheva": "באר שבע",
  "holon": "חולון",
  "bnei-brak": "בני ברק",
  "ramat-gan": "רמת גן",
  "rehovot": "רחובות",
  "bat-yam": "בת ים",
  "herzliya": "הרצליה",
  "kfar-saba": "כפר סבא",
  "eilat": "אילת",
  "tiberias": "טבריה",
};

// Cities whose listing page reliably resolves upcoming events (backend `areas`
// tagging + the Hebrew city tag). Everything else falls back to a thin template
// and must NOT be linked to prominently or indexed.
export const CITIES_WITH_INVENTORY = ["tel-aviv", "haifa", "eilat"] as const;

// Maps a backend `areas` key (lowercase English) OR the Hebrew city name to a
// city page slug.
const AREA_TO_CITY_SLUG: Record<string, string> = {
  "tel aviv": "tel-aviv",
  "tel-aviv": "tel-aviv",
  "haifa": "haifa",
  "eilat": "eilat",
};

const HEBREW_CITY_TO_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(CITY_HEBREW_NAMES).map(([slug, he]) => [he, slug]),
);
HEBREW_CITY_TO_SLUG["תל-אביב"] = "tel-aviv";

/** Resolve a city page slug from a party's `areas` array, tags and location string. */
export function resolveCitySlug(opts: {
  areas?: string[];
  tags?: string[];
  locationName?: string;
}): string | null {
  for (const a of opts.areas ?? []) {
    const hit = AREA_TO_CITY_SLUG[a.toLowerCase().trim()];
    if (hit) return hit;
  }
  for (const tag of opts.tags ?? []) {
    const hit = HEBREW_CITY_TO_SLUG[tag.trim()];
    if (hit) return hit;
  }
  const loc = (opts.locationName ?? "").toLowerCase();
  if (loc.includes("tel aviv") || loc.includes("tel-aviv")) return "tel-aviv";
  if (loc.includes("haifa")) return "haifa";
  if (loc.includes("eilat")) return "eilat";
  return null;
}

// ---- Genre -------------------------------------------------------------------

// party.musicType → /genre slug
export const MUSIC_TYPE_TO_GENRE_SLUG: Record<string, string> = {
  "טכנו": "techno-music",
  "טראנס": "trance-music",
  "האוס": "house-music",
  "מיינסטרים": "mainstream-music",
};

export const GENRE_HE_LABEL: Record<string, string> = {
  "techno-music": "מסיבות טכנו",
  "rave-parties": "רייבים בישראל",
  "house-music": "מסיבות האוס",
  "mainstream-music": "מסיבות מיינסטרים",
  "trance-music": "מסיבות טראנס",
};

// ---- Audience --------------------------------------------------------------

export const AUDIENCE_HE_LABEL: Record<string, string> = {
  "teenage-parties": "מסיבות נוער",
  "student-parties": "מסיבות סטודנטים",
  "soldier-parties": "מסיבות חיילים",
  "24plus-parties": "מסיבות 24+",
};

/** Resolve an audience page slug from a party's age field / tags. */
export function resolveAudienceSlug(opts: { age?: string; tags?: string[] }): string | null {
  const age = opts.age ?? "";
  const tags = opts.tags ?? [];
  if (age === "נוער" || tags.some((t) => t.includes("נוער"))) return "teenage-parties";
  if (tags.some((t) => t.toLowerCase().includes("student") || t.includes("סטוד"))) return "student-parties";
  if (tags.some((t) => t.toLowerCase().includes("soldier") || t.includes("חייל"))) return "soldier-parties";
  if (age === "21+" || tags.some((t) => t.includes("24") || t.includes("25"))) return "24plus-parties";
  return null;
}

// ---- Curated cross-link sets ----------------------------------------------
//
// `buildExploreLinks` returns the "explore more" chips for a given page. It
// always points OUT of the current cluster and only at inventory-backed owners.

const CITY_LINK = (slug: string): CrossLink => ({
  label: `מסיבות ב${CITY_HEBREW_NAMES[slug] ?? slug}`,
  href: `/cities/${slug}`,
});
const GENRE_LINK = (slug: string): CrossLink => ({
  label: GENRE_HE_LABEL[slug] ?? slug,
  href: `/genre/${slug}`,
});

// Owners that always render inventory — safe universal link targets.
const CORE_GENRES: CrossLink[] = [
  GENRE_LINK("mainstream-music"),
  GENRE_LINK("techno-music"),
  GENRE_LINK("rave-parties"),
  GENRE_LINK("trance-music"),
];
const CORE_CITIES: CrossLink[] = CITIES_WITH_INVENTORY.map(CITY_LINK);
const GUIDES: CrossLink[] = [
  { label: "מדריך מועדוני טכנו בתל אביב", href: "/articles/מדריך-מועדוני-טכנו-בתל-אביב" },
];
const HOLIDAYS: CrossLink[] = [
  { label: "מסיבות ראש השנה 2026", href: "/rosh-hashana" },
  { label: "מסיבות סוכות 2026", href: "/sukkot" },
];

export type ExploreContext =
  | { kind: "city"; slug: string }
  | { kind: "genre"; slug: string }
  | { kind: "audience"; slug: string };

export type ExploreGroup = { heading: string; links: CrossLink[] };

export function buildExploreLinks(ctx: ExploreContext): ExploreGroup[] {
  const groups: ExploreGroup[] = [];

  if (ctx.kind === "city") {
    groups.push({ heading: "לפי סגנון מוזיקה", links: CORE_GENRES });
    groups.push({
      heading: "ערים נוספות",
      links: CORE_CITIES.filter((l) => l.href !== `/cities/${ctx.slug}`),
    });
    groups.push({ heading: "לפי קהל", links: [{ label: "מסיבות 18 פלוס בתל אביב", href: "/parties/18-plus-parties-tel-aviv" }] });
    groups.push({ heading: "מדריכים וחגים", links: [...GUIDES, ...HOLIDAYS] });
  }

  if (ctx.kind === "genre") {
    groups.push({
      heading: "סגנונות נוספים",
      links: CORE_GENRES.filter((l) => l.href !== `/genre/${ctx.slug}`),
    });
    groups.push({ heading: "לפי עיר", links: CORE_CITIES });
    groups.push({ heading: "מדריכים וחגים", links: [...GUIDES, ...HOLIDAYS] });
  }

  if (ctx.kind === "audience") {
    groups.push({ heading: "לפי עיר", links: CORE_CITIES });
    groups.push({ heading: "לפי סגנון מוזיקה", links: CORE_GENRES });
    groups.push({ heading: "עוד קהלים", links: [{ label: "מסיבות 18 פלוס בתל אביב", href: "/parties/18-plus-parties-tel-aviv" }] });
  }

  // never return an empty group
  return groups.filter((g) => g.links.length > 0);
}

export interface FaqEntry {
  question: string;
  answer: string;
}

export interface City {
  slug: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  neighborhoods: string[];
  landmarks: string[];
  faq: FaqEntry[];
  heroImage: string;
  heroAlt: string;
}

export type IntentKind = "audience" | "genre" | "time" | "venue" | "promoter";

export interface Intent {
  slugSegments: string[];
  name: string;
  kind: IntentKind;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  faq: FaqEntry[];
}

export interface VenueDetails {
  name: string;
  address: string;
  mapUrl?: string;
  phone?: string;
}

export interface EventDetails {
  slug: string;
  name: string;
  description: string;
  citySlug: string;
  venue: VenueDetails;
  organizer: string;
  startDate: string;
  endDate: string;
  price: number;
  currency: "ILS";
  ticketUrl: string;
  genres: string[];
  audiences: string[];
  times: string[];
  image: string;
  imageAlt: string;
}

export interface ArticleDetails {
  slug: string;
  title: string;
  excerpt: string;
  intro: string;
  body: string[];
  relatedIntents: string[][];
  relatedCitySlugs: string[];
  faq: FaqEntry[];
}

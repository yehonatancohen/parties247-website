import { notFound } from "next/navigation";
import { articles } from "@/data/articles";
import { cities } from "@/data/cities";
import { intents } from "@/data/intents";
import type { ArticleDetails, City, Intent } from "@/data/models";
import { paginateEvents } from "./events";

type Segments = string[] | undefined;

export type RouteKind =
  | { type: "home" }
  | { type: "city"; city: City; page: number }
  | { type: "intent"; intent: Intent; page: number }
  | { type: "city-intent"; city: City; intent: Intent; page: number }
  | { type: "articles" }
  | { type: "article"; article: ArticleDetails };

const PAGE_KEYWORD = "עמוד";

const cleanSegments = (segments: Segments): string[] =>
  (segments ?? []).filter((segment) => segment.length > 0);

const findCity = (slug: string) => cities.find((city) => city.slug === slug);

const matchIntent = (segments: string[]): Intent | undefined =>
  intents.find((intent) => intent.slugSegments.join("/") === segments.join("/"));

const extractPagination = (segments: string[]): { base: string[]; page: number } => {
  const index = segments.findIndex((value) => value === PAGE_KEYWORD);
  if (index === -1) {
    return { base: segments, page: 1 };
  }
  const pageSegment = segments[index + 1];
  const pageNumber = pageSegment ? Number.parseInt(pageSegment, 10) : 1;
  return {
    base: segments.slice(0, index),
    page: Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber : 1
  };
};

export const parseSegments = (segments: Segments): RouteKind => {
  const normalized = cleanSegments(segments);
  if (normalized.length === 0) {
    return { type: "home" };
  }

  if (normalized[0] === "כתבות") {
    if (normalized.length === 1) {
      return { type: "articles" };
    }
    const article = articles.find((item) => item.slug === normalized[1]);
    if (!article) {
      notFound();
    }
    return { type: "article", article };
  }

  const { base, page } = extractPagination(normalized);

  if (base.length === 0) {
    return { type: "home" };
  }

  const potentialCity = findCity(base[0]);
  if (potentialCity) {
    if (base.length === 1) {
      return { type: "city", city: potentialCity, page };
    }
    const intentSegments = base.slice(1);
    const intent = matchIntent(intentSegments);
    if (!intent) {
      notFound();
    }
    return { type: "city-intent", city: potentialCity, intent, page };
  }

  const intent = matchIntent(base);
  if (intent) {
    return { type: "intent", intent, page };
  }

  notFound();
};

export const buildSegmentsFromIntent = (intent: Intent): string[] => [...intent.slugSegments];

export const buildSegmentsFromCityIntent = (city: City, intent: Intent): string[] => [
  city.slug,
  ...intent.slugSegments
];

export const buildSegmentsFromCity = (city: City): string[] => [city.slug];

export const buildSegmentsFromArticles = (): string[] => ["כתבות"];

export const getAllStaticSegments = () => {
  const paths: string[][] = [];
  paths.push([]);
  cities.forEach((city) => {
    const { totalPages } = paginateEvents({ city }, 1);
    for (let page = 1; page <= totalPages; page += 1) {
      if (page === 1) {
        paths.push(buildSegmentsFromCity(city));
      } else {
        paths.push([...buildSegmentsFromCity(city), PAGE_KEYWORD, page.toString()]);
      }
    }
  });

  intents.forEach((intent) => {
    const { totalPages } = paginateEvents({ intent }, 1);
    for (let page = 1; page <= totalPages; page += 1) {
      const base = buildSegmentsFromIntent(intent);
      if (page === 1) {
        paths.push(base);
      } else {
        paths.push([...base, PAGE_KEYWORD, page.toString()]);
      }
    }
  });

  cities.forEach((city) => {
    intents.forEach((intent) => {
      const { totalPages } = paginateEvents({ city, intent }, 1);
      for (let page = 1; page <= totalPages; page += 1) {
        const base = buildSegmentsFromCityIntent(city, intent);
        if (page === 1) {
          paths.push(base);
        } else {
          paths.push([...base, PAGE_KEYWORD, page.toString()]);
        }
      }
    });
  });

  paths.push(buildSegmentsFromArticles());
  articles.forEach((article) => {
    paths.push(["כתבות", article.slug]);
  });
  return paths;
};

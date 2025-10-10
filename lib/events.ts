import { events } from "@/data/events";
import type { City, EventDetails, Intent } from "@/data/models";

export const EVENTS_PAGE_SIZE = 6;

type EventFilterContext = {
  city?: City;
  intent?: Intent;
};

const joinIntentPath = (intent: Intent) => intent.slugSegments.join("/");

const eventMatchesIntent = (event: EventDetails, intent: Intent) => {
  const joined = joinIntentPath(intent);
  switch (intent.kind) {
    case "genre":
      return event.genres.includes(intent.slugSegments[0]);
    case "audience":
      return event.audiences.includes(intent.slugSegments[0]);
    case "time":
      return event.times.some((entry) => entry === joined || entry === intent.slugSegments[0]);
    case "venue":
      return false;
    case "promoter":
      return false;
    default:
      return false;
  }
};

export const sortEventsByDate = (list: EventDetails[]) =>
  [...list].sort((a, b) => a.startDate.localeCompare(b.startDate));

export const filterEvents = ({ city, intent }: EventFilterContext): EventDetails[] => {
  let filtered = events;
  if (city) {
    filtered = filtered.filter((event) => event.citySlug === city.slug);
  }
  if (intent) {
    filtered = filtered.filter((event) => eventMatchesIntent(event, intent));
  }
  return sortEventsByDate(filtered);
};

export const paginateEvents = (
  context: EventFilterContext,
  page: number
): {
  events: EventDetails[];
  total: number;
  totalPages: number;
} => {
  const filtered = filterEvents(context);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / EVENTS_PAGE_SIZE));
  const currentPage = Math.min(Math.max(page, 1), totalPages);
  const start = (currentPage - 1) * EVENTS_PAGE_SIZE;
  const end = start + EVENTS_PAGE_SIZE;
  return {
    events: filtered.slice(start, end),
    total,
    totalPages
  };
};

export const buildItemListSchema = (
  name: string,
  eventList: EventDetails[]
) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name,
  itemListElement: eventList.map((event, index) => ({
    "@type": "ListItem",
    position: index + 1,
    url: `https://www.parties247.co.il/event/${event.slug}`
  }))
});

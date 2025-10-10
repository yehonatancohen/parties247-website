import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { JsonLd } from "@/components/JsonLd";
import { events, eventSlugs } from "@/data/events";
import { cities } from "@/data/cities";
import { intents } from "@/data/intents";
import type { EventDetails } from "@/data/models";
import { buildBreadcrumbSchema, type BreadcrumbItem } from "@/lib/page-content";

export const revalidate = 3600;

type Params = {
  slug: string;
};

const SITE_ORIGIN = "https://www.parties247.co.il";

const findEvent = (slug: string): EventDetails | undefined =>
  events.find((event) => event.slug === slug);

const findCityBreadcrumb = (event: EventDetails): BreadcrumbItem[] => {
  const city = cities.find((item) => item.slug === event.citySlug);
  if (!city) {
    return [{ name: "בית", href: "/" }];
  }
  return [
    { name: "בית", href: "/" },
    { name: city.name, href: `/${city.slug}` },
    { name: event.name, href: `/event/${event.slug}` }
  ];
};

const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("he-IL", {
    dateStyle: "full",
    timeStyle: "short"
  }).format(new Date(iso));

const mapEmbedUrl = (event: EventDetails) =>
  `https://www.google.com/maps?q=${encodeURIComponent(`${event.venue.name} ${event.venue.address}`)}&output=embed`;

const getRelatedIntents = (event: EventDetails) => {
  const relatedPaths = new Set<string>();
  event.genres.forEach((slug) => relatedPaths.add(slug));
  event.audiences.forEach((slug) => relatedPaths.add(slug));
  event.times.forEach((slug) => relatedPaths.add(slug));

  const links: { name: string; href: string }[] = [];
  relatedPaths.forEach((slug) => {
    const intent = intents.find(
      (item) =>
        item.slugSegments.join("/") === slug ||
        item.slugSegments[0] === slug
    );
    if (intent) {
      links.push({
        name: intent.name,
        href: `/${intent.slugSegments.join("/")}`
      });
    }
  });

  const city = cities.find((item) => item.slug === event.citySlug);
  if (city) {
    links.unshift({ name: `מסיבות ב${city.name}`, href: `/${city.slug}` });
  }

  return links;
};

const buildEventJsonLd = (event: EventDetails) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name: event.name,
  startDate: event.startDate,
  endDate: event.endDate,
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: event.venue.name,
    address: event.venue.address
  },
  organizer: {
    "@type": "Organization",
    name: event.organizer
  },
  offers: {
    "@type": "Offer",
    price: event.price.toString(),
    priceCurrency: event.currency,
    availability: "https://schema.org/InStock",
    url: `${SITE_ORIGIN}/event/${event.slug}`
  }
});

export async function generateStaticParams() {
  return eventSlugs.map((slug) => ({ slug }));
}

export function generateMetadata({ params }: { params: Params }): Metadata {
  const event = findEvent(params.slug);
  if (!event) {
    return {};
  }
  const city = cities.find((item) => item.slug === event.citySlug);
  const cityLabel = city ? ` ב${city.name}` : "";
  const title = `${event.name}${cityLabel}`;
  const description = `${event.description.slice(0, 140)}...`;
  return {
    title: `${title} - Parties 24/7`,
    description,
    alternates: {
      canonical: `${SITE_ORIGIN}/event/${event.slug}`
    },
    openGraph: {
      title,
      description,
      url: `${SITE_ORIGIN}/event/${event.slug}`,
      type: "event",
      locale: "he_IL"
    }
  };
}

export default function EventPage({ params }: { params: Params }) {
  const event = findEvent(params.slug);
  if (!event) {
    notFound();
  }
  const breadcrumbs = findCityBreadcrumb(event);
  const breadcrumbSchema = buildBreadcrumbSchema(breadcrumbs);
  const related = getRelatedIntents(event);
  const eventJsonLd = buildEventJsonLd(event);

  return (
    <>
      <JsonLd data={[breadcrumbSchema, eventJsonLd]} />
      <Breadcrumbs items={breadcrumbs} />
      <article className="hero">
        <h1>{event.name}</h1>
        <p>{event.description}</p>
        <div className="event-meta">
          <time dateTime={event.startDate}>התחלה: {formatDate(event.startDate)}</time>
          <time dateTime={event.endDate}>סיום: {formatDate(event.endDate)}</time>
          <span>מיקום: {event.venue.name}, {event.venue.address}</span>
          {event.venue.phone && <span>טלפון: {event.venue.phone}</span>}
        </div>
        <Link className="button-primary" href={event.ticketUrl}>
          רכישת כרטיסים באתר המפיק
        </Link>
      </article>
      <section>
        <h2>מפת הגעה</h2>
        <iframe
          src={mapEmbedUrl(event)}
          width="100%"
          height="320"
          style={{ border: 0, borderRadius: "12px" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`מפת הגעה אל ${event.venue.name}`}
        />
      </section>
      <section>
        <h2>קישורים קשורים</h2>
        <ul>
          {related.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>{item.name}</Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

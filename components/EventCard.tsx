import Link from "next/link";
import type { EventDetails } from "@/data/models";

interface Props {
  event: EventDetails;
}

export const EventCard = ({ event }: Props) => (
  <article className="event-card">
    <img src={event.image} alt={event.imageAlt} loading="lazy" />
    <div>
      <h3>
        <Link href={`/event/${event.slug}`}>{event.name}</Link>
      </h3>
      <div className="event-meta">
        <time dateTime={event.startDate}>מתחיל: {new Date(event.startDate).toLocaleString("he-IL")}</time>
        <time dateTime={event.endDate}>מסתיים: {new Date(event.endDate).toLocaleString("he-IL")}</time>
        <span>מיקום: {event.venue.name}, {event.venue.address}</span>
        <span>מחיר: ₪{event.price}</span>
      </div>
      <Link className="button-primary" href={`/event/${event.slug}`}>
        לכל הפרטים ולרכישת כרטיסים
      </Link>
    </div>
  </article>
);

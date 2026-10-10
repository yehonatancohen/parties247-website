import type { Party } from '@/data/types';

export interface PriceView {
  /** Cheapest currently buyable paid ticket, final price incl. fees. */
  amount: number | null;
  /** The event has free entry only — no paid ticket at all. */
  free: boolean;
  /** A free ticket sold next to the paid ones, e.g. "כניסה חופשית עד 23:30". */
  freeLabel: string | null;
  /**
   * GoOut has ticket types but none is on sale right now (not sold out — it is
   * also what an event looks like before its sale opens). Owner decision: say
   * so instead of showing a buy button.
   */
  closed: boolean;
}

export const SALES_CLOSED_LABEL = 'המכירה לא פתוחה כרגע';

/**
 * The one reading of a party's price for every surface (event page, cards,
 * sticky bar, JSON-LD). The backend's Listing Guard decides the numbers
 * (`ticketPrice` = cheapest paid tier; `priceInfo` says whether a free tier
 * exists) — this only decides how they are worded.
 *
 * A bare `ticketPrice: 0` without `priceInfo` is not trusted as "free": before
 * the Listing Guard, a "free until 23:30" tier next to an ₪80 ticket was stored
 * as price 0.
 */
export function priceView(party: Pick<Party, 'ticketPrice' | 'priceInfo'>): PriceView {
  const info = party.priceInfo;
  const amount = typeof party.ticketPrice === 'number' && party.ticketPrice > 0 ? party.ticketPrice : null;
  const free = amount === null && Boolean(info?.onlyFree);
  return {
    amount,
    free,
    freeLabel: amount !== null && info?.hasFree ? info.freeLabel ?? 'כניסה חופשית בהרשמה מראש' : null,
    closed: amount === null && !free && info?.salesState === 'closed',
  };
}

/** Price for schema.org `offers.price`: the paid price, `0` only for a truly free event. */
export function schemaPrice(party: Pick<Party, 'ticketPrice' | 'priceInfo'>): string | null {
  const view = priceView(party);
  if (view.amount !== null) return String(view.amount);
  return view.free ? '0' : null;
}

/** "כרטיסים החל מ-87.4 ₪" / "כניסה חופשית" / "המכירה לא פתוחה כרגע" / null when there is nothing honest to say. */
export function priceLabel(party: Pick<Party, 'ticketPrice' | 'priceInfo'>): string | null {
  const view = priceView(party);
  if (view.amount !== null) return `כרטיסים החל מ-${view.amount} ₪`;
  if (view.closed) return SALES_CLOSED_LABEL;
  return view.free ? 'כניסה חופשית' : null;
}

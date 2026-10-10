import { describe, expect, it } from 'vitest';
import { priceLabel, priceView, schemaPrice } from './price';

const info = (over: Partial<NonNullable<Parameters<typeof priceView>[0]['priceInfo']>> = {}) => ({
  from: null, hasFree: false, freeLabel: null, onlyFree: false, salesState: 'on_sale' as const, verified: true, ...over,
});

describe('priceView', () => {
  it('shows the paid price and turns a free tier into a badge', () => {
    // FRIDAY MAINSTREAM: ₪80 + fees next to "free until 23:30" used to render as ₪0.
    const party = { ticketPrice: 87.4, priceInfo: info({ from: 87.4, hasFree: true, freeLabel: 'כניסה חופשית עד 23:30' }) };
    expect(priceView(party)).toEqual({ amount: 87.4, free: false, freeLabel: 'כניסה חופשית עד 23:30', closed: false });
    expect(priceLabel(party)).toBe('כרטיסים החל מ-87.4 ₪');
    expect(schemaPrice(party)).toBe('87.4');
  });

  it('says free only when the backend says the event is free-only', () => {
    const party = { ticketPrice: 0, priceInfo: info({ hasFree: true, onlyFree: true, freeLabel: 'כניסה חופשית עד 23:00' }) };
    expect(priceView(party)).toEqual({ amount: null, free: true, freeLabel: null, closed: false });
    expect(priceLabel(party)).toBe('כניסה חופשית');
    expect(schemaPrice(party)).toBe('0');
  });

  it('does not trust a legacy price of 0 without priceInfo', () => {
    expect(priceView({ ticketPrice: 0 })).toEqual({ amount: null, free: false, freeLabel: null, closed: false });
    expect(priceLabel({ ticketPrice: 0 })).toBeNull();
    expect(schemaPrice({ ticketPrice: 0 })).toBeNull();
  });

  it('has nothing to say when the price is unknown', () => {
    expect(priceView({})).toEqual({ amount: null, free: false, freeLabel: null, closed: false });
    expect(schemaPrice({ ticketPrice: undefined, priceInfo: info({ salesState: 'closed' }) })).toBeNull();
  });

  it('marks a sale that is not open, unless a price is still known', () => {
    expect(priceView({ priceInfo: info({ salesState: 'closed' }) }).closed).toBe(true);
    expect(priceLabel({ priceInfo: info({ salesState: 'closed' }) })).toBe('המכירה לא פתוחה כרגע');
    expect(priceView({ ticketPrice: 60, priceInfo: info({ salesState: 'closed' }) }).closed).toBe(false);
    expect(priceView({ priceInfo: info({ salesState: 'coming_soon' }) }).closed).toBe(false);
  });

  it('works for a party the backend has not annotated yet', () => {
    expect(priceView({ ticketPrice: 56.75 })).toEqual({ amount: 56.75, free: false, freeLabel: null, closed: false });
  });
});

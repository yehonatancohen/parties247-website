import { describe, expect, it } from 'vitest';
import type { Party } from '@/data/types';
import { eventMetaDescription, eventMetaTitle, eventSummary, googleCalendarUrl, shareUrl, truncateWords } from './eventMeta';

// DECISION FESTIVAL, 2026-10-22 20:30 at Gagarin (the case from the 2026-10-21 site survey).
const party = (extra: Partial<Party> = {}) =>
  ({
    id: '1',
    slug: 'decision-festival-gagarin-tlv-22-10-october-2026',
    name: 'DECISION FESTIVAL',
    date: '2026-10-22T20:30:00.000',
    location: { name: 'Gagarin Club TLV, דרך קיבוץ גלויות, Tel Aviv-Yafo, Israel' },
    musicType: 'טכנו',
    age: '18+',
    ticketPrice: 120,
    tags: [],
    ...extra,
  }) as Party;

describe('googleCalendarUrl', () => {
  it('sends the real UTC time: 20:30 in Israel (summer, UTC+3) is 17:30Z', () => {
    const url = new URL(googleCalendarUrl(party(), ''));
    expect(url.searchParams.get('dates')).toBe('20261022T173000Z/20261022T213000Z');
    expect(url.searchParams.get('ctz')).toBe('Asia/Jerusalem');
  });

  it('uses the winter offset after DST ends on 2026-10-25', () => {
    const url = new URL(googleCalendarUrl(party({ date: '2026-11-26T22:30:00' }), ''));
    expect(url.searchParams.get('dates')).toBe('20261126T203000Z/20261127T003000Z');
  });

  it('is the same whatever the server timezone is', () => {
    const before = process.env.TZ;
    for (const tz of ['UTC', 'Asia/Jerusalem', 'America/New_York']) {
      process.env.TZ = tz;
      expect(new URL(googleCalendarUrl(party(), '')).searchParams.get('dates')).toBe('20261022T173000Z/20261022T213000Z');
    }
    process.env.TZ = before;
  });

  it('leaves the dates out rather than inventing them for an unparseable date', () => {
    expect(new URL(googleCalendarUrl(party({ date: 'Unknown Date' }), '')).searchParams.has('dates')).toBe(false);
  });
});

describe('eventSummary / meta', () => {
  it('says when, where, music, age and price in our own words', () => {
    expect(eventSummary(party())).toBe(
      'DECISION FESTIVAL – חמישי 22.10 · 20:30 ב-Gagarin Club TLV · תל אביב. מוזיקת טכנו, גיל כניסה 18+. כרטיסים החל מ-120 ₪.'
    );
  });

  it('keeps the calendar day of a late party (no UTC shift to the next day)', () => {
    expect(eventSummary(party({ date: '2026-10-22T23:00:00' }))).toContain('חמישי 22.10 · 23:00');
  });

  it('is past tense without a price on the archive', () => {
    const text = eventSummary(party(), { past: true });
    expect(text.startsWith('DECISION FESTIVAL התקיימה חמישי 22.10')).toBe(true);
    expect(text).not.toContain('₪');
  });

  it('title uses the venue, not the full street address', () => {
    expect(eventMetaTitle(party())).toBe('DECISION FESTIVAL - Gagarin Club TLV · תל אביב, חמישי 22.10');
    expect(eventMetaTitle(party(), { past: true })).toMatch(/\| ארכיון מסיבות$/);
  });

  it('meta description leads with the summary and stays within 160 characters', () => {
    const text = eventMetaDescription(party(), 'היי, זה שוב אנחנו '.repeat(20));
    expect(text.startsWith('DECISION FESTIVAL – חמישי 22.10')).toBe(true);
    expect(text.length).toBeLessThanOrEqual(160);
  });

  it('truncateWords cuts on a word boundary', () => {
    expect(truncateWords('אחת שתיים שלוש ארבע', 12)).toBe('אחת שתיים…');
  });
});

describe('shareUrl', () => {
  it('points at our event page with UTM tags', () => {
    expect(shareUrl('x', 'https://www.parties247.co.il', 'whatsapp')).toBe(
      'https://www.parties247.co.il/event/x?utm_source=share&utm_medium=whatsapp&utm_campaign=event_share'
    );
  });
});

import { describe, expect, it } from 'vitest';
import { captureFirstTouch, externalReferrerHost, readFirstTouch } from './firstTouch';

class FakeStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

const DAY = 24 * 60 * 60 * 1000;
const t0 = Date.parse('2026-09-20T12:00:00.000Z');

describe('externalReferrerHost', () => {
  it('returns the bare host of an external referrer', () => {
    expect(externalReferrerHost('https://www.google.com/search?q=x')).toBe('google.com');
  });
  it('ignores own-domain, empty and garbage referrers', () => {
    expect(externalReferrerHost('https://www.parties247.co.il/event/a')).toBeUndefined();
    expect(externalReferrerHost('')).toBeUndefined();
    expect(externalReferrerHost('not a url')).toBeUndefined();
  });
});

describe('captureFirstTouch', () => {
  it('stores utm + external referrer + landing path', () => {
    const s = new FakeStorage();
    const touch = captureFirstTouch(
      '?utm_source=Instagram&utm_medium=bio&utm_campaign=sukkot',
      '/event/x',
      'https://l.instagram.com/',
      s,
      t0,
    );
    expect(touch).toMatchObject({
      source: 'instagram',
      medium: 'bio',
      campaign: 'sukkot',
      referrerHost: 'l.instagram.com',
      landingPath: '/event/x',
    });
    expect(readFirstTouch(s, t0)).toEqual(touch);
  });

  it('keeps the first touch over a later one that also has a signal', () => {
    const s = new FakeStorage();
    captureFirstTouch('?utm_source=google', '/', undefined, s, t0);
    const later = captureFirstTouch('?utm_source=telegram', '/x', undefined, s, t0 + DAY);
    expect(later?.source).toBe('google');
  });

  it('upgrades a stored direct touch when a real signal arrives', () => {
    const s = new FakeStorage();
    captureFirstTouch('', '/', undefined, s, t0);
    const later = captureFirstTouch('', '/y', 'https://www.google.com/', s, t0 + DAY);
    expect(later?.referrerHost).toBe('google.com');
  });

  it('does not overwrite a signal with a later direct visit', () => {
    const s = new FakeStorage();
    captureFirstTouch('?utm_source=google', '/', undefined, s, t0);
    const later = captureFirstTouch('', '/z', undefined, s, t0 + DAY);
    expect(later?.source).toBe('google');
  });

  it('expires after 30 days', () => {
    const s = new FakeStorage();
    captureFirstTouch('?utm_source=google', '/', undefined, s, t0);
    expect(readFirstTouch(s, t0 + 31 * DAY)).toBeNull();
    const fresh = captureFirstTouch('?utm_source=tiktok', '/', undefined, s, t0 + 31 * DAY);
    expect(fresh?.source).toBe('tiktok');
  });
});

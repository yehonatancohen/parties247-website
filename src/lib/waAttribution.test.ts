import { describe, expect, it } from 'vitest';
import { captureWaCodeFromUrl, readWaAttribution } from './waAttribution';

// Minimal in-memory Storage fake — avoids depending on jsdom/localStorage
// just for these pure-function tests.
class FakeStorage {
  private store = new Map<string, string>();
  getItem(key: string): string | null {
    return this.store.has(key) ? this.store.get(key)! : null;
  }
  setItem(key: string, value: string): void {
    this.store.set(key, value);
  }
}

const HOUR = 60 * 60 * 1000;

describe('captureWaCodeFromUrl', () => {
  it('stores the code with the current time when ?w= is present', () => {
    const storage = new FakeStorage();
    const now = Date.parse('2026-09-10T12:00:00.000Z');
    const result = captureWaCodeFromUrl('?w=abc123', storage, now);
    expect(result).toEqual({ code: 'abc123', firstSeenAt: new Date(now).toISOString() });
    expect(readWaAttribution(storage, now)).toEqual(result);
  });

  it('is a no-op when there is no w param', () => {
    const storage = new FakeStorage();
    expect(captureWaCodeFromUrl('?utm_source=ig', storage)).toBeNull();
    expect(readWaAttribution(storage)).toBeNull();
  });

  it('overwrites an older code with a newer one (last touch wins)', () => {
    const storage = new FakeStorage();
    const first = Date.parse('2026-09-10T12:00:00.000Z');
    const second = first + HOUR;
    captureWaCodeFromUrl('?w=old-code', storage, first);
    captureWaCodeFromUrl('?w=new-code', storage, second);
    expect(readWaAttribution(storage, second)).toEqual({
      code: 'new-code',
      firstSeenAt: new Date(second).toISOString(),
    });
  });

  it('never throws when storage.setItem throws (e.g. private mode / quota)', () => {
    const throwing = { setItem: () => { throw new Error('quota exceeded'); } };
    expect(() => captureWaCodeFromUrl('?w=abc', throwing)).not.toThrow();
    expect(captureWaCodeFromUrl('?w=abc', throwing)).toBeNull();
  });
});

describe('readWaAttribution', () => {
  it('returns null when nothing is stored', () => {
    expect(readWaAttribution(new FakeStorage())).toBeNull();
  });

  it('returns null for malformed JSON', () => {
    const storage = new FakeStorage();
    storage.setItem('parties247.wa.attribution', 'not json');
    expect(readWaAttribution(storage)).toBeNull();
  });

  it('returns null for a shape missing required fields', () => {
    const storage = new FakeStorage();
    storage.setItem('parties247.wa.attribution', JSON.stringify({ code: 'abc' }));
    expect(readWaAttribution(storage)).toBeNull();
  });

  it('expires exactly at the 72h boundary', () => {
    const storage = new FakeStorage();
    const seen = Date.parse('2026-09-10T12:00:00.000Z');
    captureWaCodeFromUrl('?w=abc', storage, seen);

    const justBefore = seen + 72 * HOUR - 1;
    expect(readWaAttribution(storage, justBefore)).not.toBeNull();

    const justAfter = seen + 72 * HOUR + 1;
    expect(readWaAttribution(storage, justAfter)).toBeNull();
  });

  it('treats an unparseable firstSeenAt as expired', () => {
    const storage = new FakeStorage();
    storage.setItem('parties247.wa.attribution', JSON.stringify({ code: 'abc', firstSeenAt: 'garbage' }));
    expect(readWaAttribution(storage)).toBeNull();
  });

  it('never throws when storage.getItem throws', () => {
    const throwing = { getItem: () => { throw new Error('blocked'); } };
    expect(() => readWaAttribution(throwing)).not.toThrow();
    expect(readWaAttribution(throwing)).toBeNull();
  });
});

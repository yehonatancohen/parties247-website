/**
 * Attribution for WhatsApp campaign clicks (`?w=<code>` on /event/<slug>).
 *
 * Previously kept only in sessionStorage (see analytics.ts's old
 * captureWaCode/getWaCode), which dies the moment WhatsApp's in-app browser
 * closes — exactly the case that matters most, since a visitor who taps a
 * link, closes the browser, and buys later from a normal tab would silently
 * lose the code. localStorage with an explicit expiry survives that, while
 * still not attributing a purchase to a WhatsApp touch from a week ago.
 *
 * Last-touch wins: a newer `?w=` code always overwrites an older one.
 */

const STORAGE_KEY = 'parties247.wa.attribution';
const EXPIRY_MS = 72 * 60 * 60 * 1000; // 72h

export type WaAttribution = {
  code: string;
  firstSeenAt: string; // ISO
};

const isExpired = (attribution: WaAttribution, now: number): boolean => {
  const firstSeen = Date.parse(attribution.firstSeenAt);
  if (Number.isNaN(firstSeen)) return true;
  return now - firstSeen > EXPIRY_MS;
};

/**
 * Parses `?w=<code>` from a URL's query string and stores it (last-touch
 * wins), unless a code is already stored and unexpired — in which case we
 * still overwrite, since a *new* click always represents a fresher touch.
 * No-op when there's no `w` param. Never throws.
 */
export const captureWaCodeFromUrl = (
  search: string,
  storage: Pick<Storage, 'setItem'>,
  now: number = Date.now(),
): WaAttribution | null => {
  try {
    const code = new URLSearchParams(search).get('w');
    if (!code) return null;
    const attribution: WaAttribution = { code, firstSeenAt: new Date(now).toISOString() };
    storage.setItem(STORAGE_KEY, JSON.stringify(attribution));
    return attribution;
  } catch {
    return null;
  }
};

/**
 * Reads back a still-valid attribution, or null if absent/expired/corrupt.
 * Does not delete an expired entry — the next capture overwrites it anyway,
 * and a read-only path (view/redirect tracking) shouldn't have side effects.
 */
export const readWaAttribution = (
  storage: Pick<Storage, 'getItem'>,
  now: number = Date.now(),
): WaAttribution | null => {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.code !== 'string' || typeof parsed.firstSeenAt !== 'string') {
      return null;
    }
    const attribution = parsed as WaAttribution;
    return isExpired(attribution, now) ? null : attribution;
  } catch {
    return null;
  }
};

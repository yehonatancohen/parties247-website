/**
 * First-touch acquisition attribution — where a visitor originally came from.
 *
 * The buy-button redirect used to record only `document.referrer` of the page
 * the visitor was on at click time, which after any in-site navigation is one
 * of our own pages. So Google / Instagram / Telegram were invisible at the one
 * moment that matters (the click-out to GoOut). This stores the landing
 * touch (UTM params + external referrer + landing path) in localStorage for
 * 30 days and is attached to every view/redirect beacon.
 *
 * First-touch wins, with one exception: a stored "direct" touch (no UTM, no
 * external referrer) is upgraded by a later touch that carries a real signal,
 * since "direct" is what a missing signal looks like, not a real source.
 */

const STORAGE_KEY = 'parties247.first.touch';
const EXPIRY_MS = 30 * 24 * 60 * 60 * 1000; // 30d

export type FirstTouch = {
  source?: string; // utm_source, lowercased
  medium?: string;
  campaign?: string;
  referrerHost?: string; // external referrer hostname only, never a full URL
  landingPath: string;
  capturedAt: string; // ISO
};

const OWN_HOSTS = ['parties247.co.il', 'localhost'];

const isOwnHost = (host: string): boolean =>
  OWN_HOSTS.some((own) => host === own || host.endsWith(`.${own}`));

const clean = (value: string | null): string | undefined => {
  const trimmed = value?.trim().toLowerCase().slice(0, 80);
  return trimmed || undefined;
};

/** Hostname of an external referrer, or undefined for empty/own/unparseable. */
export const externalReferrerHost = (referrer: string | undefined): string | undefined => {
  if (!referrer) return undefined;
  try {
    const host = new URL(referrer).hostname.toLowerCase().replace(/^www\./, '');
    return host && !isOwnHost(host) ? host : undefined;
  } catch {
    return undefined;
  }
};

const hasSignal = (touch: Pick<FirstTouch, 'source' | 'referrerHost'>): boolean =>
  Boolean(touch.source || touch.referrerHost);

export const buildFirstTouch = (
  search: string,
  pathname: string,
  referrer: string | undefined,
  now: number = Date.now(),
): FirstTouch => {
  const params = new URLSearchParams(search);
  return {
    source: clean(params.get('utm_source')),
    medium: clean(params.get('utm_medium')),
    campaign: clean(params.get('utm_campaign')),
    referrerHost: externalReferrerHost(referrer),
    landingPath: pathname.slice(0, 200),
    capturedAt: new Date(now).toISOString(),
  };
};

export const readFirstTouch = (
  storage: Pick<Storage, 'getItem'>,
  now: number = Date.now(),
): FirstTouch | null => {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed.landingPath !== 'string' || typeof parsed.capturedAt !== 'string') {
      return null;
    }
    const capturedAt = Date.parse(parsed.capturedAt);
    if (Number.isNaN(capturedAt) || now - capturedAt > EXPIRY_MS) return null;
    return parsed as FirstTouch;
  } catch {
    return null;
  }
};

/** Stores the current landing as the first touch when appropriate. Never throws. */
export const captureFirstTouch = (
  search: string,
  pathname: string,
  referrer: string | undefined,
  storage: Pick<Storage, 'getItem' | 'setItem'>,
  now: number = Date.now(),
): FirstTouch | null => {
  try {
    const existing = readFirstTouch(storage, now);
    const candidate = buildFirstTouch(search, pathname, referrer, now);
    if (existing && (hasSignal(existing) || !hasSignal(candidate))) return existing;
    storage.setItem(STORAGE_KEY, JSON.stringify(candidate));
    return candidate;
  } catch {
    return null;
  }
};

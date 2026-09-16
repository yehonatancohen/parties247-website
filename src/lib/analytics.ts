import { recordPartyRedirect, recordPartyView, recordVisitor } from '../services/api';
import { pushToDataLayer } from './gtm';
import { captureWaCodeFromUrl, readWaAttribution, type WaAttribution } from './waAttribution';

export const COOKIE_CONSENT_KEY = 'cookieConsent_v2';
export const ANALYTICS_CONSENT_EVENT = 'analytics:consentGranted';
export const ADMIN_USER_KEY = 'parties247.isAdminUser';

const SESSION_STORAGE_KEY = 'parties247.analytics.sessionId';
const VISITOR_RECORDED_KEY = 'parties247.analytics.visitorRecorded';

let fallbackConsentGranted = false;
let fallbackAdminUser = false;

let analyticsReady = false;
let fallbackSessionId: string | null = null;
let fallbackVisitorRecorded = false;

const generateId = (): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`;
};

const readFromStorage = (storage: Storage, key: string): string | null => {
  try {
    return storage.getItem(key);
  } catch (error) {
    console.warn('Failed to read from storage', error);
    return null;
  }
};

const writeToStorage = (storage: Storage, key: string, value: string): void => {
  try {
    storage.setItem(key, value);
  } catch (error) {
    console.warn('Failed to write to storage', error);
  }
};

const hasVisitorBeenRecorded = (): boolean => {
  if (typeof window === 'undefined') {
    return fallbackVisitorRecorded;
  }

  try {
    return window.sessionStorage.getItem(VISITOR_RECORDED_KEY) === 'true';
  } catch (error) {
    console.warn('Failed to read visitor flag from storage', error);
    return fallbackVisitorRecorded;
  }
};

const markVisitorRecorded = (): void => {
  fallbackVisitorRecorded = true;
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.sessionStorage.setItem(VISITOR_RECORDED_KEY, 'true');
  } catch (error) {
    console.warn('Failed to persist visitor flag', error);
  }
};

export const ensureSessionId = (): string => {
  if (typeof window === 'undefined') {
    if (!fallbackSessionId) {
      fallbackSessionId = generateId();
    }
    return fallbackSessionId;
  }

  let sessionId = readFromStorage(window.sessionStorage, SESSION_STORAGE_KEY);
  if (!sessionId) {
    sessionId = generateId();
    writeToStorage(window.sessionStorage, SESSION_STORAGE_KEY, sessionId);
  }
  fallbackSessionId = sessionId;
  return sessionId;
};

export const hasAnalyticsConsent = (): boolean => {
  if (typeof window === 'undefined') {
    return fallbackConsentGranted;
  }
  try {
    const granted = window.localStorage.getItem(COOKIE_CONSENT_KEY) === 'true';
    if (granted) {
      fallbackConsentGranted = true;
    }
    return granted;
  } catch (error) {
    console.warn('Failed to read analytics consent', error);
    return fallbackConsentGranted;
  }
};

export const isAdminUser = (): boolean => {
  if (typeof window === 'undefined') {
    return fallbackAdminUser;
  }
  try {
    const flagged = window.localStorage.getItem(ADMIN_USER_KEY) === 'true';
    if (flagged) {
      fallbackAdminUser = true;
    }
    return flagged;
  } catch (error) {
    console.warn('Failed to read admin user flag', error);
    return fallbackAdminUser;
  }
};

/**
 * Marks the current browser as belonging to a logged-in admin so subsequent
 * analytics calls (in-house tracking, GTM, Clarity) can exclude this user.
 */
export const markAdminUser = (): void => {
  fallbackAdminUser = true;

  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(ADMIN_USER_KEY, 'true');
  } catch (error) {
    console.warn('Failed to persist admin user flag', error);
  }

  pushToDataLayer({ event: 'admin_user_identified', isAdminUser: true });

  try {
    const clarity = (window as unknown as { clarity?: (...args: unknown[]) => void }).clarity;
    clarity?.('stop');
  } catch (error) {
    console.debug('Failed to stop Clarity tracking for admin user', error);
  }
};

/**
 * Extract UTM parameters from the current URL query string.
 */
const extractUtmParams = (): Record<string, string> => {
  if (typeof window === 'undefined') return {};
  try {
    const params = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    const keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
    for (const key of keys) {
      const val = params.get(key);
      if (val) {
        // Convert utm_source -> utmSource
        const camelKey = key.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
        utm[camelKey] = val;
      }
    }
    return utm;
  } catch {
    return {};
  }
};

/**
 * Build enriched visitor context for the analytics API.
 */
const buildVisitorContext = (): Record<string, unknown> => {
  const ctx: Record<string, unknown> = {};

  if (typeof window === 'undefined') return ctx;

  try {
    ctx.pageUrl = window.location.href;
    ctx.referrer = document.referrer || undefined;
    ctx.language = navigator.language || undefined;

    try {
      ctx.timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    } catch { /* timezone optional */ }

    if (window.screen) {
      ctx.screenWidth = window.screen.width;
      ctx.screenHeight = window.screen.height;
    }

    // UTM parameters
    const utm = extractUtmParams();
    Object.assign(ctx, utm);
  } catch {
    // Silently fail — context is best-effort
  }

  return ctx;
};

// Old (pre-2026-09) sessionStorage-only key, kept as a read-only fallback so
// a tab that captured a code before this rollout doesn't lose it mid-session.
// Never written to anymore — see waAttribution.ts for why localStorage with
// an explicit expiry replaced it (WhatsApp's in-app browser closing used to
// wipe sessionStorage before a delayed purchase could carry the code along).
const LEGACY_WA_CODE_SESSION_KEY = 'parties247.wa.code';

const captureWaCode = (): void => {
  if (typeof window === 'undefined') return;
  captureWaCodeFromUrl(window.location.search, window.localStorage);
};

const getWaAttribution = (): WaAttribution | undefined => {
  if (typeof window === 'undefined') return undefined;
  const attribution = readWaAttribution(window.localStorage);
  if (attribution) return attribution;
  try {
    const legacyCode = window.sessionStorage.getItem(LEGACY_WA_CODE_SESSION_KEY);
    return legacyCode ? { code: legacyCode, firstSeenAt: '' } : undefined;
  } catch {
    return undefined;
  }
};

export const initializeAnalytics = (): boolean => {
  if (isAdminUser()) {
    return false;
  }

  if (!analyticsReady) {
    ensureSessionId();
    captureWaCode();
    analyticsReady = true;
  }

  // Always refresh the session identifier to keep it alive for long-lived tabs.
  ensureSessionId();

  if (!hasVisitorBeenRecorded()) {
    const sessionId = ensureSessionId();
    const context = buildVisitorContext();

    void recordVisitor(sessionId, context)
      .then(() => {
        markVisitorRecorded();
      })
      .catch((error) => {
        console.debug('Failed to record visitor event', error);
      });
  }

  return true;
};

export const trackPartyRedirect = (partyId: string, partySlug: string): boolean => {
  if (!partyId || !partySlug || isAdminUser()) {
    return false;
  }

  initializeAnalytics();
  const sessionId = ensureSessionId();
  const referrer = typeof document !== 'undefined' ? document.referrer : undefined;
  const waAttribution = getWaAttribution();

  void recordPartyRedirect({
    partyId, partySlug, sessionId, referrer,
    waCode: waAttribution?.code,
    waFirstSeenAt: waAttribution?.firstSeenAt || undefined,
  }).catch((error) => {
    console.debug('Failed to record party redirect', error);
  });
  return true;
};

export const trackPartyView = (partyId: string, partySlug: string): boolean => {
  if (!partyId || !partySlug || isAdminUser()) {
    return false;
  }

  initializeAnalytics();
  const sessionId = ensureSessionId();
  const referrer = typeof document !== 'undefined' ? document.referrer : undefined;
  // Attached here too (not just on the buy-click redirect) so "viewed party
  // A via WhatsApp, bought party B" is visible instead of only ever seeing
  // the WhatsApp touch on whichever party happened to convert.
  const waAttribution = getWaAttribution();

  recordPartyView({
    partyId, partySlug, sessionId, referrer,
    waCode: waAttribution?.code,
    waFirstSeenAt: waAttribution?.firstSeenAt || undefined,
  }).catch((error) => {
    console.debug('Failed to record party view', error);
  });
  return true;
};

/**
 * Fires a Microsoft Clarity custom event. Clarity's event API has no payload —
 * `clarity('event', name)` is just a boolean counter — so a `source`/label is
 * attached via `clarity('set', ...)` session tags, which Clarity's dashboard
 * lets you filter/segment sessions by. Also mirrors to GTM's dataLayer for
 * consistency with the existing `trackPurchaseButtonClick` dual-tracking
 * pattern. No-ops without consent or for admin users, same gate as everywhere
 * else in this file.
 */
const fireClarityEvent = (eventName: string, tags: Record<string, string> = {}): void => {
  if (typeof window === 'undefined' || isAdminUser() || !hasAnalyticsConsent()) {
    return;
  }
  try {
    const clarity = (window as unknown as { clarity?: (...args: unknown[]) => void }).clarity;
    for (const [key, value] of Object.entries(tags)) {
      clarity?.('set', key, value);
    }
    clarity?.('event', eventName);
  } catch (error) {
    console.debug(`Failed to fire Clarity event "${eventName}"`, error);
  }
  pushToDataLayer({ event: eventName, ...tags });
};

/** Coupon badge/copy button on an account1 event page or card was copied. */
export const trackCouponCopy = (partyId: string): void => {
  fireClarityEvent('coupon_copy', { party_id: partyId });
};

/** Purchase button was clicked while the coupon was auto-copied to the clipboard. */
export const trackBuyClickWithCoupon = (partyId: string): void => {
  fireClarityEvent('buy_click_with_coupon', { party_id: partyId });
};

/** WhatsApp group nudge was clicked. `source`: a = post-purchase-click, b = quiet
 * footer block, c = holiday page empty state. */
export const trackWhatsappClick = (source: 'a' | 'b' | 'c'): void => {
  fireClarityEvent('whatsapp_click', { whatsapp_source: source });
};

export const grantAnalyticsConsent = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    fallbackConsentGranted = true;
    window.localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
  } catch (error) {
    console.warn('Failed to persist analytics consent', error);
  }

  window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT));
};

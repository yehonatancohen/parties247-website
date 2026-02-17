import { recordPartyRedirect, recordVisitor } from '../src/services/api';

export const COOKIE_CONSENT_KEY = 'cookieConsent_v2';
export const ANALYTICS_CONSENT_EVENT = 'analytics:consentGranted';

const SESSION_STORAGE_KEY = 'parties247.analytics.sessionId';
const VISITOR_RECORDED_KEY = 'parties247.analytics.visitorRecorded';

let fallbackConsentGranted = false;

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

    const utm = extractUtmParams();
    Object.assign(ctx, utm);
  } catch {
    // Silently fail — context is best-effort
  }

  return ctx;
};

export const initializeAnalytics = (): boolean => {
  if (!analyticsReady) {
    ensureSessionId();
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
  if (!partyId || !partySlug) {
    return false;
  }

  initializeAnalytics();
  const sessionId = ensureSessionId();
  const referrer = typeof document !== 'undefined' ? document.referrer : undefined;

  void recordPartyRedirect({ partyId, partySlug, sessionId, referrer }).catch((error) => {
    console.debug('Failed to record party redirect', error);
  });
  return true;
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

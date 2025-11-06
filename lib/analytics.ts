import { recordPartyRedirect, recordPartyView, recordVisitor } from '../services/api';

export const COOKIE_CONSENT_KEY = 'cookieConsent_v2';
export const ANALYTICS_CONSENT_EVENT = 'analytics:consentGranted';

const SESSION_STORAGE_KEY = 'parties247.analytics.sessionId';
const USER_STORAGE_KEY = 'parties247.analytics.userId';
const VISITOR_RECORDED_KEY = 'parties247.analytics.visitorRecorded';

let fallbackConsentGranted = false;

let analyticsReady = false;
let fallbackSessionId: string | null = null;
let fallbackUserId: string | null = null;
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

const ensureSessionId = (): string => {
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

const ensureUserId = (): string => {
  if (typeof window === 'undefined') {
    if (!fallbackUserId) {
      fallbackUserId = generateId();
    }
    return fallbackUserId;
  }

  let userId = readFromStorage(window.localStorage, USER_STORAGE_KEY);
  if (!userId) {
    userId = generateId();
    writeToStorage(window.localStorage, USER_STORAGE_KEY, userId);
  }
  fallbackUserId = userId;
  return userId;
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

export const initializeAnalytics = (): boolean => {
  if (!hasAnalyticsConsent()) {
    analyticsReady = false;
    return false;
  }

  if (!analyticsReady) {
    ensureUserId();
    ensureSessionId();
    analyticsReady = true;
  }

  // Always refresh the session identifier to keep it alive for long-lived tabs.
  ensureSessionId();

  if (!hasVisitorBeenRecorded()) {
    const sessionId = ensureSessionId();
    void recordVisitor(sessionId)
      .then(() => {
        markVisitorRecorded();
      })
      .catch((error) => {
        console.debug('Failed to record visitor event', error);
      });
  }

  return true;
};

export const trackPartyView = (partyId: string, partySlug: string): boolean => {
  if (!partyId || !partySlug) {
    return false;
  }

  if (!initializeAnalytics()) {
    return false;
  }

  void recordPartyView({ partyId, partySlug }).catch((error) => {
    console.debug('Failed to record party view', error);
  });
  return true;
};

export const trackPartyRedirect = (partyId: string, partySlug: string): boolean => {
  if (!partyId || !partySlug) {
    return false;
  }

  if (!initializeAnalytics()) {
    return false;
  }

  void recordPartyRedirect({ partyId, partySlug }).catch((error) => {
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

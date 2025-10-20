import { AnalyticsEventRequest } from '../types';
import { sendAnalyticsEvent } from '../services/api';

export const COOKIE_CONSENT_KEY = 'cookieConsent_v2';
export const ANALYTICS_CONSENT_EVENT = 'analytics:consentGranted';

const SESSION_STORAGE_KEY = 'parties247.analytics.sessionId';
const USER_STORAGE_KEY = 'parties247.analytics.userId';

let analyticsReady = false;
let fallbackSessionId: string | null = null;
let fallbackUserId: string | null = null;

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
    return false;
  }
  try {
    return window.localStorage.getItem(COOKIE_CONSENT_KEY) === 'true';
  } catch (error) {
    console.warn('Failed to read analytics consent', error);
    return false;
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
  } else {
    // Always refresh the session identifier to keep it alive for long-lived tabs.
    ensureSessionId();
  }

  return true;
};

type TrackEventPayload = {
  category: string;
  action: string;
  label?: string;
  value?: number;
  path?: string;
  context?: Record<string, unknown>;
};

export const trackEvent = (event: TrackEventPayload): void => {
  if (!initializeAnalytics()) {
    return;
  }

  const sessionId = ensureSessionId();
  const userId = ensureUserId();
  const resolvedPath = event.path ?? (typeof window !== 'undefined' ? window.location.pathname : undefined);

  const payload: AnalyticsEventRequest = {
    category: event.category,
    action: event.action,
    sessionId,
    userId,
  };

  if (event.label) {
    payload.label = event.label;
  }
  if (typeof event.value === 'number') {
    payload.value = event.value;
  }
  if (resolvedPath) {
    payload.path = resolvedPath;
  }
  if (event.context && Object.keys(event.context).length > 0) {
    payload.context = event.context;
  }

  void sendAnalyticsEvent(payload).catch((error) => {
    console.debug('Failed to send analytics event', error);
  });
};

export const trackPageView = (path?: string, title?: string): void => {
  const context: Record<string, unknown> = {};
  if (typeof document !== 'undefined' && document.referrer) {
    context.referrer = document.referrer;
  }

  trackEvent({
    category: 'page',
    action: 'view',
    path,
    label: title ?? (typeof document !== 'undefined' ? document.title : undefined),
    context: Object.keys(context).length > 0 ? context : undefined,
  });
};

export const grantAnalyticsConsent = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    window.localStorage.setItem(COOKIE_CONSENT_KEY, 'true');
  } catch (error) {
    console.warn('Failed to persist analytics consent', error);
  }

  window.dispatchEvent(new Event(ANALYTICS_CONSENT_EVENT));
};

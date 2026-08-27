export type ConsentChoice = 'granted' | 'denied';

export interface ConsentState {
  analytics: ConsentChoice;
  advertising: ConsentChoice;
}

export const CONSENT_STORAGE_KEY = 'slashjournal-consent-v2';

export function readConsent(): ConsentState | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(CONSENT_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    if (parsed?.analytics && parsed?.advertising) return parsed as ConsentState;
    return null;
  } catch {
    return null;
  }
}

export function readAdvertisingConsent(): boolean {
  return readConsent()?.advertising === 'granted';
}

export function readAnalyticsConsent(): boolean {
  return readConsent()?.analytics === 'granted';
}

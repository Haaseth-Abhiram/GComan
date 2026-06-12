// Single source of truth for cookie-consent state.
//
// CookieConsent.tsx writes the user's choice to localStorage; the analytics
// (Google Analytics) and marketing (Zoho SalesIQ) integrations read it here and
// must NOT load their third-party scripts until the matching category is
// granted. Because consent can be granted mid-session (the banner is dismissed
// without a reload), those integrations also subscribe to CONSENT_EVENT so they
// can load the moment the user opts in.

export interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

/** Dispatched on window whenever the user saves a cookie choice. */
export const CONSENT_EVENT = 'gc:cookie-consent-changed';

const DENIED: CookiePreferences = { essential: true, analytics: false, marketing: false };

/** Current stored preferences. Defaults to deny-all until the user chooses. */
export function getConsentPreferences(): CookiePreferences {
  if (typeof localStorage === 'undefined') return DENIED;
  try {
    const raw = localStorage.getItem('cookiePreferences');
    if (!raw) return DENIED;
    const p = JSON.parse(raw);
    return {
      essential: true,
      analytics: p?.analytics === true,
      marketing: p?.marketing === true,
    };
  } catch {
    return DENIED;
  }
}

export const hasAnalyticsConsent = (): boolean => getConsentPreferences().analytics;
export const hasMarketingConsent = (): boolean => getConsentPreferences().marketing;

/** Notify in-page listeners (GA, Zoho) that consent changed, no reload needed. */
export function notifyConsentChanged(prefs: CookiePreferences): void {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent<CookiePreferences>(CONSENT_EVENT, { detail: prefs }));
}

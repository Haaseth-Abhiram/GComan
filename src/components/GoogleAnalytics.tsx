import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { hasAnalyticsConsent, CONSENT_EVENT } from '@/lib/consent';

// Google Analytics Tracking ID
const GA_MEASUREMENT_ID = 'G-6VX4FTG809';

// Declare gtag function type
declare global {
  interface Window {
    gtag: (
      command: 'config' | 'event' | 'js',
      targetId: string | Date,
      config?: Record<string, any>
    ) => void;
    dataLayer: any[];
  }
}

const GoogleAnalytics = () => {
  const location = useLocation();

  useEffect(() => {
    if (import.meta.env.DEV || !GA_MEASUREMENT_ID) {
      if (import.meta.env.DEV) console.log('Google Analytics disabled in development');
      return;
    }

    let injected = false;

    // Only load the gtag script once the user has granted analytics consent.
    // Loading it earlier would set GA cookies before consent (GDPR/ePrivacy).
    const loadGA = () => {
      if (injected || !hasAnalyticsConsent()) return;
      injected = true;

      const script1 = document.createElement('script');
      script1.async = true;
      script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      document.head.appendChild(script1);

      const script2 = document.createElement('script');
      script2.textContent = `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${GA_MEASUREMENT_ID}', {
          page_path: window.location.pathname,
        });
      `;
      document.head.appendChild(script2);
    };

    // Load now if consent was given in a previous session…
    loadGA();
    // …or the moment the user opts in via the cookie banner this session.
    window.addEventListener(CONSENT_EVENT, loadGA);
    return () => window.removeEventListener(CONSENT_EVENT, loadGA);
  }, []);

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

// =====================================================
// Helper function to push events to both gtag and dataLayer
// =====================================================
const pushEvent = (eventName: string, params: Record<string, any>) => {
  // Push to dataLayer for GTM compatibility
  if (window.dataLayer) {
    window.dataLayer.push({ event: eventName, ...params });
  }
  // Fire via gtag directly
  if (typeof window.gtag === 'function') {
    window.gtag('event', eventName, params);
  }
};

// =====================================================
// GA4 CONVERSION TRACKING
// IMPORTANT: Mark "generate_lead_contact" and "generate_lead_career" as Key
// Events in the GA4 dashboard (Admin → Events → Mark as Key Event).
// Kept as two separate event names (rather than one "generate_lead" event)
// so a job-application spike/lull can't be misread as a sales-lead trend.
// =====================================================

/**
 * Track lead generation events (contact form, quote form submissions)
 * This is the PRIMARY conversion event - mark as Key Event in GA4.
 */
export const trackGenerateLead = (formName: string, method: string = 'web') => {
  const eventName = formName === 'career' ? 'generate_lead_career' : 'generate_lead_contact';
  pushEvent(eventName, {
    form_name: formName,
    method: method,
    currency: 'OMR',
  });
};

/**
 * Track contact clicks (phone, WhatsApp, email)
 */
export const trackContactClick = (method: 'phone' | 'whatsapp' | 'email') => {
  pushEvent('contact_click', {
    method: method,
    event_category: 'Contact',
    event_label: method,
  });
};

/**
 * Track file downloads (brochures, catalogs, SDS)
 */
export const trackFileDownload = (fileName: string) => {
  pushEvent('file_download', {
    file_name: fileName,
    event_category: 'Downloads',
    event_label: fileName,
  });
};

/**
 * Track CTA button clicks (Get Quote, etc.)
 */
export const trackSelectContent = (contentType: string, itemId: string) => {
  pushEvent('select_content', {
    content_type: contentType,
    item_id: itemId,
  });
};

// Legacy helpers (kept for backward compatibility)
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  pushEvent(action, {
    event_category: category,
    event_label: label,
    value: value,
  });
};

export const trackProductView = (productId: string, productName: string, category: string) => {
  pushEvent('view_item', {
    event_category: 'Products',
    event_label: `${productName} (${category})`,
    items: [{ item_id: productId, item_name: productName, item_category: category }],
  });
};

export const trackSearch = (searchTerm: string) => {
  pushEvent('search', { search_term: searchTerm });
};

// Separate event name from trackSearch's generic 'search' (the on-page product
// catalog filter) so AI Search Dialog queries don't blend into the same metric —
// same reasoning as the generate_lead_contact/generate_lead_career split above.
export const trackAISearch = (searchTerm: string) => {
  pushEvent('ai_search_query', { search_term: searchTerm });
};

export const trackDownload = (resourceName: string) => {
  trackFileDownload(resourceName);
};

export const trackFormSubmission = (formName: string) => {
  trackGenerateLead(formName, 'web');
};

export const trackLanguageChange = (language: string) => {
  pushEvent('language_change', { language });
};

export default GoogleAnalytics;

import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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
    if (process.env.NODE_ENV !== 'production' || !GA_MEASUREMENT_ID) {
      console.log('Google Analytics disabled in development');
      return;
    }

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

    return () => {
      try {
        if (script1.parentNode) document.head.removeChild(script1);
        if (script2.parentNode) document.head.removeChild(script2);
      } catch (error) {
        console.error('Error cleaning up GA scripts:', error);
      }
    };
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
// IMPORTANT: Mark "generate_lead" as a Key Event in the GA4 dashboard
// (Admin → Events → Mark as Key Event)
// =====================================================

/**
 * Track lead generation events (contact form, quote form submissions)
 * This is the PRIMARY conversion event - mark as Key Event in GA4.
 */
export const trackGenerateLead = (formName: string, method: string = 'web') => {
  pushEvent('generate_lead', {
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

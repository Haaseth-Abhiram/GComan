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
    // Only load in production
    if (process.env.NODE_ENV !== 'production' || !GA_MEASUREMENT_ID) {
      console.log('Google Analytics disabled in development');
      return;
    }

    // Load Google Analytics script
    const script1 = document.createElement('script');
    script1.async = true;
    script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(script1);

    const script2 = document.createElement('script');
    script2.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${GA_MEASUREMENT_ID}', {
        page_path: window.location.pathname,
      });
    `;
    document.head.appendChild(script2);

    return () => {
      // Cleanup on unmount - safely remove scripts
      try {
        if (script1.parentNode) {
          document.head.removeChild(script1);
        }
        if (script2.parentNode) {
          document.head.removeChild(script2);
        }
      } catch (error) {
        console.error('Error cleaning up GA scripts:', error);
      }
    };
  }, []);

  // Track page views on route change
  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('config', GA_MEASUREMENT_ID, {
        page_path: location.pathname + location.search,
      });
    }
  }, [location]);

  return null;
};

// Helper functions for tracking events
export const trackEvent = (
  action: string,
  category: string,
  label?: string,
  value?: number
) => {
  if (typeof window.gtag === 'function') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

export const trackProductView = (productId: string, productName: string, category: string) => {
  trackEvent('view_item', 'Products', `${productName} (${category})`, 1);
};

export const trackSearch = (searchTerm: string) => {
  trackEvent('search', 'Products', searchTerm);
};

export const trackDownload = (resourceName: string) => {
  trackEvent('download', 'Resources', resourceName);
};

export const trackFormSubmission = (formName: string) => {
  trackEvent('form_submit', 'Forms', formName);
};

export const trackLanguageChange = (language: string) => {
  trackEvent('language_change', 'Preferences', language);
};

export default GoogleAnalytics;

import { useEffect } from 'react';
import { hasMarketingConsent, CONSENT_EVENT } from '@/lib/consent';

/**
 * Zoho SalesIQ Live Chat Widget
 * Loads the chat widget on all pages for customer engagement.
 *
 * SalesIQ sets visitor-tracking cookies, so it's gated behind the user's
 * "marketing" cookie consent. (If you'd rather treat live chat as a functional
 * support tool that loads for everyone, swap hasMarketingConsent() for a
 * constant true.)
 */
export const ZohoSalesIQ = () => {
  useEffect(() => {
    // Skip during prerender. The puppeteer renderer used by
    // @prerenderer/rollup-plugin reports a HeadlessChrome user agent. If we
    // let the embed run, the SalesIQ widget DOM gets frozen into the static
    // HTML; the loader <script> then re-initialises in the real browser and
    // a second launcher renders next to the prerendered one.
    if (typeof navigator !== 'undefined' && /HeadlessChrome/i.test(navigator.userAgent)) {
      return;
    }

    let timer: ReturnType<typeof setTimeout> | undefined;

    // Initialize Zoho SalesIQ
    const initZohoSalesIQ = () => {
      // Add the widget configuration
      (window as any).$zoho = (window as any).$zoho || {};
      (window as any).$zoho.salesiq = (window as any).$zoho.salesiq || {
        widgetcode: "siq3b6c690b0b8928b4b145e6f29a429a0c894a7447ff8b04fa69bdda85d6cd1bcf",
        values: {},
        ready: function() {},
      };

      // Check if script already exists
      if (document.getElementById('zsiqscript')) {
        return;
      }

      // Create and append the script
      const script = document.createElement('script');
      script.id = 'zsiqscript';
      script.src = 'https://salesiq.zohopublic.com/widget?wc=siq3b6c690b0b8928b4b145e6f29a429a0c894a7447ff8b04fa69bdda85d6cd1bcf';
      script.defer = true;
      script.async = true;

      script.onerror = () => {
        console.error('Failed to load Zoho SalesIQ widget');
      };

      document.body.appendChild(script);
    };

    // Load the widget only once the user has granted marketing consent.
    const loadIfConsented = () => {
      if (!hasMarketingConsent() || document.getElementById('zsiqscript')) return;
      // Small delay to ensure DOM is ready
      timer = setTimeout(initZohoSalesIQ, 100);
    };

    // Load now if consent was given previously…
    loadIfConsented();
    // …or the moment the user opts in via the cookie banner this session.
    window.addEventListener(CONSENT_EVENT, loadIfConsented);

    // Cleanup function
    return () => {
      if (timer) clearTimeout(timer);
      window.removeEventListener(CONSENT_EVENT, loadIfConsented);
      // Note: We don't remove the script itself to maintain chat state.
    };
  }, []);

  return null; // This component doesn't render anything visible
};

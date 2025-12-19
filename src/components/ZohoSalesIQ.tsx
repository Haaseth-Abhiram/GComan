import { useEffect } from 'react';

/**
 * Zoho SalesIQ Live Chat Widget
 * Loads the chat widget on all pages for customer engagement
 */
export const ZohoSalesIQ = () => {
  useEffect(() => {
    // Initialize Zoho SalesIQ
    const initZohoSalesIQ = () => {
      // Add the widget configuration
      (window as any).$zoho = (window as any).$zoho || {};
      (window as any).$zoho.salesiq = (window as any).$zoho.salesiq || {
        widgetcode: "siq3b6c690b0b8928b4b145e6f29a429a0c894a7447ff8b04fa69bdda85d6cd1bcf",
        values: {},
        ready: function() {
          console.log('Zoho SalesIQ widget loaded successfully');
        }
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

    // Initialize after a small delay to ensure DOM is ready
    const timer = setTimeout(initZohoSalesIQ, 100);

    // Cleanup function
    return () => {
      clearTimeout(timer);
      // Note: We don't remove the script on unmount to maintain chat state
    };
  }, []);

  return null; // This component doesn't render anything visible
};

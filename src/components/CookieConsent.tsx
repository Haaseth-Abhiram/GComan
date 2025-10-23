import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { X, Cookie } from 'lucide-react';
import { Button } from '@/components/ui/button';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already accepted cookies
    const hasAccepted = localStorage.getItem('cookieConsent');
    if (!hasAccepted) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setShowBanner(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  const declineCookies = () => {
    localStorage.setItem('cookieConsent', 'declined');
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 animate-in slide-in-from-bottom duration-500">
      <div className="bg-card border-t border-border shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-4 flex-1">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg mb-2">We Value Your Privacy</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  We use cookies and similar technologies to enhance your browsing experience, analyze site traffic, 
                  and personalize content. By clicking "Accept All," you consent to our use of cookies.
                </p>
                <div className="flex flex-wrap gap-3 text-sm">
                  <Link 
                    to="/privacy" 
                    className="text-primary hover:underline font-medium"
                  >
                    Privacy Policy
                  </Link>
                  <span className="text-muted-foreground">•</span>
                  <Link 
                    to="/terms" 
                    className="text-primary hover:underline font-medium"
                  >
                    Terms & Conditions
                  </Link>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button
                onClick={declineCookies}
                variant="outline"
                className="flex-1 md:flex-none"
              >
                Decline
              </Button>
              <Button
                onClick={acceptCookies}
                className="flex-1 md:flex-none bg-primary hover:bg-primary/90"
              >
                Accept All
              </Button>
              <Button
                onClick={declineCookies}
                variant="ghost"
                size="icon"
                className="flex-shrink-0"
                aria-label="Close cookie banner"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;

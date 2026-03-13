import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cookie, Settings2, X, Shield, BarChart3, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

interface CookiePreferences {
  essential: boolean;
  analytics: boolean;
  marketing: boolean;
}

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    essential: true,
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (prefs: CookiePreferences) => {
    localStorage.setItem('cookieConsent', 'custom');
    localStorage.setItem('cookiePreferences', JSON.stringify(prefs));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
  };

  const acceptAll = () => {
    savePreferences({ essential: true, analytics: true, marketing: true });
  };

  const acceptMinimum = () => {
    savePreferences({ essential: true, analytics: false, marketing: false });
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Compact pill banner - centered at bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom duration-500">
        <div className="flex items-center gap-3 rounded-full bg-gradient-to-r from-secondary via-primary to-accent px-1.5 py-1.5 shadow-xl shadow-primary/20">
          {/* Inner pill content */}
          <div className="flex items-center gap-3 rounded-full bg-card/95 backdrop-blur-sm pl-4 pr-2 py-2">
            <Cookie className="h-4 w-4 text-primary flex-shrink-0" />
            <span className="text-sm font-medium text-foreground whitespace-nowrap">
              We use cookies
            </span>
            <div className="flex items-center gap-1.5">
              <Button
                onClick={() => setShowSettings(true)}
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 text-xs rounded-full text-muted-foreground hover:text-foreground"
              >
                <Settings2 className="h-3.5 w-3.5 mr-1" />
                Settings
              </Button>
              <Button
                onClick={acceptMinimum}
                variant="outline"
                size="sm"
                className="h-7 px-3 text-xs rounded-full border-border"
              >
                Decline
              </Button>
              <Button
                onClick={acceptAll}
                size="sm"
                className="h-7 px-3 text-xs rounded-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Accept All
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cookie Settings Dialog */}
      <Dialog open={showSettings} onOpenChange={setShowSettings}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary via-primary to-accent flex items-center justify-center">
                <Cookie className="h-4 w-4 text-primary-foreground" />
              </div>
              Cookie Preferences
            </DialogTitle>
            <DialogDescription>
              Manage how Global Chemicals uses cookies on this site.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {/* Essential */}
            <div className="flex items-start justify-between gap-3 p-3 rounded-lg bg-muted/50">
              <div className="flex items-start gap-3">
                <Shield className="h-4 w-4 text-primary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Essential Cookies</p>
                  <p className="text-xs text-muted-foreground">Required for the site to function. Cannot be disabled.</p>
                </div>
              </div>
              <Switch checked disabled className="data-[state=checked]:bg-primary" />
            </div>

            {/* Analytics */}
            <div className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <BarChart3 className="h-4 w-4 text-accent mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Analytics Cookies</p>
                  <p className="text-xs text-muted-foreground">Help us understand site usage and improve performance.</p>
                </div>
              </div>
              <Switch
                checked={preferences.analytics}
                onCheckedChange={(v) => setPreferences(p => ({ ...p, analytics: v }))}
                className="data-[state=checked]:bg-primary"
              />
            </div>

            {/* Marketing */}
            <div className="flex items-start justify-between gap-3 p-3 rounded-lg border border-border">
              <div className="flex items-start gap-3">
                <Target className="h-4 w-4 text-secondary mt-0.5" />
                <div>
                  <p className="text-sm font-medium">Marketing Cookies</p>
                  <p className="text-xs text-muted-foreground">Used for targeted ads and personalized content.</p>
                </div>
              </div>
              <Switch
                checked={preferences.marketing}
                onCheckedChange={(v) => setPreferences(p => ({ ...p, marketing: v }))}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex gap-2 text-xs">
              <Link to="/privacy" className="text-primary hover:underline" onClick={() => setShowSettings(false)}>
                Privacy Policy
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/terms" className="text-primary hover:underline" onClick={() => setShowSettings(false)}>
                Terms
              </Link>
            </div>
            <div className="flex gap-2">
              <Button onClick={acceptMinimum} variant="outline" size="sm" className="text-xs">
                Essential Only
              </Button>
              <Button onClick={() => savePreferences(preferences)} size="sm" className="text-xs bg-primary hover:bg-primary/90 text-primary-foreground">
                Save Preferences
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CookieConsent;

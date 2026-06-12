import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

// Cloudflare Turnstile bot/abuse-protection widget.
// Renders nothing (no-op) when VITE_TURNSTILE_SITE_KEY is not set, so the
// integration can ship before a key is provisioned without breaking forms.
//
// Server-side verification lives in supabase/functions/submit-contact and
// runs only when TURNSTILE_SECRET_KEY is set. Both halves degrade gracefully
// to "captcha disabled" if their respective env var is missing.

const TURNSTILE_SCRIPT_SRC = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement,
        opts: {
          sitekey: string;
          callback?: (token: string) => void;
          'expired-callback'?: () => void;
          'error-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
          size?: 'normal' | 'compact';
        }
      ) => string;
      reset: (id: string) => void;
      remove: (id: string) => void;
    };
  }
}

let scriptLoadingPromise: Promise<void> | null = null;
function loadTurnstileScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.resolve();
  if (window.turnstile) return Promise.resolve();
  if (scriptLoadingPromise) return scriptLoadingPromise;
  scriptLoadingPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${TURNSTILE_SCRIPT_SRC}"]`);
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }
    const s = document.createElement('script');
    s.src = TURNSTILE_SCRIPT_SRC;
    s.async = true;
    s.defer = true;
    s.onload = () => resolve();
    s.onerror = reject;
    document.head.appendChild(s);
  });
  return scriptLoadingPromise;
}

interface TurnstileProps {
  onToken: (token: string) => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
}

export interface TurnstileHandle {
  /**
   * Tokens are single-use: once a submission reaches siteverify the token is
   * consumed even if the request then fails validation. Callers must reset
   * the widget in every failed-submit path or the user's retry sends a dead
   * token and the form bricks.
   */
  reset: () => void;
}

export const Turnstile = forwardRef<TurnstileHandle, TurnstileProps>(({ onToken, onExpire, theme = 'auto' }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY as string | undefined;

  useImperativeHandle(ref, () => ({
    reset: () => {
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.reset(widgetIdRef.current); } catch { /* widget already gone */ }
      }
      onToken('');
    },
  }), [onToken]);

  useEffect(() => {
    // Skip prerender (no DOM) and dev-without-key.
    if (!siteKey || typeof window === 'undefined') return;
    let cancelled = false;

    loadTurnstileScript()
      .then(() => {
        if (cancelled || !containerRef.current || !window.turnstile) return;
        widgetIdRef.current = window.turnstile.render(containerRef.current, {
          sitekey: siteKey,
          theme,
          callback: onToken,
          'expired-callback': () => {
            onExpire?.();
            onToken('');
          },
          'error-callback': () => onToken(''),
        });
      })
      .catch((err) => console.error('[Turnstile] script failed to load', err));

    return () => {
      cancelled = true;
      if (widgetIdRef.current && window.turnstile) {
        try { window.turnstile.remove(widgetIdRef.current); } catch { /* widget already gone */ }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, theme, onToken, onExpire]);

  if (!siteKey) return null;
  return <div ref={containerRef} className="cf-turnstile" />;
});
Turnstile.displayName = 'Turnstile';

export const isTurnstileEnabled = () => Boolean(import.meta.env.VITE_TURNSTILE_SITE_KEY);

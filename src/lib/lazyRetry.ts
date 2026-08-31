import { lazy } from 'react';
import type { ComponentType } from 'react';

// Route-chunk resilience. GSC live-testing (2026-08-31) showed Googlebot's
// renderer intermittently failing to fetch lazy route chunks ("Failed to
// fetch dynamically imported module: .../Oilfield.tsx-*.js"), which threw at
// <Lazy>, tripped the ErrorBoundary, and replaced the fully-prerendered page
// with "Something went wrong" — Google then classified the URL as a Soft 404.
// The data layer already guards against this (safeImport in productLoader.ts);
// this file gives the React.lazy route chunks the same protection.

// Same session key as productLoader.ts's safeImport so the whole app performs
// at most ONE stale-build recovery reload per session, whichever layer hits
// the failure first.
const RELOAD_KEY = '__gc_chunk_reload__';

export function isChunkLoadError(err: unknown): boolean {
  const msg = String((err as Error)?.message || err);
  return (
    msg.includes('Failed to fetch dynamically imported module') ||
    msg.includes('Importing a module script failed') ||
    msg.includes('error loading dynamically imported module') ||
    msg.includes('Loading chunk')
  );
}

export function hasUsedChunkReload(): boolean {
  try {
    return typeof window !== 'undefined' && sessionStorage.getItem(RELOAD_KEY) === '1';
  } catch {
    return true; // storage unavailable → never reload-loop
  }
}

/** Reload the page once per session to recover from a stale deploy. Returns true if a reload was initiated. */
export function reloadOnceOnChunkError(): boolean {
  try {
    if (typeof window === 'undefined' || sessionStorage.getItem(RELOAD_KEY)) return false;
    sessionStorage.setItem(RELOAD_KEY, '1');
    window.location.reload();
    return true;
  } catch {
    return false;
  }
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Drop-in replacement for React.lazy that retries transient chunk-fetch
 * failures (twice, with backoff) before falling back to a one-per-session
 * reload. Only genuine, persistent failures reach the ErrorBoundary.
 */
export function lazyRetry<T extends ComponentType<unknown>>(
  importer: () => Promise<{ default: T }>
) {
  return lazy(async () => {
    try {
      return await importer();
    } catch (err) {
      if (!isChunkLoadError(err)) throw err;
      await sleep(500);
      try {
        return await importer();
      } catch {
        await sleep(1500);
        try {
          return await importer();
        } catch (finalErr) {
          reloadOnceOnChunkError();
          throw finalErr;
        }
      }
    }
  });
}

// Keeps the prerendered page in the DOM while the lazy route chunk loads.
//
// Every sitemap route ships prerendered HTML (vite.config.ts → @prerenderer),
// but main.tsx mounts with createRoot(), which replaces that markup with the
// <Suspense> fallback until the route chunk resolves. Visitors saw a ~250 ms
// spinner; Google's renderer, where a route chunk intermittently fails to
// fetch (lazyRetry.ts, 2026-08-31), was left with an image and three dots and
// filed the URL as "Soft 404" — on 2026-10-13 that list held
// /chemical-suppliers-oman and both acid hubs, each passing "Test live URL".
//
// hydrateRoot() is NOT an option: the prerenderer serialises a client-rendered
// DOM, which carries none of the <!--$--> Suspense markers React looks for, so
// hydration throws #418/#423 on every page and falls back to the same wipe
// (measured on the 2026-10-13 build). Instead, main.tsx snapshots the
// prerendered route region before mounting, and App.tsx uses that HTML as the
// Suspense fallback for the initial route. The fallback is pixel-identical to
// the page, so nothing flashes, and a slow or retrying chunk fetch leaves the
// full content — headings, text, links — in the DOM for any crawler snapshot.
// The snapshot is cleared the moment the first route commits, so later
// navigations fall back to <Loading /> as before.

export const ROUTE_ROOT_ATTR = 'data-route-root';

let snapshot: string | null = null;

/** Called once by main.tsx before createRoot() replaces the prerendered DOM. */
export function capturePrerenderSnapshot(container: HTMLElement): void {
  const region = container.querySelector(`[${ROUTE_ROOT_ATTR}]`);
  const html = region?.innerHTML.trim();
  snapshot = html ? html : null;
}

export function getPrerenderSnapshot(): string | null {
  return snapshot;
}

export function clearPrerenderSnapshot(): void {
  snapshot = null;
}

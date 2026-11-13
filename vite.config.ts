import { defineConfig, type PluginOption } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import viteCompression from "vite-plugin-compression";
import { imagetools } from "vite-imagetools";
import { ViteWebfontDownload } from "vite-plugin-webfont-dl";
import prerender from "@prerenderer/rollup-plugin";
import { mcpPlugin } from "@lovable.dev/mcp-js/stacks/supabase/vite";
import { dedupeFaqPage, loadLastmod, stampModified } from "./scripts/stamp-modified.mjs";
import { legacyExactRedirects } from "./src/lib/legacyRedirects";

/**
 * Routes that must be prerendered *precisely because* they are noindex.
 *
 * These are deliberately absent from sitemap.xml (submitting a noindex URL
 * would contradict itself), which meant they were never prerendered — so the
 * SPA shell was served, and the shell's default `robots: index, follow` is
 * what crawlers actually saw. The `noIndex` prop on the page only took effect
 * after React + Helmet ran.
 *
 * Google and Bing execute JS so they eventually saw the noindex (Bing's own
 * SEO report flagged /thank-you, proving it rendered the page). **AI crawlers
 * do not execute JavaScript** — GPTBot, ClaudeBot and PerplexityBot were
 * therefore reading "Thank you, your enquiry was received" as ordinary
 * indexable content. Prerendering these puts the noindex in the raw HTML for
 * every crawler, without adding them to the sitemap. Found 2026-09-29 while
 * verifying Bing Webmaster's NOINDEX recommendation.
 *
 * NOT included: `/sitemap` (the HTML sitemap page). It was tried and reliably
 * exceeds the 120s puppeteer navigation timeout — it renders the entire
 * 657-route link list — which fails the whole build. It is also the far
 * milder case: it is a legitimate link hub, so being crawled is desirable,
 * and an indexed HTML sitemap is low-harm. Left on the JS-only noindex.
 */
const NOINDEX_PRERENDER_ROUTES = ["/thank-you"];

/**
 * Duplicate SKUs (`details.canonicalOverride`, 2026-11-10).
 *
 * sync-ar-sitemap.mjs prunes them from the sitemap because they canonicalise
 * elsewhere, which also dropped them from the prerender list. Non-JS crawlers
 * then got the SPA shell (homepage title, canonical "/") at all 21 of them,
 * while Google, which renders, saw the right canonical. Prerendering them
 * (EN + /ar) puts the real canonical in the raw HTML without listing them.
 */
const canonicalOverrideRoutes = (): string[] => {
  const dir = path.resolve(__dirname, "src/data/products");
  return fs.readdirSync(dir).filter((f) => f.endsWith(".json")).flatMap((f) => {
    const data = JSON.parse(fs.readFileSync(path.join(dir, f), "utf-8"));
    const items: { id: string; details?: { canonicalOverride?: string } }[] =
      Array.isArray(data) ? data : data.products ?? [];
    const category = f.replace(/\.json$/, "");
    return items
      .filter((p) => p.details?.canonicalOverride)
      .flatMap((p) => [`/products/${category}/${p.id}`, `/ar/products/${category}/${p.id}`]);
  });
};

const routesFromSitemap = (): string[] => {
  const xml = fs.readFileSync(
    path.resolve(__dirname, "public/sitemap.xml"),
    "utf-8"
  );
  const fromSitemap = Array.from(
    xml.matchAll(/<loc>https:\/\/gcoman\.com([^<]*)<\/loc>/g)
  )
    .map((m) => m[1] || "/")
    .filter((p) => !p.startsWith("/admin") && !p.startsWith("/login"));
  // Noindex /ar twins (2026-11-13). An /ar page without Arabic meta renders
  // `noindex, follow` with an /ar canonical, so sync-ar-sitemap.mjs leaves it
  // out of the sitemap, which also left it out of this list. Non-JS crawlers
  // then got the SPA shell at every one of them (homepage title, `index,
  // follow`, canonical "/"): /ar/about, /ar/contact, /ar/blog, all 22
  // /ar/products/<category> pages, linked from the Arabic nav and footer on
  // every Arabic page. Same fix as canonicalOverrideRoutes(): prerender the
  // twin of every English sitemap URL whose /ar version is not listed.
  // `/sitemap` stays out for the reason given on NOINDEX_PRERENDER_ROUTES.
  const listed = new Set(fromSitemap);
  const arNoindexTwins = fromSitemap
    .filter((p) => !p.startsWith("/ar") && p !== "/sitemap")
    .map((p) => (p === "/" ? "/ar" : `/ar${p}`))
    .filter((p) => !listed.has(p));
  // de-dupe defensively in case one is ever added to the sitemap by mistake
  return Array.from(new Set([...fromSitemap, ...NOINDEX_PRERENDER_ROUTES, ...canonicalOverrideRoutes(), ...arNoindexTwins]));
};

/**
 * Static redirect stubs for the legacy URLs (2026-10-26).
 *
 * Lovable's CDN has no server redirects, so legacy URLs were redirected only
 * in the app (LegacyRedirectHandler). Crawlers that do not run JavaScript got
 * the SPA shell instead: the homepage title with canonical "/" at a 200. Bing,
 * which does render, still kept /products/acids/nitric-acid indexed and ranked
 * it #2 for "gcoman nitric acid supplier oman" beside the real nitric pages.
 * This writes dist/<legacy path>/index.html for every EXACT legacy entry: an
 * instant meta refresh plus a canonical to the destination, which Google and
 * Bing treat as a permanent redirect. The CDN already serves
 * dist/<route>/index.html for clean URLs, so no hosting change is needed.
 * Prefix redirects stay in-app (they cannot be enumerated). Paths that are
 * prerendered routes are skipped, so a stub can never shadow a real page.
 */
const legacyRedirectStubs = (): PluginOption => ({
  name: "legacy-redirect-stubs",
  apply: "build",
  generateBundle() {
    const live = new Set(routesFromSitemap());
    const safe = /^\/[A-Za-z0-9_\-./]+$/;
    for (const [from, to] of legacyExactRedirects()) {
      if (from === "/" || live.has(from) || !safe.test(from) || !safe.test(to) || from.includes("..")) continue;
      const abs = `https://gcoman.com${to}`;
      const html =
        `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
        `<title>Moved | Global Chemicals LLC</title>` +
        `<link rel="canonical" href="${abs}">` +
        `<meta http-equiv="refresh" content="0; url=${to}">` +
        `<meta name="viewport" content="width=device-width, initial-scale=1">` +
        `</head><body><p>This page has moved to <a href="${to}">${abs}</a>.</p>` +
        `<script>location.replace(${JSON.stringify(to)}+location.search+location.hash)</script>` +
        `</body></html>`;
      this.emitFile({ type: "asset", fileName: `${from.slice(1)}/index.html`, source: html });
    }
  },
});

let lastmodCache: Map<string, string> | undefined;
const loadLastmodOnce = (): Map<string, string> =>
  (lastmodCache ??= loadLastmod(path.resolve(__dirname, "public/sitemap.xml")));

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    // Emits supabase/functions/mcp/index.ts from src/lib/mcp/index.ts so
    // external AI clients (ChatGPT, Claude, Codex, Cursor) can connect via MCP.
    mcpPlugin(),
    legacyRedirectStubs(),
    mode === "development" && componentTagger(),
    // Gzip compression for production
    mode === "production" && viteCompression({
      algorithm: "gzip",
      ext: ".gz",
      threshold: 10240, // Only compress files > 10KB
    }),
    // Brotli compression for production (better than gzip)
    mode === "production" && viteCompression({
      algorithm: "brotliCompress",
      ext: ".br",
      threshold: 10240,
    }),
    // Image optimization
    imagetools({
      defaultDirectives: (url) => {
        // Optimize images with WebP format and quality settings
        if (url.searchParams.has('optimized')) {
          return new URLSearchParams({
            format: 'webp',
            quality: '80',
          });
        }
        return new URLSearchParams();
      },
    }),
    // Download and self-host web fonts for better performance
    ViteWebfontDownload([
      'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700&display=swap',
    ]),
    // Static prerendering for SEO — runs only on production builds.
    // Why: site is a pure SPA, so without this every URL ships an empty
    // <div id="root"></div> shell. Googlebot then classifies most pages as
    // Soft 404 / "Crawled — currently not indexed" before JS finishes.
    // Prerender resolves Helmet head tags + JSON-LD + body content into
    // each route's static HTML.
    mode === "production" && (prerender({
      routes: process.env.PRERENDER_ROUTES
        ? process.env.PRERENDER_ROUTES.split(',')
        : routesFromSitemap(),
      renderer: "@prerenderer/renderer-puppeteer",
      rendererOptions: {
        // Event-driven readiness, NOT a fixed sleep. Each page dispatches
        // 'prerender-ready' from <SEO> after its real head + body (and, on
        // /ar, the lazy Arabic catalogue) have committed — see SEO.tsx. The
        // previous fixed renderAfterTime raced the build machine: on
        // Lovable's slower builder the snapshot fired mid-render and shipped
        // 310 pages with the homepage default <title> (25 Aug 2026). If a
        // page never signals, the route fails LOUDLY at `timeout` below and
        // aborts the build — a broken build beats silently broken SEO.
        renderAfterDocumentEvent: 'prerender-ready',
        maxConcurrentRoutes: 8,
        // page.goto waits for networkidle0 with a 30 s default — under a full
        // 630-route queue a straggler route occasionally exceeds it, which
        // aborts the WHOLE build ("Navigation timeout of 30000 ms exceeded",
        // seen both locally and as Lovable's publish-timeout failure on
        // 25 Aug 2026). Give individual navigations a 120 s ceiling; total
        // build time stays bounded by the concurrency pool.
        timeout: 130_000,
        navigationOptions: { timeout: 120_000 },
        // Chrome DevTools-protocol calls (Network.enable etc.) also default to
        // a tight timeout that a loaded build machine can miss while eight
        // tabs spin up at once — same all-or-nothing build abort.
        launchOptions: { protocolTimeout: 180_000 },
      },
      // Stamp each page's git-derived sitemap <lastmod> into its static HTML
      // as WebPage `dateModified` + `article:modified_time` — a freshness
      // signal for the AI crawlers that read only this HTML. See
      // scripts/stamp-modified.mjs. Also drops a stale duplicate FAQPage
      // block left by the en→ar language flip (dedupeFaqPage).
      postProcess(renderedRoute: { originalRoute: string; html: string }) {
        const lastmod = loadLastmodOnce();
        renderedRoute.html = stampModified(
          dedupeFaqPage(renderedRoute.html),
          lastmod.get(renderedRoute.originalRoute)
        );
      },
    }) as unknown as PluginOption),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    // Single React copy: two pre-bundled chunks (seen after a dep install)
    // gave AuthProvider a null dispatcher ("reading 'useState'").
    dedupe: ["react", "react-dom", "react/jsx-runtime"],
  },
  build: {
    // Code splitting configuration
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Force each product category's JSON into its own chunk. Without this,
          // Rollup's default grouping sees that Products.tsx's "browse all
          // categories" loadAllProducts() reaches every category.json via one
          // Promise.all() and bundles all 22 (~all 270 products) together — which
          // then leaks into every single-category ProductDetail route entry too
          // (see src/pages/productDetail/), even though each only needs its own
          // category. Splitting explicitly here is what actually makes that
          // per-category route splitting pay off.
          const productDataMatch = id.match(/[\\/]data[\\/]products[\\/]([a-z0-9-]+)\.json$/);
          if (productDataMatch) return `product-data-${productDataMatch[1]}`;

          // Vendor chunks for better caching
          if (/[\\/]node_modules[\\/](react|react-dom|react-router-dom)[\\/]/.test(id)) {
            return "vendor-react";
          }
          if (/[\\/]node_modules[\\/]@radix-ui[\\/]react-(dialog|dropdown-menu|select|tabs|toast)[\\/]/.test(id)) {
            return "vendor-ui";
          }
          if (/[\\/]node_modules[\\/](date-fns|clsx|tailwind-merge)[\\/]/.test(id)) {
            return "vendor-utils";
          }
          // Separate i18n for better caching
          if (/[\\/]node_modules[\\/](i18next|react-i18next|i18next-browser-languagedetector)[\\/]/.test(id)) {
            return "vendor-i18n";
          }
        },
        // Optimize chunk file names for better caching
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()
            : 'chunk';
          return `assets/${facadeModuleId}-[hash].js`;
        },
        assetFileNames: (assetInfo) => {
          // Organize assets by type for better caching
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico|webp/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`;
          } else if (/woff2?|ttf|otf|eot/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[name]-[hash][extname]`;
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600, // Reduced from 1000 to encourage smaller chunks
    // Enable source maps for production debugging
    sourcemap: mode === "development",
    // Minify with esbuild for better performance
    minify: "esbuild",
    target: "esnext",
    // Optimize CSS
    cssCodeSplit: true,
  },
  // Optimize dependencies.
  // Only deps the app reaches lazily belong here. react / react-dom /
  // react/jsx-runtime are deliberately NOT listed: naming them as separate
  // entries made the bundler emit a React copy per entry, so a component could
  // get a copy whose dispatcher was null — "Cannot read properties of null
  // (reading 'useState')" thrown from AuthProvider. Vite's scanner pre-bundles
  // them as one shared graph on its own, and resolve.dedupe above keeps any
  // later resolver pinned to that same copy.
  optimizeDeps: {
    include: ["react-router-dom", "@supabase/supabase-js"],
    // No `force: true` on purpose. Re-bundling on every dev-server start mints
    // a new dep hash, so a page already open ends up mixing chunks from two
    // graphs — the same null-dispatcher crash. Vite invalidates this cache
    // itself when the lockfile or the config changes.
  },
}));

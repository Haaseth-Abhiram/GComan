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

const routesFromSitemap = (): string[] => {
  const xml = fs.readFileSync(
    path.resolve(__dirname, "public/sitemap.xml"),
    "utf-8"
  );
  return Array.from(xml.matchAll(/<loc>https:\/\/gcoman\.com([^<]*)<\/loc>/g))
    .map((m) => m[1] || "/")
    .filter((p) => !p.startsWith("/admin") && !p.startsWith("/login"));
};

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
      'https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;600;700&display=swap',
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
    }) as unknown as PluginOption),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
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
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    // Pre-bundle large dependencies
    force: mode === "development",
  },
}));

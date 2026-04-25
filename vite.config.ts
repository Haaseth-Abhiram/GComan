import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import fs from "fs";
import { componentTagger } from "lovable-tagger";
import viteCompression from "vite-plugin-compression";
import { imagetools } from "vite-imagetools";
import { ViteWebfontDownload } from "vite-plugin-webfont-dl";
import prerender from "@prerenderer/rollup-plugin";

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
    mode === "production" && prerender({
      routes: routesFromSitemap(),
      renderer: "@prerenderer/renderer-puppeteer",
      rendererOptions: {
        // 2.5s gives the lazy chunk time to load + Helmet to commit. The
        // Helmet commits are now synchronous (we set defer={false} on every
        // <Helmet> in the codebase) — without that, puppeteer snapshotted
        // before requestAnimationFrame fired and most routes shipped the
        // homepage <title> baked in.
        renderAfterTime: 2500,
        maxConcurrentRoutes: 4,
      },
    }),
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
        manualChunks: {
          // Vendor chunks for better caching
          "vendor-react": ["react", "react-dom", "react-router-dom"],
          "vendor-ui": [
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-select",
            "@radix-ui/react-tabs",
            "@radix-ui/react-toast",
          ],
          "vendor-utils": ["date-fns", "clsx", "tailwind-merge"],
          // Separate i18n for better caching
          "vendor-i18n": ["i18next", "react-i18next", "i18next-browser-languagedetector"],
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

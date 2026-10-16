import { Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useLocation, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { useTranslation } from "react-i18next";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AdminRoute } from "./components/AdminRoute";
import CookieConsent from "./components/CookieConsent";
import ErrorBoundary from "./components/ErrorBoundary";
import { Loading } from "./components/Loading";
import GoogleAnalytics from "./components/GoogleAnalytics";
import { ZohoSalesIQ } from "./components/ZohoSalesIQ";
import BackToTopButton from "./components/BackToTopButton";
import WhatsAppButton from "./components/WhatsAppButton";
import RouteChangeLoader from "./components/RouteChangeLoader";
import ScrollToTop from "./components/ScrollToTop";
import { resolveLegacyRedirect } from "./lib/legacyRedirects";
import { lazyRetry } from "./lib/lazyRetry";
import { ROUTE_ROOT_ATTR, clearPrerenderSnapshot, getPrerenderSnapshot } from "./lib/prerenderSnapshot";

// Lazy load all page components
const Index = lazyRetry(() => import("./pages/Index"));
const About = lazyRetry(() => import("./pages/About"));
const Products = lazyRetry(() => import("./pages/Products"));
// One lazy entry per product category so each category's JSON lands in its own
// route chunk (instead of every product page downloading all 22 categories'
// data). See src/pages/productDetail/ for the per-category entry files.
const productDetailEntries: Record<string, ReturnType<typeof lazyRetry>> = {
  'water-treatment': lazyRetry(() => import("./pages/productDetail/WaterTreatment")),
  'lubricants': lazyRetry(() => import("./pages/productDetail/Lubricants")),
  'oilfield': lazyRetry(() => import("./pages/productDetail/Oilfield")),
  'lab-chemicals': lazyRetry(() => import("./pages/productDetail/LabChemicals")),
  'lab-equipment': lazyRetry(() => import("./pages/productDetail/LabEquipment")),
  'solvents': lazyRetry(() => import("./pages/productDetail/Solvents")),
  'swimming-pool': lazyRetry(() => import("./pages/productDetail/SwimmingPool")),
  'inorganic': lazyRetry(() => import("./pages/productDetail/Inorganic")),
  'alcohols': lazyRetry(() => import("./pages/productDetail/Alcohols")),
  'glycols': lazyRetry(() => import("./pages/productDetail/Glycols")),
  'ethanolamines': lazyRetry(() => import("./pages/productDetail/Ethanolamines")),
  'food-beverage': lazyRetry(() => import("./pages/productDetail/FoodBeverage")),
  'construction': lazyRetry(() => import("./pages/productDetail/Construction")),
  'soap-detergent': lazyRetry(() => import("./pages/productDetail/SoapDetergent")),
  'ro-chemicals': lazyRetry(() => import("./pages/productDetail/RoChemicals")),
  'cooling-water': lazyRetry(() => import("./pages/productDetail/CoolingWater")),
  'corrosion-inhibitor': lazyRetry(() => import("./pages/productDetail/CorrosionInhibitor")),
  'tank-cleaners': lazyRetry(() => import("./pages/productDetail/TankCleaners")),
  'additives': lazyRetry(() => import("./pages/productDetail/Additives")),
  'agro': lazyRetry(() => import("./pages/productDetail/Agro")),
  'chlorinated': lazyRetry(() => import("./pages/productDetail/Chlorinated")),
  'calcium-carbonate': lazyRetry(() => import("./pages/productDetail/CalciumCarbonate")),
};
// Per-category entries for the CATEGORY LISTING page, mirroring the pattern
// above. Each statically imports only its own category JSON so the product grid
// is present in the first render — see the comment on ProductsProps in
// src/pages/Products.tsx for why the previous useEffect-only load left 16 of 22
// category pages with no product links in the prerendered HTML.
const productCategoryEntries: Record<string, ReturnType<typeof lazyRetry>> = {
  'water-treatment': lazyRetry(() => import("./pages/productCategory/WaterTreatment")),
  'lubricants': lazyRetry(() => import("./pages/productCategory/Lubricants")),
  'oilfield': lazyRetry(() => import("./pages/productCategory/Oilfield")),
  'lab-chemicals': lazyRetry(() => import("./pages/productCategory/LabChemicals")),
  'lab-equipment': lazyRetry(() => import("./pages/productCategory/LabEquipment")),
  'solvents': lazyRetry(() => import("./pages/productCategory/Solvents")),
  'swimming-pool': lazyRetry(() => import("./pages/productCategory/SwimmingPool")),
  'inorganic': lazyRetry(() => import("./pages/productCategory/Inorganic")),
  'alcohols': lazyRetry(() => import("./pages/productCategory/Alcohols")),
  'glycols': lazyRetry(() => import("./pages/productCategory/Glycols")),
  'ethanolamines': lazyRetry(() => import("./pages/productCategory/Ethanolamines")),
  'food-beverage': lazyRetry(() => import("./pages/productCategory/FoodBeverage")),
  'construction': lazyRetry(() => import("./pages/productCategory/Construction")),
  'soap-detergent': lazyRetry(() => import("./pages/productCategory/SoapDetergent")),
  'ro-chemicals': lazyRetry(() => import("./pages/productCategory/RoChemicals")),
  'cooling-water': lazyRetry(() => import("./pages/productCategory/CoolingWater")),
  'corrosion-inhibitor': lazyRetry(() => import("./pages/productCategory/CorrosionInhibitor")),
  'tank-cleaners': lazyRetry(() => import("./pages/productCategory/TankCleaners")),
  'additives': lazyRetry(() => import("./pages/productCategory/Additives")),
  'agro': lazyRetry(() => import("./pages/productCategory/Agro")),
  'chlorinated': lazyRetry(() => import("./pages/productCategory/Chlorinated")),
  'calcium-carbonate': lazyRetry(() => import("./pages/productCategory/CalciumCarbonate")),
};
// Derived from the registry above (not re-imported from productLoader.ts) so App.tsx's
// own root bundle never pulls in productLoader.ts's eager category JSON imports.
const PRODUCT_CATEGORIES = Object.keys(productDetailEntries);
const Industries = lazyRetry(() => import("./pages/Industries"));
const Resources = lazyRetry(() => import("./pages/Resources"));
const Contact = lazyRetry(() => import("./pages/Contact"));
const Customers = lazyRetry(() => import("./pages/Customers"));
const Career = lazyRetry(() => import("./pages/Career"));
const Certifications = lazyRetry(() => import("./pages/Certifications"));
const Login = lazyRetry(() => import("./pages/Login"));
const Admin = lazyRetry(() => import("./pages/Admin"));
const Blog = lazyRetry(() => import("./pages/Blog"));
const BlogPost = lazyRetry(() => import("./pages/BlogPost"));
const Privacy = lazyRetry(() => import("./pages/Privacy"));
const Terms = lazyRetry(() => import("./pages/Terms"));
const Sitemap = lazyRetry(() => import("./pages/Sitemap"));
const LocationLanding = lazyRetry(() => import("./pages/LocationLanding"));
const ChemicalsHub = lazyRetry(() => import("./pages/ChemicalsHub"));
const DosingCalculator = lazyRetry(() => import("./pages/DosingCalculator"));
const ChemicalSuppliersOman = lazyRetry(() => import("./pages/ChemicalSuppliersOman"));
const ChemicalSuppliersMiddleEast = lazyRetry(() => import("./pages/ChemicalSuppliersMiddleEast"));
const CausticSodaOman = lazyRetry(() => import("./pages/CausticSodaOman"));
const NitricAcidOman = lazyRetry(() => import("./pages/NitricAcidOman"));
const LaboratoryChemicalsOman = lazyRetry(() => import("./pages/LaboratoryChemicalsOman"));
const HydrochloricAcidOman = lazyRetry(() => import("./pages/HydrochloricAcidOman"));
const ThankYou = lazyRetry(() => import("./pages/ThankYou"));
const NotFound = lazyRetry(() => import("./pages/NotFound"));
// Internal design tool. Not in sitemap.xml so it doesn't get prerendered or
// indexed. Reachable manually at /dev/chemistry-playground in any environment.
const ChemistryPlayground = lazyRetry(() => import("./pages/ChemistryPlayground"));
// Managed OAuth consent screen for external MCP clients (ChatGPT, Claude, etc.).
const OAuthConsent = lazyRetry(() => import("./pages/OAuthConsent"));

const queryClient = new QueryClient();

// Keeps i18next in sync with the URL: /ar/* renders Arabic, everything else
// English. Driven by pathname (not a route param) so switching back to an
// English route also resets the language — the previous version read a :lng
// param the route never provided, so every /ar route fell through to "/".
const LanguageSync = () => {
  const { i18n } = useTranslation();
  const { pathname } = useLocation();

  useEffect(() => {
    const next = pathname === '/ar' || pathname.startsWith('/ar/') ? 'ar' : 'en';
    if (i18n.language !== next) {
      i18n.changeLanguage(next);
    }
  }, [pathname, i18n]);

  return null;
};

// Wrapper element for the /ar route subtree. Language is handled globally by
// <LanguageSync>; this just renders the matched child route.
const LangLayout = () => <Outlet />;

// Redirects legacy WordPress-era URLs and normalizes trailing slashes.
// Production is served by Lovable's CDN, which has no server-side redirect
// support, so this client-side layer is what actually fires for old URLs
// (src/lib/legacyRedirects.ts). Rendered above <Routes> so it also intercepts
// paths that would otherwise match a live route pattern (e.g. the old
// /products/acids/* URLs match /products/:category/:productSlug).
const LegacyRedirectHandler = () => {
  const { pathname, search, hash } = useLocation();
  const target = resolveLegacyRedirect(pathname);
  if (!target) return null;
  return <Navigate to={target + search + hash} replace />;
};

// Redirect component for /en/* routes to avoid duplicate content. Reads the
// live location (a precomputed prop would freeze the target at App mount) and
// preserves query/hash.
const RedirectToNonLang = () => {
  const { pathname, search, hash } = useLocation();
  const target = pathname.replace(/^\/en(?=\/|$)/, '') || '/';
  return <Navigate to={target + search + hash} replace />;
};

// Initial-route fallback: the prerendered page itself (see
// src/lib/prerenderSnapshot.ts). Falls back to the spinner when there is no
// snapshot — the dev server, the SPA shell for unknown routes, and every
// navigation after the first.
const InitialRouteFallback = () => {
  const html = getPrerenderSnapshot();
  if (!html) return <Loading />;
  return <div data-prerender-snapshot dangerouslySetInnerHTML={{ __html: html }} />;
};

// Mounted inside the Suspense boundary, so its effect runs only once the
// first route has actually committed — the exact moment the snapshot stops
// being useful. Without this, a route whose chunk was already cached would
// never show the fallback, never clear the snapshot, and a later navigation
// could flash the first page's markup.
const PrerenderSnapshotGuard = () => {
  useEffect(() => {
    clearPrerenderSnapshot();
  }, []);
  return null;
};

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
        <AuthProvider>
          <ErrorBoundary>
            <GoogleAnalytics />
            <ZohoSalesIQ />
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              Skip to main content
            </a>
            <CookieConsent />
            <BackToTopButton />
            {/* Global: was imported per-page, so it was missing exactly where a
                stuck visitor needs it most (404 and /thank-you). */}
            <WhatsAppButton />
            <LanguageSync />
            <LegacyRedirectHandler />
            <ScrollToTop />
            <RouteChangeLoader />
            {/* data-route-root marks the region the prerenderer output is
                snapshotted from; display:contents keeps it out of layout. */}
            <div {...{ [ROUTE_ROOT_ATTR]: "" }} style={{ display: "contents" }}>
            <Suspense fallback={<InitialRouteFallback />}>
              <PrerenderSnapshotGuard />
              <Routes>
                {/* Main routes (English default) */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                {PRODUCT_CATEGORIES.map((cat) => {
                  const Entry = productCategoryEntries[cat];
                  return <Route key={`cat-${cat}`} path={`/products/${cat}`} element={<Entry />} />;
                })}
                {/* Keeps unknown categories resolving to the normal (lazy) page. */}
                <Route path="/products/:category" element={<Products />} />
                {PRODUCT_CATEGORIES.map((cat) => {
                  const Entry = productDetailEntries[cat];
                  return <Route key={cat} path={`/products/${cat}/:productSlug`} element={<Entry />} />;
                })}
                <Route path="/industries" element={<Industries />} />
                <Route path="/resources" element={<Resources />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/customers" element={<Customers />} />
                <Route path="/career" element={<Career />} />
                <Route path="/certifications" element={<Certifications />} />
                <Route path="/login" element={<Login />} />
                <Route path="/admin/*" element={
                  <AdminRoute>
                    <Admin />
                  </AdminRoute>
                } />
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                <Route path="/privacy" element={<Privacy />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/sitemap" element={<Sitemap />} />
                <Route path="/chemical-suppliers-oman" element={<ChemicalSuppliersOman />} />
                <Route path="/chemical-suppliers-middle-east" element={<ChemicalSuppliersMiddleEast />} />
                <Route path="/chemical-supplier/caustic-soda-oman" element={<CausticSodaOman />} />
                <Route path="/chemical-supplier/nitric-acid-oman" element={<NitricAcidOman />} />
                <Route path="/chemical-supplier/laboratory-chemicals-oman" element={<LaboratoryChemicalsOman />} />
                <Route path="/chemical-supplier/hydrochloric-acid-oman" element={<HydrochloricAcidOman />} />
                <Route path="/thank-you" element={<ThankYou />} />

                {/* Internal design tool — kept out of sitemap.xml on purpose
                    so it never enters the prerender or indexing pipeline. */}
                <Route path="/dev/chemistry-playground" element={<ChemistryPlayground />} />

                {/* Managed OAuth consent for external MCP clients. Must be a public route. */}
                <Route path="/.lovable/oauth/consent" element={<OAuthConsent />} />

                {/* Location-specific landing pages for SEO */}
                <Route path="/chemicals" element={<ChemicalsHub />} />
                <Route path="/tools/dosing-calculator" element={<DosingCalculator />} />
                <Route path="/chemicals/:location" element={<LocationLanding />} />

                {/* 301 Redirects: /en/* to /* (avoid duplicate content) */}
                <Route path="/en" element={<RedirectToNonLang />} />
                <Route path="/en/*" element={<RedirectToNonLang />} />

                {/* Arabic language routes */}
                <Route path="/ar" element={<LangLayout />}>
                  <Route index element={<Index />} />
                  <Route path="about" element={<About />} />
                  <Route path="products" element={<Products />} />
                  {PRODUCT_CATEGORIES.map((cat) => {
                    const Entry = productCategoryEntries[cat];
                    return <Route key={`cat-${cat}`} path={`products/${cat}`} element={<Entry />} />;
                  })}
                  <Route path="products/:category" element={<Products />} />
                  {PRODUCT_CATEGORIES.map((cat) => {
                    const Entry = productDetailEntries[cat];
                    return <Route key={cat} path={`products/${cat}/:productSlug`} element={<Entry />} />;
                  })}
                  <Route path="industries" element={<Industries />} />
                  <Route path="resources" element={<Resources />} />
                  <Route path="contact" element={<Contact />} />
                  <Route path="customers" element={<Customers />} />
                  <Route path="career" element={<Career />} />
                  <Route path="certifications" element={<Certifications />} />
                  <Route path="login" element={<Login />} />
                  <Route path="admin/*" element={
                    <AdminRoute>
                      <Admin />
                    </AdminRoute>
                  } />
                  <Route path="blog" element={<Blog />} />
                  <Route path="blog/:slug" element={<BlogPost />} />
                  <Route path="privacy" element={<Privacy />} />
                  <Route path="terms" element={<Terms />} />
                  <Route path="sitemap" element={<Sitemap />} />
                  <Route path="chemical-suppliers-oman" element={<ChemicalSuppliersOman />} />
                  <Route path="chemical-suppliers-middle-east" element={<ChemicalSuppliersMiddleEast />} />
                  <Route path="chemical-supplier/caustic-soda-oman" element={<CausticSodaOman />} />
                  <Route path="chemical-supplier/nitric-acid-oman" element={<NitricAcidOman />} />
                  <Route path="chemical-supplier/laboratory-chemicals-oman" element={<LaboratoryChemicalsOman />} />
                  <Route path="chemical-supplier/hydrochloric-acid-oman" element={<HydrochloricAcidOman />} />
                  <Route path="thank-you" element={<ThankYou />} />
                  <Route path="chemicals" element={<ChemicalsHub />} />
                  <Route path="tools/dosing-calculator" element={<DosingCalculator />} />
                  <Route path="chemicals/:location" element={<LocationLanding />} />
                </Route>

                {/* 404 catch-all - MUST BE LAST */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
            </div>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;

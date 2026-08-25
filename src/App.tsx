import { lazy, Suspense, useEffect } from "react";
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
import RouteChangeLoader from "./components/RouteChangeLoader";
import { resolveLegacyRedirect } from "./lib/legacyRedirects";

// Lazy load all page components
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
// One lazy entry per product category so each category's JSON lands in its own
// route chunk (instead of every product page downloading all 22 categories'
// data). See src/pages/productDetail/ for the per-category entry files.
const productDetailEntries: Record<string, ReturnType<typeof lazy>> = {
  'water-treatment': lazy(() => import("./pages/productDetail/WaterTreatment")),
  'lubricants': lazy(() => import("./pages/productDetail/Lubricants")),
  'oilfield': lazy(() => import("./pages/productDetail/Oilfield")),
  'lab-chemicals': lazy(() => import("./pages/productDetail/LabChemicals")),
  'lab-equipment': lazy(() => import("./pages/productDetail/LabEquipment")),
  'solvents': lazy(() => import("./pages/productDetail/Solvents")),
  'swimming-pool': lazy(() => import("./pages/productDetail/SwimmingPool")),
  'inorganic': lazy(() => import("./pages/productDetail/Inorganic")),
  'alcohols': lazy(() => import("./pages/productDetail/Alcohols")),
  'glycols': lazy(() => import("./pages/productDetail/Glycols")),
  'ethanolamines': lazy(() => import("./pages/productDetail/Ethanolamines")),
  'food-beverage': lazy(() => import("./pages/productDetail/FoodBeverage")),
  'construction': lazy(() => import("./pages/productDetail/Construction")),
  'soap-detergent': lazy(() => import("./pages/productDetail/SoapDetergent")),
  'ro-chemicals': lazy(() => import("./pages/productDetail/RoChemicals")),
  'cooling-water': lazy(() => import("./pages/productDetail/CoolingWater")),
  'corrosion-inhibitor': lazy(() => import("./pages/productDetail/CorrosionInhibitor")),
  'tank-cleaners': lazy(() => import("./pages/productDetail/TankCleaners")),
  'additives': lazy(() => import("./pages/productDetail/Additives")),
  'agro': lazy(() => import("./pages/productDetail/Agro")),
  'chlorinated': lazy(() => import("./pages/productDetail/Chlorinated")),
  'calcium-carbonate': lazy(() => import("./pages/productDetail/CalciumCarbonate")),
};
// Derived from the registry above (not re-imported from productLoader.ts) so App.tsx's
// own root bundle never pulls in productLoader.ts's eager category JSON imports.
const PRODUCT_CATEGORIES = Object.keys(productDetailEntries);
const Industries = lazy(() => import("./pages/Industries"));
const Resources = lazy(() => import("./pages/Resources"));
const Contact = lazy(() => import("./pages/Contact"));
const Customers = lazy(() => import("./pages/Customers"));
const Career = lazy(() => import("./pages/Career"));
const Certifications = lazy(() => import("./pages/Certifications"));
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const LocationLanding = lazy(() => import("./pages/LocationLanding"));
const ChemicalsHub = lazy(() => import("./pages/ChemicalsHub"));
const DosingCalculator = lazy(() => import("./pages/DosingCalculator"));
const ChemicalSuppliersOman = lazy(() => import("./pages/ChemicalSuppliersOman"));
const ChemicalSuppliersMiddleEast = lazy(() => import("./pages/ChemicalSuppliersMiddleEast"));
const CausticSodaOman = lazy(() => import("./pages/CausticSodaOman"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const NotFound = lazy(() => import("./pages/NotFound"));
// Internal design tool. Not in sitemap.xml so it doesn't get prerendered or
// indexed. Reachable manually at /dev/chemistry-playground in any environment.
const ChemistryPlayground = lazy(() => import("./pages/ChemistryPlayground"));
// Managed OAuth consent screen for external MCP clients (ChatGPT, Claude, etc.).
const OAuthConsent = lazy(() => import("./pages/OAuthConsent"));

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
            <LanguageSync />
            <LegacyRedirectHandler />
            <RouteChangeLoader />
            <Suspense fallback={<Loading />}>
              <Routes>
                {/* Main routes (English default) */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
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
                  <Route path="thank-you" element={<ThankYou />} />
                  <Route path="chemicals" element={<ChemicalsHub />} />
                  <Route path="tools/dosing-calculator" element={<DosingCalculator />} />
                  <Route path="chemicals/:location" element={<LocationLanding />} />
                </Route>

                {/* 404 catch-all - MUST BE LAST */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </ErrorBoundary>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;

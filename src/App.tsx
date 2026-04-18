import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useParams, Navigate } from "react-router-dom";
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

// Lazy load all page components
const Index = lazy(() => import("./pages/Index"));
const About = lazy(() => import("./pages/About"));
const Products = lazy(() => import("./pages/Products"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
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
const ChemicalSuppliersOman = lazy(() => import("./pages/ChemicalSuppliersOman"));
const ChemicalSuppliersMiddleEast = lazy(() => import("./pages/ChemicalSuppliersMiddleEast"));
const CausticSodaOman = lazy(() => import("./pages/CausticSodaOman"));
const ThankYou = lazy(() => import("./pages/ThankYou"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();

const LangLayout = () => {
  const { lng } = useParams();
  const { i18n } = useTranslation();

  useEffect(() => {
    const next = lng === 'ar' ? 'ar' : 'en';
    if (i18n.language !== next) {
      i18n.changeLanguage(next);
      localStorage.setItem('i18nextLng', next);
    }
  }, [lng, i18n]);

  if (lng !== 'ar' && lng !== 'en') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

// Redirect component for /en/* routes to avoid duplicate content
const RedirectToNonLang = ({ to }: { to: string }) => {
  return <Navigate to={to} replace />;
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
            <Suspense fallback={<Loading />}>
              <Routes>
                {/* Main routes (English default) */}
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:category" element={<Products />} />
                <Route path="/products/:category/:productSlug" element={<ProductDetail />} />
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

                {/* Location-specific landing pages for SEO */}
                <Route path="/chemicals/:location" element={<LocationLanding />} />

                {/* 301 Redirects: /en/* to /* (avoid duplicate content) */}
                <Route path="/en" element={<RedirectToNonLang to="/" />} />
                <Route path="/en/*" element={<RedirectToNonLang to={window.location.pathname.replace('/en', '')} />} />

                {/* Arabic language routes */}
                <Route path="/ar" element={<LangLayout />}>
                  <Route index element={<Index />} />
                  <Route path="about" element={<About />} />
                  <Route path="products" element={<Products />} />
                  <Route path="products/:category" element={<Products />} />
                  <Route path="products/:category/:productSlug" element={<ProductDetail />} />
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

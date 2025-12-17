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
import CookieConsent from "./components/CookieConsent";
import ErrorBoundary from "./components/ErrorBoundary";
import { Loading } from "./components/Loading";
import GoogleAnalytics from "./components/GoogleAnalytics";

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
const Login = lazy(() => import("./pages/Login"));
const Admin = lazy(() => import("./pages/Admin"));
const Blog = lazy(() => import("./pages/Blog"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const LocationLanding = lazy(() => import("./pages/LocationLanding"));
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

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/about" element={<About />} />
    <Route path="/products" element={<Products />} />
    <Route path="/products/:category/:productSlug" element={<ProductDetail />} />
    <Route path="/industries" element={<Industries />} />
    <Route path="/resources" element={<Resources />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/customers" element={<Customers />} />
    <Route path="/career" element={<Career />} />
    <Route path="/login" element={<Login />} />
    <Route
      path="/admin/*"
      element={
        <ProtectedRoute>
          <Admin />
        </ProtectedRoute>
      }
    />
    <Route path="/blog" element={<Blog />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
    <Route path="/sitemap" element={<Sitemap />} />
    {/* Location-specific landing pages for SEO */}
    <Route path="/chemicals/:location" element={<LocationLanding />} />

    {/* Language-prefixed routes (supports /ar/... and /en/...) */}
    <Route path="/:lng(ar|en)" element={<LangLayout />}>
      <Route index element={<Index />} />
      <Route path="about" element={<About />} />
      <Route path="products" element={<Products />} />
      <Route path="products/:category/:productSlug" element={<ProductDetail />} />
      <Route path="industries" element={<Industries />} />
      <Route path="resources" element={<Resources />} />
      <Route path="contact" element={<Contact />} />
      <Route path="customers" element={<Customers />} />
      <Route path="career" element={<Career />} />
      <Route path="login" element={<Login />} />
      <Route
        path="admin/*"
        element={
          <ProtectedRoute>
            <Admin />
          </ProtectedRoute>
        }
      />
      <Route path="blog" element={<Blog />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="terms" element={<Terms />} />
      <Route path="sitemap" element={<Sitemap />} />
      <Route path="chemicals/:location" element={<LocationLanding />} />
    </Route>

    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

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
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-primary-foreground px-4 py-2 rounded z-50 focus:outline-none focus:ring-2 focus:ring-ring"
              >
                Skip to main content
              </a>
              <CookieConsent />
              <Suspense fallback={<Loading />}>
                <AppRoutes />
              </Suspense>
            </ErrorBoundary>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;

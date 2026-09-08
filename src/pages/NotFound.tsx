import { useLocation, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Helmet } from 'react-helmet-async';
import { getLangPrefixFromPath, withLangPrefix } from '@/lib/langRouting';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Card } from '@/components/ui/card';
import { useSpotlight } from '@/hooks/useSpotlight';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import { Package, Calculator, Newspaper, MapPin, Mail, ArrowRight } from 'lucide-react';

const NotFound = () => {
  const location = useLocation();
  const prefix = useMemo(() => getLangPrefixFromPath(location.pathname), [location.pathname]);
  const spotlight = useSpotlight();

  useEffect(() => {
    // Reported as an analytics event rather than console.error so broken
    // inbound links are actually visible in GA instead of only in a console
    // nobody is watching in production. LocationLanding routes every unknown
    // /chemicals/<slug> here, so this page sees real traffic.
    trackSelectContent('404', location.pathname);
  }, [location.pathname]);

  const suggestions = [
    { icon: Package, title: 'Products', description: '275+ chemicals across 22 categories', to: '/products' },
    { icon: Calculator, title: 'Dosing Calculators', description: 'Free water-treatment sizing tools', to: '/tools/dosing-calculator' },
    { icon: MapPin, title: 'Delivery Locations', description: 'Where we supply across Oman & the GCC', to: '/chemicals' },
    { icon: Newspaper, title: 'Technical Guides', description: 'Articles from our applications team', to: '/blog' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet defer={false}>
        <title>Page Not Found | Global Chemicals LLC</title>
        <meta
          name="description"
          content="Page not found - The page you're looking for doesn't exist. Return to Global Chemicals LLC homepage to browse products, services & contact information."
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Page Not Found | Global Chemicals LLC" />
        <meta property="og:description" content="The page you are looking for could not be found." />
        <meta property="og:image" content="https://gcoman.com/images/og-default.png" />
      </Helmet>

      <Navigation />

      <main id="main-content">
        <section className="pt-32 pb-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-xs font-semibold tracking-[0.2em] uppercase text-primary mb-3">
                Error 404
              </p>
              <h1 className="text-6xl md:text-8xl font-extrabold leading-none mb-5 bg-gradient-to-r from-[hsl(var(--logo-blue))] via-[hsl(var(--logo-orange))] to-[hsl(var(--logo-blue))] bg-[length:200%_auto] bg-clip-text text-transparent animate-gradient-x">
                404
              </h1>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                This page moved, or never existed
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-8">
                The address <span className="font-mono text-sm text-foreground/80 break-all">{location.pathname}</span> didn&apos;t
                match anything on our site. Here&apos;s where most visitors are headed.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to={withLangPrefix(prefix, '/products')}
                  className="group relative overflow-hidden inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[hsl(var(--logo-blue))] to-[hsl(var(--logo-orange))] shadow-md hover:shadow-lg transition-all hover:scale-[1.03] motion-reduce:transform-none"
                >
                  <span aria-hidden className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer motion-reduce:hidden" />
                  Browse all products
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180" />
                </Link>
                <Link
                  to={withLangPrefix(prefix, '/contact')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-sm font-semibold border border-border bg-background hover:border-primary/40 hover:text-primary transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Tell us what you were looking for
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="pb-24">
          <div className="container mx-auto px-4">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
              {suggestions.map(({ icon: Icon, title, description, to }) => (
                <Link key={to} to={withLangPrefix(prefix, to)} className="h-full">
                  <Card
                    onMouseMove={spotlight}
                    className="group relative h-full p-6 logo-gradient-border spotlight-card transition-all duration-300 hover:shadow-lg hover:-translate-y-1 motion-reduce:transform-none"
                  >
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[hsl(var(--logo-blue))] to-[hsl(var(--logo-orange))] flex items-center justify-center shadow-md mb-4 transition-transform duration-300 group-hover:scale-110 motion-reduce:transform-none">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="font-bold text-foreground group-hover:text-primary transition-colors mb-1">
                      {title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default NotFound;

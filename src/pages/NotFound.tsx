import { useLocation, Link } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { Helmet } from 'react-helmet-async';
import { getLangPrefixFromPath, withLangPrefix } from '@/lib/langRouting';

const NotFound = () => {
  const location = useLocation();
  const prefix = useMemo(() => getLangPrefixFromPath(location.pathname), [location.pathname]);

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <Helmet>
        <title>Page Not Found | Global Chemicals LLC</title>
        <meta
          name="description"
          content="Page not found - The page you're looking for doesn't exist. Return to Global Chemicals LLC homepage to browse products, services & contact information."
        />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="Page Not Found | Global Chemicals LLC" />
        <meta property="og:description" content="The page you are looking for could not be found." />
        <meta property="og:image" content="https://www.gcoman.com/og-image.jpg" />
      </Helmet>
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold text-foreground">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <Link
          to={withLangPrefix(prefix, '/')}
          className="text-primary underline hover:text-accent font-semibold"
        >
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;

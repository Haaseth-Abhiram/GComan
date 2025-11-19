import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  canonical?: string;
}

export const SEO = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogUrl,
  ogImage,
  canonical,
}: SEOProps) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      
      {/* Open Graph */}
      <meta property="og:title" content={ogTitle || title} />
      <meta property="og:description" content={ogDescription || description} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:image" content={ogImage || "https://www.gcoman.com/og-image.jpg"} />
      
      {/* Twitter */}
      <meta name="twitter:title" content={ogTitle || title} />
      <meta name="twitter:description" content={ogDescription || description} />
      <meta name="twitter:image" content={ogImage || "https://www.gcoman.com/og-image.jpg"} />
      
      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
};

import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  canonical?: string;
  noIndex?: boolean;
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
  articleSection?: string;
  articleTags?: string[];
}

const DEFAULT_IMAGE = "https://storage.googleapis.com/gpt-engineer-file-uploads/KCdCgzQqlrUlZx0GJf8ZTPlKH1p2/social-images/social-1761453031792-resize-17607541312075170240GlobalChemicalsLLCLogoPNG.png";
const SITE_NAME = "Global Chemicals LLC";
const TWITTER_HANDLE = "@globalchemicals";

export const SEO = ({
  title,
  description,
  keywords,
  ogTitle,
  ogDescription,
  ogUrl,
  ogImage,
  ogType = 'website',
  canonical,
  noIndex = false,
  author,
  publishedTime,
  modifiedTime,
  articleSection,
  articleTags,
}: SEOProps) => {
  const finalOgImage = ogImage || DEFAULT_IMAGE;
  const finalTitle = ogTitle || title;
  const finalDescription = ogDescription || description;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      {ogUrl && <meta property="og:url" content={ogUrl} />}
      <meta property="og:image" content={finalOgImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={`${finalTitle} - Global Chemicals LLC`} />
      <meta property="og:locale" content="en_US" />

      {/* Article-specific Open Graph tags */}
      {ogType === 'article' && (
        <>
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          {author && <meta property="article:author" content={author} />}
          {articleSection && <meta property="article:section" content={articleSection} />}
          {articleTags?.map((tag, index) => (
            <meta key={index} property="article:tag" content={tag} />
          ))}
        </>
      )}

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content={TWITTER_HANDLE} />
      <meta name="twitter:creator" content={TWITTER_HANDLE} />
      <meta name="twitter:title" content={finalTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalOgImage} />
      <meta name="twitter:image:alt" content={`${finalTitle} - Global Chemicals LLC`} />

      {/* Canonical */}
      {canonical && <link rel="canonical" href={canonical} />}
    </Helmet>
  );
};

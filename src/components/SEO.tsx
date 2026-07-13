import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  /** Optional override for the <title> tag only (og:title still uses `title`). Use when fitForSerp's automatic shortening is too aggressive. */
  seoTitle?: string;
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
const BASE_URL = "https://gcoman.com";
const TWITTER_HANDLE = "@globalchemicals";
const BRAND_SUFFIX = ' | Global Chemicals LLC';
const SERP_TITLE_LIMIT = 60;
const SERP_TITLE_SOFT_LIMIT = 65;

// Smart fit for the <title> tag. Google truncates around ~580 px (≈60 chars).
// 1. Short enough → untouched.
// 2. Otherwise, drop the brand suffix (brand is also conveyed via og:site_name,
//    LocalBusiness/Organization JSON-LD, and the H1).
// 3. Still too long → word-truncate to 60 chars (no ellipsis — Google's UI handles it).
// Override per-page by passing `seoTitle` to <SEO>.
function fitForSerp(title: string): string {
  if (title.length <= SERP_TITLE_LIMIT) return title;
  const stripped = title.endsWith(BRAND_SUFFIX) ? title.slice(0, -BRAND_SUFFIX.length) : title;
  if (stripped.length <= SERP_TITLE_SOFT_LIMIT) return stripped;
  return stripped
    .slice(0, SERP_TITLE_LIMIT)
    .replace(/\s+\S*$/, '')        // drop the partial trailing word
    .replace(/[\s:;,.\-—–|]+$/, ''); // and trailing punctuation/separators
}

export const SEO = ({
  title,
  seoTitle,
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
  const titleForSerp = seoTitle ?? fitForSerp(title);
  const { i18n } = useTranslation();
  const location = useLocation();

  const finalOgImage = ogImage || DEFAULT_IMAGE;
  const finalTitle = ogTitle || title;
  const finalDescription = ogDescription || description;

  const currentLocale = i18n.language === 'ar' ? 'ar_SA' : 'en_US';

  return (
    // defer={false} forces react-helmet-async to commit head changes
    // synchronously instead of waiting for requestAnimationFrame. rAF is
    // unreliable inside the headless puppeteer prerender (vite.config.ts) and
    // produced HTML where the <title>/og:* never updated past the index.html
    // defaults — Google then saw most routes as duplicates of /.
    <Helmet defer={false}>
      <title>{titleForSerp}</title>
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
      <meta property="og:locale" content={currentLocale} />
      <meta property="og:locale:alternate" content={currentLocale === 'en_US' ? 'ar_SA' : 'en_US'} />

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
      <link rel="canonical" href={canonical || `${BASE_URL}${location.pathname}`} />
    </Helmet>
  );
};

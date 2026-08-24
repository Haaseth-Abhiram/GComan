import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';

interface SEOProps {
  title: string;
  /** Optional override for the <title> tag only (og:title still uses `title`). Use when fitForSerp's automatic shortening is too aggressive. */
  seoTitle?: string;
  description: string;
  /**
   * Arabic title + description. Passing BOTH marks the page's /ar twin as
   * fully localized: the /ar render becomes indexable with this meta and a
   * /ar canonical, and both language versions emit reciprocal hreflang
   * alternates. Omit (the default) and the /ar twin stays noindex — the safe
   * state for pages whose body content is still English.
   */
  arTitle?: string;
  arDescription?: string;
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
// The account the site itself links to from the footer. Do not guess a
// prettier handle here — a wrong twitter:site attributes every social card
// on the site to someone else's account.
const TWITTER_HANDLE = "@LlcChemica92705";
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
  arTitle,
  arDescription,
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
  const { i18n } = useTranslation();
  const location = useLocation();

  const currentLocale = i18n.language === 'ar' ? 'ar_SA' : 'en_US';
  const isArabic = location.pathname === '/ar' || location.pathname.startsWith('/ar/');

  // A page's Arabic twin is only exposed to crawlers when the caller supplied
  // a fully localized meta layer. Without it, /ar/* renders keep English
  // meta + noindex, so half-translated pages never compete with the English
  // originals as duplicate content.
  const arReady = Boolean(arTitle && arDescription);
  const useArabicMeta = isArabic && arReady;

  const effectiveDescription = useArabicMeta ? arDescription! : description;
  // fitForSerp's brand-suffix logic is tuned for the English titles; Arabic
  // titles are authored to length and pass through unchanged.
  const titleForSerp = useArabicMeta ? arTitle! : (seoTitle ?? fitForSerp(title));

  // canonical/ogUrl props are authored as the English URLs. The /ar render
  // must self-canonicalize (an /ar page pointing its canonical at the English
  // URL would tell Google to ignore the Arabic version entirely).
  const toArUrl = (url: string) =>
    url.replace(/^https:\/\/gcoman\.com(\/|$)/, 'https://gcoman.com/ar$1').replace(/\/ar$/, '/ar/');
  const effectiveCanonical = canonical && isArabic ? toArUrl(canonical) : canonical;
  const effectiveOgUrl = ogUrl && isArabic ? toArUrl(ogUrl) : ogUrl;

  const finalOgImage = ogImage || DEFAULT_IMAGE;
  const finalTitle = useArabicMeta ? arTitle! : (ogTitle || title);
  const finalDescription = useArabicMeta ? arDescription! : (ogDescription || description);

  return (
    // defer={false} forces react-helmet-async to commit head changes
    // synchronously instead of waiting for requestAnimationFrame. rAF is
    // unreliable inside the headless puppeteer prerender (vite.config.ts) and
    // produced HTML where the <title>/og:* never updated past the index.html
    // defaults — Google then saw most routes as duplicates of /.
    <Helmet defer={false}>
      <title>{titleForSerp}</title>
      <meta name="description" content={effectiveDescription} />
      {keywords && <meta name="keywords" content={keywords} />}

      {/* Robots — /ar renders are indexable only with a localized meta layer */}
      {noIndex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : isArabic && !arReady ? (
        <meta name="robots" content="noindex, follow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      )}

      {/* hreflang — only for pages with a live, indexable Arabic twin
          (arTitle/arDescription provided). Both language versions emit the
          same reciprocal set; x-default is the English page. Pages without
          Arabic meta emit nothing (their /ar twin is noindex, and hreflang
          must never point at a noindexed URL). */}
      {arReady && canonical && !noIndex && (
        <link rel="alternate" hrefLang="en" href={canonical} />
      )}
      {arReady && canonical && !noIndex && (
        <link rel="alternate" hrefLang="ar" href={toArUrl(canonical)} />
      )}
      {arReady && canonical && !noIndex && (
        <link rel="alternate" hrefLang="x-default" href={canonical} />
      )}

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      {effectiveOgUrl && <meta property="og:url" content={effectiveOgUrl} />}
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

      {/* Canonical — locale-aware (self-referencing on /ar), falling back to
          the current path so every page always has a canonical */}
      <link rel="canonical" href={effectiveCanonical || `${BASE_URL}${location.pathname}`} />
    </Helmet>
  );
};

import { useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'react-router-dom';
import { loadFullArabic } from '@/i18n';

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

const DEFAULT_IMAGE = "https://gcoman.com/images/og-default.png";
const SITE_NAME = "Global Chemicals LLC";
const BASE_URL = "https://gcoman.com";
// The account the site itself links to from the footer. Do not guess a
// prettier handle here — a wrong twitter:site attributes every social card
// on the site to someone else's account.
const TWITTER_HANDLE = "@LlcChemica92705";
const BRAND_SUFFIX = ' | Global Chemicals LLC';
const SERP_TITLE_LIMIT = 60;
// Post-strip grace was 65, but Google truncates on pixel width (~580 px) and
// the wide-character titles at 61–65 chars were measurably cut in mobile
// SERPs (55 pages in the Aug 2026 audit). 60 keeps the whole title visible.
const SERP_TITLE_SOFT_LIMIT = 60;
// Descriptions are cut around 155–160 chars; past that the closing CTA never
// renders. Clamp at a word boundary before 158 so the snippet ends clean.
const SERP_DESCRIPTION_LIMIT = 158;

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

// Same idea for the meta description: never emit more than Google will show.
// English only — Arabic descriptions are authored to length and Arabic SERP
// truncation behaves differently, so they pass through unchanged.
function fitDescription(text: string): string {
  if (text.length <= SERP_DESCRIPTION_LIMIT) return text;
  return text
    .slice(0, SERP_DESCRIPTION_LIMIT)
    .replace(/\s+\S*$/, '')
    .replace(/[\s:;,.\-—–|]+$/, '');
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

  const effectiveDescription = useArabicMeta ? arDescription! : fitDescription(description);
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

  // ── Prerender readiness signal ─────────────────────────────────────────
  // vite.config.ts uses renderAfterDocumentEvent('prerender-ready'): the
  // snapshot is taken only after a page explicitly says it is committed.
  // Every prerendered route mounts <SEO> exactly once, and this effect runs
  // after the commit that rendered the page's real head + body — unlike the
  // old fixed renderAfterTime, which raced the build machine's CPU and, on a
  // slow builder, shipped 310 half-rendered pages to production (25 Aug 2026:
  // homepage default <title>, English bodies on /ar). On /ar routes we also
  // wait for the lazily-loaded Arabic catalogue so localized bodies are in
  // the snapshot. Harmless no-op for real visitors.
  useEffect(() => {
    let cancelled = false;
    const signal = async () => {
      if (isArabic) {
        try { await loadFullArabic(); } catch { /* meta subset still correct */ }
        // let the changeLanguage-triggered re-render commit
        await new Promise((r) => setTimeout(r, 0));
      }
      // NO requestAnimationFrame here: rAF stalls in headless puppeteer (the
      // same quirk that forced defer={false} on Helmet). useEffect already
      // runs after the DOM commit; a zero-timeout is margin enough.
      await new Promise((r) => setTimeout(r, 0));
      if (!cancelled) document.dispatchEvent(new Event('prerender-ready'));
    };
    void signal();
    return () => { cancelled = true; };
  });

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
      {/* Dimension hints only for the default card, whose size we control.
          Caller-supplied images (e.g. 1200×900 product photos) vary, and a
          wrong height claim makes scrapers crop the preview badly. */}
      {finalOgImage === DEFAULT_IMAGE && <meta property="og:image:width" content="1200" />}
      {finalOgImage === DEFAULT_IMAGE && <meta property="og:image:height" content="630" />}
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

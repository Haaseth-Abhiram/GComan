import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ar from './locales/ar.json';
// Small generated subset of the Arabic catalogue translations (per-product
// title/description, per-location metaTitle/metaDescription). It exists so
// the big files below can stay OUT of the eager bundle: products-ar.json
// (~700 KB) + location-pages-ar.json used to be statically imported here,
// which made Arabic body copy ~80% of the main JS bundle for every visitor.
// The SEO layer, however, needs this subset synchronously on EVERY page —
// English renders decide whether to emit hreflang by checking the Arabic
// resources (ProductDetail/LocationLanding i18n.exists gates), so it cannot
// be lazy. Regenerate with scripts/sync-ar-meta.mjs after editing either
// source file; CI fails if it drifts.
import arMeta from './locales/ar-meta.json';

const isBrowser = typeof document !== 'undefined';

// Eager Arabic resources: full UI layer + the SEO-critical catalogue subset.
// ar.json's `products` key holds products-PAGE UI strings while ar-meta's
// holds per-product-id entries — deep-merge so neither clobbers the other.
// `locationPages` is a fresh top-level key (ar.json's `locations` only holds
// the footer's short city labels), so a shallow spread is safe.
const eagerAr = {
  ...ar,
  locationPages: arMeta.locationPages,
  products: {
    ...ar.products,
    ...arMeta.products,
  },
};

const resources = {
  en: { translation: en },
  ar: { translation: eagerAr },
};

// Full Arabic body copy (longDescription, applications, technicalSpecs,
// alternativeNames, seoKeywords per product; full location-page prose).
// Loaded on demand the first time the language flips to Arabic. addResourceBundle
// deep-merges over the eager subset; the follow-up changeLanguage('ar') is a
// same-language no-op except that it re-emits languageChanged, which is what
// react-i18next components re-render on — without it, an /ar page that mounted
// before the chunk arrived would keep showing the English defaultValue bodies.
let fullArabicLoaded = false;
let fullArabicLoading: Promise<void> | null = null;
export function loadFullArabic(): Promise<void> {
  if (fullArabicLoaded) return Promise.resolve();
  if (fullArabicLoading) return fullArabicLoading;
  fullArabicLoading = Promise.all([
    import('./locales/products-ar.json'),
    import('./locales/location-pages-ar.json'),
  ]).then(([productsAr, locationPagesAr]) => {
    i18n.addResourceBundle(
      'ar',
      'translation',
      { products: productsAr.default.products, locationPages: locationPagesAr.default.locationPages },
      true, // deep
      true  // overwrite (full entries win over the meta subset)
    );
    fullArabicLoaded = true;
    if (i18n.language === 'ar') void i18n.changeLanguage('ar');
  }).catch((err) => {
    // Meta subset keeps titles/descriptions correct; bodies fall back to
    // English defaultValues. Allow a retry on the next trigger.
    console.error('Failed to load full Arabic translations:', err);
    fullArabicLoading = null;
  });
  return fullArabicLoading;
}

// Language is URL-derived: <LanguageSync> in src/App.tsx sets it from the
// pathname (/ar/* → ar, else en). There is deliberately no browser/localStorage
// language detection — on a prerendered site, detection would make the rendered
// language disagree with the URL crawlers indexed.
i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
  });

// Update document direction and lang attribute when language changes,
// and pull in the full Arabic bundle the moment Arabic becomes active.
i18n.on('languageChanged', (lng) => {
  if (lng === 'ar') void loadFullArabic();
  if (!isBrowser) return;
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

// Set initial direction; start the Arabic chunk download immediately on /ar
// URLs so the prerenderer (and real /ar visitors) get localized bodies as
// early as possible instead of waiting for LanguageSync's first effect.
if (isBrowser) {
  const initialDir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = initialDir;
  document.documentElement.lang = i18n.language || 'en';
  const path = window.location.pathname;
  if (path === '/ar' || path.startsWith('/ar/')) void loadFullArabic();
}

export default i18n;

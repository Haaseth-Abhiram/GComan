import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from './locales/en.json';
import ar from './locales/ar.json';
import productsAr from './locales/products-ar.json';

const isBrowser = typeof document !== 'undefined';

// Merge Arabic product translations into main Arabic translations.
// Both files define a top-level `products` key (ar.json holds the products-page
// UI strings, products-ar.json holds per-product-id translations), so the
// namespace must be deep-merged — a shallow spread would drop the UI strings.
const mergedAr = {
  ...ar,
  ...productsAr,
  products: {
    ...ar.products,
    ...productsAr.products,
  },
};

const resources = {
  en: { translation: en },
  ar: { translation: mergedAr },
};

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

// Update document direction and lang attribute when language changes
i18n.on('languageChanged', (lng) => {
  if (!isBrowser) return;
  const dir = lng === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lng;
});

// Set initial direction
if (isBrowser) {
  const initialDir = i18n.language === 'ar' ? 'rtl' : 'ltr';
  document.documentElement.dir = initialDir;
  document.documentElement.lang = i18n.language || 'en';
}

export default i18n;

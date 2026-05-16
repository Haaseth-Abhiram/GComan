import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import ar from './locales/ar.json';
import productsAr from './locales/products-ar.json';

const isBrowser = typeof document !== 'undefined';

// Merge Arabic product translations into main Arabic translations
const mergedAr = {
  ...ar,
  ...productsAr
};

const resources = {
  en: { translation: en },
  ar: { translation: mergedAr },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: false,
    interpolation: {
      escapeValue: false,
    },
    ...(isBrowser ? {
      detection: {
        order: ['localStorage', 'navigator'],
        caches: ['localStorage'],
      },
    } : {}),
  });

if (isBrowser) {
  i18n.use(LanguageDetector);
}

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

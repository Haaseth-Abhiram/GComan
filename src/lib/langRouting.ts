import { useLocation } from 'react-router-dom';

export const getLangPrefixFromPath = (pathname: string): '' | '/en' | '/ar' => {
  if (pathname === '/ar' || pathname.startsWith('/ar/')) return '/ar';
  if (pathname === '/en' || pathname.startsWith('/en/')) return '/en';
  return '';
};

export const withLangPrefix = (prefix: '' | '/en' | '/ar', path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return prefix ? `${prefix}${normalized === '/' ? '' : normalized}` : normalized;
};

/**
 * True when the current route is an `/ar` render.
 *
 * **Use this, not `i18n.language === 'ar'`, to decide what CONTENT to render.**
 * `i18n.language` is `'en'` on the first render — `LangLayout` flips it in an
 * effect — so a component that derives an array in its body can compute the
 * English value and never recompute it. That is not theoretical: the visible
 * FAQ blocks shipped English answers under the Arabic heading
 * `الأسئلة الشائعة` on `/ar`, because `FAQSection` re-rendered when the
 * language changed (it calls `useTranslation()` itself) while the page
 * component that built the array did not.
 *
 * The pathname is correct from the very first render and is identical under
 * the puppeteer prerender, which is why `SEO.tsx` already decides indexability
 * and canonicals the same way.
 *
 * `i18n.language` remains the right check for *translating* a string via
 * `t()` — only content-shape decisions need the path.
 */
export const useIsArabicRoute = (): boolean => {
  const { pathname } = useLocation();
  return getLangPrefixFromPath(pathname) === '/ar';
};

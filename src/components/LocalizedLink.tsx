import { Link, useLocation, type LinkProps } from 'react-router-dom';
import { getLangPrefixFromPath, withLangPrefix } from '@/lib/langRouting';

/**
 * Locale-aware <Link>. Prefixes the target with the current language prefix
 * (/ar) so navigation from an Arabic page stays on the Arabic site. Use this
 * for any internal link in a component that renders under both language trees
 * (Hero, Footer, shared sections) — a bare <Link to="/contact"> would silently
 * eject /ar visitors back to English.
 */
export const LocalizedLink = ({ to, ...rest }: LinkProps & { to: string }) => {
  const localize = useLocalizedPath();
  return <Link to={localize(to)} {...rest} />;
};

/** Hook variant for places that build hrefs programmatically. */
export const useLocalizedPath = () => {
  const { pathname } = useLocation();
  // /en/* is a transient redirect target — never generate /en-prefixed links.
  const prefix = getLangPrefixFromPath(pathname);
  const effective = prefix === '/ar' ? '/ar' : '';
  return (path: string) => withLangPrefix(effective, path);
};

export const getLangPrefixFromPath = (pathname: string): '' | '/en' | '/ar' => {
  if (pathname === '/ar' || pathname.startsWith('/ar/')) return '/ar';
  if (pathname === '/en' || pathname.startsWith('/en/')) return '/en';
  return '';
};

export const withLangPrefix = (prefix: '' | '/en' | '/ar', path: string) => {
  const normalized = path.startsWith('/') ? path : `/${path}`;
  return prefix ? `${prefix}${normalized === '/' ? '' : normalized}` : normalized;
};

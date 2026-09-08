import { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, LogOut, User, Shield, Search, ArrowRight, ChevronDown } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import logo from '@/assets/global-chemicals-logo.svg';
import { getLangPrefixFromPath, withLangPrefix } from '@/lib/langRouting';
import { AISearchDialog } from '@/components/AISearchDialog';
import ProductsMegaMenu from '@/components/ProductsMegaMenu';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const megaTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  // Hover-intent for the Products mega-menu: instant open, short grace
  // period on leave so the cursor can cross the gap into the panel.
  const openMega = () => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    setMegaOpen(true);
  };
  const closeMega = () => {
    if (megaTimer.current) clearTimeout(megaTimer.current);
    megaTimer.current = setTimeout(() => setMegaOpen(false), 150);
  };

  // Close menus on route change
  useEffect(() => {
    setMegaOpen(false);
    setIsOpen(false);
  }, [location.pathname]);
  const { user, signOut } = useAuth();
  const { isAdmin } = useUserRole();
  const { t } = useTranslation();

  // Condense the header once the page starts scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const prefix = useMemo(() => getLangPrefixFromPath(location.pathname), [location.pathname]);

  const navItems = useMemo(
    () => [
      { label: t('nav.home'), path: withLangPrefix(prefix, '/') },
      { label: t('nav.about'), path: withLangPrefix(prefix, '/about') },
      { label: t('nav.products'), path: withLangPrefix(prefix, '/products'), hasMega: true },
      { label: t('nav.industries'), path: withLangPrefix(prefix, '/industries') },
      { label: t('nav.resources'), path: withLangPrefix(prefix, '/resources') },
      { label: t('nav.contact'), path: withLangPrefix(prefix, '/contact') },
    ],
    [t, prefix]
  );

  const utilityLinks = useMemo(
    () => [
      { label: t('nav.customers'), path: withLangPrefix(prefix, '/customers') },
      { label: t('nav.careers'), path: withLangPrefix(prefix, '/career') },
    ],
    [t, prefix]
  );

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${
        scrolled
          ? 'bg-background/90 backdrop-blur-xl border-border shadow-md supports-[backdrop-filter]:bg-background/75'
          : 'bg-background/95 backdrop-blur-md border-border/60 shadow-sm supports-[backdrop-filter]:bg-background/85'
      }`}
    >
      {/* Utility Bar — collapses away on scroll to condense the header */}
      <div
        className={`hidden lg:block border-b border-border/50 overflow-hidden transition-all duration-300 ${
          scrolled ? 'max-h-0 opacity-0 border-b-0' : 'max-h-10 opacity-100'
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex justify-end items-center h-10 gap-6">
            <LanguageSwitcher variant="compact" />
            {utilityLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm transition-colors text-muted-foreground hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
            {user ? (
              <div className="flex items-center gap-4">
                {isAdmin && (
                  <Link
                    to={withLangPrefix(prefix, '/admin')}
                    className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                  >
                    <Shield className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <span className="text-sm text-muted-foreground flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {user.email}
                </span>
                <button
                  onClick={signOut}
                  className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to={withLangPrefix(prefix, '/login')}
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div
          className={`flex items-center justify-between transition-all duration-300 ${
            scrolled ? 'h-16' : 'h-20'
          }`}
        >
          {/* Logo */}
          <Link
            to={withLangPrefix(prefix, '/')}
            aria-label="Global Chemicals LLC – Home"
            className="flex items-center group"
          >
            <img
              src={logo}
              alt="Global Chemicals LLC Logo"
              width={180}
              height={56}
              className={`w-auto transition-all duration-300 group-hover:scale-105 ${
                scrolled ? 'h-10 md:h-11' : 'h-12 md:h-14'
              }`}
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onMouseEnter={item.hasMega ? openMega : closeMega}
                onMouseLeave={item.hasMega ? closeMega : undefined}
                onFocus={item.hasMega ? openMega : undefined}
                aria-expanded={item.hasMega ? megaOpen : undefined}
                aria-haspopup={item.hasMega ? 'menu' : undefined}
                className={`relative flex items-center gap-1 px-3.5 py-2 rounded-full text-sm font-semibold tracking-wide transition-all duration-200 ${
                  isActive(item.path) || (item.hasMega && megaOpen)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/70 hover:text-primary hover:bg-muted'
                }`}
              >
                {item.label}
                {item.hasMega && (
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${megaOpen ? 'rotate-180' : ''}`}
                  />
                )}
                {isActive(item.path) && (
                  <span className="absolute -bottom-px left-1/2 -translate-x-1/2 w-5 h-0.5 rounded-full bg-primary" />
                )}
              </Link>
            ))}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(true)}
              aria-label="AI Search"
              className="text-foreground/70 hover:text-primary rounded-full ltr:ml-1 rtl:mr-1"
            >
              <Search className="h-5 w-5" />
            </Button>
            {/* Primary CTA */}
            <Link
              to={withLangPrefix(prefix, '/contact')}
              className="group relative overflow-hidden ltr:ml-2 rtl:mr-2 inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[hsl(var(--logo-blue))] to-[hsl(var(--logo-orange))] bg-[length:150%_auto] hover:bg-right shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.03]"
            >
              <span aria-hidden className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer motion-reduce:hidden" />
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Products Mega-Menu (desktop) */}
      {megaOpen && (
        <div
          className="hidden lg:block absolute top-full left-0 right-0"
          onMouseEnter={openMega}
          onMouseLeave={closeMega}
          onKeyDown={(e) => e.key === 'Escape' && setMegaOpen(false)}
        >
          <ProductsMegaMenu prefix={prefix} onNavigate={() => setMegaOpen(false)} />
        </div>
      )}

      {/* Mobile Menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="lg:hidden border-t border-border bg-background/95 backdrop-blur-xl animate-fade-in max-h-[calc(100dvh-4rem)] overflow-y-auto"
          onKeyDown={(e) => e.key === 'Escape' && setIsOpen(false)}
        >
          <div className="container mx-auto px-4 py-6 space-y-1.5">
            {navItems.map((item, index) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block text-base font-semibold px-4 py-3 rounded-xl transition-colors animate-fade-in ${
                  isActive(item.path)
                    ? 'text-primary bg-primary/10'
                    : 'text-foreground/70 hover:text-primary hover:bg-muted'
                }`}
                style={{ animationDelay: `${index * 0.04}s` }}
              >
                {item.label}
              </Link>
            ))}
            <button
              onClick={() => { setIsOpen(false); setIsSearchOpen(true); }}
              className="flex w-full items-center gap-2 text-base font-semibold px-4 py-3 rounded-xl text-foreground/70 hover:text-primary hover:bg-muted transition-colors"
            >
              <Search className="h-5 w-5" />
              AI Search
            </button>
            {/* Mobile CTA */}
            <Link
              to={withLangPrefix(prefix, '/contact')}
              onClick={() => setIsOpen(false)}
              className="mt-2 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl text-base font-semibold text-white bg-gradient-to-r from-[hsl(var(--logo-blue))] to-[hsl(var(--logo-orange))] shadow-md active:scale-[0.99] transition-transform"
            >
              {t('hero.cta')}
              <ArrowRight className="w-4 h-4 rtl:rotate-180" />
            </Link>
            <div className="pt-4 mt-2 border-t border-border/50 space-y-2">
              <div className="py-2">
                <LanguageSwitcher />
              </div>
              {utilityLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  {link.label}
                </Link>
              ))}
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      to={withLangPrefix(prefix, '/admin')}
                      onClick={() => setIsOpen(false)}
                      className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      Admin
                    </Link>
                  )}
                  <div className="text-sm text-muted-foreground py-1 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {user.email}
                  </div>
                  <button
                    onClick={() => {
                      signOut();
                      setIsOpen(false);
                    }}
                    className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1 flex items-center gap-2"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  to={withLangPrefix(prefix, '/login')}
                  onClick={() => setIsOpen(false)}
                  className="block text-sm text-muted-foreground hover:text-primary transition-colors py-1"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
      <AISearchDialog open={isSearchOpen} onOpenChange={setIsSearchOpen} />
    </nav>
  );
};

export default Navigation;

import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';
import { trackLanguageChange } from '@/components/GoogleAnalytics';
import { getLangPrefixFromPath } from '@/lib/langRouting';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇴🇲' },
];

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact';
  className?: string;
}

// Rewrite the current pathname to the target language. The route source of
// truth is the URL (LanguageSync in App.tsx forces i18n to match the path),
// so language switching MUST navigate — calling i18n.changeLanguage alone
// gets reverted on the next render.
const pathForLanguage = (pathname: string, target: 'en' | 'ar') => {
  const currentPrefix = getLangPrefixFromPath(pathname);
  // Strip any existing /ar or /en prefix to get the canonical path.
  let base = pathname;
  if (currentPrefix) base = pathname.slice(currentPrefix.length) || '/';
  if (!base.startsWith('/')) base = `/${base}`;
  if (target === 'ar') {
    return base === '/' ? '/ar' : `/ar${base}`;
  }
  return base;
};

const LanguageSwitcher = ({ variant = 'default', className = '' }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode: string) => {
    if (langCode !== 'en' && langCode !== 'ar') return;
    if (langCode === i18n.language) return;

    try {
      localStorage.setItem('i18nextLng', langCode);
      trackLanguageChange(langCode);
    } catch {
      // ignore storage/analytics failures — navigation still proceeds
    }

    const nextPath = pathForLanguage(location.pathname, langCode);
    navigate(`${nextPath}${location.search}${location.hash}`);
  };

  if (variant === 'compact') {
    return (
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleLanguageChange(i18n.language === 'en' ? 'ar' : 'en')}
        className={`flex items-center gap-1.5 ${className}`}
      >
        <Globe className="h-4 w-4" />
        <span className="text-sm font-medium">
          {i18n.language === 'en' ? 'العربية' : 'English'}
        </span>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className={`flex items-center gap-1.5 ${className}`}>
          <Globe className="h-4 w-4" />
          <span className="text-sm font-medium">{currentLanguage.nativeName}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px]">
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`flex items-center gap-2 cursor-pointer ${
              i18n.language === lang.code ? 'bg-primary/10' : ''
            }`}
          >
            <span>{lang.flag}</span>
            <span>{lang.nativeName}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;

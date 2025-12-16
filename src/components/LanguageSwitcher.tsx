import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇴🇲' },
];

interface LanguageSwitcherProps {
  variant?: 'default' | 'compact';
  className?: string;
}

const LanguageSwitcher = ({ variant = 'default', className = '' }: LanguageSwitcherProps) => {
  const { i18n } = useTranslation();

  const currentLanguage = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = async (langCode: string) => {
    try {
      // Explicitly save to localStorage before changing
      localStorage.setItem('i18nextLng', langCode);

      // Change the language
      await i18n.changeLanguage(langCode);

      // Small delay to ensure state is saved
      await new Promise(resolve => setTimeout(resolve, 100));

      // Force reload to ensure all components update with new language
      window.location.reload();
    } catch (error) {
      console.error('Failed to change language:', error);
    }
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

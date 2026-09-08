import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { ChevronRight } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { getLangPrefixFromPath, withLangPrefix } from '@/lib/langRouting';
import { trackSelectContent } from '@/components/GoogleAnalytics';
import type { Product } from '@/data/productTypes';

interface ProductCardProps {
  product: Product;
  onClick?: (product: Product) => void;
}

const ProductCardComponent = ({ product }: ProductCardProps) => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const prefix = useMemo(() => getLangPrefixFromPath(location.pathname), [location.pathname]);

  const Icon = product.icon;
  const productUrl = withLangPrefix(prefix, `/products/${product.category}/${product.id}`);
  // Carry the exact SKU into the contact form: Contact.tsx reads product+ref
  // and prefills the quotation, so sales receives the product URL, not a
  // guessing game. (Historically the card was an <a> nested inside an <a> —
  // invalid HTML that some browsers resolve by dropping the inner link, i.e.
  // eating quote clicks. The card is now a div with an overlay link and the
  // quote CTA is a real sibling anchor.)
  const quoteUrl =
    withLangPrefix(prefix, '/contact') +
    `?product=${encodeURIComponent(product.title)}&ref=${encodeURIComponent(`${product.category}/${product.id}`)}`;

  // Get translated product data if available (for Arabic)
  const translatedTitle =
    i18n.language === 'ar'
      ? t(`products.${product.id}.title`, { defaultValue: product.title })
      : product.title;

  const translatedDescription =
    i18n.language === 'ar'
      ? t(`products.${product.id}.description`, { defaultValue: product.description })
      : product.description;

  // Card-wide click without an overlay link: an absolutely-positioned overlay
  // (or pointer-events-none content) makes the whole card unselectable, and
  // buyers copy product names and CAS numbers straight off these cards. The
  // title stays a real <a> for crawlers, middle-click and keyboard; this
  // handler only adds mouse convenience, and bails when the user was selecting
  // text rather than clicking.
  const handleCardClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('a,button')) return;
    if (window.getSelection()?.toString()) return;
    navigate(productUrl);
  };

  return (
    <Card
      onClick={handleCardClick}
      className="group relative overflow-hidden transition-all duration-300 hover:shadow-lg bg-card hover:-translate-y-1 logo-gradient-border focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 rounded-lg cursor-pointer cv-auto"
    >
      <div className="p-5 sm:p-6 flex flex-col h-full">
        <div className="flex items-start gap-3 sm:gap-4 mb-3 sm:mb-4">
          <div className="flex-shrink-0 p-2.5 sm:p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
            <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-foreground leading-tight mb-1 sm:mb-2 line-clamp-2">
              <Link
                to={productUrl}
                className="hover:text-primary group-hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
              >
                {translatedTitle}
              </Link>
            </h3>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mb-4 flex-grow line-clamp-3">
          {translatedDescription}
        </p>

        <div className="flex items-center justify-between gap-2 pt-3 border-t border-border">
          <div className="flex items-center gap-2 text-primary text-xs sm:text-sm font-semibold group-hover:gap-3 transition-all">
            <span>{t('products.viewDetails', { defaultValue: 'View Details' })}</span>
            <ChevronRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform rtl:rotate-180" />
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              trackSelectContent('cta_button', `get_quote:${product.id}`);
              navigate(quoteUrl);
            }}
            className="relative z-10 text-xs font-semibold px-3 py-1.5 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          >
            {t('products.getQuote', { defaultValue: 'Get Quote' })}
          </button>
        </div>
      </div>
    </Card>
  );
};

// Memoize but allow re-render when language changes (i18n handles this internally)
export const ProductCard = memo(ProductCardComponent);

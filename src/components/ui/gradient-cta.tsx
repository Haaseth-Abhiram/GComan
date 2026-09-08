import * as React from 'react';
import { ArrowRight } from 'lucide-react';
import { LocalizedLink } from '@/components/LocalizedLink';
import { cn } from '@/lib/utils';

interface GradientCTAProps {
  to: string;
  children: React.ReactNode;
  /** Hide the trailing arrow (e.g. when the label already ends in one). */
  hideArrow?: boolean;
  size?: 'default' | 'lg';
  className?: string;
  onClick?: () => void;
}

/**
 * The site's single primary call-to-action treatment: brand gradient pill with
 * a shimmer sweep, matching the navbar CTA. Use this for the money action
 * ("Request a Quote") so it reads identically on every page; keep secondary
 * actions as outline buttons.
 */
export const GradientCTA = ({
  to,
  children,
  hideArrow,
  size = 'default',
  className,
  onClick,
}: GradientCTAProps) => (
  <LocalizedLink
    to={to}
    onClick={onClick}
    className={cn(
      'group relative overflow-hidden inline-flex items-center justify-center gap-2 rounded-full font-semibold text-white',
      'bg-gradient-to-r from-[hsl(var(--logo-blue))] to-[hsl(var(--logo-orange))]',
      'shadow-md hover:shadow-lg transition-all hover:scale-[1.03] motion-reduce:transform-none',
      size === 'lg' ? 'px-8 py-4 text-base' : 'px-6 py-3 text-sm',
      className
    )}
  >
    <span
      aria-hidden
      className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer motion-reduce:hidden"
    />
    {children}
    {!hideArrow && (
      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 rtl:group-hover:-translate-x-0.5 transition-transform rtl:rotate-180" />
    )}
  </LocalizedLink>
);

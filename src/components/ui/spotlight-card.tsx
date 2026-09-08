import * as React from 'react';
import { Card } from '@/components/ui/card';
import { useSpotlight } from '@/hooks/useSpotlight';
import { cn } from '@/lib/utils';

/**
 * A Card with the cursor-tracking brand glow (see `.spotlight-card` in
 * src/index.css). Drop-in replacement for <Card> on hero/feature grids.
 *
 * Do NOT pass `logo-gradient-top` — that utility also owns ::after and the two
 * would cancel each other out.
 */
export const SpotlightCard = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<typeof Card>
>(({ className, onMouseMove, ...props }, ref) => {
  const spotlight = useSpotlight();

  return (
    <Card
      ref={ref}
      onMouseMove={(e) => {
        spotlight(e);
        onMouseMove?.(e);
      }}
      className={cn('relative spotlight-card', className)}
      {...props}
    />
  );
});

SpotlightCard.displayName = 'SpotlightCard';

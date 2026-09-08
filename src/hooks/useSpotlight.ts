import { useCallback } from 'react';

/**
 * Feeds the cursor position to the `.spotlight-card` CSS overlay (see
 * src/index.css), which paints a soft brand-coloured glow that follows the
 * pointer across a card.
 *
 * Usage: `<Card onMouseMove={spotlight} className="... spotlight-card">`.
 * The CSS disables itself under `prefers-reduced-motion` and on touch
 * pointers, so no JS guard is needed here.
 *
 * Do NOT combine `.spotlight-card` with `.logo-gradient-top` — both own the
 * `::after` pseudo-element.
 */
export const useSpotlight = () =>
  useCallback((e: React.MouseEvent<HTMLElement>) => {
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
  }, []);

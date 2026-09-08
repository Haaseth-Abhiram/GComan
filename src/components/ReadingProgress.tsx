import { useEffect, useState } from 'react';

/**
 * Thin brand-gradient bar showing how far through the article the reader is.
 * Sits directly under the fixed navbar. rAF-throttled so scrolling stays cheap.
 */
export const ReadingProgress = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        setProgress(scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0);
      });
    };

    update();
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    return () => {
      window.removeEventListener('scroll', update);
      window.removeEventListener('resize', update);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div
      className="fixed top-0 left-0 right-0 z-[55] h-0.5 pointer-events-none"
      aria-hidden
    >
      <div
        className="h-full origin-left bg-gradient-to-r from-[hsl(var(--logo-blue))] to-[hsl(var(--logo-orange))]"
        style={{ transform: `scaleX(${progress})` }}
      />
    </div>
  );
};

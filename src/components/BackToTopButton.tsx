import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const toggleVisibility = () => {
      // rAF-throttled: the raw scroll handler called setState on every event.
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        setIsVisible(window.scrollY > 300);
      });
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  const scrollToTop = () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
  };

  // Hidden = not rendered at all, so it also leaves the tab order (opacity-0
  // alone left an invisible focusable control behind).
  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToTop}
      // bottom-40 on mobile clears the Zoho SalesIQ bubble, which index.css
      // pins to bottom:80px/right:16px under 768px — exactly where this button
      // used to sit.
      className="fixed bottom-40 sm:bottom-24 ltr:right-4 ltr:sm:right-8 rtl:left-4 rtl:sm:left-8 z-40 w-12 h-12 sm:w-14 sm:h-14 rounded-full shadow-xl hover:shadow-2xl transition-all transform hover:scale-110 motion-reduce:transform-none flex items-center justify-center bg-background/80 backdrop-blur-md border border-border text-foreground hover:text-primary hover:border-primary/40 animate-fade-in"
      aria-label="Back to top"
    >
      <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6" />
    </button>
  );
};

export default BackToTopButton;

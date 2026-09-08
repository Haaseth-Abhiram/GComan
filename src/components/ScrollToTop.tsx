import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

/**
 * Resets scroll position on route change.
 *
 * React Router does not do this for you: the browser keeps the previous
 * scroll offset across a client-side navigation, so clicking "About" while
 * halfway down the homepage dropped you into the middle of the About page.
 * Every page in the site was affected.
 *
 * Three cases are deliberately left alone:
 *  - Back/forward (POP), where the browser restores the position the visitor
 *    left off at — overriding that is worse than the bug.
 *  - Any URL carrying a hash, which is an in-page anchor (/industries#laboratory,
 *    an article heading). Those targets own the scroll.
 *  - Same-page updates that only change the query string, e.g. filtering.
 */
const ScrollToTop = () => {
  const { pathname, hash } = useLocation();
  const navigationType = useNavigationType();

  useEffect(() => {
    if (hash) return;
    if (navigationType === 'POP') return;
    // Jump, never smooth-scroll: animating the whole page on navigation reads
    // as the page moving under you.
    window.scrollTo(0, 0);
  }, [pathname, hash, navigationType]);

  return null;
};

export default ScrollToTop;

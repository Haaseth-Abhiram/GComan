import { Suspense, lazy, useEffect, useState } from 'react';
import type { MoleculeSpec } from '@/data/productTypes';
import type { ChemistryHeroTuning } from './ChemistryHero3D';

// three.js + r3f only loads on demand. Keeps the main bundle slim.
const ChemistryHero3D = lazy(() => import('./ChemistryHero3D'));

export interface ChemistryHeroProps {
  formula: string;
  molecule: MoleculeSpec;
  productTitle: string;
  /** Override visual tuning (used by /dev/chemistry-playground). */
  tuning?: Partial<ChemistryHeroTuning>;
}

// Detect headless prerender (Puppeteer). The 3D Canvas keeps a permanent
// requestAnimationFrame loop running, which prevents the prerender's idle
// detection from firing — every product route then exhausts puppeteer's 30 s
// navigation budget. Real browsers still get the full 3D scene.
const isPrerender = (): boolean => {
  if (typeof navigator === 'undefined') return true;
  return /HeadlessChrome|Prerender/i.test(navigator.userAgent);
};

// The 3D hero costs ~2.7 MB on first view (1.6 MB HDRI + 1.1 MB three.js/r3f
// chunk) and, once mounted, becomes the largest painted element — so LCP ends
// up measuring that whole chain. GSC field data had every product page at
// "Poor" on mobile. It is decoration: the prerendered HTML already ships the
// static formula fallback, which stays put for anyone who does not clear the
// bar below. Capable desktop visitors still get the full scene.
const canAfford3D = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return false;
  if (isPrerender()) return false;

  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return false;

  // Phones and small tablets: this is exactly where CrUX marks us Poor, and
  // where 2.7 MB of decoration is least affordable.
  if (window.matchMedia?.('(max-width: 1023px)').matches) return false;

  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean; effectiveType?: string };
    deviceMemory?: number;
  };
  if (nav.connection?.saveData) return false;
  if (nav.connection?.effectiveType && /(^|-)[23]g$/.test(nav.connection.effectiveType)) return false;
  if (typeof nav.hardwareConcurrency === 'number' && nav.hardwareConcurrency < 4) return false;
  if (typeof nav.deviceMemory === 'number' && nav.deviceMemory < 4) return false;

  return true;
};

export const ChemistryHero = ({ formula, molecule, productTitle, tuning }: ChemistryHeroProps) => {
  // Defer mounting until after client hydration so the prerendered HTML is the
  // static fallback (better SEO, no canvas-related layout shift on slow clients).
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // Covers the prerenderer too (canAfford3D returns false for it), so the
    // prerendered HTML still ships the static fallback.
    if (!canAfford3D()) return;

    // Search Console field data (CrUX) showed real-visitor LCP at >2.5s mobile /
    // >4s desktop across product pages — because once this mounts, the 3D
    // canvas becomes the largest painted element, so LCP ends up measuring
    // this entire fetch+init chain, not the fast initial fallback paint.
    // The HDRI (1.6MB) is pure network I/O with no JS execution cost, so fetch
    // it immediately — `fetchPriority: low` keeps it from competing with
    // genuinely critical resources (fonts, hero image), but starting now
    // instead of after the idle wait below removes ~1.6MB of latency from
    // the critical chain.
    const hdriPreload = document.createElement('link');
    hdriPreload.rel = 'preload';
    hdriPreload.as = 'fetch';
    hdriPreload.href = '/hdri/empty_warehouse_01_1k.hdr';
    hdriPreload.crossOrigin = 'anonymous';
    hdriPreload.setAttribute('fetchpriority', 'low');
    document.head.appendChild(hdriPreload);

    // Warm the 1.1MB three.js/r3f/drei chunk's network fetch on a short,
    // separate idle window — still off the critical initial-render path, but
    // its own low-timeout callback so the download starts well before the
    // full mount trigger below, instead of only once that also fires.
    let prefetchHandle: number | undefined;
    const prefetchChunk = () => { import('./ChemistryHero3D'); };
    if (typeof window.requestIdleCallback === 'function') {
      prefetchHandle = window.requestIdleCallback(prefetchChunk, { timeout: 300 });
    } else {
      prefetchChunk();
    }

    // Mounting immediately on hydration made the 1.6MB HDRI fetch + three.js
    // scene/shader init compete directly with the browser making the rest of
    // the page interactive — measured at ~7.5s of Total Blocking Time on
    // product pages. requestIdleCallback pushes that work to after the
    // browser is done with higher-priority work, off the critical path.
    // Falls back to setTimeout for Safari, which has no native support.
    if (typeof window.requestIdleCallback === 'function') {
      const handle = window.requestIdleCallback(() => setMounted(true), { timeout: 2000 });
      return () => {
        window.cancelIdleCallback(handle);
        if (prefetchHandle !== undefined) window.cancelIdleCallback(prefetchHandle);
        document.head.removeChild(hdriPreload);
      };
    }
    const timer = window.setTimeout(() => setMounted(true), 200);
    return () => {
      window.clearTimeout(timer);
      document.head.removeChild(hdriPreload);
    };
  }, []);

  return (
    <Suspense fallback={<HeroFallback formula={formula} />}>
      {mounted ? (
        <ChemistryHero3D
          formula={formula}
          molecule={molecule}
          productTitle={productTitle}
          tuning={tuning}
        />
      ) : (
        <HeroFallback formula={formula} />
      )}
    </Suspense>
  );
};

const HeroFallback = ({ formula }: { formula: string }) => (
  <div
    aria-hidden
    className="relative flex h-[340px] sm:h-[400px] md:h-[440px] w-full items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-primary/5 via-background to-secondary/5"
  >
    <div className="text-center">
      <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-mono">
        <span className="font-semibold text-primary">{formula}</span>
      </div>
      <p className="text-xs text-muted-foreground">Loading interactive molecule…</p>
    </div>
  </div>
);

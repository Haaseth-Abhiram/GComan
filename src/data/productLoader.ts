import {
  Beaker, Droplets, Wrench, Zap, FlaskConical, TestTube,
  Factory, Building2, Wheat, Microscope, Sparkles, FlaskRound,
  Flame, Wind, Wine, Shield, SprayCan,
} from 'lucide-react';

// Map icon name strings (stored in JSON) back to Lucide components
export const ICON_MAP: Record<string, React.ElementType> = {
  Beaker, Droplets, Wrench, Zap, FlaskConical, TestTube,
  Factory, Building2, Wheat, Microscope, Sparkles, FlaskRound,
  Flame, Wind, Wine, Shield, SprayCan,
};

/**
 * Wrap a dynamic import so that stale-chunk failures after a new deploy
 * (very common on this site — JSON product files are emitted as hashed chunks
 * that disappear when a new build replaces them) don't leave the UI stuck on
 * a "Loading…" state. We retry once, then force a single hard reload so the
 * browser fetches the new index.html with the current chunk filenames.
 */
function safeImport<T>(importer: () => Promise<T>): Promise<T> {
  return importer().catch(async (err) => {
    const msg = String(err?.message || err);
    const isChunkError =
      msg.includes('Failed to fetch dynamically imported module') ||
      msg.includes('Importing a module script failed') ||
      msg.includes('error loading dynamically imported module');
    if (!isChunkError) throw err;

    // One retry — sometimes a transient network blip
    try {
      return await importer();
    } catch {
      // Persistent failure → stale build. Reload once per session.
      if (typeof window !== 'undefined') {
        const KEY = '__gc_chunk_reload__';
        if (!sessionStorage.getItem(KEY)) {
          sessionStorage.setItem(KEY, '1');
          window.location.reload();
        }
      }
      throw err;
    }
  });
}

const categoryLoaders: Record<string, () => Promise<any[]>> = {
  'water-treatment':     () => safeImport(() => import('./products/water-treatment.json')).then((m: any) => m.default),
  'lubricants':          () => import('./products/lubricants.json').then(m => m.default),
  'oilfield':            () => import('./products/oilfield.json').then(m => m.default),
  'lab-chemicals':       () => import('./products/lab-chemicals.json').then(m => m.default),
  'lab-equipment':       () => import('./products/lab-equipment.json').then(m => m.default),
  'solvents':            () => import('./products/solvents.json').then(m => m.default),
  'swimming-pool':       () => import('./products/swimming-pool.json').then(m => m.default),
  'inorganic':           () => import('./products/inorganic.json').then(m => m.default),
  'alcohols':            () => import('./products/alcohols.json').then(m => m.default),
  'glycols':             () => import('./products/glycols.json').then(m => m.default),
  'ethanolamines':       () => import('./products/ethanolamines.json').then(m => m.default),
  'food-beverage':       () => import('./products/food-beverage.json').then(m => m.default),
  'construction':        () => import('./products/construction.json').then(m => m.default),
  'soap-detergent':      () => import('./products/soap-detergent.json').then(m => m.default),
  'ro-chemicals':        () => import('./products/ro-chemicals.json').then(m => m.default),
  'cooling-water':       () => import('./products/cooling-water.json').then(m => m.default),
  'corrosion-inhibitor': () => import('./products/corrosion-inhibitor.json').then(m => m.default),
  'tank-cleaners':       () => import('./products/tank-cleaners.json').then(m => m.default),
  'additives':           () => import('./products/additives.json').then(m => m.default),
  'agro':                () => import('./products/agro.json').then(m => m.default),
  'chlorinated':         () => import('./products/chlorinated.json').then(m => m.default),
  'calcium-carbonate':   () => import('./products/calcium-carbonate.json').then(m => m.default),
};

export const ALL_CATEGORIES = Object.keys(categoryLoaders);

/** Attach icon component to a raw product object from JSON */
export function hydrateProduct(p: any) {
  return { ...p, icon: ICON_MAP[p.iconName] || Beaker };
}

/** Load products for a single category (lazy) */
export async function loadProductsByCategory(category: string) {
  const loader = categoryLoaders[category];
  if (!loader) return [];
  const data = await loader();
  return data.map(hydrateProduct);
}

/** Load ALL products (used by search, sitemap, etc.) */
export async function loadAllProducts() {
  const all = await Promise.all(Object.values(categoryLoaders).map(l => l()));
  return all.flat().map(hydrateProduct);
}

/** Synchronous lookup within an already-loaded array */
export function findProduct(allProducts: any[], category: string, id: string) {
  return allProducts.find(p => p.id === id && p.category === category) || null;
}

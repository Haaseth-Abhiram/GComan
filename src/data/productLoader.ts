import {
  Beaker, Droplets, Wrench, Zap, FlaskConical, TestTube,
  Factory, Building2, Wheat, Microscope, Sparkles, FlaskRound,
  Flame, Wind, Wine, Shield, SprayCan,
} from 'lucide-react';
import additives from './products/additives.json';
import agro from './products/agro.json';
import alcohols from './products/alcohols.json';
import calciumCarbonate from './products/calcium-carbonate.json';
import chlorinated from './products/chlorinated.json';
import construction from './products/construction.json';
import coolingWater from './products/cooling-water.json';
import corrosionInhibitor from './products/corrosion-inhibitor.json';
import ethanolamines from './products/ethanolamines.json';
import foodBeverage from './products/food-beverage.json';
import glycols from './products/glycols.json';
import inorganic from './products/inorganic.json';
import labChemicals from './products/lab-chemicals.json';
import labEquipment from './products/lab-equipment.json';
import lubricants from './products/lubricants.json';
import oilfield from './products/oilfield.json';
import roChemicals from './products/ro-chemicals.json';
import soapDetergent from './products/soap-detergent.json';
import solvents from './products/solvents.json';
import swimmingPool from './products/swimming-pool.json';
import tankCleaners from './products/tank-cleaners.json';
import waterTreatment from './products/water-treatment.json';

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
  'lubricants':          () => safeImport(() => import('./products/lubricants.json')).then((m: any) => m.default),
  'oilfield':            () => safeImport(() => import('./products/oilfield.json')).then((m: any) => m.default),
  'lab-chemicals':       () => safeImport(() => import('./products/lab-chemicals.json')).then((m: any) => m.default),
  'lab-equipment':       () => safeImport(() => import('./products/lab-equipment.json')).then((m: any) => m.default),
  'solvents':            () => safeImport(() => import('./products/solvents.json')).then((m: any) => m.default),
  'swimming-pool':       () => safeImport(() => import('./products/swimming-pool.json')).then((m: any) => m.default),
  'inorganic':           () => safeImport(() => import('./products/inorganic.json')).then((m: any) => m.default),
  'alcohols':            () => safeImport(() => import('./products/alcohols.json')).then((m: any) => m.default),
  'glycols':             () => safeImport(() => import('./products/glycols.json')).then((m: any) => m.default),
  'ethanolamines':       () => safeImport(() => import('./products/ethanolamines.json')).then((m: any) => m.default),
  'food-beverage':       () => safeImport(() => import('./products/food-beverage.json')).then((m: any) => m.default),
  'construction':        () => safeImport(() => import('./products/construction.json')).then((m: any) => m.default),
  'soap-detergent':      () => safeImport(() => import('./products/soap-detergent.json')).then((m: any) => m.default),
  'ro-chemicals':        () => safeImport(() => import('./products/ro-chemicals.json')).then((m: any) => m.default),
  'cooling-water':       () => safeImport(() => import('./products/cooling-water.json')).then((m: any) => m.default),
  'corrosion-inhibitor': () => safeImport(() => import('./products/corrosion-inhibitor.json')).then((m: any) => m.default),
  'tank-cleaners':       () => safeImport(() => import('./products/tank-cleaners.json')).then((m: any) => m.default),
  'additives':           () => safeImport(() => import('./products/additives.json')).then((m: any) => m.default),
  'agro':                () => safeImport(() => import('./products/agro.json')).then((m: any) => m.default),
  'chlorinated':         () => safeImport(() => import('./products/chlorinated.json')).then((m: any) => m.default),
  'calcium-carbonate':   () => safeImport(() => import('./products/calcium-carbonate.json')).then((m: any) => m.default),
};

const categoryData: Record<string, any[]> = {
  'water-treatment': waterTreatment,
  'lubricants': lubricants,
  'oilfield': oilfield,
  'lab-chemicals': labChemicals,
  'lab-equipment': labEquipment,
  'solvents': solvents,
  'swimming-pool': swimmingPool,
  'inorganic': inorganic,
  'alcohols': alcohols,
  'glycols': glycols,
  'ethanolamines': ethanolamines,
  'food-beverage': foodBeverage,
  'construction': construction,
  'soap-detergent': soapDetergent,
  'ro-chemicals': roChemicals,
  'cooling-water': coolingWater,
  'corrosion-inhibitor': corrosionInhibitor,
  'tank-cleaners': tankCleaners,
  'additives': additives,
  'agro': agro,
  'chlorinated': chlorinated,
  'calcium-carbonate': calciumCarbonate,
};

export const ALL_CATEGORIES = Object.keys(categoryLoaders);

/** Total products in the catalogue — derived so copy/FAQ counts never go stale. */
export const TOTAL_PRODUCTS = Object.values(categoryData).reduce(
  (n, arr) => n + arr.length,
  0
);

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

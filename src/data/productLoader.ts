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

const categoryLoaders: Record<string, () => Promise<any[]>> = {
  'water-treatment':     () => import('./products/water-treatment.json').then(m => m.default),
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

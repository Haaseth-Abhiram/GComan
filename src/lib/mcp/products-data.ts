// Aggregates all product JSON files into a single flat array for MCP tools.
// Imports are relative because the mcp-js Vite plugin bundles this module into
// a Deno Edge Function at build time (no `@/` alias at runtime).
import additives from "../../data/products/additives.json";
import agro from "../../data/products/agro.json";
import alcohols from "../../data/products/alcohols.json";
import calciumCarbonate from "../../data/products/calcium-carbonate.json";
import chlorinated from "../../data/products/chlorinated.json";
import construction from "../../data/products/construction.json";
import coolingWater from "../../data/products/cooling-water.json";
import corrosionInhibitor from "../../data/products/corrosion-inhibitor.json";
import ethanolamines from "../../data/products/ethanolamines.json";
import foodBeverage from "../../data/products/food-beverage.json";
import glycols from "../../data/products/glycols.json";
import inorganic from "../../data/products/inorganic.json";
import labChemicals from "../../data/products/lab-chemicals.json";
import labEquipment from "../../data/products/lab-equipment.json";
import lubricants from "../../data/products/lubricants.json";
import oilfield from "../../data/products/oilfield.json";
import roChemicals from "../../data/products/ro-chemicals.json";
import soapDetergent from "../../data/products/soap-detergent.json";
import solvents from "../../data/products/solvents.json";
import swimmingPool from "../../data/products/swimming-pool.json";
import tankCleaners from "../../data/products/tank-cleaners.json";
import waterTreatment from "../../data/products/water-treatment.json";

type RawProduct = {
  id: string;
  title: string;
  description?: string;
  category: string;
  iconName?: string;
  details?: Record<string, unknown>;
  [key: string]: unknown;
};

const ALL: RawProduct[] = [
  ...(additives as RawProduct[]),
  ...(agro as RawProduct[]),
  ...(alcohols as RawProduct[]),
  ...(calciumCarbonate as RawProduct[]),
  ...(chlorinated as RawProduct[]),
  ...(construction as RawProduct[]),
  ...(coolingWater as RawProduct[]),
  ...(corrosionInhibitor as RawProduct[]),
  ...(ethanolamines as RawProduct[]),
  ...(foodBeverage as RawProduct[]),
  ...(glycols as RawProduct[]),
  ...(inorganic as RawProduct[]),
  ...(labChemicals as RawProduct[]),
  ...(labEquipment as RawProduct[]),
  ...(lubricants as RawProduct[]),
  ...(oilfield as RawProduct[]),
  ...(roChemicals as RawProduct[]),
  ...(soapDetergent as RawProduct[]),
  ...(solvents as RawProduct[]),
  ...(swimmingPool as RawProduct[]),
  ...(tankCleaners as RawProduct[]),
  ...(waterTreatment as RawProduct[]),
];

export function allProducts() {
  return ALL;
}

export function productUrl(p: RawProduct) {
  return `https://gcoman.com/products/${p.category}/${p.id}`;
}

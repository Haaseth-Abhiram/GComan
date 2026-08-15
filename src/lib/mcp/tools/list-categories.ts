import { defineTool } from "@lovable.dev/mcp-js";

// Full list of chemical product categories offered on gcoman.com.
// Kept inline so the tool has no filesystem or network dependency.
const CATEGORIES: Array<{ id: string; name: string }> = [
  { id: "oilfield", name: "Oilfield & Refinery" },
  { id: "water-treatment", name: "Water Treatment Chemicals" },
  { id: "lubricants", name: "Lubricants & Greases" },
  { id: "corrosion-inhibitor", name: "Corrosion Inhibitor" },
  { id: "tank-cleaners", name: "Tank Cleaners" },
  { id: "ro-chemicals", name: "RO Chemicals" },
  { id: "cooling-water", name: "Cooling Water Chemicals" },
  { id: "swimming-pool", name: "Swimming Pool Chemicals" },
  { id: "construction", name: "Construction" },
  { id: "food-beverage", name: "Food & Beverage" },
  { id: "soap-detergent", name: "Soap & Detergent" },
  { id: "calcium-carbonate", name: "Calcium Carbonate" },
  { id: "additives", name: "Additives" },
  { id: "lab-equipment", name: "Lab Equipment" },
  { id: "lab-chemicals", name: "Lab Chemicals" },
  { id: "agro", name: "Agro Products" },
  { id: "solvents", name: "Solvents" },
  { id: "inorganic", name: "Inorganic Chemicals" },
  { id: "chlorinated", name: "Chlorinated Solvents" },
  { id: "ethanolamines", name: "Ethanolamines" },
  { id: "glycols", name: "Glycols" },
  { id: "alcohols", name: "Alcohols" },
];

export default defineTool({
  name: "list_categories",
  title: "List product categories",
  description:
    "List every chemical product category Global Chemicals LLC (gcoman.com) supplies. Returns category ids (URL slugs) and human-readable names.",
  inputSchema: {},
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: () => ({
    content: [{ type: "text", text: JSON.stringify(CATEGORIES, null, 2) }],
    structuredContent: { categories: CATEGORIES },
  }),
});

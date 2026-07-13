import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { allProducts, productUrl } from "../products-data";

export default defineTool({
  name: "get_product",
  title: "Get product details",
  description:
    "Fetch the full details for a single product by its category slug and product slug (as used in the gcoman.com URL /products/<category>/<slug>). Returns title, description, CAS number, applications, and other structured product data.",
  inputSchema: {
    category: z.string().trim().min(1).describe("Category slug, e.g. 'water-treatment'."),
    slug: z.string().trim().min(1).describe("Product slug, e.g. 'caustic-soda-flakes'."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ category, slug }) => {
    const product = allProducts().find((p) => p.category === category && p.id === slug);
    if (!product) {
      return {
        content: [{ type: "text", text: `No product found for ${category}/${slug}.` }],
        isError: true,
      };
    }
    const enriched = { ...product, url: productUrl(product) };
    return {
      content: [{ type: "text", text: JSON.stringify(enriched, null, 2) }],
      structuredContent: { product: enriched },
    };
  },
});

import { defineTool } from "@lovable.dev/mcp-js";
import { z } from "zod";
import { allProducts, productUrl } from "../products-data";

export default defineTool({
  name: "search_products",
  title: "Search products",
  description:
    "Search the Global Chemicals LLC product catalog (200+ industrial chemicals, lubricants, and lab equipment supplied in Oman/GCC) by keyword and optional category. Returns up to `limit` matches with title, category, short description, and canonical URL.",
  inputSchema: {
    query: z.string().trim().min(1).describe("Free-text search string matched against product title, description, and CAS number."),
    category: z
      .string()
      .trim()
      .optional()
      .describe("Optional category id (see list_categories) to narrow the search, e.g. 'water-treatment'."),
    limit: z.number().int().min(1).max(50).default(10).describe("Maximum number of results to return (1-50)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: ({ query, category, limit }) => {
    const q = query.toLowerCase();
    const source = allProducts().filter((p) => (category ? p.category === category : true));
    const matches = source
      .filter((p) => {
        const hay = [
          p.title,
          p.description ?? "",
          JSON.stringify(p.details ?? {}),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(q);
      })
      .slice(0, limit)
      .map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        description: p.description ?? "",
        url: productUrl(p),
      }));

    return {
      content: [
        {
          type: "text",
          text:
            matches.length === 0
              ? `No products matched "${query}"${category ? ` in ${category}` : ""}.`
              : JSON.stringify(matches, null, 2),
        },
      ],
      structuredContent: { count: matches.length, results: matches },
    };
  },
});

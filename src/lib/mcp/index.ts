import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listCategoriesTool from "./tools/list-categories";
import searchProductsTool from "./tools/search-products";
import getProductTool from "./tools/get-product";
import listContactSubmissionsTool from "./tools/list-contact-submissions";
import listDownloadLeadsTool from "./tools/list-download-leads";

// Direct supabase.co project ref (never the .lovable.cloud proxy).
// Vite inlines this literal at build time so it stays import-safe.
const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "gcoman-mcp",
  title: "Global Chemicals LLC (gcoman.com)",
  version: "0.1.0",
  instructions:
    "Tools for Global Chemicals LLC (gcoman.com), a chemical supplier in Oman. Use `list_categories` and `search_products` to discover the public product catalog, and `get_product` to fetch full details for a specific product. Admin-only tools (`list_contact_submissions`, `list_download_leads`) return sales-lead data and require the signed-in user to hold the 'admin' role.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [
    listCategoriesTool,
    searchProductsTool,
    getProductTool,
    listContactSubmissionsTool,
    listDownloadLeadsTool,
  ],
});

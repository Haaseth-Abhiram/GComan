import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_download_leads",
  title: "List recent download leads",
  description:
    "Admin only. Return the most recent PDF/brochure download leads captured on gcoman.com. Requires the signed-in user to have the 'admin' role — RLS returns no rows otherwise.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).default(20).describe("Maximum leads to return (1-100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("download_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      return { content: [{ type: "text", text: error.message }], isError: true };
    }
    const rows = data ?? [];
    return {
      content: [
        {
          type: "text",
          text:
            rows.length === 0
              ? "No download leads visible to you (admin role required)."
              : JSON.stringify(rows, null, 2),
        },
      ],
      structuredContent: { count: rows.length, leads: rows },
    };
  },
});

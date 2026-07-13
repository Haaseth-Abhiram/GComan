import { createClient } from "@supabase/supabase-js";
import { defineTool, type ToolContext } from "@lovable.dev/mcp-js";
import { z } from "zod";

// Admin-only tool: lists recent contact-form submissions for lead review.
// RLS on `contact_submissions` restricts SELECT to admins; the request is
// forwarded with the caller's OAuth bearer so the policy runs as that user.
function supabaseForUser(ctx: ToolContext) {
  return createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_PUBLISHABLE_KEY!, {
    global: { headers: { Authorization: `Bearer ${ctx.getToken()}` } },
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export default defineTool({
  name: "list_contact_submissions",
  title: "List recent contact submissions",
  description:
    "Admin only. Return the most recent contact-form submissions from gcoman.com (name, email, company, message, created_at). Requires the signed-in user to have the 'admin' role — non-admins receive an empty result under RLS.",
  inputSchema: {
    limit: z.number().int().min(1).max(100).default(20).describe("Maximum submissions to return (1-100)."),
  },
  annotations: { readOnlyHint: true, idempotentHint: true, openWorldHint: false },
  handler: async ({ limit }, ctx) => {
    if (!ctx.isAuthenticated()) {
      return { content: [{ type: "text", text: "Not authenticated" }], isError: true };
    }
    const supabase = supabaseForUser(ctx);
    const { data, error } = await supabase
      .from("contact_submissions")
      .select("id,name,email,company,phone,subject,message,created_at,status")
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
              ? "No submissions visible to you (admin role required)."
              : JSON.stringify(rows, null, 2),
        },
      ],
      structuredContent: { count: rows.length, submissions: rows },
    };
  },
});

// Shared Zoho CRM helper: gets a fresh access token using the stored refresh token,
// then creates a Lead in the Leads module. Designed to be fire-and-forget from
// edge functions so DB writes never wait on Zoho.

const ZOHO_ACCOUNTS_URL = "https://accounts.zoho.com";
const ZOHO_API_DOMAIN = "https://www.zohoapis.com";

interface ZohoLeadPayload {
  Last_Name: string;
  First_Name?: string;
  Email?: string;
  Phone?: string;
  Mobile?: string;
  Company: string;
  Lead_Source?: string;
  Description?: string;
  Industry?: string;
  Country?: string;
  City?: string;
  Title?: string;
  // Allow custom fields
  [key: string]: unknown;
}

let cachedAccessToken: { token: string; expiresAt: number } | null = null;

async function getAccessToken(): Promise<string> {
  // Reuse cached token if still valid (with 5 min buffer)
  if (cachedAccessToken && cachedAccessToken.expiresAt > Date.now() + 5 * 60 * 1000) {
    return cachedAccessToken.token;
  }

  const clientId = Deno.env.get("ZOHO_CRM_CLIENT_ID");
  const clientSecret = Deno.env.get("ZOHO_CRM_CLIENT_SECRET");
  const refreshToken = Deno.env.get("ZOHO_CRM_REFRESH_TOKEN");

  if (!clientId || !clientSecret || !refreshToken) {
    throw new Error("Zoho CRM credentials not configured");
  }

  // Zoho's token endpoint requires params in the URL query string, not body
  const params = new URLSearchParams({
    refresh_token: refreshToken,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "refresh_token",
  });

  const response = await fetch(`${ZOHO_ACCOUNTS_URL}/oauth/v2/token?${params.toString()}`, {
    method: "POST",
    headers: { "Accept": "application/json" },
  });

  const responseText = await response.text();
  let data: any;
  try {
    data = JSON.parse(responseText);
  } catch {
    throw new Error(`Zoho token refresh returned non-JSON (status ${response.status}): ${responseText.slice(0, 200)}`);
  }

  if (!response.ok || !data.access_token) {
    throw new Error(`Zoho token refresh failed: ${JSON.stringify(data)}`);
  }

  cachedAccessToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in ?? 3600) * 1000,
  };

  return cachedAccessToken.token;
}

export async function createZohoLead(
  lead: ZohoLeadPayload
): Promise<{ success: boolean; leadId?: string; error?: string }> {
  try {
    const accessToken = await getAccessToken();

    const response = await fetch(`${ZOHO_API_DOMAIN}/crm/v5/Leads`, {
      method: "POST",
      headers: {
        Authorization: `Zoho-oauthtoken ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [lead],
        trigger: ["approval", "workflow", "blueprint"],
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error("Zoho CRM error response:", JSON.stringify(result));
      return { success: false, error: JSON.stringify(result) };
    }

    const record = result?.data?.[0];
    if (record?.status === "success") {
      console.log("Zoho lead created:", record.details?.id);
      return { success: true, leadId: record.details?.id };
    }

    console.error("Zoho CRM unexpected response:", JSON.stringify(result));
    return { success: false, error: JSON.stringify(record) };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown Zoho error";
    console.error("Zoho lead creation failed:", message);
    return { success: false, error: message };
  }
}

// Helper to split a full name into First/Last for Zoho
export function splitName(fullName: string): { first?: string; last: string } {
  const parts = fullName.trim().split(/\s+/);
  if (parts.length === 1) return { last: parts[0] };
  return { first: parts.slice(0, -1).join(" "), last: parts[parts.length - 1] };
}

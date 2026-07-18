import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Helmet } from "react-helmet-async";
import logo from "@/assets/global-chemicals-logo.svg";

// Beta helpers on supabase.auth.oauth — narrow typed wrapper so TS is happy.
type OAuthDetails = {
  client?: { name?: string; redirect_uri?: string; redirect_uris?: string[] };
  scope?: string;
  redirect_url?: string;
  redirect_to?: string;
};
type OAuthResult = { data: OAuthDetails | null; error: { message: string } | null };
const oauth = () =>
  (supabase.auth as unknown as {
    oauth: {
      getAuthorizationDetails: (id: string) => Promise<OAuthResult>;
      approveAuthorization: (id: string) => Promise<OAuthResult>;
      denyAuthorization: (id: string) => Promise<OAuthResult>;
    };
  }).oauth;

export default function OAuthConsent() {
  const [params] = useSearchParams();
  const authorizationId = params.get("authorization_id") ?? "";
  const [details, setDetails] = useState<OAuthDetails | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    (async () => {
      if (!authorizationId) {
        setError("Missing authorization_id in URL.");
        return;
      }
      const { data: sess } = await supabase.auth.getSession();
      if (!sess.session) {
        // Preserve the full consent URL so /login returns the user here.
        const next = window.location.pathname + window.location.search;
        window.location.href = "/login?next=" + encodeURIComponent(next);
        return;
      }
      setUserEmail(sess.session.user?.email ?? null);

      const { data, error: err } = await oauth().getAuthorizationDetails(authorizationId);
      if (!active) return;
      if (err) {
        setError(err.message);
        return;
      }
      const immediate = data?.redirect_url ?? data?.redirect_to;
      if (immediate && !data?.client) {
        window.location.href = immediate;
        return;
      }
      setDetails(data);
    })();
    return () => {
      active = false;
    };
  }, [authorizationId]);

  async function decide(approve: boolean) {
    setBusy(true);
    setError(null);
    const { data, error: err } = approve
      ? await oauth().approveAuthorization(authorizationId)
      : await oauth().denyAuthorization(authorizationId);
    if (err) {
      setBusy(false);
      setError(err.message);
      return;
    }
    const target = data?.redirect_url ?? data?.redirect_to;
    if (!target) {
      setBusy(false);
      setError("No redirect URL returned by the authorization server.");
      return;
    }
    window.location.href = target;
  }

  const clientName = details?.client?.name ?? "an external app";
  const scopeList = (details?.scope ?? "").split(/\s+/).filter(Boolean);

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-background flex items-center justify-center p-4">
      <Helmet defer={false}>
        <title>Authorize connection | Global Chemicals LLC</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <Card className="w-full max-w-md logo-gradient-border shadow-xl">
        <CardHeader className="space-y-3 text-center">
          <img src={logo} alt="Global Chemicals LLC" className="h-12 w-auto mx-auto" />
          <CardTitle className="text-2xl">
            Connect {clientName} to Global Chemicals LLC
          </CardTitle>
          <CardDescription>
            {userEmail ? `Signed in as ${userEmail}.` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && (
            <div className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
              {error}
            </div>
          )}
          {!details && !error && (
            <p className="text-center text-sm text-muted-foreground">Loading request…</p>
          )}
          {details && (
            <>
              <p className="text-sm text-muted-foreground">
                This lets <span className="font-medium text-foreground">{clientName}</span> call
                this app's tools while you are signed in. It does not bypass this app's permissions
                or backend policies — admin-only tools still require your admin role.
              </p>
              {scopeList.length > 0 && (
                <div className="rounded-md bg-muted/50 p-3 text-xs">
                  <div className="font-medium mb-1">Requested permissions</div>
                  <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                    {scopeList.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
              )}
              <div className="flex flex-col gap-2">
                <Button size="lg" disabled={busy} onClick={() => decide(true)}>
                  {busy ? "Working…" : "Approve"}
                </Button>
                <Button size="lg" variant="outline" disabled={busy} onClick={() => decide(false)}>
                  Cancel connection
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

#!/usr/bin/env node
// One-time helper: swap a Zoho OAuth grant code for a refresh token.
//
// Prereq: in https://api-console.zoho.com/, open your Server-based app and
// note the Client ID, Client Secret, and Authorized Redirect URI. Visit:
//
//   https://accounts.zoho.com/oauth/v2/auth?
//     scope=ZohoCRM.modules.leads.ALL,ZohoCRM.modules.ALL
//     &client_id=<CLIENT_ID>
//     &response_type=code
//     &access_type=offline
//     &prompt=consent
//     &redirect_uri=<REDIRECT_URI>
//
// approve, copy the `code` query param from the redirect URL, then:
//
//   export ZOHO_CLIENT_ID=...
//   export ZOHO_CLIENT_SECRET=...
//   export ZOHO_REDIRECT_URI=...
//   node scripts/zoho-refresh-token.mjs
//
// Output: the refresh_token. Paste into Supabase secrets as
// ZOHO_CRM_REFRESH_TOKEN. Refresh tokens don't expire unless revoked.

import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ACCOUNTS_HOST = 'https://accounts.zoho.com'; // US data center

const rl = createInterface({ input, output });
const ask = async (label, fallback) => {
  if (fallback) return fallback;
  return (await rl.question(`${label}: `)).trim();
};

const clientId = await ask('Client ID', process.env.ZOHO_CLIENT_ID);
const clientSecret = await ask('Client Secret', process.env.ZOHO_CLIENT_SECRET);
const redirectUri = await ask('Redirect URI', process.env.ZOHO_REDIRECT_URI);
const rawGrant = (await rl.question('Grant Code (paste the code value, OR the full redirect URL): ')).trim();
rl.close();

// Accept either the bare code or a pasted redirect URL — extract code= if present.
const codeMatch = rawGrant.match(/[?&]code=([^&\s]+)/);
const grantCode = codeMatch ? decodeURIComponent(codeMatch[1]) : rawGrant;

if (!clientId || !clientSecret || !redirectUri || !grantCode) {
  console.error('\nError: client id, client secret, redirect uri, and grant code are all required.');
  process.exit(1);
}

if (clientSecret.startsWith('<') && clientSecret.endsWith('>')) {
  console.error(`\nError: ZOHO_CLIENT_SECRET still looks like a placeholder (${clientSecret}).`);
  console.error('Set the real secret value from https://api-console.zoho.com/ before running.');
  process.exit(1);
}

const body = new URLSearchParams({
  grant_type: 'authorization_code',
  client_id: clientId,
  client_secret: clientSecret,
  redirect_uri: redirectUri,
  code: grantCode,
});

const res = await fetch(`${ACCOUNTS_HOST}/oauth/v2/token`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body,
});

const responseText = await res.text();
let json;
try {
  json = JSON.parse(responseText);
} catch {
  console.error(`\nFailed. Zoho returned HTTP ${res.status} with non-JSON body.`);
  console.error('First 300 chars of response:');
  console.error(responseText.slice(0, 300));
  console.error('\nThis usually means the request hit an HTML login/error page instead of the API.');
  console.error('Common causes:');
  console.error('  - Client secret is wrong or still a placeholder');
  console.error('  - Grant code is malformed (paste only the value of code=, not the full URL)');
  console.error('  - Wrong data center (this script targets accounts.zoho.com — try .in or .eu)');
  process.exit(1);
}

if (!res.ok || !json.refresh_token) {
  console.error('\nFailed. Zoho response:');
  console.error(JSON.stringify(json, null, 2));
  console.error('\nCommon causes:');
  console.error('  - Grant code expired (re-generate; valid ~10 min only, single-use)');
  console.error('  - redirect_uri does not match the one registered on the OAuth client');
  console.error('  - Wrong data center (this script targets accounts.zoho.com)');
  console.error('  - Client secret was rotated after the grant code was generated');
  process.exit(1);
}

console.log('\n=== SUCCESS ===');
console.log('Refresh token:');
console.log(json.refresh_token);
console.log('\nNext step: paste this into Supabase Edge Function secrets as');
console.log('  ZOHO_CRM_REFRESH_TOKEN');
console.log('along with ZOHO_CRM_CLIENT_ID and ZOHO_CRM_CLIENT_SECRET.');

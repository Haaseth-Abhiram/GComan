#!/usr/bin/env node
// One-time helper: swap a Zoho OAuth grant code for a refresh token.
//
// Prereq: in https://api-console.zoho.com/, open your Self Client app,
// click "Generate Code" with scope:
//   ZohoCRM.modules.leads.CREATE,ZohoCRM.modules.leads.READ
// and a 10-minute duration. Copy the grant code, then run:
//
//   node scripts/zoho-refresh-token.mjs
//
// You'll be prompted for client id, client secret, and the grant code.
// Output: the refresh_token. Paste it into Supabase secrets as
// ZOHO_CRM_REFRESH_TOKEN. Refresh tokens don't expire unless revoked.

import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const ACCOUNTS_HOST = 'https://accounts.zoho.com'; // US data center

const rl = createInterface({ input, output });
const prompt = (q) => rl.question(q);

const clientId = (await prompt('Client ID: ')).trim();
const clientSecret = (await prompt('Client Secret: ')).trim();
const grantCode = (await prompt('Grant Code (from API Console "Generate Code"): ')).trim();
rl.close();

if (!clientId || !clientSecret || !grantCode) {
  console.error('\nError: all three values are required.');
  process.exit(1);
}

const body = new URLSearchParams({
  grant_type: 'authorization_code',
  client_id: clientId,
  client_secret: clientSecret,
  code: grantCode,
});

const res = await fetch(`${ACCOUNTS_HOST}/oauth/v2/token`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  body,
});

const json = await res.json();

if (!res.ok || !json.refresh_token) {
  console.error('\nFailed. Zoho response:');
  console.error(JSON.stringify(json, null, 2));
  console.error('\nCommon causes:');
  console.error('  - Grant code expired (re-generate; valid for 10 min only)');
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

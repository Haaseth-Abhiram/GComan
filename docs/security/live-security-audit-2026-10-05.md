# Live security audit — gcoman.com, 2026-10-05

Black-box assessment against **production** (`psr2.fd03b655`), plus source verification where a live probe was ambiguous. Every result below was produced by an actual request, not inferred from code.

**Headline: the things that would actually leak customer data are all correctly locked down.** The real findings are one broken admin feature and a set of platform-imposed header gaps.

---

## 1. Data exposure — clean

This is the category that matters most for a Supabase app, and it passes.

| Test | Result |
|---|---|
| Anonymous `SELECT` on `contact_submissions`, `job_applications`, `download_leads`, `newsletter_subscribers`, `user_roles`, `profiles`, `site_analytics_snapshots`, `ar_index_status` | **0 rows on every table** ✅ |
| Anonymous `INSERT` on the three lead tables | **Blocked — Postgres `42501`, RLS policy violation** ✅ |
| `service_role` key in the client bundle | **Absent.** The only JWT shipped decodes to `"role":"anon"`, which is correct ✅ |
| Storage bucket enumeration | `[]` — no buckets listable ✅ |
| `resumes` / `job-applications` / `documents` / `public` object listing | **0 items each** ✅ |
| `resumes` public-object fetch | `"Bucket not found"` — the bucket is **private** ✅ |

Row-level security is doing its job in both directions: nobody can read lead data, and nobody can write to those tables directly. The only write path is through the edge functions, which apply validation, Turnstile and rate limiting.

**This means job applicants' resumes and every customer enquiry are not reachable without authentication.** That was the single highest-stakes question and the answer is good.

---

## 2. Authorization — clean, with one broken function

| Endpoint | Anonymous call | Verdict |
|---|---|---|
| `search-console` | `401 Unauthorized` | ✅ |
| `refresh-analytics` | `401 Unauthorized` | ✅ |
| `check-ar-indexing` | `401 Unauthorized` | ✅ |
| **`resync-zoho-leads`** | **`404 NOT_FOUND`** | ⚠️ **see below** |
| `submit-contact` | `400` + field validation errors | ✅ |
| `subscribe-newsletter` | `400` "valid email address" | ✅ |
| `notify-download` | `400` "Invalid email address" | ✅ |

### ⚠️ FINDING 1 — `resync-zoho-leads` is not deployed (functional, not a vulnerability)

The function **exists in the repo** and the admin UI **calls it** (`ContactSubmissionsTable.tsx`), but production returns `{"code":"NOT_FOUND","message":"Requested function was not found"}`.

So the admin dashboard's **"Check CRM sync" / "Push N to Zoho"** button cannot work. That control exists specifically to backfill contact submissions whose Zoho push failed — meaning the recovery path for lost leads is itself broken.

This is the exact failure mode `CLAUDE.md` warns about: **edge functions do not deploy on a Lovable Publish.** A newly added function never appears. Nothing we published today changed this; it has been broken since the function was written.

**Fix:** deploy it with the Supabase CLI (`supabase functions deploy resync-zoho-leads`) or have it deployed from the Lovable side. There are no standalone Supabase credentials in this project, so this needs you or Lovable support.

---

## 3. Transport and headers

| Control | Status |
|---|---|
| TLS version | **TLS 1.3**, AEAD-CHACHA20-POLY1305 ✅ |
| HTTP → HTTPS | `301` to `https://gcoman.com/` ✅ |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains` ✅ |
| `X-Content-Type-Options` | `nosniff` ✅ |
| `Referrer-Policy` | `strict-origin-when-cross-origin` ✅ |
| `Content-Security-Policy` | ❌ missing |
| `X-Frame-Options` | ❌ missing |
| `Permissions-Policy` | ❌ missing |
| `Cross-Origin-Opener-Policy` | ❌ missing |

### FINDING 2 — three headers are missing, and the fix is already written but cannot be deployed

`public/_headers` and `public/.htaccess` **already contain** the correct directives:

```
X-Frame-Options: SAMEORIGIN
Permissions-Policy: camera=(), microphone=(), geolocation=()
Content-Security-Policy: default-src 'self'; script-src 'self' …
```

They are inert because **Lovable's CDN ignores both files** — a documented platform limitation, not an oversight.

**Practical impact — clickjacking.** With no `X-Frame-Options` and no CSP `frame-ancestors`, the site can be embedded in a hostile iframe. The realistic target is the `/admin` login. Severity is **low-to-moderate**: it needs a victim admin to visit an attacker's page while signed in.

**Why I did not patch it in code:** `frame-ancestors` is explicitly **ignored** when delivered via `<meta http-equiv>`, so a meta-tag CSP cannot fix clickjacking. There is no in-app workaround on this host. The genuine fixes are (a) move to a host that serves custom headers — the config is already written and waiting — or (b) put Cloudflare in front and set them as transform rules.

---

## 4. Attack surface

| Check | Result |
|---|---|
| CORS on `submit-contact` | Restricted to `https://www.gcoman.com` — arbitrary origins rejected ✅ |
| Source maps in production | `404` ✅ |
| `/.env` | `403` ✅ |
| `/.git/config` | `403` ✅ |
| `x-powered-by` | absent ✅ |
| `/admin` prerendered into `dist/` | no ✅ |
| `/admin`, `/dev/` in sitemap | 0 occurrences ✅ |
| `robots.txt` | disallows `/admin`, `/dev/` ✅ |

---

## 5. Dependencies — 16 production advisories, 1 worth a second look, 0 exploitable

| Package | Advisory | Real exposure |
|---|---|---|
| `braces`, `micromatch`, `chokidar`, `fast-glob`, `tailwindcss`, `brace-expansion`, `fast-uri` | ReDoS / stack-exhaustion via crafted glob or URI | **Build-time only.** Not reachable by a site visitor — these run on the build machine, never in a browser. |
| **`xlsx` 0.18.5** | Prototype pollution in SheetJS (CVSS 7.8) | **Not exploitable here.** Verified in `src/lib/exportToExcel.ts`: the app only **writes** (`json_to_sheet`, `writeFile`) and never parses an untrusted workbook. The CVE requires reading a malicious file. |
| `pdfjs-dist` ^6.3.289 | **no advisory** | This is the one that *does* parse untrusted input (resume previews), and it is clean ✅ |

Lovable's "66 packages • 45 known issues" counts dev dependencies too. The honest production number is **16, none reachable by an attacker**.

**Recommendation: do not run `npm audit fix` during the watch window.** Every production advisory is either build-time or unexploitable, so an upgrade buys no security while risking a dependency regression on a site that just shipped. Revisit after 27 Oct — `xlsx` is the only one worth real attention, and the correct fix is migrating to the SheetJS CDN distribution since the npm package is no longer maintained.

---

## 6. Authentication

### FINDING 3 — leaked-password protection is off (Lovable's flagged finding)

> *"Your app does not check new or changed passwords against known leaks, so people can pick passwords that attackers already have on their lists."*

A **Supabase Auth configuration toggle**, not code. Blast radius is small — there is no public signup, so it only affects internal admin accounts — but admin accounts are exactly the ones worth protecting, and it is a one-click fix.

**Fix:** Supabase → Authentication → Policies → enable leaked-password protection (HaveIBeenPwned).

### FINDING 4 — Lovable's deep security scan never completed

The panel reads *"We couldn't finish the security scan."* The quick scan runs on every publish, but the deep scan — the one that reviews app logic, permissions and data — has **not successfully run**. There may be findings nobody has seen. Worth clicking "Run again" (12–15 min, free).

---

## 7. Summary

| # | Finding | Severity | Owner |
|---|---|---|---|
| 1 | `resync-zoho-leads` not deployed — CRM backfill button dead | **Medium** (functional) | needs Supabase CLI / Lovable |
| 2 | `CSP`, `X-Frame-Options`, `Permissions-Policy` missing → clickjacking | Low–Moderate | platform limitation; config already written |
| 3 | Leaked-password protection disabled | Low | one toggle in Supabase |
| 4 | Deep security scan incomplete | Unknown | re-run in Lovable |
| — | Dependencies | Informational | defer past 27 Oct |

**Nothing found exposes customer or applicant data.** RLS, storage privacy, function authorization, TLS, CORS and secret handling all passed. The two items genuinely worth acting on are a broken admin function and a header set the host will not serve.

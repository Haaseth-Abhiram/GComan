#!/usr/bin/env node
const urls = [
  "https://gcoman.com/products/glycols",
  "https://gcoman.com/products/water-treatment/caustic-soda-flakes",
  "https://gcoman.com/products/water-treatment/citric-acid-anhydrous",
];

let failed = false;

for (const url of urls) {
  const response = await fetch(url, { redirect: "manual" });
  const html = await response.text();
  const title = html.match(/<title[^>]*>(.*?)<\/title>/is)?.[1]?.trim() || "NO_TITLE";
  const canonicalTag = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i)?.[0] || "";
  const canonical = canonicalTag.match(/href=["']([^"']+)["']/i)?.[1] || "NO_CANONICAL";
  const worker = response.headers.get("x-gcoman-worker") || "NO_WORKER_HEADER";
  const expectedCanonical = url;
  const ok = response.status === 200 && canonical === expectedCanonical && worker === "prerender-rewrite";

  console.log(`${ok ? "✅" : "❌"} ${url}`);
  console.log(`   status: ${response.status}`);
  console.log(`   worker: ${worker}`);
  console.log(`   title: ${title}`);
  console.log(`   canonical: ${canonical}`);

  if (!ok) failed = true;
}

if (failed) {
  console.error("\nSEO routing is still blocked: clean product URLs are not serving prerendered HTML.");
  process.exit(1);
}

console.log("\nSEO routing is healthy: clean product URLs serve prerendered HTML with self canonicals.");
# SiteRoast Secure Baseline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task-by-task. Subagents are disabled for this workspace. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Preserve the working audit-to-report flow while adding a no-dependency test gate, blocking non-public outbound scan targets, fixing fresh-clone setup, and clearing compatible dependency vulnerabilities.

**Architecture:** Keep the current single Next.js repository. One shared target validator classifies hostnames and resolved IPs; one guarded fetch helper validates every redirect; Playwright validates each HTTP(S) request before continuing. Existing API, worker, scoring, and database contracts stay unchanged.

**Tech Stack:** Node.js 22+, TypeScript, Node test runner through `tsx`, Next.js 15, Playwright, native `fetch`, npm lockfile.

**Repository:** `E:\MData\projecten\Siteroast`

**Git constraint:** Do not commit. Daniel's workspace and repository rules override generic commit steps.

---

### Task 1: Add test gate and complete public-address classification

**Files:**
- Modify: `package.json`
- Create: `tests/security/validate-scan-target.test.ts`
- Modify: `lib/audit/security/validate-scan-target.ts`

- [ ] **Step 1: Add test command without adding a dependency**

Add this script beside existing scripts in `package.json`:

```json
"test": "tsx --test tests/**/*.test.ts"
```

- [ ] **Step 2: Write failing address-boundary tests**

Create `tests/security/validate-scan-target.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";

import { validateScanTarget } from "@/lib/audit/security/validate-scan-target";

const blocked = [
  "http://0.0.0.1",
  "http://10.0.0.1",
  "http://100.64.0.1",
  "http://127.0.0.1",
  "http://169.254.169.254",
  "http://172.16.0.1",
  "http://192.0.2.1",
  "http://192.168.0.1",
  "http://198.18.0.1",
  "http://198.51.100.1",
  "http://203.0.113.1",
  "http://224.0.0.1",
  "http://[::1]",
  "http://[fc00::1]",
  "http://[fe80::1]",
  "http://[ff02::1]",
  "http://[2001:db8::1]",
  "http://[::ffff:127.0.0.1]"
];

for (const url of blocked) {
  test(`rejects non-public target ${url}`, async () => {
    await assert.rejects(validateScanTarget(url), /private|non-public/i);
  });
}

test("accepts a public IPv4 literal", async () => {
  const target = await validateScanTarget("https://8.8.8.8");
  assert.equal(target.hostname, "8.8.8.8");
});

test("accepts a bracketed public IPv6 literal", async () => {
  const target = await validateScanTarget("https://[2606:4700:4700::1111]");
  assert.equal(target.hostname, "[2606:4700:4700::1111]");
});
```

- [ ] **Step 3: Run focused test and confirm correct red state**

Run:

```powershell
npx tsx --test tests/security/validate-scan-target.test.ts
```

Expected: failures for reserved ranges currently accepted and bracketed IPv6 currently sent to DNS with brackets. Failures must name target validation, not a TypeScript import or syntax error.

- [ ] **Step 4: Implement minimum complete classifier**

Replace `lib/audit/security/validate-scan-target.ts` with:

```ts
import { lookup } from "node:dns/promises";
import { isIP } from "node:net";

import { normalizeScanUrl, type NormalizedScanUrl } from "@/lib/audit/url-normalize";

const blockedHostnames = new Set(["localhost", "0.0.0.0"]);

export async function validateScanTarget(input: string): Promise<NormalizedScanUrl> {
  const normalized = normalizeScanUrl(input);
  const hostname = withoutIpv6Brackets(normalized.hostname.toLowerCase());

  if (blockedHostnames.has(hostname) || hostname.endsWith(".localhost")) {
    throw new Error("Localhost and private network targets cannot be scanned.");
  }

  if (isBlockedIp(hostname)) {
    throw new Error("Private or non-public IP targets cannot be scanned.");
  }

  try {
    const addresses = isIP(hostname)
      ? [{ address: hostname }]
      : await lookup(hostname, { all: true, verbatim: true });
    if (addresses.some((item) => isBlockedIp(item.address))) {
      throw new Error("Target resolves to a private or non-public network address.");
    }
  } catch (error) {
    if (error instanceof Error && /private|non-public/i.test(error.message)) throw error;
    throw new Error("Could not resolve this website. Check the URL and try again.");
  }

  return normalized;
}

export function createScanTargetGuard() {
  const checks = new Map<string, Promise<NormalizedScanUrl>>();
  return (input: string) => {
    const normalized = normalizeScanUrl(input);
    const key = normalized.hostname.toLowerCase();
    const existing = checks.get(key);
    if (existing) return existing;
    const check = validateScanTarget(input).catch((error) => {
      checks.delete(key);
      throw error;
    });
    checks.set(key, check);
    return check;
  };
}

function withoutIpv6Brackets(value: string) {
  return value.startsWith("[") && value.endsWith("]") ? value.slice(1, -1) : value;
}

function isBlockedIp(value: string) {
  const address = withoutIpv6Brackets(value).split("%")[0].toLowerCase();
  const version = isIP(address);
  if (version === 0) return false;
  if (version === 4) return isBlockedIpv4(address);

  const mappedIpv4 = ipv4FromMappedIpv6(address);
  if (mappedIpv4) return isBlockedIpv4(mappedIpv4);

  return (
    address === "::" ||
    address === "::1" ||
    /^f[cd]/.test(address) ||
    /^fe[89ab]/.test(address) ||
    address.startsWith("ff") ||
    address.startsWith("100::") ||
    address.startsWith("2001:db8:")
  );
}

function isBlockedIpv4(value: string) {
  const [a, b, c] = value.split(".").map(Number);
  return (
    a === 0 ||
    a === 10 ||
    (a === 100 && b >= 64 && b <= 127) ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 0 && c === 0) ||
    (a === 192 && b === 0 && c === 2) ||
    (a === 192 && b === 88 && c === 99) ||
    (a === 192 && b === 168) ||
    (a === 198 && (b === 18 || b === 19)) ||
    (a === 198 && b === 51 && c === 100) ||
    (a === 203 && b === 0 && c === 113) ||
    a >= 224
  );
}

function ipv4FromMappedIpv6(value: string) {
  const match = value.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i);
  if (!match) return null;
  const high = Number.parseInt(match[1], 16);
  const low = Number.parseInt(match[2], 16);
  return `${high >> 8}.${high & 255}.${low >> 8}.${low & 255}`;
}
```

- [ ] **Step 5: Run focused and full tests**

Run:

```powershell
npx tsx --test tests/security/validate-scan-target.test.ts
npm test
```

Expected: all address tests pass; no DNS or syntax errors.

- [ ] **Step 6: Checkpoint**

Run:

```powershell
git diff --check
git status --short
```

Record: address guard done; focused tests verified; redirect and browser request guards remain.

### Task 2: Guard robots, sitemap, and llms.txt redirects

**Files:**
- Create: `tests/security/discovery-fetch.test.ts`
- Create: `lib/audit/security/safe-fetch.ts`
- Modify: `lib/audit/discovery/robots.ts`
- Modify: `lib/audit/discovery/sitemap.ts`
- Modify: `lib/audit/ai-visibility/ai-visibility-scan.ts`

- [ ] **Step 1: Write failing outbound-fetch tests**

Create `tests/security/discovery-fetch.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";

import { fetchRobots } from "@/lib/audit/discovery/robots";
import { discoverSitemapUrls } from "@/lib/audit/discovery/sitemap";

test("robots redirect cannot reach a private target", async () => {
  const originalFetch = globalThis.fetch;
  let privateRequests = 0;

  globalThis.fetch = async (input, init) => {
    const url = String(input);
    if (url === "https://93.184.216.34/robots.txt") {
      if (init?.redirect === "manual") {
        return new Response(null, { status: 302, headers: { location: "http://127.0.0.1/admin" } });
      }
      privateRequests += 1;
      return new Response("User-agent: *", { status: 200 });
    }
    if (url.startsWith("http://127.0.0.1")) privateRequests += 1;
    return new Response("User-agent: *", { status: 200 });
  };

  try {
    const result = await fetchRobots("https://93.184.216.34");
    assert.equal(result.found, false);
    assert.equal(privateRequests, 0);
  } finally {
    globalThis.fetch = originalFetch;
  }
});

test("private sitemap candidates are rejected before fetch", async () => {
  const originalFetch = globalThis.fetch;
  let privateRequests = 0;

  globalThis.fetch = async (input) => {
    const url = String(input);
    if (url.startsWith("http://127.0.0.1")) privateRequests += 1;
    return new Response("", { status: 404 });
  };

  try {
    const result = await discoverSitemapUrls(
      "https://93.184.216.34",
      "93.184.216.34",
      ["http://127.0.0.1/sitemap.xml"]
    );
    assert.equal(privateRequests, 0);
    assert.match(result.errors.join(" "), /private|non-public/i);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
```

- [ ] **Step 2: Run test and verify red state**

Run:

```powershell
npx tsx --test tests/security/discovery-fetch.test.ts
```

Expected: current discovery code invokes mocked fetch for unsafe destinations or treats unguarded redirect as found.

- [ ] **Step 3: Add one guarded fetch helper**

Create `lib/audit/security/safe-fetch.ts`:

```ts
import { validateScanTarget } from "@/lib/audit/security/validate-scan-target";

const redirectStatuses = new Set([301, 302, 303, 307, 308]);

export async function fetchPublicResource(input: string, init: RequestInit = {}, maxRedirects = 5) {
  let url = input;

  for (let redirects = 0; redirects <= maxRedirects; redirects += 1) {
    await validateScanTarget(url);
    const response = await fetch(url, { ...init, redirect: "manual" });
    if (!redirectStatuses.has(response.status)) return response;

    const location = response.headers.get("location");
    await response.body?.cancel().catch(() => undefined);
    if (!location) throw new Error("Redirect response did not include a location.");
    if (redirects === maxRedirects) throw new Error("Too many redirects while fetching scan resource.");
    url = new URL(location, url).toString();
  }

  throw new Error("Too many redirects while fetching scan resource.");
}
```

- [ ] **Step 4: Route target-controlled fetches through helper**

In `lib/audit/discovery/robots.ts`, import `fetchPublicResource` and replace:

```ts
const response = await fetch(robotsUrl, { signal: AbortSignal.timeout(10000) });
```

with:

```ts
const response = await fetchPublicResource(robotsUrl, { signal: AbortSignal.timeout(10000) });
```

In `lib/audit/discovery/sitemap.ts`, replace its target fetch with:

```ts
const response = await fetchPublicResource(url, { signal: AbortSignal.timeout(15000) });
```

In `lib/audit/ai-visibility/ai-visibility-scan.ts`, replace its `llms.txt` fetch with:

```ts
const response = await fetchPublicResource(`${origin}/llms.txt`, { signal: AbortSignal.timeout(8000) });
```

Add the same import in all three files:

```ts
import { fetchPublicResource } from "@/lib/audit/security/safe-fetch";
```

- [ ] **Step 5: Run focused and full tests**

Run:

```powershell
npx tsx --test tests/security/discovery-fetch.test.ts
npm test
```

Expected: private request counters remain zero and all tests pass.

- [ ] **Step 6: Checkpoint**

Run:

```powershell
git diff --check
git status --short
```

Record: target-controlled fetches guarded; browser request guard and fresh-clone cleanup remain.

### Task 3: Validate scanner entry and Playwright network requests

**Files:**
- Create: `tests/security/scan-network-guard.test.ts`
- Modify: `lib/audit/run-audit.ts`
- Modify: `lib/audit/playwright/scan-page.ts`

- [ ] **Step 1: Write failing scan-boundary tests**

Create `tests/security/scan-network-guard.test.ts`:

```ts
import assert from "node:assert/strict";
import test from "node:test";
import type { Browser } from "playwright";

import { scanPageWithPlaywright } from "@/lib/audit/playwright/scan-page";
import { runAuditScan } from "@/lib/audit/run-audit";

test("scan engine rejects a private target before browser launch", async () => {
  await assert.rejects(
    runAuditScan({
      auditId: "security-test",
      url: "http://127.0.0.1:1",
      auditType: "quick_homepage"
    }),
    /private|non-public/i
  );
});

test("Playwright aborts a private request before continuing it", async () => {
  let routeHandler: ((route: FakeRoute) => Promise<void>) | undefined;
  let aborted = false;
  let continued = false;

  type FakeRoute = {
    request: () => { url: () => string };
    abort: (code?: string) => Promise<void>;
    continue: () => Promise<void>;
  };

  const page = {
    addInitScript: async () => undefined,
    route: async (_pattern: string, handler: (route: FakeRoute) => Promise<void>) => {
      routeHandler = handler;
    },
    goto: async () => {
      if (!routeHandler) {
        continued = true;
        throw new Error("unguarded request");
      }
      await routeHandler({
        request: () => ({ url: () => "http://127.0.0.1/admin" }),
        abort: async () => {
          aborted = true;
        },
        continue: async () => {
          continued = true;
        }
      });
      throw new Error("net::ERR_BLOCKED_BY_CLIENT");
    },
    close: async () => undefined
  };
  const browser = { newPage: async () => page } as unknown as Browser;

  await assert.rejects(
    scanPageWithPlaywright("https://93.184.216.34", 0, browser),
    /private|non-public/i
  );
  assert.equal(aborted, true);
  assert.equal(continued, false);
});
```

- [ ] **Step 2: Run test and verify red state**

Run:

```powershell
npx tsx --test tests/security/scan-network-guard.test.ts
```

Expected: private scan reaches discovery/browser path and fake browser reports `unguarded request`; assertions fail for expected missing guards.

- [ ] **Step 3: Validate at scan-engine entry**

In `lib/audit/run-audit.ts`, replace the `normalizeScanUrl` import and first line of `runAuditScan` so imports include:

```ts
import { validateScanTarget } from "@/lib/audit/security/validate-scan-target";
```

and the function begins with:

```ts
const normalized = await validateScanTarget(input.url);
```

Keep other URL helpers imported from `url-normalize.ts`.

- [ ] **Step 4: Guard every Playwright HTTP(S) request**

In `lib/audit/playwright/scan-page.ts`, import:

```ts
import { createScanTargetGuard } from "@/lib/audit/security/validate-scan-target";
```

After page creation, before `page.goto`, add:

```ts
const validateRequest = createScanTargetGuard();
let blockedRequest: Error | null = null;

await page.route("**/*", async (route) => {
  const requestUrl = route.request().url();
  if (!/^https?:/i.test(requestUrl)) {
    await route.continue();
    return;
  }

  try {
    await validateRequest(requestUrl);
    await route.continue();
  } catch (error) {
    blockedRequest ??= new Error(
      `Blocked unsafe scan request ${requestUrl}: ${error instanceof Error ? error.message : "Target validation failed"}`
    );
    await route.abort("blockedbyclient");
  }
});
```

Wrap `page.goto` so blocked validation is surfaced instead of a generic browser error:

```ts
let response;
try {
  response = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
} catch (error) {
  if (blockedRequest) throw blockedRequest;
  throw error;
}
await page.waitForTimeout(1200);
if (blockedRequest) throw blockedRequest;
```

Keep existing extraction, screenshots, axe scan, and cleanup unchanged.

- [ ] **Step 5: Run focused and full tests**

Run:

```powershell
npx tsx --test tests/security/scan-network-guard.test.ts
npm test
```

Expected: scan rejects before browser launch; fake private request is aborted and never continued; all tests pass.

- [ ] **Step 6: Checkpoint**

Run:

```powershell
git diff --check
git status --short
```

Record: scanner entry, target fetches, and browser requests guarded; config/dependency cleanup remains.

### Task 4: Repair fresh-clone setup and compatible dependency health

**Files:**
- Modify: `.env.example`
- Modify: `docs/SCAN_ENGINE.md`
- Modify: `package.json`
- Modify: `package-lock.json`

- [ ] **Step 1: Fix service-role key template**

In `.env.example`, replace:

```dotenv
ZSUPABASE_SERVICE_ROLE_KEY=
```

with:

```dotenv
SUPABASE_SERVICE_ROLE_KEY=
```

- [ ] **Step 2: Document exact fresh-clone setup**

Add this section before `## Run Locally` in `docs/SCAN_ENGINE.md`:

~~~markdown
## Fresh Clone Setup

Use Node.js 22 or newer, then install locked dependencies and the Chromium runtime used by Playwright:

```bash
npm ci
npx playwright install chromium
```

Copy `.env.example` to `.env.local` and fill the required Supabase values before starting the app or worker.
~~~

- [ ] **Step 3: Confirm unused vulnerable package has no callers**

Run:

```powershell
rg -n --glob '!node_modules/**' 'image-size' .
```

Expected: references only in `package.json` and `package-lock.json`.

- [ ] **Step 4: Remove unused direct package and apply compatible lockfile fixes**

Run:

```powershell
npm uninstall image-size
npm audit fix
```

Observed registry result: compatible updates moved Next to 15.5.23 and Lighthouse to 13.4.1, but Next 15 still hard-pinned three high-severity `postcss`/`sharp` findings. The official Next 16 guide and repository `report.md` both support the coherent upgrade path. Run:

```powershell
npm install --save-exact next@16.3.0 eslint-config-next@16.3.0
```

Rename root `middleware.ts` to `proxy.ts`, rename its exported function from `middleware` to `proxy`, and replace the obsolete `FlatCompat` ESLint wrapper with direct flat imports from `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`. Keep Supabase's internal `lib/supabase/middleware.ts` helper unchanged.

- [ ] **Step 5: Verify dependency result before continuing**

Run:

```powershell
npm ls --depth=0
npm audit --audit-level=high
```

Expected: dependency tree valid; zero high or critical vulnerabilities. Any remaining lower-severity finding must be named with package, reachability, and reason it remains.

- [ ] **Step 6: Run full static verification**

Run:

```powershell
npm test
npm run lint
npm run build
```

Expected: tests and build exit 0; lint has zero errors and no warning beyond the pre-existing font-loading warning.

- [ ] **Step 7: Checkpoint**

Run:

```powershell
git diff --check
git status --short
```

Record: setup, environment template, packages, tests, lint, and build verified; live scan remains.

### Task 5: Prove original live scan still works

**Files:**
- Inspect only: `.audit-output/*` (Git-ignored runtime evidence)
- Inspect only: all changed files

- [ ] **Step 1: Run original live scan command**

Run:

```powershell
npm run audit:test-url -- https://example.com
```

Expected: exit 0, scores printed, prioritized issues printed, JSON saved under `.audit-output`.

- [ ] **Step 2: Inspect saved result for required structure**

Run:

```powershell
$siteroastLatestAudit = Get-ChildItem -LiteralPath '.audit-output' -Filter '*.json' | Sort-Object LastWriteTime -Descending | Select-Object -First 1
$siteroastResult = Get-Content -LiteralPath $siteroastLatestAudit.FullName -Raw | ConvertFrom-Json
$siteroastResult | Select-Object auditId,url,finalUrl
$siteroastResult.scores
@($siteroastResult.issues).Count
```

Expected: URL/final URL present, all seven scores present, issue count greater than zero.

- [ ] **Step 3: Run final verification from clean command state**

Run:

```powershell
npm test
npm run lint
npm run build
npm audit --audit-level=high
git diff --check
git status --short --branch
git diff --stat
```

Expected: tests/build/audit/diff checks exit 0; lint contains no errors; Git shows only secure-baseline source, tests, config, docs, and lockfile changes.

- [ ] **Step 4: Review against design**

Confirm:

- test gate uses existing `tsx` and Node test runner;
- API and worker both route through shared target validation;
- private/reserved IPv4, IPv6, mapped IPv6, redirects, sitemap candidates, and Playwright requests are covered;
- database schema and scoring formulas are untouched;
- fresh-clone Chromium step and correct env key are documented;
- compatible dependency fixes do not migrate framework major;
- no commit exists.

- [ ] **Step 5: Final checkpoint for this slice**

Report three facts: what changed, exact commands and results, and deferred next slice (working report actions and issue-status workflow).

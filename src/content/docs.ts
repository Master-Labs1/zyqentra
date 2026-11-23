import {
  DEPOSIT_BONUSES,
  ENDPOINTS,
  ERRORS,
  OBSERVED_401,
  REALMAILPRO,
  SERVICES,
  UNVERIFIED_ITEMS,
} from "./realmailpro";
import { CHANGELOG, SITE } from "./site";

/**
 * Documentation content model. Pages are plain data so the sidebar, search index,
 * table of contents, sitemap and prev/next links are all derived from one place.
 * Edit content here (reviewed through Git) — there is intentionally no runtime CMS.
 */

export type CodeTab = { label: string; lang: string; code: string };
export type Block =
  | { type: "p"; text: string }
  | { type: "h2"; id: string; text: string }
  | { type: "h3"; id: string; text: string }
  | { type: "list"; items: string[]; ordered?: boolean }
  | { type: "code"; tabs: CodeTab[]; title?: string }
  | { type: "callout"; tone: "info" | "warning" | "verify" | "success"; title: string; text: string }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "endpoint"; method: "GET" | "POST"; path: string; cost: string; status: string };

export type DocStatus = "source" | "partial" | "prerelease";

export const DOC_STATUS_LABEL: Record<DocStatus, string> = {
  source: "Based on RealMailPro public docs",
  partial: "Partially verified",
  prerelease: "Pre-release",
};

export type DocPage = {
  slug: string; // "" = overview
  title: string;
  nav: string;
  description: string;
  section: "Start" | "API" | "Guides" | "Reference";
  status: DocStatus;
  indexable: boolean;
  updated: string;
  blocks: Block[];
};

const B = REALMAILPRO.baseUrl;
const KEY = "YOUR_API_KEY";

const curlCreate = `curl -X POST ${B}/inboxes \\
  -H "Authorization: Bearer $REALMAILPRO_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{ "service": "gmail_alias" }'`;

const jsCreate = `const BASE_URL = "${B}";
const apiKey = process.env.REALMAILPRO_API_KEY; // never hard-code keys

const res = await fetch(\`\${BASE_URL}/inboxes\`, {
  method: "POST",
  headers: {
    Authorization: \`Bearer \${apiKey}\`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ service: "gmail_alias" }),
});

if (!res.ok) {
  const { error } = await res.json();
  throw new Error(\`\${res.status} \${error.code}: \${error.message}\`);
}

const inbox = await res.json();
console.log(inbox.address, inbox.expires_at);`;

const pyCreate = `import json, os, urllib.request

BASE_URL = "${B}"
api_key = os.environ["REALMAILPRO_API_KEY"]  # never hard-code keys

req = urllib.request.Request(
    f"{BASE_URL}/inboxes",
    data=json.dumps({"service": "gmail_alias"}).encode(),
    headers={
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    },
    method="POST",
)
with urllib.request.urlopen(req, timeout=30) as res:
    inbox = json.load(res)

print(inbox["address"], inbox["expires_at"])`;

const jsPoll = `async function waitForOtp(inboxId, { timeoutMs = 120_000, intervalMs = 10_000 } = {}) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    const res = await fetch(\`\${BASE_URL}/inboxes/\${encodeURIComponent(inboxId)}/messages\`, {
      headers: { Authorization: \`Bearer \${apiKey}\` },
    });
    if (res.status === 429) {
      await new Promise((r) => setTimeout(r, intervalMs * 2)); // back off
      continue;
    }
    if (!res.ok) throw new Error(\`Poll failed with \${res.status}\`);
    const { data } = await res.json();
    const hit = data.find((m) => m.otp);
    if (hit) return hit.otp;
    await new Promise((r) => setTimeout(r, intervalMs));
  }
  throw new Error("No OTP before timeout");
}`;

const pyPoll = `import time

def wait_for_otp(inbox_id: str, timeout_s: int = 120, interval_s: int = 10) -> str:
    deadline = time.time() + timeout_s
    while time.time() < deadline:
        req = urllib.request.Request(
            f"{BASE_URL}/inboxes/{urllib.parse.quote(inbox_id, safe='')}/messages",
            headers={"Authorization": f"Bearer {api_key}"},
        )
        with urllib.request.urlopen(req, timeout=30) as res:
            body = json.load(res)
        for message in body["data"]:
            if message.get("otp"):
                return message["otp"]
        time.sleep(interval_s)
    raise TimeoutError("No OTP before timeout")`;

const costNote =
  "Each poll costs 3 credits on the published price list, so poll at a sensible interval instead of in a tight loop.";

const endpointBlocks: Block[] = ENDPOINTS.flatMap((e) => {
  const blocks: Block[] = [
    { type: "h2", id: e.id, text: e.summary },
    { type: "endpoint", method: e.method, path: e.path, cost: e.cost, status: "Requires verification" },
    { type: "p", text: e.description },
  ];
  const curl =
    e.method === "POST"
      ? curlCreate
      : `curl ${B}${e.path.replace("{id}", e.path.startsWith("/inboxes") ? "INBOX_ID" : "MESSAGE_ID")} \\\n  -H "Authorization: Bearer $REALMAILPRO_API_KEY"`;
  blocks.push({ type: "code", title: "Request", tabs: [{ label: "cURL", lang: "bash", code: curl }] });
  if (e.responseExample) {
    blocks.push({
      type: "code",
      title: "Published example response",
      tabs: [{ label: "JSON", lang: "json", code: e.responseExample }],
    });
  }
  if (e.responseNote) {
    blocks.push({ type: "callout", tone: "verify", title: "Needs verification", text: e.responseNote });
  }
  return blocks;
});

export const DOCS: DocPage[] = [
  {
    slug: "",
    title: "RealMailPro API documentation",
    nav: "Overview",
    description:
      "Overview of the RealMailPro REST API: temporary Gmail.com and Outlook.com inboxes, OTP reading, credits and authentication.",
    section: "Start",
    status: "source",
    indexable: true,
    updated: "2026-11-23",
    blocks: [
      {
        type: "p",
        text: "The RealMailPro API lets you create temporary Gmail.com and Outlook.com inboxes, receive verification emails and read OTP codes from your own code. It is built for test suites, QA flows and sign-up automation on accounts you own.",
      },
      {
        type: "callout",
        tone: "info",
        title: "About this documentation",
        text: `Zyqentra maintains this portal from RealMailPro's public documentation at [realmailpro.online/docs](${REALMAILPRO.docsUrl}). Where RealMailPro has not published a detail, the page says **needs verification** instead of guessing.`,
      },
      { type: "h2", id: "at-a-glance", text: "At a glance" },
      {
        type: "table",
        head: ["Item", "Value", "Source"],
        rows: [
          ["Base URL", `\`${B}\``, "Published"],
          ["Auth", "`Authorization: Bearer YOUR_KEY` or `X-API-Key`", "Published"],
          ["Format", "JSON over HTTPS", "Observed"],
          ["Inbox lifetime", "10 minutes", "Published"],
          ["Billing", "Prepaid credits, $1 = 1,000 credits", "Published"],
          ["Active keys", "Up to 3", "Published"],
          ["Rate limits", "Per key, per minute — numbers not published", "Needs verification"],
        ],
      },
      { type: "h2", id: "endpoints", text: "Endpoints" },
      {
        type: "table",
        head: ["Method", "Path", "Purpose", "Cost"],
        rows: ENDPOINTS.map((e) => [e.method, `\`${e.path}\``, e.summary, e.cost]),
      },
      { type: "h2", id: "next-steps", text: "Next steps" },
      {
        type: "list",
        items: [
          "[Getting started](/docs/realmailpro/getting-started) — get a key and make your first call.",
          "[Authentication](/docs/realmailpro/authentication) — headers, key handling and rotation.",
          "[API reference](/docs/realmailpro/api-reference) — every endpoint with published examples.",
          "[Errors](/docs/realmailpro/errors) — the error envelope and what each code means.",
        ],
      },
    ],
  },
  {
    slug: "getting-started",
    title: "Getting started",
    nav: "Getting started",
    description:
      "Create a RealMailPro account, add credits, generate an API key and create your first temporary inbox.",
    section: "Start",
    status: "source",
    indexable: true,
    updated: "2026-11-23",
    blocks: [
      { type: "p", text: "From zero to your first OTP in four steps. Docs and pricing are public; managing keys and funds requires a RealMailPro account." },
      { type: "h2", id: "account", text: "1. Create an account" },
      { type: "p", text: `Sign up at [realmailpro.online](${REALMAILPRO.signupUrl}) with email or Google sign-in.` },
      { type: "h2", id: "credits", text: "2. Add credits" },
      {
        type: "p",
        text: `Add at least **$${REALMAILPRO.minDepositUsd}** on the [Developer API page](${REALMAILPRO.developerApiUrl}). API deposits are made in USDT (BEP20) and verified automatically on-chain. Credits never expire. Keys unlock after your first verified deposit and stay unlocked even if your balance reaches zero.`,
      },
      { type: "h2", id: "key", text: "3. Generate an API key" },
      {
        type: "p",
        text: "Create a key in your RealMailPro dashboard. It is shown **once** — store it in a secret manager or an environment variable. You can hold up to 3 active keys.",
      },
      { type: "code", tabs: [{ label: ".env", lang: "bash", code: `# .env — never commit this file\nREALMAILPRO_API_KEY=${KEY}` }] },
      { type: "h2", id: "first-call", text: "4. Create an inbox" },
      {
        type: "code",
        tabs: [
          { label: "cURL", lang: "bash", code: curlCreate },
          { label: "JavaScript", lang: "js", code: jsCreate },
          { label: "Python", lang: "python", code: pyCreate },
        ],
      },
      {
        type: "callout",
        tone: "verify",
        title: "Request body",
        text: "RealMailPro's docs describe a `service` field in the body, but their published cURL example sends no body. Always send `service` explicitly until the default is confirmed.",
      },
      { type: "h2", id: "read-otp", text: "5. Read the OTP" },
      { type: "p", text: "Use the address on the sign-up form you are testing, then poll the inbox." },
      {
        type: "code",
        tabs: [
          { label: "JavaScript", lang: "js", code: jsPoll },
          { label: "Python", lang: "python", code: pyPoll },
        ],
      },
      { type: "callout", tone: "warning", title: "Polling costs credits", text: costNote },
    ],
  },
  {
    slug: "authentication",
    title: "Authentication",
    nav: "Authentication",
    description: "Authenticate RealMailPro API requests with a Bearer API key, and keep keys out of source control.",
    section: "Start",
    status: "source",
    indexable: true,
    updated: "2026-11-23",
    blocks: [
      { type: "p", text: "Every request must carry your API key. RealMailPro accepts it in either of two headers:" },
      {
        type: "code",
        tabs: [
          { label: "Bearer (recommended)", lang: "bash", code: `Authorization: Bearer ${KEY}` },
          { label: "X-API-Key", lang: "bash", code: `X-API-Key: ${KEY}` },
        ],
      },
      { type: "h2", id: "key-format", text: "Key format" },
      {
        type: "p",
        text: "RealMailPro's public examples show keys beginning with `rmp_live_`. Treat the rest of the key as opaque and do not validate its length or characters in your code.",
      },
      { type: "h2", id: "lifecycle", text: "Key lifecycle" },
      {
        type: "list",
        items: [
          "Keys are shown once at creation and stored by RealMailPro only as a hash.",
          "Up to 3 keys can be active at a time. Revoke one to create a replacement.",
          "Revoked or invalid keys return `401 unauthorized`.",
        ],
      },
      { type: "h2", id: "unauthorized", text: "Unauthorized response" },
      { type: "p", text: "Observed from the live API on 2026-11-23 when no key or an invalid key is sent:" },
      { type: "code", tabs: [{ label: "HTTP 401", lang: "json", code: OBSERVED_401 }] },
      { type: "h2", id: "best-practices", text: "Keeping keys safe" },
      {
        type: "list",
        items: [
          "Call the API from a server, CI job or backend function — never from browser or mobile app code.",
          "Read the key from an environment variable such as `REALMAILPRO_API_KEY`.",
          "Add `.env` to `.gitignore`; use your CI provider's secret store.",
          "Use a separate key per environment so you can revoke one without breaking the others.",
          "Rotate a key immediately if it appears in logs, screenshots or a commit.",
        ],
      },
      {
        type: "callout",
        tone: "info",
        title: "CORS",
        text: "The API responds with `access-control-allow-origin: *`. That makes browser calls technically possible, but it would expose your key to anyone who opens the page. Keep calls server-side.",
      },
    ],
  },
  {
    slug: "api-reference",
    title: "API reference",
    nav: "API reference",
    description: "Reference for every RealMailPro v1 endpoint: services, inboxes, messages, balance and usage.",
    section: "API",
    status: "source",
    indexable: true,
    updated: "2026-11-23",
    blocks: [
      { type: "p", text: `All paths are relative to \`${B}\`. Requests and responses are JSON.` },
      {
        type: "callout",
        tone: "verify",
        title: "Endpoint status: requires verification",
        text: "These endpoints are published by RealMailPro. Zyqentra has confirmed the base URL and the 401 error envelope, but has not yet made a successful call with a key. Example responses below are RealMailPro's own, with values elided as `…`.",
      },
      ...endpointBlocks,
    ],
  },
  {
    slug: "request-parameters",
    title: "Request parameters",
    nav: "Request parameters",
    description: "Path and body parameters accepted by the RealMailPro API, including the four service names.",
    section: "API",
    status: "partial",
    indexable: true,
    updated: "2026-11-23",
    blocks: [
      { type: "h2", id: "service", text: "service (body, POST /inboxes)" },
      { type: "p", text: "Selects the kind of inbox to create. Use `GET /services` to check availability and current price." },
      {
        type: "table",
        head: ["Value", "Mailbox", "Credits"],
        rows: SERVICES.map((s) => [`\`${s.id}\``, s.label, String(s.credits)]),
      },
      { type: "h2", id: "path", text: "Path parameters" },
      {
        type: "table",
        head: ["Parameter", "Used in", "Description"],
        rows: [
          ["`id`", "`/inboxes/{id}/messages`", "The inbox `id` returned when you created it."],
          ["`id`", "`/messages/{id}`", "A message `id` from the poll response."],
        ],
      },
      { type: "p", text: "URL-encode IDs before placing them in a path." },
      { type: "h2", id: "unknown", text: "Not published" },
      {
        type: "callout",
        tone: "verify",
        title: "Needs verification",
        text: "ID format, query parameters (pagination, filtering, `since`), and whether `service` has a default are not published by RealMailPro.",
      },
    ],
  },
  {
    slug: "response-formats",
    title: "Response formats",
    nav: "Response formats",
    description: "JSON response shapes returned by the RealMailPro API, with published field names.",
    section: "API",
    status: "partial",
    indexable: true,
    updated: "2026-11-23",
    blocks: [
      { type: "p", text: "Field names below come from RealMailPro's published examples. Types are Zyqentra's reading of those examples." },
      { type: "h2", id: "inbox", text: "Inbox" },
      {
        type: "table",
        head: ["Field", "Type", "Notes"],
        rows: [
          ["`id`", "string", "Inbox identifier"],
          ["`address`", "string", "The email address to use"],
          ["`expires_at`", "string", "Timestamp — format needs verification"],
          ["`created_at`", "string", "Timestamp — format needs verification"],
          ["`active`", "boolean", "Present on the poll response's `inbox` object"],
        ],
      },
      { type: "h2", id: "message-summary", text: "Message summary (poll)" },
      {
        type: "table",
        head: ["Field", "Type", "Notes"],
        rows: [
          ["`id`", "string", "Use with `GET /messages/{id}`"],
          ["`from`", "string", "Sender"],
          ["`subject`", "string", "Subject line"],
          ["`otp`", "string", "Detected code; behaviour when none is detected needs verification"],
          ["`received_at`", "string", "Timestamp"],
        ],
      },
      { type: "h2", id: "message", text: "Message (full)" },
      {
        type: "table",
        head: ["Field", "Type", "Notes"],
        rows: [
          ["`id`, `to`, `from`, `subject`", "string", ""],
          ["`text`", "string", "Plain-text body"],
          ["`html`", "string", "HTML body — sanitize before rendering"],
          ["`otp`", "string", "Detected code"],
        ],
      },
      { type: "h2", id: "balance", text: "Balance" },
      { type: "code", tabs: [{ label: "JSON", lang: "json", code: `{ "balance": 104998, "currency": "credits" }` }] },
      { type: "h2", id: "error-envelope", text: "Error envelope" },
      { type: "code", tabs: [{ label: "JSON", lang: "json", code: `{ "error": { "code": "unauthorized", "message": "Missing or invalid API key." } }` }] },
    ],
  },
  {
    slug: "errors",
    title: "Errors",
    nav: "Errors",
    description: "RealMailPro API error codes, what they mean, and how to handle them safely.",
    section: "API",
    status: "source",
    indexable: true,
    updated: "2026-11-23",
    blocks: [
      { type: "p", text: "Errors use standard HTTP status codes and a JSON envelope with a machine-readable `code` and a human-readable `message`." },
      { type: "code", tabs: [{ label: "Observed 401", lang: "json", code: OBSERVED_401 }] },
      { type: "h2", id: "codes", text: "Error codes" },
      {
        type: "table",
        head: ["Status", "Code", "Meaning", "Charged"],
        rows: ERRORS.map((e) => [String(e.status), `\`${e.code}\``, e.meaning, e.charged]),
      },
      { type: "h2", id: "handling", text: "Handling errors" },
      {
        type: "list",
        items: [
          "`401` — stop and fix the key; retrying will not help.",
          "`402` — top up credits before retrying.",
          "`404` — check the ID belongs to an inbox created by your account and has not expired.",
          "`429` — wait and retry with exponential backoff.",
          "`502` — safe to retry read requests after a short delay; RealMailPro refunds the credits.",
        ],
      },
      {
        type: "callout",
        tone: "warning",
        title: "Do not blindly retry POST /inboxes",
        text: "Creating an inbox is billable and not documented as idempotent. Retry it only when you know the first attempt failed.",
      },
      {
        type: "callout",
        tone: "verify",
        title: "Needs verification",
        text: "Only the 401 body has been observed. Bodies for 402–502 are assumed to use the same envelope.",
      },
    ],
  },
  {
    slug: "rate-limits",
    title: "Rate limits",
    nav: "Rate limits",
    description: "How RealMailPro rate-limits API keys and how to back off when you receive 429.",
    section: "API",
    status: "partial",
    indexable: true,
    updated: "2026-11-23",
    blocks: [
      { type: "p", text: "RealMailPro applies fair per-key limits measured per minute. When you exceed them the API returns `429 rate_limited`." },
      {
        type: "callout",
        tone: "verify",
        title: "Limits not published",
        text: "The number of requests per minute, any rate-limit response headers, and whether `Retry-After` is sent are not published. This page will be updated when RealMailPro confirms them.",
      },
      { type: "h2", id: "backoff", text: "Recommended backoff" },
      {
        type: "code",
        tabs: [
          {
            label: "JavaScript",
            lang: "js",
            code: `async function withBackoff(fn, retries = 3) {
  for (let attempt = 0; ; attempt++) {
    const res = await fn();
    if (res.status !== 429 || attempt >= retries) return res;
    const retryAfter = Number(res.headers.get("retry-after"));
    const waitMs = Number.isFinite(retryAfter) && retryAfter > 0
      ? retryAfter * 1000
      : 2 ** attempt * 1000 + Math.random() * 250;
    await new Promise((r) => setTimeout(r, waitMs));
  }
}`,
          },
        ],
      },
      { type: "h2", id: "website-limit", text: "Website generation limit" },
      { type: "p", text: "The RealMailPro website limits inbox generation to one per 30 seconds. Whether the same limit applies to the API is not published." },
    ],
  },
  {
    slug: "examples",
    title: "Integration examples",
    nav: "Examples",
    description: "End-to-end RealMailPro examples: create an inbox, wait for a verification email and extract the OTP.",
    section: "Guides",
    status: "source",
    indexable: true,
    updated: "2026-11-23",
    blocks: [
      { type: "p", text: "These examples follow RealMailPro's published request and response shapes. Replace the key placeholder with an environment variable." },
      { type: "h2", id: "e2e-signup", text: "End-to-end sign-up test" },
      {
        type: "list",
        ordered: true,
        items: [
          "Create an inbox with `POST /inboxes`.",
          "Submit the `address` in the sign-up form under test.",
          "Poll `GET /inboxes/{id}/messages` every 10 seconds until a message with an `otp` arrives.",
          "Enter the OTP and finish the flow before the inbox expires (10 minutes).",
        ],
      },
      { type: "code", tabs: [{ label: "JavaScript", lang: "js", code: jsCreate }, { label: "Python", lang: "python", code: pyCreate }] },
      { type: "code", title: "Wait for the OTP", tabs: [{ label: "JavaScript", lang: "js", code: jsPoll }, { label: "Python", lang: "python", code: pyPoll }] },
      { type: "h2", id: "balance-check", text: "Check balance before a test run" },
      {
        type: "code",
        tabs: [{ label: "cURL", lang: "bash", code: `curl ${B}/account/balance \\\n  -H "Authorization: Bearer $REALMAILPRO_API_KEY"` }],
      },
      { type: "h2", id: "acceptable-use", text: "Acceptable use" },
      {
        type: "p",
        text: `Use the API only for inboxes and accounts you own or are authorised to test. Spam, abuse and getting around other services' rules are not allowed — see RealMailPro's [terms](${REALMAILPRO.termsUrl}).`,
      },
    ],
  },
  {
    slug: "javascript",
    title: "JavaScript & TypeScript SDK",
    nav: "JavaScript / TypeScript",
    description: "Pre-release TypeScript SDK for the RealMailPro API: typed client, errors, timeouts and safe retries.",
    section: "Guides",
    status: "prerelease",
    indexable: false,
    updated: "2026-11-23",
    blocks: [
      {
        type: "callout",
        tone: "warning",
        title: "Not published to npm",
        text: `The SDK source lives in the \`${SITE.githubRepo}\` repository under \`sdk/javascript\`. It has unit tests against a mocked API but has not been tested against the live API with a key, and is not on npm.`,
      },
      { type: "h2", id: "install", text: "Install from source" },
      { type: "code", tabs: [{ label: "Shell", lang: "bash", code: `cd sdk/javascript\nnpm install\nnpm run build` }] },
      { type: "h2", id: "usage", text: "Usage" },
      {
        type: "code",
        tabs: [
          {
            label: "TypeScript",
            lang: "ts",
            code: `import { RealMailPro, RateLimitError } from "@zyqentra/realmailpro";

const client = new RealMailPro({ apiKey: process.env.REALMAILPRO_API_KEY });

const inbox = await client.inboxes.create({ service: "gmail_alias" });
const { data } = await client.inboxes.messages(inbox.id);
const otp = data.find((m) => m.otp)?.otp;

try {
  console.log(await client.account.balance());
} catch (err) {
  if (err instanceof RateLimitError) {
    // back off and retry later
  }
}`,
          },
        ],
      },
      { type: "h2", id: "features", text: "What is implemented" },
      {
        type: "table",
        head: ["Feature", "Status"],
        rows: [
          ["All six published endpoints", "Implemented (mock-tested)"],
          ["Typed errors per status code", "Implemented"],
          ["Request timeout (default 30 s)", "Implemented"],
          ["Retries for GET on 429/5xx with backoff", "Implemented"],
          ["No automatic retry of POST /inboxes", "By design"],
          ["npm package", "Planned — needs owner approval"],
          ["Typed /services and /account/usage", "Blocked — schema not published"],
        ],
      },
    ],
  },
  {
    slug: "python",
    title: "Python SDK",
    nav: "Python",
    description: "Pre-release Python SDK for the RealMailPro API with type hints, custom exceptions and zero dependencies.",
    section: "Guides",
    status: "prerelease",
    indexable: false,
    updated: "2026-11-23",
    blocks: [
      {
        type: "callout",
        tone: "warning",
        title: "Not published to PyPI",
        text: `The SDK source lives in the \`${SITE.githubRepo}\` repository under \`sdk/python\`. It uses only the standard library, is unit-tested against a mocked API, and is not on PyPI.`,
      },
      { type: "h2", id: "install", text: "Install from source" },
      { type: "code", tabs: [{ label: "Shell", lang: "bash", code: `cd sdk/python\npip install -e .` }] },
      { type: "h2", id: "usage", text: "Usage" },
      {
        type: "code",
        tabs: [
          {
            label: "Python",
            lang: "python",
            code: `from realmailpro import RealMailPro, RateLimitError

client = RealMailPro()  # reads REALMAILPRO_API_KEY

inbox = client.inboxes.create(service="gmail_alias")
messages = client.inboxes.messages(inbox["id"])
otp = next((m["otp"] for m in messages["data"] if m.get("otp")), None)

try:
    print(client.account.balance())
except RateLimitError:
    pass  # back off and retry later`,
          },
        ],
      },
      { type: "h2", id: "requirements", text: "Requirements" },
      { type: "list", items: ["Python 3.9 or newer", "No third-party runtime dependencies"] },
    ],
  },
  {
    slug: "postman",
    title: "Postman collection",
    nav: "Postman",
    description: "Import the RealMailPro Postman collection with all six published requests and a key variable.",
    section: "Guides",
    status: "source",
    indexable: true,
    updated: "2026-11-23",
    blocks: [
      { type: "p", text: "The collection contains the six published requests, collection-level Bearer auth and RealMailPro's published example responses." },
      { type: "h2", id: "import", text: "Import" },
      {
        type: "list",
        ordered: true,
        items: [
          "Open Postman → **Import**.",
          `Choose \`postman/collection.json\` from the \`${SITE.githubRepo}\` repository.`,
          "Open the collection's **Variables** tab and set `apiKey` as a secret current value.",
          "Send **Get balance** first — it is free and confirms the key works.",
        ],
      },
      { type: "h2", id: "variables", text: "Variables" },
      {
        type: "table",
        head: ["Variable", "Default"],
        rows: [
          ["`baseUrl`", `\`${B}\``],
          ["`apiKey`", "`YOUR_API_KEY` (replace locally, never commit)"],
          ["`inboxId`", "Set from a create-inbox response"],
          ["`messageId`", "Set from a poll response"],
        ],
      },
      { type: "callout", tone: "warning", title: "Credits", text: "Create, poll and read requests spend real credits." },
    ],
  },
  {
    slug: "changelog",
    title: "Changelog",
    nav: "Changelog",
    description: "Changes to the Zyqentra RealMailPro documentation, SDK sources and tooling.",
    section: "Reference",
    status: "source",
    indexable: true,
    updated: "2026-11-23",
    blocks: [
      {
        type: "p",
        text: "This changelog tracks Zyqentra's documentation and tooling. It does not track changes to the RealMailPro service itself.",
      },
      ...CHANGELOG.flatMap<Block>((c) => [
        { type: "h2", id: `v${c.version.replace(/\./g, "-")}`, text: `${c.version} — ${c.date}` },
        { type: "p", text: `**${c.title}**` },
        { type: "list", items: c.items },
      ]),
    ],
  },
  {
    slug: "faq",
    title: "FAQ",
    nav: "FAQ",
    description: "Answers to common questions about RealMailPro API access, credits, keys and inboxes.",
    section: "Reference",
    status: "source",
    indexable: true,
    updated: "2026-11-23",
    blocks: [
      { type: "h3", id: "account", text: "Do I need an account?" },
      { type: "p", text: "Yes. Docs and pricing are public, but you must sign in to RealMailPro to add funds and manage API keys." },
      { type: "h3", id: "when-keys", text: "When can I create API keys?" },
      { type: "p", text: "After your first verified deposit of at least $10. Keys stay unlocked even if your balance later reaches zero." },
      { type: "h3", id: "failed-charged", text: "Are failed requests charged?" },
      { type: "p", text: "No. If a billable request fails, the credits are returned straight away." },
      { type: "h3", id: "bonuses", text: "How do deposit bonuses work?" },
      { type: "p", text: "Every deposit gets the bonus of its own tier — it is not limited to the first deposit." },
      {
        type: "table",
        head: ["Deposit", "Bonus", "Total credits"],
        rows: DEPOSIT_BONUSES.map((d) => [d.deposit, d.bonus, d.total]),
      },
      { type: "h3", id: "mailboxes", text: "Which mailboxes can the API create?" },
      { type: "p", text: "Gmail.com + Alias, Outlook.com + Alias, Gmail.com Original and Outlook.com Original. Inboxes expire after 10 minutes." },
      { type: "h3", id: "official", text: "Is Zyqentra run by RealMailPro?" },
      { type: "p", text: "Zyqentra is the developer documentation and tooling ecosystem for RealMailPro. The RealMailPro service, its backend and its brand belong to RealMailPro and are not open source." },
      { type: "h3", id: "webhooks", text: "Are there webhooks?" },
      { type: "p", text: "None are published. Poll the inbox instead." },
    ],
  },
  {
    slug: "troubleshooting",
    title: "Troubleshooting",
    nav: "Troubleshooting",
    description: "Fix common RealMailPro API problems: 401 errors, missing OTPs, expired inboxes and rate limiting.",
    section: "Reference",
    status: "source",
    indexable: true,
    updated: "2026-11-23",
    blocks: [
      { type: "h3", id: "401", text: "Every request returns 401" },
      {
        type: "list",
        items: [
          "Check the header is exactly `Authorization: Bearer <key>` with one space.",
          "Make sure the key was not revoked and you copied it in full.",
          "Confirm your environment variable is loaded in the process that makes the call.",
        ],
      },
      { type: "h3", id: "no-otp", text: "Messages arrive but `otp` is empty" },
      { type: "p", text: "Open the full message with `GET /messages/{id}` and read the code from `text` or `html`. OTP detection covers supported formats only." },
      { type: "h3", id: "404", text: "404 for an inbox I just created" },
      { type: "p", text: "Inboxes expire after 10 minutes, and IDs are scoped to the account that created them. Check you are using the same account's key." },
      { type: "h3", id: "site-rejects", text: "The site rejects the address" },
      { type: "p", text: "Some sites reject plus-alias addresses. Try `gmail_original` or `outlook_original`." },
      { type: "h3", id: "429", text: "Frequent 429 responses" },
      { type: "p", text: "Increase your polling interval and add exponential backoff. See [Rate limits](/docs/realmailpro/rate-limits)." },
      { type: "h3", id: "still-stuck", text: "Still stuck?" },
      { type: "p", text: `Contact RealMailPro through their [contact page](${REALMAILPRO.contactUrl}) for account or billing issues, or open an issue in the SDK repository for documentation problems.` },
      { type: "h2", id: "known-gaps", text: "Known documentation gaps" },
      { type: "list", items: UNVERIFIED_ITEMS },
    ],
  },
];

export const DOC_SECTIONS = ["Start", "API", "Guides", "Reference"] as const;

export function docPath(slug: string) {
  return slug ? `/docs/realmailpro/${slug}` : "/docs/realmailpro";
}

export function getDoc(slug: string) {
  return DOCS.find((d) => d.slug === slug);
}

export function getNeighbors(slug: string) {
  const i = DOCS.findIndex((d) => d.slug === slug);
  return { prev: i > 0 ? DOCS[i - 1] : undefined, next: i >= 0 ? DOCS[i + 1] : undefined };
}

export function plainText(s: string) {
  return s.replace(/\[([^\]]+)\]\([^)]+\)/g, "$1").replace(/[`*]/g, "");
}

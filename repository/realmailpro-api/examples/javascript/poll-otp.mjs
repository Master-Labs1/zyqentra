// Create an inbox and wait for an OTP. Node 18+. Usage: REALMAILPRO_API_KEY=... node poll-otp.mjs
// Spends credits: 1–3 for the inbox plus 3 per poll.
const BASE_URL = process.env.REALMAILPRO_BASE_URL ?? "https://realmailpro.online/api/public/v1";
const apiKey = process.env.REALMAILPRO_API_KEY;
if (!apiKey) {
  console.error("Set REALMAILPRO_API_KEY first.");
  process.exit(1);
}

async function call(method, path, body) {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(body ? { "Content-Type": "application/json" } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(30_000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`${res.status} ${data?.error?.code ?? ""}: ${data?.error?.message ?? res.statusText}`);
  return data;
}

const inbox = await call("POST", "/inboxes", { service: process.argv[2] ?? "gmail_alias" });
console.log(`Use this address: ${inbox.address} (expires ${inbox.expires_at})`);

const deadline = Date.now() + 5 * 60_000;
while (Date.now() < deadline) {
  await new Promise((r) => setTimeout(r, 10_000));
  const { data } = await call("GET", `/inboxes/${encodeURIComponent(inbox.id)}/messages`);
  const hit = data.find((m) => m.otp);
  if (hit) {
    console.log(`OTP from ${hit.from}: ${hit.otp}`);
    process.exit(0);
  }
  console.log("No OTP yet…");
}
console.error("Timed out waiting for an OTP.");
process.exit(2);

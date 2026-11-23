import { describe, expect, it, vi } from "vitest";

import {
  AccountSuspendedError,
  AuthenticationError,
  InsufficientCreditsError,
  NotFoundError,
  RateLimitError,
  RealMailPro,
  RealMailProError,
  TimeoutError,
  UpstreamError,
} from "../src/index.js";

type Call = { url: string; init: RequestInit };

function json(status: number, body: unknown, headers: Record<string, string> = {}) {
  return new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json", ...headers } });
}

function mockFetch(...responses: Array<Response | Error>) {
  const calls: Call[] = [];
  const fn = vi.fn(async (url: string | URL | Request, init?: RequestInit) => {
    calls.push({ url: String(url), init: init ?? {} });
    const next = responses.shift();
    if (!next) throw new Error("unexpected call");
    if (next instanceof Error) throw next;
    return next;
  });
  return { fetch: fn as unknown as typeof fetch, calls };
}

const KEY = "test_key_not_real";

describe("RealMailPro client", () => {
  it("sends the Bearer header and parses JSON", async () => {
    const m = mockFetch(json(200, { balance: 104998, currency: "credits" }));
    const client = new RealMailPro({ apiKey: KEY, fetch: m.fetch });
    const res = await client.account.balance();
    expect(res.balance).toBe(104998);
    expect(m.calls[0]?.url).toBe("https://realmailpro.online/api/public/v1/account/balance");
    expect((m.calls[0]?.init.headers as Record<string, string>)["Authorization"]).toBe(`Bearer ${KEY}`);
  });

  it("throws when no API key is configured", () => {
    const prev = process.env["REALMAILPRO_API_KEY"];
    delete process.env["REALMAILPRO_API_KEY"];
    expect(() => new RealMailPro({ fetch: mockFetch().fetch })).toThrow(/Missing API key/);
    if (prev !== undefined) process.env["REALMAILPRO_API_KEY"] = prev;
  });

  it("reads the key from REALMAILPRO_API_KEY", async () => {
    process.env["REALMAILPRO_API_KEY"] = "env_key";
    const m = mockFetch(json(200, { balance: 1, currency: "credits" }));
    await new RealMailPro({ fetch: m.fetch }).account.balance();
    expect((m.calls[0]?.init.headers as Record<string, string>)["Authorization"]).toBe("Bearer env_key");
    delete process.env["REALMAILPRO_API_KEY"];
  });

  it("posts the service body when creating an inbox", async () => {
    const m = mockFetch(json(200, { id: "i1", address: "a+b@gmail.com", expires_at: "x", created_at: "y" }));
    const inbox = await new RealMailPro({ apiKey: KEY, fetch: m.fetch }).inboxes.create({ service: "gmail_alias" });
    expect(inbox.id).toBe("i1");
    expect(m.calls[0]?.init.method).toBe("POST");
    expect(m.calls[0]?.init.body).toBe(JSON.stringify({ service: "gmail_alias" }));
  });

  it("rejects unknown services before calling the API", () => {
    const m = mockFetch();
    const client = new RealMailPro({ apiKey: KEY, fetch: m.fetch });
    // @ts-expect-error invalid on purpose
    expect(() => client.inboxes.create({ service: "yahoo" })).toThrow(RealMailProError);
    expect(m.calls).toHaveLength(0);
  });

  it.each([
    [401, "unauthorized", AuthenticationError],
    [402, "insufficient_credits", InsufficientCreditsError],
    [403, "suspended", AccountSuspendedError],
    [404, "not_found", NotFoundError],
  ] as const)("maps %i to %s", async (status, code, Ctor) => {
    const m = mockFetch(json(status, { error: { code, message: "nope" } }));
    const err = await new RealMailPro({ apiKey: KEY, fetch: m.fetch, maxRetries: 0 }).account.balance().catch((e) => e);
    expect(err).toBeInstanceOf(Ctor);
    expect(err.status).toBe(status);
    expect(err.code).toBe(code);
    expect(err.message).toBe("nope");
  });

  it("maps 429 and 502 when retries are exhausted", async () => {
    const m429 = mockFetch(json(429, { error: { code: "rate_limited", message: "slow down" } }, { "retry-after": "7" }));
    const e429 = await new RealMailPro({ apiKey: KEY, fetch: m429.fetch, maxRetries: 0 }).account.usage().catch((e) => e);
    expect(e429).toBeInstanceOf(RateLimitError);
    expect(e429.retryAfterSeconds).toBe(7);

    const m502 = mockFetch(json(502, { error: { code: "upstream_error", message: "mail down" } }));
    const e502 = await new RealMailPro({ apiKey: KEY, fetch: m502.fetch, maxRetries: 0 }).account.usage().catch((e) => e);
    expect(e502).toBeInstanceOf(UpstreamError);
  });

  it("retries GET on 429 and then succeeds", async () => {
    vi.useFakeTimers();
    const m = mockFetch(
      json(429, { error: { code: "rate_limited", message: "x" } }, { "retry-after": "1" }),
      json(200, { inbox: { id: "i", address: "a", active: true }, data: [] }),
    );
    const p = new RealMailPro({ apiKey: KEY, fetch: m.fetch }).inboxes.messages("i");
    await vi.advanceTimersByTimeAsync(1000);
    const res = await p;
    expect(res.data).toEqual([]);
    expect(m.calls).toHaveLength(2);
    vi.useRealTimers();
  });

  it("never retries POST /inboxes", async () => {
    const m = mockFetch(json(502, { error: { code: "upstream_error", message: "x" } }), json(200, {}));
    const err = await new RealMailPro({ apiKey: KEY, fetch: m.fetch, maxRetries: 5 })
      .inboxes.create({ service: "outlook_alias" })
      .catch((e) => e);
    expect(err).toBeInstanceOf(UpstreamError);
    expect(m.calls).toHaveLength(1);
  });

  it("times out slow requests", async () => {
    const slow = vi.fn(
      (_url: string | URL | Request, init?: RequestInit) =>
        new Promise<Response>((_, reject) => {
          init?.signal?.addEventListener("abort", () => reject(new DOMException("aborted", "AbortError")));
        }),
    ) as unknown as typeof fetch;
    const err = await new RealMailPro({ apiKey: KEY, fetch: slow, timeoutMs: 20, maxRetries: 0 })
      .account.balance()
      .catch((e) => e);
    expect(err).toBeInstanceOf(TimeoutError);
  });

  it("URL-encodes path IDs and rejects empty IDs", async () => {
    const m = mockFetch(json(200, { id: "a/b" }));
    await new RealMailPro({ apiKey: KEY, fetch: m.fetch }).messages.get("a/b?x");
    expect(m.calls[0]?.url).toBe("https://realmailpro.online/api/public/v1/messages/a%2Fb%3Fx");
    expect(() => new RealMailPro({ apiKey: KEY, fetch: m.fetch }).messages.get("  ")).toThrow(RealMailProError);
  });
});

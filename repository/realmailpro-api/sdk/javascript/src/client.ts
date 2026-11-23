import { ConnectionError, RealMailProError, RateLimitError, TimeoutError, errorFromResponse } from "./errors.js";
import type {
  Balance,
  ClientOptions,
  CreateInboxParams,
  Inbox,
  InboxMessages,
  Message,
  ServiceName,
  ServicesResponse,
  UsageResponse,
} from "./types.js";

export const DEFAULT_BASE_URL = "https://realmailpro.online/api/public/v1";
const SERVICES: readonly ServiceName[] = ["gmail_alias", "outlook_alias", "gmail_original", "outlook_original"];
const RETRYABLE = new Set([429, 500, 502, 503, 504]);

function envKey(): string | undefined {
  const g = globalThis as { process?: { env?: Record<string, string | undefined> } };
  return g.process?.env?.["REALMAILPRO_API_KEY"];
}

function pathId(id: string, name: string): string {
  if (typeof id !== "string" || id.trim() === "") {
    throw new RealMailProError(`${name} must be a non-empty string`, { code: "invalid_argument" });
  }
  return encodeURIComponent(id);
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * Client for the RealMailPro API.
 *
 * - Sends `Authorization: Bearer <key>`; never logs the key.
 * - Times out each request (default 30 s).
 * - Retries only GET requests on 429/5xx/network errors. POST /inboxes is billable and
 *   is never retried automatically.
 */
export class RealMailPro {
  readonly baseUrl: string;
  readonly #apiKey: string;
  readonly #timeoutMs: number;
  readonly #maxRetries: number;
  readonly #fetch: typeof fetch;

  constructor(options: ClientOptions = {}) {
    const apiKey = options.apiKey ?? envKey();
    if (!apiKey) {
      throw new RealMailProError(
        "Missing API key. Pass { apiKey } or set the REALMAILPRO_API_KEY environment variable.",
        { code: "missing_api_key" },
      );
    }
    const f = options.fetch ?? globalThis.fetch;
    if (typeof f !== "function") {
      throw new RealMailProError("No fetch implementation available. Use Node 18+ or pass { fetch }.", {
        code: "missing_fetch",
      });
    }
    this.#apiKey = apiKey;
    this.baseUrl = (options.baseUrl ?? DEFAULT_BASE_URL).replace(/\/+$/, "");
    this.#timeoutMs = options.timeoutMs ?? 30_000;
    this.#maxRetries = Math.max(0, options.maxRetries ?? 2);
    this.#fetch = f;
  }

  readonly services = {
    /** GET /services — availability and price per service. Schema NEEDS VERIFICATION. */
    list: () => this.request<ServicesResponse>("GET", "/services"),
  };

  readonly inboxes = {
    /** POST /inboxes — creates a 10-minute inbox. Billable (1 or 3 credits). */
    create: (params: CreateInboxParams) => {
      if (!params || !SERVICES.includes(params.service)) {
        throw new RealMailProError(`service must be one of: ${SERVICES.join(", ")}`, { code: "invalid_argument" });
      }
      return this.request<Inbox>("POST", "/inboxes", { service: params.service });
    },
    /** GET /inboxes/{id}/messages — polls the inbox. Billable (3 credits). */
    messages: (inboxId: string) =>
      this.request<InboxMessages>("GET", `/inboxes/${pathId(inboxId, "inboxId")}/messages`),
  };

  readonly messages = {
    /** GET /messages/{id} — full message with text and HTML. Billable (3 credits). */
    get: (messageId: string) => this.request<Message>("GET", `/messages/${pathId(messageId, "messageId")}`),
  };

  readonly account = {
    /** GET /account/balance — free. */
    balance: () => this.request<Balance>("GET", "/account/balance"),
    /** GET /account/usage — last 100 requests, free. Schema NEEDS VERIFICATION. */
    usage: () => this.request<UsageResponse>("GET", "/account/usage"),
  };

  private async request<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
    const retries = method === "GET" ? this.#maxRetries : 0;
    for (let attempt = 0; ; attempt++) {
      try {
        return await this.once<T>(method, path, body);
      } catch (err) {
        const retryable =
          err instanceof ConnectionError ||
          err instanceof TimeoutError ||
          (err instanceof RealMailProError && err.status !== undefined && RETRYABLE.has(err.status));
        if (!retryable || attempt >= retries) throw err;
        const hinted = err instanceof RateLimitError ? err.retryAfterSeconds : undefined;
        const wait = hinted !== undefined ? hinted * 1000 : 2 ** attempt * 500 + Math.random() * 100;
        await sleep(Math.min(wait, 30_000));
      }
    }
  }

  private async once<T>(method: "GET" | "POST", path: string, body?: unknown): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.#timeoutMs);
    let res: Response;
    try {
      const headers: Record<string, string> = {
        Authorization: `Bearer ${this.#apiKey}`,
        Accept: "application/json",
      };
      const init: RequestInit = { method, headers, signal: controller.signal };
      if (body !== undefined) {
        headers["Content-Type"] = "application/json";
        init.body = JSON.stringify(body);
      }
      res = await this.#fetch(`${this.baseUrl}${path}`, init);
    } catch (err) {
      if (controller.signal.aborted) {
        throw new TimeoutError(`Request timed out after ${this.#timeoutMs} ms`, { code: "timeout", cause: err });
      }
      throw new ConnectionError("Could not reach the RealMailPro API", { code: "connection_error", cause: err });
    } finally {
      clearTimeout(timer);
    }

    const text = await res.text();
    let parsed: unknown = undefined;
    if (text) {
      try {
        parsed = JSON.parse(text);
      } catch {
        parsed = undefined;
      }
    }
    if (!res.ok) {
      const ra = Number(res.headers.get("retry-after"));
      throw errorFromResponse(res.status, parsed, Number.isFinite(ra) && ra > 0 ? ra : undefined);
    }
    if (parsed === undefined) {
      throw new RealMailProError("Expected a JSON response body", { status: res.status, code: "invalid_response" });
    }
    return parsed as T;
  }
}

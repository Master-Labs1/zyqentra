/**
 * Types derived from RealMailPro's published examples at https://realmailpro.online/docs.
 * Fields marked "NEEDS VERIFICATION" are not fully specified by RealMailPro.
 */

export type ServiceName = "gmail_alias" | "outlook_alias" | "gmail_original" | "outlook_original";

export interface Inbox {
  id: string;
  address: string;
  /** Timestamp string. Format NEEDS VERIFICATION. */
  expires_at: string;
  /** Timestamp string. Format NEEDS VERIFICATION. */
  created_at: string;
}

export interface InboxRef {
  id: string;
  address: string;
  active: boolean;
}

export interface MessageSummary {
  id: string;
  from: string;
  subject: string;
  /** Detected code. Value when nothing is detected NEEDS VERIFICATION. */
  otp?: string | null;
  received_at: string;
}

export interface InboxMessages {
  inbox: InboxRef;
  data: MessageSummary[];
}

export interface Message {
  id: string;
  to: string;
  from: string;
  subject: string;
  text: string;
  /** Untrusted HTML — sanitize before rendering. */
  html: string;
  otp?: string | null;
}

export interface Balance {
  balance: number;
  currency: "credits" | (string & {});
}

/** Response schema is not published. NEEDS VERIFICATION. */
export type ServicesResponse = Record<string, unknown> | unknown[];

/** Response schema is not published. NEEDS VERIFICATION. */
export type UsageResponse = Record<string, unknown> | unknown[];

export interface CreateInboxParams {
  service: ServiceName;
}

export interface ClientOptions {
  /** Defaults to process.env.REALMAILPRO_API_KEY when available. */
  apiKey?: string;
  /** Defaults to https://realmailpro.online/api/public/v1 */
  baseUrl?: string;
  /** Per-request timeout in milliseconds. Default 30000. */
  timeoutMs?: number;
  /** Retries for idempotent GET requests on 429/5xx/network errors. Default 2. */
  maxRetries?: number;
  /** Custom fetch implementation (tests, proxies). Defaults to globalThis.fetch. */
  fetch?: typeof fetch;
}

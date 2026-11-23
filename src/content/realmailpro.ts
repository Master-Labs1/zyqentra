/**
 * Single source of truth for RealMailPro facts shown on the portal.
 * Every value here comes from RealMailPro's public pages (see research/realmailpro-public-research.md).
 * Anything not published by RealMailPro is marked with `verification: "needs-verification"`.
 */

export const RESEARCH_DATE = "2026-11-23";

export const REALMAILPRO = {
  name: "RealMailPro",
  website: "https://realmailpro.online",
  docsUrl: "https://realmailpro.online/docs",
  developerApiUrl: "https://realmailpro.online/developer-api",
  tempMailApiUrl: "https://realmailpro.online/temp-mail-api",
  pricingUrl: "https://realmailpro.online/#pricing",
  contactUrl: "https://realmailpro.online/contact",
  termsUrl: "https://realmailpro.online/terms",
  privacyUrl: "https://realmailpro.online/privacy",
  acceptableUseUrl: "https://realmailpro.online/acceptable-use",
  signupUrl: "https://realmailpro.online/auth?tab=signup",
  baseUrl: "https://realmailpro.online/api/public/v1",
  apiVersion: "v1",
  keyPrefixExample: "rmp_live_",
  maxActiveKeys: 3,
  minDepositUsd: 10,
  creditsPerUsd: 1000,
  inboxLifetimeMinutes: 10,
} as const;

export type ApiStatus = "available" | "in-progress" | "requires-verification" | "planned";

export const API_STATUS_LABEL: Record<ApiStatus, string> = {
  available: "Available",
  "in-progress": "Documentation in progress",
  "requires-verification": "Requires verification",
  planned: "Planned",
};

export type ServiceName = "gmail_alias" | "outlook_alias" | "gmail_original" | "outlook_original";

export const SERVICES: { id: ServiceName; label: string; kind: string; credits: number }[] = [
  { id: "gmail_alias", label: "Gmail.com + Alias", kind: "Plus-alias on a Gmail address", credits: 1 },
  { id: "outlook_alias", label: "Outlook.com + Alias", kind: "Plus-alias on an Outlook address", credits: 1 },
  { id: "gmail_original", label: "Gmail.com Original", kind: "Dedicated original Gmail address", credits: 3 },
  { id: "outlook_original", label: "Outlook.com Original", kind: "Dedicated original Outlook address", credits: 3 },
];

export type Endpoint = {
  id: string;
  method: "GET" | "POST";
  path: string;
  summary: string;
  description: string;
  cost: string;
  status: ApiStatus;
  responseExample?: string;
  responseNote?: string;
};

/**
 * Endpoints as published at realmailpro.online/docs. Status is "requires-verification" because
 * Zyqentra has only observed the documented 401 envelope; no successful call has been made with a key.
 */
export const ENDPOINTS: Endpoint[] = [
  {
    id: "list-services",
    method: "GET",
    path: "/services",
    summary: "List services",
    description:
      "Lists the four email services, whether each is available right now, and its credit price.",
    cost: "Not stated",
    status: "requires-verification",
    responseNote: "Response schema is not published. NEEDS VERIFICATION.",
  },
  {
    id: "create-inbox",
    method: "POST",
    path: "/inboxes",
    summary: "Create inbox",
    description:
      "Creates a new temporary inbox for the chosen service. Inboxes expire after 10 minutes.",
    cost: "1 credit (alias) · 3 credits (original)",
    status: "requires-verification",
    responseExample: `{ "id": "8f1c…", "address": "name+abc@outlook.com", "expires_at": "…", "created_at": "…" }`,
  },
  {
    id: "poll-inbox",
    method: "GET",
    path: "/inboxes/{id}/messages",
    summary: "Poll inbox",
    description: "Fetches new mail and returns the list of messages with the detected OTP.",
    cost: "3 credits",
    status: "requires-verification",
    responseExample: `{ "inbox": { "id": "…", "address": "…", "active": true }, "data": [ { "id": "…", "from": "…", "subject": "…", "otp": "482913", "received_at": "…" } ] }`,
  },
  {
    id: "read-message",
    method: "GET",
    path: "/messages/{id}",
    summary: "Read message",
    description: "Returns the full message (text + HTML) for a message from one of your inboxes.",
    cost: "3 credits",
    status: "requires-verification",
    responseExample: `{ "id": "…", "to": "…", "from": "…", "subject": "…", "text": "…", "html": "…", "otp": "482913" }`,
  },
  {
    id: "balance",
    method: "GET",
    path: "/account/balance",
    summary: "Get balance",
    description: "Returns your wallet balance in credits.",
    cost: "No charge",
    status: "requires-verification",
    responseExample: `{ "balance": 104998, "currency": "credits" }`,
  },
  {
    id: "usage",
    method: "GET",
    path: "/account/usage",
    summary: "Get usage",
    description: "Returns your last 100 requests and charges.",
    cost: "No charge",
    status: "requires-verification",
    responseNote: "Response schema is not published. NEEDS VERIFICATION.",
  },
];

export const ERRORS: { status: number; code: string; meaning: string; charged: string }[] = [
  { status: 401, code: "unauthorized", meaning: "Missing, invalid or revoked key", charged: "No" },
  { status: 402, code: "insufficient_credits", meaning: "Wallet balance too low — add funds", charged: "No" },
  { status: 403, code: "suspended", meaning: "Account under review", charged: "No" },
  { status: 404, code: "not_found", meaning: "Inbox/message is not yours, or unknown endpoint", charged: "No" },
  { status: 429, code: "rate_limited", meaning: "Too many requests per minute for this key", charged: "No" },
  { status: 502, code: "upstream_error", meaning: "Mail service failed", charged: "No (refunded)" },
];

export const OBSERVED_401 = `{"error":{"code":"unauthorized","message":"Missing or invalid API key."}}`;

export const DEPOSIT_BONUSES: { deposit: string; bonus: string; total: string }[] = [
  { deposit: "$10", bonus: "5%", total: "10,500" },
  { deposit: "$100", bonus: "10%", total: "110,000" },
  { deposit: "$250", bonus: "20%", total: "300,000" },
  { deposit: "$500", bonus: "30%", total: "650,000" },
  { deposit: "$1,000", bonus: "40%", total: "1,400,000" },
  { deposit: "$5,000", bonus: "50%", total: "7,500,000" },
  { deposit: "$10,000", bonus: "60%", total: "16,000,000" },
  { deposit: "$15,000", bonus: "70%", total: "25,500,000" },
];

export const VERIFIED_CAPABILITIES = [
  { title: "Disposable inboxes", text: "Create a temporary Gmail.com or Outlook.com inbox on demand." },
  { title: "OTP detection", text: "Polled messages include the detected verification code in an `otp` field." },
  { title: "Full message read", text: "Read the text and HTML body of a message from one of your inboxes." },
  { title: "10-minute lifetime", text: "Every generated inbox expires after 10 minutes." },
  { title: "Prepaid credits", text: "$1 = 1,000 credits. Only successful billable calls are charged." },
  { title: "Hashed API keys", text: "Keys are shown once, stored only as a hash, revocable, up to 3 active." },
];

export const UNVERIFIED_ITEMS = [
  "Response schema for GET /services and GET /account/usage",
  "Field types and formats (IDs, timestamps, nullable otp)",
  "Numeric rate limits and rate-limit headers",
  "Pagination or long-poll behaviour for inbox messages",
  "Default service when POST /inboxes is sent without a body",
  "Error body for codes other than 401 (same envelope assumed)",
  "Webhooks, sandbox keys, SLA and uptime",
];

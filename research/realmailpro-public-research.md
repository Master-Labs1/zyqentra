# RealMailPro — Public Research Report

Prepared for the Zyqentra developer portal. Research date: 2026-11-23 (UTC).
Sources: public pages of https://realmailpro.online only. No private code, database,
credentials or Lovable project of RealMailPro were accessed.

Pages read: `/`, `/developer-api`, `/docs`, `/temp-mail-api`, `/free-vs-premium`,
`/privacy`, `/terms`. Unauthenticated probes were sent to the public API base URL
(no key) to observe the error envelope.

---

## A. VERIFIED INFORMATION

### Product
- RealMailPro is a temporary / disposable email web service for receiving sign-up
  confirmations, verification codes (OTP) and test emails.
- Generated addresses expire after **10 minutes**; addresses can be saved to an account.
- Free tier: Gmail, Outlook and Hotmail **plus-alias** addresses, no signup, live inbox
  with OTP detection. Generation limit on the website: 1 per 30 s.
- Premium: **original** Gmail and Outlook addresses, full message reading, no ads.
- Website plans: Premium $9.99 / 30 days, Premium Plus $24.99 / 90 days,
  Premium Max $101.00 / 365 days. Payments via Paddle (card), OxaPay crypto, JazzCash (PK).
- Google sign-in is optional and only receives name, email and profile picture.

### Developer API (as published at /docs and /developer-api)
- Base URL: `https://realmailpro.online/api/public/v1`
- Auth: `Authorization: Bearer YOUR_KEY` (alternative header `X-API-Key`).
- Key format shown in public examples: `rmp_live_…`
- Keys are shown once and stored only as a hash; can be revoked; **up to 3 active keys**.
- Keys unlock after the first verified deposit of at least **$10**.
- Prepaid credit wallet: **$1 = 1,000 credits**, credits never expire, minimum deposit $10.
  API deposits: USDT (BEP20), verified on-chain.
- Only successful billable calls are charged; failed calls are refunded automatically.
- Per-key rate limits exist ("too many requests per minute").
- Services: `gmail_alias`, `outlook_alias`, `gmail_original`, `outlook_original`.

| Method | Path | Purpose | Cost (credits) |
| --- | --- | --- | --- |
| GET | /services | List services, availability and price | not stated |
| POST | /inboxes | Create inbox, body `{ "service": "<service>" }` | 1 (alias) / 3 (original) |
| GET | /inboxes/{id}/messages | Poll inbox; messages with detected `otp` | 3 |
| GET | /messages/{id} | Read full message (text + HTML) | 3 |
| GET | /account/balance | Wallet balance | free |
| GET | /account/usage | Last 100 requests | free |

Published example responses (values elided by RealMailPro with "…"):
- POST /inboxes → `{ "id", "address", "expires_at", "created_at" }`
- GET /inboxes/{id}/messages → `{ "inbox": { "id", "address", "active" }, "data": [ { "id", "from", "subject", "otp", "received_at" } ] }`
- GET /messages/{id} → `{ "id", "to", "from", "subject", "text", "html", "otp" }`
- GET /account/balance → `{ "balance": 104998, "currency": "credits" }`

Published error codes: 401 `unauthorized`, 402 `insufficient_credits`, 403 `suspended`,
404 `not_found`, 429 `rate_limited`, 502 `upstream_error` (not charged).

Observed live (2026-11-23, no key): every path returns HTTP 401 with
`{"error":{"code":"unauthorized","message":"Missing or invalid API key."}}`,
`content-type: application/json`, `access-control-allow-origin: *`, `cache-control: no-store`.

Deposit bonus tiers (per deposit): $10 5%, $100 10%, $250 20%, $500 30%, $1000 40%,
$5000 50%, $10000 60%, $15000 70%.

Acceptable use: only for inboxes/accounts you own or are authorised to test; no spam,
abuse or circumvention of other services' rules.

## B. UNAVAILABLE INFORMATION
- Response schema for `GET /services` and `GET /account/usage`.
- Exact data types and formats (ID format, timestamp format, nullability of `otp`).
- Numeric rate limits (requests per minute per key), rate-limit headers, `Retry-After`.
- Pagination, filtering or long-polling behaviour of `GET /inboxes/{id}/messages`.
- Whether `POST /inboxes` defaults `service` when the body is omitted (the published
  curl example sends no body).
- Error response body for codes other than 401 (assumed same envelope, unconfirmed).
- API versioning / deprecation policy, SLA, uptime.
- Webhooks (none mentioned).
- Official SDKs (none mentioned).
- Sandbox / test mode (none mentioned).

## C. OWNER CONFIRMATION REQUIRED
- Full OpenAPI specification or JSON schemas for all six endpoints.
- Rate-limit values and headers.
- Whether `X-API-Key` and `Authorization: Bearer` are equally supported long-term.
- Permission to publish SDKs and docs under the Zyqentra GitHub organization and to use
  the RealMailPro name and logo.
- License choice for SDK/example code.
- Security contact address for SECURITY.md.
- Final production domain for the Zyqentra portal (canonical URLs, sitemap).

## D. FUTURE DEVELOPMENT (not verified, not promised)
- Webhooks for new messages.
- Official npm / PyPI packages (SDK sources are prepared, not published).
- Test-mode keys.
- Server-sent or long-poll message delivery.
- Additional language SDKs.

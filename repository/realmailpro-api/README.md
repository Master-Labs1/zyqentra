<div align="center">

<img src="https://raw.githubusercontent.com/Zyqentra/realmailpro-api/main/.github/assets/zyqentra-mark.svg" alt="Zyqentra logo" width="64" height="64" />

# RealMailPro API — Developer Kit

**Temporary Gmail.com & Outlook.com inboxes and OTP reading, from your own code.**

Documentation, OpenAPI spec, SDK sources and examples for the [RealMailPro](https://realmailpro.online) API,
maintained by **Zyqentra** — *Build beyond limits.*

[![License: MIT](https://img.shields.io/badge/license-MIT-c6f432?style=flat-square)](LICENSE)
[![OpenAPI 3.1](https://img.shields.io/badge/OpenAPI-3.1-6ba539?style=flat-square)](openapi/openapi.yaml)
[![API v1](https://img.shields.io/badge/API-v1-15171c?style=flat-square)](https://realmailpro.online/docs)
[![Status: pre-release](https://img.shields.io/badge/status-pre--release-f5a524?style=flat-square)](#status)

[Docs](docs/getting-started.md) · [API reference](docs/api-reference.md) · [OpenAPI](openapi/openapi.yaml) · [Postman](postman/collection.json) · [Official docs](https://realmailpro.online/docs)

</div>

---

## Overview

RealMailPro creates disposable inboxes, detects verification codes in incoming mail and lets you read full messages —
built for end-to-end tests, QA tooling and sign-up automation **on accounts you own**.

This repository contains everything a developer needs to integrate it, written **only** from RealMailPro's public
documentation. Anything RealMailPro has not published is marked **NEEDS VERIFICATION** instead of guessed.

## Status

| Area | Status |
| --- | --- |
| Endpoints, base URL, auth headers, error codes | Published by RealMailPro · 401 envelope observed live |
| Successful authenticated calls | **Not yet verified** by Zyqentra |
| Response schemas | From published examples · `/services` and `/account/usage` unknown |
| Rate-limit numbers & headers | **Not published** |
| TypeScript SDK (`sdk/javascript`) | Implemented, mock-tested · **not on npm** |
| Python SDK (`sdk/python`) | Implemented, mock-tested · **not on PyPI** |
| Webhooks | Not offered |

## Quick start

1. Create an account at [realmailpro.online](https://realmailpro.online/auth?tab=signup).
2. Deposit at least **$10** (USDT BEP20) on the [Developer API page](https://realmailpro.online/developer-api) — $1 = 1,000 credits.
3. Generate an API key (shown once; up to 3 active).
4. Export it — never commit it:

```bash
export REALMAILPRO_API_KEY=YOUR_API_KEY
```

## Authentication

```http
Authorization: Bearer YOUR_API_KEY
```

`X-API-Key: YOUR_API_KEY` is also accepted. Call the API from servers or CI only — never from browser code.

## Endpoints

Base URL: `https://realmailpro.online/api/public/v1`

| Method | Path | Purpose | Credits |
| --- | --- | --- | --- |
| `GET` | `/services` | List services, availability, price | not stated |
| `POST` | `/inboxes` | Create a 10-minute inbox | 1 alias · 3 original |
| `GET` | `/inboxes/{id}/messages` | Poll inbox (with detected `otp`) | 3 |
| `GET` | `/messages/{id}` | Read full message (text + HTML) | 3 |
| `GET` | `/account/balance` | Wallet balance | free |
| `GET` | `/account/usage` | Last 100 requests | free |

Services: `gmail_alias`, `outlook_alias`, `gmail_original`, `outlook_original`.

## Examples

**cURL**

```bash
curl -X POST https://realmailpro.online/api/public/v1/inboxes \
  -H "Authorization: Bearer $REALMAILPRO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "service": "gmail_alias" }'
```

**TypeScript** (pre-release SDK, build from source)

```ts
import { RealMailPro } from "@zyqentra/realmailpro";

const client = new RealMailPro(); // reads REALMAILPRO_API_KEY
const inbox = await client.inboxes.create({ service: "gmail_alias" });
const { data } = await client.inboxes.messages(inbox.id);
console.log(data.find((m) => m.otp)?.otp);
```

**Python** (pre-release SDK, install from source)

```python
from realmailpro import RealMailPro

client = RealMailPro()  # reads REALMAILPRO_API_KEY
inbox = client.inboxes.create("gmail_alias")
messages = client.inboxes.messages(inbox["id"])
print(next((m["otp"] for m in messages["data"] if m.get("otp")), None))
```

More in [`examples/`](examples) and [docs/examples.md](docs/examples.md).

## Responses

Published examples from RealMailPro (values elided as `…`):

```jsonc
// POST /inboxes
{ "id": "8f1c…", "address": "name+abc@outlook.com", "expires_at": "…", "created_at": "…" }

// GET /inboxes/{id}/messages
{ "inbox": { "id": "…", "address": "…", "active": true },
  "data": [ { "id": "…", "from": "…", "subject": "…", "otp": "482913", "received_at": "…" } ] }

// GET /account/balance
{ "balance": 104998, "currency": "credits" }
```

## Error handling

```json
{ "error": { "code": "unauthorized", "message": "Missing or invalid API key." } }
```

| Status | Code | SDK exception |
| --- | --- | --- |
| 401 | `unauthorized` | `AuthenticationError` |
| 402 | `insufficient_credits` | `InsufficientCreditsError` |
| 403 | `suspended` | `AccountSuspendedError` |
| 404 | `not_found` | `NotFoundError` |
| 429 | `rate_limited` | `RateLimitError` |
| 502 | `upstream_error` | `UpstreamError` |

Failed billable calls are refunded by RealMailPro. The SDKs retry **GET** requests on 429/5xx with backoff and
**never** retry `POST /inboxes`. See [docs/errors.md](docs/errors.md).

## Rate limits

Limits are per key, per minute. The numbers are not published — see [docs/rate-limits.md](docs/rate-limits.md).

## SDKs

| SDK | Path | Install | Status |
| --- | --- | --- | --- |
| TypeScript / JavaScript | [`sdk/javascript`](sdk/javascript) | `npm install && npm run build` | Pre-release, not on npm |
| Python 3.9+ | [`sdk/python`](sdk/python) | `pip install -e sdk/python` | Pre-release, not on PyPI |

Both have zero runtime dependencies, typed errors, request timeouts and safe retries.

## Postman

Import [`postman/collection.json`](postman/collection.json), then set the `apiKey` variable as a **secret current value**.
Start with **Get balance** (free).

## Repository layout

```text
docs/        Markdown guides
openapi/     OpenAPI 3.1 description (published endpoints only)
sdk/         TypeScript and Python clients
examples/    cURL, JavaScript, TypeScript, Python
postman/     Postman v2.1 collection
.github/     CI, CodeQL, Dependabot, issue & PR templates
```

## Changelog · Contributing · Security · Support

- [CHANGELOG.md](CHANGELOG.md) — Keep a Changelog, Semantic Versioning.
- [CONTRIBUTING.md](CONTRIBUTING.md) — how to propose changes; no unverified API claims.
- [SECURITY.md](SECURITY.md) — report vulnerabilities privately.
- [SUPPORT.md](SUPPORT.md) — where to ask for help.

## License & trademarks

SDK source code, examples and documentation in this repository are released under the [MIT License](LICENSE).

The RealMailPro API service, its backend and the RealMailPro name and logo are proprietary to their owner and are
**not** covered by this license. This repository contains no RealMailPro backend code, credentials or customer data.

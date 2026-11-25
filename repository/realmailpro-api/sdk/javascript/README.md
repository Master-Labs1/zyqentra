# @zyqentra/realmailpro (TypeScript)

Pre-release TypeScript client for the [RealMailPro](https://realmailpro.online) API. **Not published to npm** — build from source.

## Install (from source)

```bash
cd sdk/javascript && npm install && npm run build
```

Node 18+ (uses global `fetch`). Zero runtime dependencies.

## Usage

```ts
import { RealMailPro, InsufficientCreditsError } from "@zyqentra/realmailpro";

const client = new RealMailPro(); // reads REALMAILPRO_API_KEY
const inbox = await client.inboxes.create({ service: "gmail_alias" });
const { data } = await client.inboxes.messages(inbox.id);
const otp = data.find((m) => m.otp)?.otp;
```

| Method | Endpoint | Credits |
| --- | --- | --- |
| `services.list()` | `GET /services` | not stated |
| `inboxes.create({ service })` | `POST /inboxes` | 1 alias · 3 original |
| `inboxes.messages(id)` | `GET /inboxes/{id}/messages` | 3 |
| `messages.get(id)` | `GET /messages/{id}` | 3 |
| `account.balance()` | `GET /account/balance` | free |
| `account.usage()` | `GET /account/usage` | free |

Options: `apiKey`, `baseUrl`, `timeoutMs` (30000), `maxRetries` (2, GET only), `fetch`.

Errors: `AuthenticationError` 401, `InsufficientCreditsError` 402, `AccountSuspendedError` 403, `NotFoundError` 404, `RateLimitError` 429, `UpstreamError` 502, plus `TimeoutError` and `ConnectionError`. `POST /inboxes` is never retried.

Schemas for `/services` and `/account/usage` are **NEEDS VERIFICATION**. Server-side use only. MIT.

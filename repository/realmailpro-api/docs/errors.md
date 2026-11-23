# Errors

Errors use HTTP status codes and a JSON envelope:

```json
{ "error": { "code": "unauthorized", "message": "Missing or invalid API key." } }
```

| Status | Code | Meaning | Charged |
| --- | --- | --- | --- |
| 401 | `unauthorized` | Missing, invalid or revoked key | No |
| 402 | `insufficient_credits` | Add funds | No |
| 403 | `suspended` | Account under review | No |
| 404 | `not_found` | Inbox/message not yours, or unknown endpoint | No |
| 429 | `rate_limited` | Too many requests per minute | No |
| 502 | `upstream_error` | Mail service failed | No (refunded) |

## Handling

- **401** — fix the key; do not retry.
- **402** — top up, then retry.
- **404** — check the ID belongs to your account and the inbox has not expired (10 minutes).
- **429** — exponential backoff; honour `Retry-After` if present.
- **502** — read requests can be retried after a short delay.
- **Never auto-retry `POST /inboxes`** — it is billable and not documented as idempotent.

> **Needs verification:** only the 401 body has been observed. Other bodies are assumed to use the same envelope.

# API reference

Base URL: `https://realmailpro.online/api/public/v1` · Auth: `Authorization: Bearer YOUR_API_KEY` · JSON

> **Status: requires verification.** Endpoints are published by RealMailPro. Zyqentra has observed the base URL and 401 envelope, but has not made a successful authenticated call. Example responses are RealMailPro's own, with values elided as `…`.

| Method | Path | Purpose | Credits |
| --- | --- | --- | --- |
| GET | `/services` | List services, availability and price | Not stated |
| POST | `/inboxes` | Create a 10-minute inbox. Body: `{ "service": "gmail_alias" | "outlook_alias" | "gmail_original" | "outlook_original" }` | 1 (alias) / 3 (original) |
| GET | `/inboxes/{id}/messages` | Poll inbox; messages include detected `otp` | 3 |
| GET | `/messages/{id}` | Full message (text + HTML) | 3 |
| GET | `/account/balance` | Wallet balance | Free |
| GET | `/account/usage` | Last 100 requests | Free |

## GET /services

List services, availability and price.

Cost: Not stated.

```bash
curl https://realmailpro.online/api/public/v1/services \
  -H "Authorization: Bearer $REALMAILPRO_API_KEY"
```

> **Schema NEEDS VERIFICATION.**

## POST /inboxes

Create a 10-minute inbox. Body: `{ "service": "gmail_alias" | "outlook_alias" | "gmail_original" | "outlook_original" }`.

Cost: {c} credits.

```bash
curl -X POST https://realmailpro.online/api/public/v1/inboxes \
  -H "Authorization: Bearer $REALMAILPRO_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{ "service": "gmail_alias" }'
```

Published example response:

```json
{ "id": "8f1c…", "address": "name+abc@outlook.com", "expires_at": "…", "created_at": "…" }
```

## GET /inboxes/{id}/messages

Poll inbox; messages include detected `otp`.

Cost: {c} credits.

```bash
curl https://realmailpro.online/api/public/v1/inboxes/INBOX_ID/messages \
  -H "Authorization: Bearer $REALMAILPRO_API_KEY"
```

Published example response:

```json
{ "inbox": { "id": "…", "address": "…", "active": true }, "data": [ { "id": "…", "from": "…", "subject": "…", "otp": "482913", "received_at": "…" } ] }
```

## GET /messages/{id}

Full message (text + HTML).

Cost: {c} credits.

```bash
curl https://realmailpro.online/api/public/v1/messages/MESSAGE_ID \
  -H "Authorization: Bearer $REALMAILPRO_API_KEY"
```

Published example response:

```json
{ "id": "…", "to": "…", "from": "…", "subject": "…", "text": "…", "html": "…", "otp": "482913" }
```

## GET /account/balance

Wallet balance.

Cost: Free.

```bash
curl https://realmailpro.online/api/public/v1/account/balance \
  -H "Authorization: Bearer $REALMAILPRO_API_KEY"
```

Published example response:

```json
{ "balance": 104998, "currency": "credits" }
```

## GET /account/usage

Last 100 requests.

Cost: Free.

```bash
curl https://realmailpro.online/api/public/v1/account/usage \
  -H "Authorization: Bearer $REALMAILPRO_API_KEY"
```

> **Schema NEEDS VERIFICATION.**

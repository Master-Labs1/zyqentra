# Authentication

Send your key on every request using either header:

```http
Authorization: Bearer YOUR_API_KEY
X-API-Key: YOUR_API_KEY
```

- Public examples show keys beginning with `rmp_live_`. Treat keys as opaque strings.
- Keys are shown once, stored by RealMailPro only as a hash, and can be revoked.
- Up to 3 keys can be active. Keys unlock after a first verified deposit of $10.

## Unauthorized response (observed live, 2026-11-23)

```json
{"error":{"code":"unauthorized","message":"Missing or invalid API key."}}
```

## Keep keys safe

- Call the API from servers or CI only — never from browser or mobile code. (The API sends
  `access-control-allow-origin: *`, so a browser call would expose your key.)
- Load keys from environment variables or a secret manager; keep `.env` out of Git.
- Use one key per environment and rotate immediately if a key leaks.

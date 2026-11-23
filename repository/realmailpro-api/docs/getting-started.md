# Getting started

> Source: RealMailPro public docs (<https://realmailpro.online/docs>), researched 2026-11-23.

1. **Create an account** at <https://realmailpro.online/auth?tab=signup>.
2. **Add credits** — at least $10 on the [Developer API page](https://realmailpro.online/developer-api).
   API deposits are USDT (BEP20), verified on-chain. $1 = 1,000 credits. Credits never expire.
3. **Generate an API key** in your dashboard. It is shown once. Up to 3 keys can be active.
4. **Store the key** in an environment variable:

   ```bash
   export REALMAILPRO_API_KEY=YOUR_API_KEY   # never commit this value
   ```

5. **Create an inbox**:

   ```bash
   curl -X POST https://realmailpro.online/api/public/v1/inboxes \
     -H "Authorization: Bearer $REALMAILPRO_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{ "service": "gmail_alias" }'
   ```

   > **Needs verification:** RealMailPro's published cURL example sends no body. Always send `service` until the default is confirmed.

6. **Poll for the OTP** with `GET /inboxes/{id}/messages` every ~10 seconds. Each poll costs 3 credits.

Next: [Authentication](authentication.md) · [API reference](api-reference.md)

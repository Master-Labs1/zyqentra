# Examples

| Example | Path | Notes |
| --- | --- | --- |
| cURL scripts | [`examples/curl`](../examples/curl) | `balance.sh`, `create-inbox.sh`, `poll-inbox.sh`, `read-message.sh` |
| JavaScript (no SDK) | [`examples/javascript/poll-otp.mjs`](../examples/javascript/poll-otp.mjs) | Node 18+, uses `fetch` |
| TypeScript (SDK) | [`examples/typescript/poll-otp.ts`](../examples/typescript/poll-otp.ts) | Uses `sdk/javascript` source |
| Python (SDK) | [`examples/python/poll_otp.py`](../examples/python/poll_otp.py) | Uses `sdk/python` source |

All examples read `REALMAILPRO_API_KEY` from the environment and exit if it is missing.
They spend real credits.

## End-to-end sign-up test

1. `POST /inboxes` → get `address` and `id`.
2. Submit the address in the sign-up form under test.
3. Poll `GET /inboxes/{id}/messages` until a message has an `otp`.
4. Finish the flow before the inbox expires (10 minutes).

Use the API only for accounts you own or are authorised to test — see
<https://realmailpro.online/terms>.

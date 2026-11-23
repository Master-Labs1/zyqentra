# Rate limits

RealMailPro applies fair per-key limits measured per minute and returns `429 rate_limited` when exceeded.

> **Needs verification:** requests-per-minute values, rate-limit headers and whether `Retry-After` is sent are **not published**.

The RealMailPro website limits inbox generation to one per 30 seconds; whether this applies to the API is not published.

## Recommended client behaviour

- Poll inboxes every ~10 seconds, not in a tight loop (each poll costs 3 credits).
- On 429, wait `Retry-After` seconds if present, otherwise back off exponentially (1 s, 2 s, 4 s…) with jitter.
- Both SDKs in this repository do this automatically for GET requests only.

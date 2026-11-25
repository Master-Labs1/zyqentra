# zyqentra-realmailpro (Python)

Pre-release Python client for the [RealMailPro](https://realmailpro.online) API. **Not published to PyPI** — install from source.

```bash
pip install -e sdk/python
```

Python 3.9+, standard library only.

```python
from realmailpro import RealMailPro, InsufficientCreditsError

client = RealMailPro()  # reads REALMAILPRO_API_KEY
inbox = client.inboxes.create("gmail_alias")
messages = client.inboxes.messages(inbox["id"])
otp = next((m["otp"] for m in messages["data"] if m.get("otp")), None)
```

Methods: `services.list()`, `inboxes.create(service)`, `inboxes.messages(id)`, `messages.get(id)`, `account.balance()`, `account.usage()`.
Exceptions mirror the TypeScript SDK (`AuthenticationError`, `InsufficientCreditsError`, `AccountSuspendedError`, `NotFoundError`, `RateLimitError`, `UpstreamError`, `TimeoutError`, `ConnectionError`). GET requests retry on 429/5xx; `POST /inboxes` never retries.

Unpublished schemas are marked NEEDS VERIFICATION. MIT.

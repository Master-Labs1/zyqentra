"""RealMailPro API client using only the Python standard library."""
from __future__ import annotations

import json
import os
import random
import socket
import time
import urllib.error
import urllib.parse
import urllib.request
from typing import Any, Callable, Optional, cast

from .errors import (
    ConnectionError,
    RateLimitError,
    RealMailProError,
    TimeoutError,
    error_from_response,
)
from .types import SERVICES, Balance, Inbox, InboxMessages, Message, ServicesResponse, UsageResponse

DEFAULT_BASE_URL = "https://realmailpro.online/api/public/v1"
_RETRYABLE = {429, 500, 502, 503, 504}

Opener = Callable[..., Any]


def _path_id(value: str, name: str) -> str:
    if not isinstance(value, str) or not value.strip():
        raise RealMailProError(f"{name} must be a non-empty string", code="invalid_argument")
    return urllib.parse.quote(value, safe="")


class _Services:
    def __init__(self, client: "RealMailPro") -> None:
        self._c = client

    def list(self) -> ServicesResponse:
        """GET /services — schema NEEDS VERIFICATION."""
        return cast(ServicesResponse, self._c._request("GET", "/services"))


class _Inboxes:
    def __init__(self, client: "RealMailPro") -> None:
        self._c = client

    def create(self, service: str) -> Inbox:
        """POST /inboxes — creates a 10-minute inbox. Billable; never retried automatically."""
        if service not in SERVICES:
            raise RealMailProError(f"service must be one of: {', '.join(SERVICES)}", code="invalid_argument")
        return cast(Inbox, self._c._request("POST", "/inboxes", {"service": service}))

    def messages(self, inbox_id: str) -> InboxMessages:
        """GET /inboxes/{id}/messages — billable (3 credits)."""
        return cast(InboxMessages, self._c._request("GET", f"/inboxes/{_path_id(inbox_id, 'inbox_id')}/messages"))


class _Messages:
    def __init__(self, client: "RealMailPro") -> None:
        self._c = client

    def get(self, message_id: str) -> Message:
        """GET /messages/{id} — billable (3 credits)."""
        return cast(Message, self._c._request("GET", f"/messages/{_path_id(message_id, 'message_id')}"))


class _Account:
    def __init__(self, client: "RealMailPro") -> None:
        self._c = client

    def balance(self) -> Balance:
        """GET /account/balance — free."""
        return cast(Balance, self._c._request("GET", "/account/balance"))

    def usage(self) -> UsageResponse:
        """GET /account/usage — free. Schema NEEDS VERIFICATION."""
        return cast(UsageResponse, self._c._request("GET", "/account/usage"))


class RealMailPro:
    """Client for the RealMailPro API.

    The API key is read from ``api_key`` or the ``REALMAILPRO_API_KEY`` environment variable
    and is never logged. GET requests are retried on 429/5xx/network errors; POST is not.
    """

    def __init__(
        self,
        api_key: Optional[str] = None,
        *,
        base_url: str = DEFAULT_BASE_URL,
        timeout: float = 30.0,
        max_retries: int = 2,
        opener: Optional[Opener] = None,
    ) -> None:
        key = api_key or os.environ.get("REALMAILPRO_API_KEY")
        if not key:
            raise RealMailProError(
                "Missing API key. Pass api_key or set the REALMAILPRO_API_KEY environment variable.",
                code="missing_api_key",
            )
        self._api_key = key
        self.base_url = base_url.rstrip("/")
        self.timeout = timeout
        self.max_retries = max(0, max_retries)
        self._open: Opener = opener or urllib.request.urlopen
        self.services = _Services(self)
        self.inboxes = _Inboxes(self)
        self.messages = _Messages(self)
        self.account = _Account(self)

    def __repr__(self) -> str:  # never expose the key
        return f"RealMailPro(base_url={self.base_url!r})"

    def _request(self, method: str, path: str, body: Optional[dict] = None) -> Any:
        retries = self.max_retries if method == "GET" else 0
        attempt = 0
        while True:
            try:
                return self._once(method, path, body)
            except RealMailProError as err:
                retryable = isinstance(err, (ConnectionError, TimeoutError)) or (
                    err.status is not None and err.status in _RETRYABLE
                )
                if not retryable or attempt >= retries:
                    raise
                hinted = err.retry_after if isinstance(err, RateLimitError) else None
                wait = hinted if hinted is not None else (2 ** attempt) * 0.5 + random.random() * 0.1
                time.sleep(min(wait, 30.0))
                attempt += 1

    def _once(self, method: str, path: str, body: Optional[dict]) -> Any:
        headers = {"Authorization": f"Bearer {self._api_key}", "Accept": "application/json"}
        data = None
        if body is not None:
            headers["Content-Type"] = "application/json"
            data = json.dumps(body).encode("utf-8")
        req = urllib.request.Request(f"{self.base_url}{path}", data=data, headers=headers, method=method)
        try:
            with self._open(req, timeout=self.timeout) as res:
                raw = res.read()
        except urllib.error.HTTPError as http_err:
            raw = http_err.read() if hasattr(http_err, "read") else b""
            parsed = _parse(raw)
            retry_after = _retry_after(http_err.headers.get("Retry-After") if http_err.headers else None)
            raise error_from_response(http_err.code, parsed, retry_after) from None
        except (socket.timeout, TimeoutError) as exc:
            raise TimeoutError(f"Request timed out after {self.timeout} s", code="timeout") from exc
        except urllib.error.URLError as exc:
            if isinstance(exc.reason, socket.timeout):
                raise TimeoutError(f"Request timed out after {self.timeout} s", code="timeout") from exc
            raise ConnectionError("Could not reach the RealMailPro API", code="connection_error") from exc
        parsed = _parse(raw)
        if parsed is None:
            raise RealMailProError("Expected a JSON response body", code="invalid_response")
        return parsed


def _parse(raw: bytes) -> Any:
    if not raw:
        return None
    try:
        return json.loads(raw.decode("utf-8"))
    except (ValueError, UnicodeDecodeError):
        return None


def _retry_after(value: Optional[str]) -> Optional[float]:
    try:
        seconds = float(value) if value is not None else None
    except ValueError:
        return None
    return seconds if seconds is not None and seconds > 0 else None

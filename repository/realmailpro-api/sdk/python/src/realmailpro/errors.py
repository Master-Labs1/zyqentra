"""Exception hierarchy for the RealMailPro client."""
from __future__ import annotations

from typing import Any, Dict, Optional, Type


class RealMailProError(Exception):
    """Base class for every error raised by the client."""

    def __init__(self, message: str, *, status: Optional[int] = None, code: str = "error") -> None:
        super().__init__(message)
        self.message = message
        self.status = status
        self.code = code


class AuthenticationError(RealMailProError):
    """401 unauthorized — missing, invalid or revoked key."""


class InsufficientCreditsError(RealMailProError):
    """402 insufficient_credits — add funds."""


class AccountSuspendedError(RealMailProError):
    """403 suspended — account under review."""


class NotFoundError(RealMailProError):
    """404 not_found — inbox/message not yours, or unknown endpoint."""


class RateLimitError(RealMailProError):
    """429 rate_limited — too many requests per minute."""

    def __init__(self, message: str, *, status: Optional[int] = None, code: str = "rate_limited",
                 retry_after: Optional[float] = None) -> None:
        super().__init__(message, status=status, code=code)
        self.retry_after = retry_after


class UpstreamError(RealMailProError):
    """502 upstream_error — mail service failed (not charged)."""


class TimeoutError(RealMailProError):  # noqa: A001 - intentional, namespaced in this package
    """The request exceeded the configured timeout."""


class ConnectionError(RealMailProError):  # noqa: A001
    """The API could not be reached."""


_BY_STATUS: Dict[int, Type[RealMailProError]] = {
    401: AuthenticationError,
    402: InsufficientCreditsError,
    403: AccountSuspendedError,
    404: NotFoundError,
    502: UpstreamError,
}


def error_from_response(status: int, body: Any, retry_after: Optional[float] = None) -> RealMailProError:
    envelope = body.get("error") if isinstance(body, dict) else None
    code = envelope.get("code") if isinstance(envelope, dict) and isinstance(envelope.get("code"), str) else f"http_{status}"
    message = (
        envelope.get("message")
        if isinstance(envelope, dict) and isinstance(envelope.get("message"), str)
        else f"Request failed with status {status}"
    )
    if status == 429:
        return RateLimitError(message, status=status, code=code, retry_after=retry_after)
    cls = _BY_STATUS.get(status, RealMailProError)
    return cls(message, status=status, code=code)

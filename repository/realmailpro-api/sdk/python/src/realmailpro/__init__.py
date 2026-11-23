"""Pre-release Python client for the RealMailPro API. Not published to PyPI."""
from .client import DEFAULT_BASE_URL, RealMailPro
from .errors import (
    AccountSuspendedError,
    AuthenticationError,
    ConnectionError,
    InsufficientCreditsError,
    NotFoundError,
    RateLimitError,
    RealMailProError,
    TimeoutError,
    UpstreamError,
)

__all__ = [
    "DEFAULT_BASE_URL",
    "RealMailPro",
    "RealMailProError",
    "AuthenticationError",
    "InsufficientCreditsError",
    "AccountSuspendedError",
    "NotFoundError",
    "RateLimitError",
    "UpstreamError",
    "TimeoutError",
    "ConnectionError",
]
__version__ = "0.1.0"

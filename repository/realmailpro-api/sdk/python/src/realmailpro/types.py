"""TypedDicts derived from RealMailPro's published examples. See https://realmailpro.online/docs."""
from __future__ import annotations

from typing import Any, Dict, List, Literal, Optional, TypedDict, Union

ServiceName = Literal["gmail_alias", "outlook_alias", "gmail_original", "outlook_original"]
SERVICES = ("gmail_alias", "outlook_alias", "gmail_original", "outlook_original")


class Inbox(TypedDict):
    id: str
    address: str
    expires_at: str  # timestamp; format NEEDS VERIFICATION
    created_at: str


class InboxRef(TypedDict):
    id: str
    address: str
    active: bool


# Functional syntax because "from" is a Python keyword.
MessageSummary = TypedDict(
    "MessageSummary",
    {"id": str, "from": str, "subject": str, "otp": Optional[str], "received_at": str},
    total=False,
)


class InboxMessages(TypedDict):
    inbox: InboxRef
    data: List[MessageSummary]


Message = TypedDict(
    "Message",
    {"id": str, "to": str, "from": str, "subject": str, "text": str, "html": str, "otp": Optional[str]},
    total=False,
)


class Balance(TypedDict):
    balance: int
    currency: str


# Response schemas are not published. NEEDS VERIFICATION.
ServicesResponse = Union[Dict[str, Any], List[Any]]
UsageResponse = Union[Dict[str, Any], List[Any]]

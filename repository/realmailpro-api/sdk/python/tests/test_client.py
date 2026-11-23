import io
import json
import os
import socket
import sys
import unittest
import urllib.error
from email.message import Message as Headers
from unittest import mock

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "src"))

import realmailpro  # noqa: E402
from realmailpro import (  # noqa: E402
    AccountSuspendedError,
    AuthenticationError,
    InsufficientCreditsError,
    NotFoundError,
    RateLimitError,
    RealMailPro,
    RealMailProError,
    TimeoutError,
    UpstreamError,
)

KEY = "test_key_not_real"


class FakeResponse(io.BytesIO):
    def __enter__(self):
        return self

    def __exit__(self, *a):
        self.close()


def ok(body):
    return FakeResponse(json.dumps(body).encode())


def http_error(status, body, headers=None):
    h = Headers()
    for k, v in (headers or {}).items():
        h[k] = v
    return urllib.error.HTTPError("url", status, "err", h, io.BytesIO(json.dumps(body).encode()))


class Opener:
    def __init__(self, *outcomes):
        self.outcomes = list(outcomes)
        self.requests = []

    def __call__(self, req, timeout=None):
        self.requests.append(req)
        nxt = self.outcomes.pop(0)
        if isinstance(nxt, BaseException):
            raise nxt
        return nxt


class ClientTests(unittest.TestCase):
    def test_bearer_header_and_url(self):
        op = Opener(ok({"balance": 104998, "currency": "credits"}))
        res = RealMailPro(KEY, opener=op).account.balance()
        self.assertEqual(res["balance"], 104998)
        req = op.requests[0]
        self.assertEqual(req.full_url, "https://realmailpro.online/api/public/v1/account/balance")
        self.assertEqual(req.get_header("Authorization"), f"Bearer {KEY}")

    def test_missing_key(self):
        with mock.patch.dict(os.environ, {}, clear=True):
            with self.assertRaises(RealMailProError):
                RealMailPro()

    def test_env_key(self):
        op = Opener(ok({"balance": 1, "currency": "credits"}))
        with mock.patch.dict(os.environ, {"REALMAILPRO_API_KEY": "env_key"}):
            RealMailPro(opener=op).account.balance()
        self.assertEqual(op.requests[0].get_header("Authorization"), "Bearer env_key")

    def test_repr_hides_key(self):
        self.assertNotIn(KEY, repr(RealMailPro(KEY)))

    def test_create_inbox_body(self):
        op = Opener(ok({"id": "i1", "address": "a", "expires_at": "x", "created_at": "y"}))
        inbox = RealMailPro(KEY, opener=op).inboxes.create("gmail_alias")
        self.assertEqual(inbox["id"], "i1")
        self.assertEqual(op.requests[0].get_method(), "POST")
        self.assertEqual(json.loads(op.requests[0].data), {"service": "gmail_alias"})

    def test_invalid_service(self):
        op = Opener()
        with self.assertRaises(RealMailProError):
            RealMailPro(KEY, opener=op).inboxes.create("yahoo")
        self.assertEqual(op.requests, [])

    def test_error_mapping(self):
        cases = [
            (401, "unauthorized", AuthenticationError),
            (402, "insufficient_credits", InsufficientCreditsError),
            (403, "suspended", AccountSuspendedError),
            (404, "not_found", NotFoundError),
            (502, "upstream_error", UpstreamError),
        ]
        for status, code, cls in cases:
            with self.subTest(status=status):
                op = Opener(http_error(status, {"error": {"code": code, "message": "nope"}}))
                with self.assertRaises(cls) as ctx:
                    RealMailPro(KEY, opener=op, max_retries=0).account.usage()
                self.assertEqual(ctx.exception.status, status)
                self.assertEqual(ctx.exception.code, code)
                self.assertEqual(ctx.exception.message, "nope")

    def test_rate_limit_retry_after(self):
        op = Opener(http_error(429, {"error": {"code": "rate_limited", "message": "x"}}, {"Retry-After": "7"}))
        with self.assertRaises(RateLimitError) as ctx:
            RealMailPro(KEY, opener=op, max_retries=0).account.balance()
        self.assertEqual(ctx.exception.retry_after, 7.0)

    @mock.patch("realmailpro.client.time.sleep")
    def test_get_retried_then_succeeds(self, sleep):
        op = Opener(
            http_error(429, {"error": {"code": "rate_limited", "message": "x"}}, {"Retry-After": "1"}),
            ok({"inbox": {"id": "i", "address": "a", "active": True}, "data": []}),
        )
        res = RealMailPro(KEY, opener=op).inboxes.messages("i")
        self.assertEqual(res["data"], [])
        self.assertEqual(len(op.requests), 2)
        sleep.assert_called_once_with(1.0)

    @mock.patch("realmailpro.client.time.sleep")
    def test_post_never_retried(self, sleep):
        op = Opener(http_error(502, {"error": {"code": "upstream_error", "message": "x"}}), ok({}))
        with self.assertRaises(UpstreamError):
            RealMailPro(KEY, opener=op, max_retries=5).inboxes.create("outlook_alias")
        self.assertEqual(len(op.requests), 1)
        sleep.assert_not_called()

    def test_timeout(self):
        op = Opener(urllib.error.URLError(socket.timeout("timed out")))
        with self.assertRaises(TimeoutError):
            RealMailPro(KEY, opener=op, max_retries=0).account.balance()

    def test_path_encoding_and_empty_id(self):
        op = Opener(ok({"id": "a/b"}))
        RealMailPro(KEY, opener=op).messages.get("a/b?x")
        self.assertEqual(op.requests[0].full_url, "https://realmailpro.online/api/public/v1/messages/a%2Fb%3Fx")
        with self.assertRaises(RealMailProError):
            RealMailPro(KEY, opener=op).messages.get("  ")

    def test_version(self):
        self.assertEqual(realmailpro.__version__, "0.1.0")


if __name__ == "__main__":
    unittest.main()

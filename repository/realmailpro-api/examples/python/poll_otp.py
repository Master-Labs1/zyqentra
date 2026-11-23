"""Create an inbox and wait for an OTP using the pre-release SDK.

Usage:  REALMAILPRO_API_KEY=... python examples/python/poll_otp.py
Spends credits: 1–3 for the inbox plus 3 per poll.
"""
import os
import sys
import time

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", "..", "sdk", "python", "src"))

from realmailpro import RateLimitError, RealMailPro  # noqa: E402

if not os.environ.get("REALMAILPRO_API_KEY"):
    sys.exit("Set REALMAILPRO_API_KEY first.")

client = RealMailPro()
inbox = client.inboxes.create(sys.argv[1] if len(sys.argv) > 1 else "gmail_alias")
print(f"Use this address: {inbox['address']} (expires {inbox['expires_at']})")

deadline = time.time() + 300
while time.time() < deadline:
    time.sleep(10)
    try:
        messages = client.inboxes.messages(inbox["id"])
    except RateLimitError:
        continue
    for message in messages["data"]:
        if message.get("otp"):
            print(f"OTP from {message.get('from')}: {message['otp']}")
            sys.exit(0)
    print("No OTP yet…")
sys.exit("Timed out waiting for an OTP.")

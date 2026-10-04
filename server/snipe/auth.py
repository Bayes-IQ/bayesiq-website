"""Bearer check for estate-scout, magic-link and session signing for the operator, and the Resend send.

Secrets come from the environment only and are compared in constant time. Nothing
here logs or returns a token, link, nonce, signature or address.
"""

import hashlib
import hmac
import json
import os
import re
import secrets
import time
from urllib import request

LINK_TTL = 15 * 60
SESSION_TTL = 30 * 24 * 3600
SESSION_COOKIE = "__Host-snipe_session"
SENDS_PER_HOUR = 5
RESEND_URL = "https://api.resend.com/emails"
DEFAULT_FROM = "website@bayes-iq.com"

_LINK = re.compile(r"^([0-9]{1,12})\.([0-9a-f]{32})\.([0-9a-f]{64})$")
_SESSION = re.compile(r"^([0-9]{1,12})\.([0-9a-f]{64})$")
_sent = []  # wall-clock times of the link emails this process sent in the last hour


def bearer_ok(header, token):
    """True when `Authorization: Bearer <token>` matches, compared in constant time (only the length can leak)."""
    if not token or not header or not header.startswith("Bearer "):
        return False
    return hmac.compare_digest(header[len("Bearer "):].encode(), token.encode())


def _sign(secret, message):
    return hmac.new(secret.encode(), message.encode(), hashlib.sha256).hexdigest()


def make_link_token(secret):
    exp = int(time.time()) + LINK_TTL
    nonce = secrets.token_hex(16)
    return f"{exp}.{nonce}.{_sign(secret, f'link|{exp}|{nonce}')}"


def check_link_token(secret, token):
    """The nonce of a well-signed, unexpired link token; None otherwise."""
    m = _LINK.match(token or "")
    if not m:
        return None
    exp, nonce, sig = m.groups()
    if not hmac.compare_digest(sig, _sign(secret, f"link|{exp}|{nonce}")) or int(exp) <= time.time():
        return None
    return nonce


def make_session(secret):
    exp = int(time.time()) + SESSION_TTL
    return f"{exp}.{_sign(secret, f'session|{exp}')}"


def session_ok(secret, cookie):
    m = _SESSION.match(cookie or "")
    if not m:
        return False
    exp, sig = m.groups()
    return hmac.compare_digest(sig, _sign(secret, f"session|{exp}")) and int(exp) > time.time()


def email_matches(given, operator):
    return bool(given) and given.strip().lower() == operator.strip().lower()


def take_send_slot():
    """Reserve one of the 5 link emails allowed per rolling hour (in-memory). False when none is left."""
    now = time.time()
    _sent[:] = [t for t in _sent if t > now - 3600]
    if len(_sent) >= SENDS_PER_HOUR:
        return False
    _sent.append(now)
    return True


def send_email(to, subject, text):
    """POST /emails to Resend: the same request the website's resend SDK makes. Raises on failure."""
    body = json.dumps({"from": os.environ.get("SNIPE_FROM_EMAIL") or DEFAULT_FROM, "to": [to],
                       "subject": subject, "text": text}).encode()
    req = request.Request(RESEND_URL, data=body, method="POST", headers={
        "Authorization": f"Bearer {os.environ['RESEND_API_KEY']}", "Content-Type": "application/json",
        "User-Agent": "bayesiq-snipe/1.0"})
    with request.urlopen(req, timeout=15) as resp:
        resp.read(65536)

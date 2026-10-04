"""snipe-sales: the operator's Deal Desk, Deal Deck and Price Watch, served from the latest sweep bundle.

Reached only through `SnipeHostMiddleware`, when the request Host equals SNIPE_HOST.
Configuration is read per request; anything missing fails closed with 503.
"""

from dataclasses import dataclass
from datetime import datetime, timezone
import json
import logging
import os
from pathlib import Path
import re

from fastapi import BackgroundTasks, FastAPI, Request
from fastapi.responses import HTMLResponse, JSONResponse, PlainTextResponse, RedirectResponse, Response

from snipe import auth, pages, store
from snipe.vendor import BUNDLE_VERSION, EXPORT_VERSION

logger = logging.getLogger("bayesiq.snipe")

MAX_SWEEP = 10_000_000
MAX_PHOTO = 5_000_000
MAX_SWIPE = 4_096
PRICE = re.compile(r"^[0-9]{1,9}(\.[0-9]{1,2})?$")
VERDICTS = ("pass", "maybe", "want")

PRIVACY_HEADERS = {
    "X-Robots-Tag": "noindex, nofollow, noarchive",
    "Cache-Control": "private, no-store",
    "Referrer-Policy": "no-referrer",
    "Content-Security-Policy": ("default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; "
                                "img-src 'self' data:; connect-src 'self'; form-action 'self'; base-uri 'none'; "
                                "frame-ancestors 'none'"),
}


@dataclass(frozen=True)
class Config:
    host: str
    data_dir: str
    api_token: str
    session_secret: str
    operator_email: str


def load_config():
    """The snipe configuration, or None when any required piece is missing (fail closed)."""
    env = os.environ
    data_dir = env.get("SNIPE_DATA_DIR", "")
    values = (env.get("SNIPE_HOST", ""), data_dir, env.get("SNIPE_API_TOKEN", ""),
              env.get("SNIPE_SESSION_SECRET", ""), env.get("SNIPE_OPERATOR_EMAIL", ""))
    if not all(values) or not Path(data_dir).is_dir():
        return None
    return Config(*values)


snipe_app = FastAPI(title="snipe-sales", docs_url=None, redoc_url=None, openapi_url=None)


@snipe_app.middleware("http")
async def privacy_and_config(request: Request, call_next):
    if request.url.path == "/robots.txt":
        response = await call_next(request)
    elif (cfg := load_config()) is None:
        response = PlainTextResponse("Not configured.", status_code=503)
    else:
        request.state.cfg = cfg
        try:
            response = await call_next(request)
        except Exception as exc:  # keep the privacy headers on failures too; never log request content
            logger.error("snipe: %s %s failed (%s)", request.method, request.url.path, type(exc).__name__)
            response = PlainTextResponse("Internal error.", status_code=500)
    for key, value in PRIVACY_HEADERS.items():
        response.headers[key] = value
    return response


@snipe_app.get("/robots.txt")
def robots():
    return PlainTextResponse("User-agent: *\nDisallow: /\n")


# --- helpers ---------------------------------------------------------------------------------------

class TooLarge(Exception):
    pass


async def read_capped(request, cap):
    """The request body, refusing (TooLarge) anything over `cap` bytes by header or by actual length."""
    declared = request.headers.get("content-length")
    if declared and declared.isdigit() and int(declared) > cap:
        raise TooLarge
    chunks, size = [], 0
    async for chunk in request.stream():
        size += len(chunk)
        if size > cap:
            raise TooLarge
        chunks.append(chunk)
    return b"".join(chunks)


def error(status, message):
    return JSONResponse({"error": message}, status_code=status)


def machine_ok(request):
    """Bearer token only; a session cookie never authorizes the machine API."""
    return auth.bearer_ok(request.headers.get("authorization"), request.state.cfg.api_token)


def has_session(request):
    return auth.session_ok(request.state.cfg.session_secret, request.cookies.get(auth.SESSION_COOKIE))


def to_utc(generated_at):
    """The offset-aware `generated_at` normalized to UTC in the swipe `at` format, or None if it is not one."""
    if not isinstance(generated_at, str):
        return None
    try:
        moment = datetime.fromisoformat(generated_at)
    except ValueError:
        return None
    if moment.tzinfo is None or moment.utcoffset() is None:
        return None
    return store.utc_stamp(moment.astimezone(timezone.utc))


def _version(value, expected):
    return type(value) is int and value == expected


def validate_bundle(doc):
    """The path of the first field the pages cannot read, or None. Unknown keys are kept."""
    if not isinstance(doc, dict):
        return "bundle"
    if not _version(doc.get("schema_version"), BUNDLE_VERSION):
        return "schema_version"
    if to_utc(doc.get("generated_at")) is None:
        return "generated_at"
    desk = doc.get("desk")
    if not isinstance(desk, dict):
        return "desk"
    if not isinstance(desk.get("title"), str):
        return "desk.title"
    if not isinstance(desk.get("decisions"), list):
        return "desk.decisions"
    if not isinstance(desk.get("watchlists"), list):
        return "desk.watchlists"
    for n, w in enumerate(desk["watchlists"]):
        if not isinstance(w, dict) or not isinstance(w.get("label"), str):
            return f"desk.watchlists[{n}].label"
        if not isinstance(w.get("deals"), list):
            return f"desk.watchlists[{n}].deals"
    deck = doc.get("deck")
    if not isinstance(deck, dict) or not isinstance(deck.get("cards"), list):
        return "deck.cards"
    for n, card in enumerate(deck["cards"]):
        for key in ("ref", "slug"):
            if not isinstance(card, dict) or not isinstance(card.get(key), str):
                return f"deck.cards[{n}].{key}"
    prices = doc.get("prices")
    if not isinstance(prices, dict):
        return "prices"
    if not _version(prices.get("schema_version"), EXPORT_VERSION):
        return "prices.schema_version"
    if not isinstance(prices.get("watchlists"), list):
        return "prices.watchlists"
    return None


def valid_ref(ref):
    return isinstance(ref, str) and ref.count(":") >= 2 and len(ref) <= 512


# --- machine API (bearer) --------------------------------------------------------------------------

@snipe_app.post("/api/sweeps")
async def post_sweep(request: Request):
    if not machine_ok(request):
        return error(401, "unauthorized")
    try:
        raw = await read_capped(request, MAX_SWEEP)
    except TooLarge:
        return error(413, "too large")
    try:
        text = raw.decode("utf-8")
        doc = json.loads(text)
    except (UnicodeDecodeError, json.JSONDecodeError):
        return error(400, "expected JSON")
    problem = validate_bundle(doc)
    if problem:
        return error(422, problem)
    cfg = request.state.cfg
    stored_at = store.put_sweep(cfg.data_dir, doc["generated_at"], to_utc(doc["generated_at"]), text)
    logger.info("snipe: sweep stored")
    return {"stored_at": stored_at}


@snipe_app.put("/api/photos")
async def put_photo(request: Request, ref: str = ""):
    if not machine_ok(request):
        return error(401, "unauthorized")
    if not valid_ref(ref):
        return error(422, "ref")
    try:
        data = await read_capped(request, MAX_PHOTO)
    except TooLarge:
        return error(413, "too large")
    if not (data.startswith(b"\x89PNG") or data.startswith(b"\xff\xd8")):
        return error(415, "expected PNG or JPEG")
    name = store.save_photo(request.state.cfg.data_dir, data)
    return {"url": f"/photos/{name}"}


@snipe_app.get("/api/swipes")
def get_swipes(request: Request):
    if not machine_ok(request):
        return error(401, "unauthorized")
    return {"swipes": store.list_swipes(request.state.cfg.data_dir)}


# --- browser side (operator session) ---------------------------------------------------------------

@snipe_app.post("/api/swipes")
async def post_swipe(request: Request):
    cfg = request.state.cfg
    if not has_session(request):
        return error(401, "sign in")
    # A missing Origin is refused too: browsers always send it on a fetch POST, so only a non-browser omits it.
    if request.headers.get("origin") != f"https://{cfg.host}":
        return error(403, "origin")
    try:
        doc = json.loads(await read_capped(request, MAX_SWIPE))
    except TooLarge:
        return error(413, "too large")
    except (UnicodeDecodeError, json.JSONDecodeError):
        return error(400, "expected JSON")
    if not isinstance(doc, dict) or not valid_ref(doc.get("ref")):
        return error(422, "ref")
    if doc.get("verdict") not in VERDICTS:
        return error(422, "verdict")
    if not isinstance(doc.get("price"), str) or not PRICE.match(doc["price"]):
        return error(422, "price")
    alert_id = doc.get("alert_id")
    if alert_id is not None and not (isinstance(alert_id, str) and len(alert_id) <= 512):
        return error(422, "alert_id")
    at = store.add_swipe(cfg.data_dir, doc["ref"], doc["verdict"], doc["price"], alert_id)
    return JSONResponse({"at": at}, status_code=201)


@snipe_app.get("/photos/{name}")
def get_photo(request: Request, name: str):
    if not has_session(request):
        return error(401, "sign in")
    path = store.photo_path(request.state.cfg.data_dir, name)
    if path is None or not os.path.isfile(path):
        return PlainTextResponse("Not found.", status_code=404)
    kind = "image/png" if path.endswith(".png") else "image/jpeg"
    with open(path, "rb") as stream:
        data = stream.read()
    return Response(data, media_type=kind, headers={"X-Content-Type-Options": "nosniff"})


def _page(request, render):
    if not has_session(request):
        return RedirectResponse("/login", status_code=303)
    cfg = request.state.cfg
    row = store.latest_sweep(cfg.data_dir)
    if row is None:
        return HTMLResponse(pages.no_sweep_page())
    generated_utc, body = row
    doc = pages.overlay(json.loads(body), generated_utc, store.list_swipes(cfg.data_dir))
    return HTMLResponse(render(doc))


@snipe_app.get("/")
def desk(request: Request):
    return _page(request, pages.desk_page)


@snipe_app.get("/deck")
def deck(request: Request):
    return _page(request, pages.deck_page)


@snipe_app.get("/prices")
def prices(request: Request):
    return _page(request, pages.prices_page)


# --- login: magic link by email --------------------------------------------------------------------

def _send_link(to, link):
    try:
        auth.send_email(to, "Sign in to snipe-sales",
                        f"Sign in to snipe-sales:\n\n{link}\n\nThe link works once and expires in 15 minutes.")
    except Exception as exc:
        logger.warning("snipe: sign-in email failed (%s)", type(exc).__name__)


@snipe_app.get("/login")
def login_form():
    return HTMLResponse(pages.login_page())


@snipe_app.post("/login")
async def login_request(request: Request, background: BackgroundTasks):
    if not os.environ.get("RESEND_API_KEY"):
        return HTMLResponse(pages.message_page("Unavailable", "Email sign-in is not configured."), status_code=503)
    cfg = request.state.cfg
    form = await request.form()
    email = form.get("email")
    # Same answer either way; the email goes out after the response, so timing says nothing either.
    if isinstance(email, str) and auth.email_matches(email, cfg.operator_email) and auth.take_send_slot():
        link = f"https://{cfg.host}/login/verify?t={auth.make_link_token(cfg.session_secret)}"
        background.add_task(_send_link, cfg.operator_email, link)
    return HTMLResponse(pages.login_sent_page())


@snipe_app.get("/login/verify")
def login_verify_form(t: str = ""):
    # Only a button: mail scanners that prefetch the link do not spend it.
    return HTMLResponse(pages.verify_page(t))


@snipe_app.post("/login/verify")
async def login_verify(request: Request):
    cfg = request.state.cfg
    form = await request.form()
    token = form.get("t")
    nonce = auth.check_link_token(cfg.session_secret, token if isinstance(token, str) else "")
    if nonce is None or not store.use_nonce(cfg.data_dir, nonce):
        return HTMLResponse(pages.bad_link_page(), status_code=400)
    response = RedirectResponse("/", status_code=303)
    response.set_cookie(auth.SESSION_COOKIE, auth.make_session(cfg.session_secret), max_age=auth.SESSION_TTL,
                        path="/", secure=True, httponly=True, samesite="lax")
    return response


# --- host dispatch -----------------------------------------------------------------------------------

def _request_host(scope):
    for key, value in scope.get("headers") or []:
        if key == b"host":
            host = value.decode("latin-1").strip().lower()
            if host.startswith("["):  # IPv6 literal
                return host.split("]")[0] + "]"
            return host.rsplit(":", 1)[0] if ":" in host else host
    return ""


class SnipeHostMiddleware:
    """Pure ASGI: requests whose Host is SNIPE_HOST go to the snipe app; everything else is untouched."""

    def __init__(self, app):
        self.app = app

    async def __call__(self, scope, receive, send):
        target = os.environ.get("SNIPE_HOST", "").strip().lower()
        if target and scope["type"] in ("http", "websocket") and _request_host(scope) == target:
            # The server's access log prints the outer scope's query string, which here can hold a sign-in
            # token (?t=) or a listing ref (?ref=). The snipe app gets a copy; the logged scope gets none.
            inner = dict(scope)
            scope["query_string"] = b""
            await snipe_app(inner, receive, send)
            return
        await self.app(scope, receive, send)

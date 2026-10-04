"""snipe-sales on the audit API service: host gating, fail-closed config, machine API, login, pages.

Run from server/: python -m unittest discover -s tests -t . -v
The private audit kit is replaced by stub modules, so only requirements.txt + httpx are needed.
All data is synthetic (tests/fixtures/snipe_bundle.json came from estate-scout's site_cli
`bundle` on its synthetic examples).
"""

import copy
import json
import logging
import os
from pathlib import Path
import re
import sqlite3
import sys
import tempfile
import time
import types
import unittest
from unittest import mock
from urllib.parse import parse_qs, urlsplit

HOST = "snipe-sales.test"
ORIGIN = f"https://{HOST}"
TOKEN = "test-token-not-real"
SECRET = "test-session-secret-not-real"
OPERATOR = "operator@example.test"
SERVER = Path(__file__).resolve().parents[1]
FIXTURE = json.loads((SERVER / "tests" / "fixtures" / "snipe_bundle.json").read_text())
PNG = b"\x89PNG\r\n\x1a\n" + b"synthetic-png" * 4
JPEG = b"\xff\xd8\xff\xe0" + b"synthetic-jpeg" * 4
AUDIT_MODULES = ("dataset_loader", "schema_profiler", "quality_checker", "report_generator",
                 "assumptions_generator", "metrics_spec_generator", "dashboard_generator")
PRIVACY = {
    "x-robots-tag": "noindex, nofollow, noarchive",
    "cache-control": "private, no-store",
    "referrer-policy": "no-referrer",
    "content-security-policy": ("default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; "
                                "img-src 'self' data:; connect-src 'self'; form-action 'self'; base-uri 'none'; "
                                "frame-ancestors 'none'"),
}

main = auth = store = TestClient = None
_modules_patch = None


def setUpModule():
    global main, auth, store, TestClient, _modules_patch
    stubs = {"audit": types.ModuleType("audit")}
    for name in AUDIT_MODULES:
        module = types.ModuleType(f"audit.{name}")
        module.run = lambda *args, **kwargs: None
        stubs[f"audit.{name}"] = module
        setattr(stubs["audit"], name, module)
    _modules_patch = mock.patch.dict(sys.modules, stubs)
    _modules_patch.start()
    logging.getLogger("httpx").setLevel(logging.WARNING)  # the test client's own request log is noise
    import main as main_module
    from snipe import auth as auth_module, store as store_module
    from fastapi.testclient import TestClient as client_class
    main, auth, store, TestClient = main_module, auth_module, store_module, client_class


def tearDownModule():
    _modules_patch.stop()


def bundle(**changes):
    doc = copy.deepcopy(FIXTURE)
    doc.update(changes)
    return doc


def embedded(page, element_id):
    m = re.search(rf'<script type="application/json" id="{element_id}">(.*?)</script>', page, re.S)
    return json.loads(m.group(1).replace("<\\/", "</"))


class SnipeCase(unittest.TestCase):
    def setUp(self):
        self.data = tempfile.TemporaryDirectory()
        self.addCleanup(self.data.cleanup)
        self.env = {"SNIPE_HOST": HOST, "SNIPE_DATA_DIR": self.data.name, "SNIPE_API_TOKEN": TOKEN,
                    "SNIPE_SESSION_SECRET": SECRET, "SNIPE_OPERATOR_EMAIL": OPERATOR,
                    "RESEND_API_KEY": "test-resend-key-not-real"}
        patcher = mock.patch.dict(os.environ, self.env)
        patcher.start()
        self.addCleanup(patcher.stop)
        for name in ("SNIPE_FROM_EMAIL",):
            os.environ.pop(name, None)
        self.sent = []
        mailer = mock.patch.object(auth, "send_email", lambda to, subject, text: self.sent.append((to, subject, text)))
        mailer.start()
        self.addCleanup(mailer.stop)
        auth._sent.clear()
        self.client = TestClient(main.app, base_url=ORIGIN)
        self.other = TestClient(main.app, base_url="https://api.example.test")

    # helpers
    def machine(self, method, path, token=TOKEN, **kwargs):
        headers = kwargs.pop("headers", {})
        if token:
            headers["Authorization"] = f"Bearer {token}"
        return self.client.request(method, path, headers=headers, **kwargs)

    def push(self, doc):
        return self.machine("POST", "/api/sweeps", content=json.dumps(doc).encode())

    def request_link(self, email=OPERATOR):
        return self.client.post("/login", data={"email": email})

    def link_token(self):
        link = self.sent[-1][2].split("\n")[2]
        return parse_qs(urlsplit(link).query)["t"][0]

    def sign_in(self, client=None):
        client = client or self.client
        self.assertEqual(client.post("/login", data={"email": OPERATOR}).status_code, 200)
        r = client.post("/login/verify", data={"t": self.link_token()}, follow_redirects=False)
        self.assertEqual(r.status_code, 303)
        return r

    def swipe(self, body, origin=ORIGIN):
        headers = {"Origin": origin} if origin else {}
        return self.client.post("/api/swipes", content=json.dumps(body).encode(),
                                headers={"Content-Type": "application/json", **headers})


class T1HostGating(SnipeCase):
    def test_default_host_reaches_audit_app_only(self):
        self.assertEqual(self.other.get("/health").json(), {"status": "ok"})
        self.assertEqual(self.other.get("/prices").status_code, 404)
        self.assertEqual(self.other.post("/api/sweeps", content=b"{}").status_code, 404)
        self.assertEqual(self.other.get("/robots.txt").status_code, 404)

    def test_snipe_host_does_not_reach_audit_routes(self):
        self.assertEqual(self.client.get("/health").status_code, 404)
        self.assertEqual(self.client.get("/robots.txt").status_code, 200)

    def test_host_match_ignores_case_and_port(self):
        r = self.client.get("/robots.txt", headers={"Host": "SNIPE-SALES.test:8443"})
        self.assertEqual(r.text, "User-agent: *\nDisallow: /\n")

    def test_unset_snipe_host_leaves_audit_app_unchanged(self):
        os.environ.pop("SNIPE_HOST")
        self.assertEqual(self.client.get("/health").json(), {"status": "ok"})
        self.assertEqual(self.client.get("/robots.txt").status_code, 404)

    def test_access_log_scope_loses_the_query_string(self):
        """uvicorn logs the outer scope; the snipe app must still see ?t= while the logged scope does not."""
        import asyncio
        import snipe.app as snipe_app_module
        seen = []

        async def recorder(scope, receive, send):
            seen.append(scope["query_string"])

        async def passthrough(scope, receive, send):
            seen.append(("audit", scope["query_string"]))

        middleware = main.SnipeHostMiddleware(passthrough)
        outer = {"type": "http", "headers": [(b"host", HOST.encode())], "query_string": b"t=secret-link"}
        other = {"type": "http", "headers": [(b"host", b"api.example.test")], "query_string": b"x=1"}
        with mock.patch.object(snipe_app_module, "snipe_app", recorder):
            asyncio.run(middleware(outer, None, None))
            asyncio.run(middleware(other, None, None))
        self.assertEqual(seen, [b"t=secret-link", ("audit", b"x=1")])
        self.assertEqual((outer["query_string"], other["query_string"]), (b"", b"x=1"))

    def test_snipe_responses_skip_audit_cors(self):
        origin = {"Origin": "https://bayes-iq.com"}
        self.assertEqual(self.other.get("/health", headers=origin).headers.get("access-control-allow-origin"),
                         "https://bayes-iq.com")  # the audit CORS policy is live on other hosts
        self.assertNotIn("access-control-allow-origin", self.client.get("/robots.txt", headers=origin).headers)
        self.assertNotIn("access-control-allow-origin", self.client.get("/login", headers=origin).headers)


class T2FailClosed(SnipeCase):
    def assert_closed(self):
        self.assertEqual(self.client.get("/", follow_redirects=False).status_code, 503)
        self.assertEqual(self.push(FIXTURE).status_code, 503)
        self.assertEqual(self.client.get("/login").status_code, 503)
        self.assertEqual(self.client.get("/robots.txt").status_code, 200)

    def test_data_dir_unset(self):
        os.environ.pop("SNIPE_DATA_DIR")
        self.assert_closed()

    def test_data_dir_missing(self):
        os.environ["SNIPE_DATA_DIR"] = str(Path(self.data.name) / "absent")
        self.assert_closed()

    def test_api_token_unset(self):
        os.environ.pop("SNIPE_API_TOKEN")
        self.assert_closed()

    def test_session_secret_unset(self):
        os.environ.pop("SNIPE_SESSION_SECRET")
        self.assert_closed()

    def test_operator_email_unset(self):
        os.environ.pop("SNIPE_OPERATOR_EMAIL")
        self.assert_closed()

    def test_config_is_read_per_request(self):
        os.environ.pop("SNIPE_API_TOKEN")
        self.assertEqual(self.client.get("/login").status_code, 503)
        os.environ["SNIPE_API_TOKEN"] = TOKEN
        self.assertEqual(self.client.get("/login").status_code, 200)


class T3Privacy(SnipeCase):
    def assert_private(self, response):
        for key, value in PRIVACY.items():
            self.assertEqual(response.headers.get(key), value, key)

    def test_headers_on_every_kind_of_response(self):
        self.sign_in()
        self.push(FIXTURE)
        page = self.client.get("/")
        self.assertEqual(page.status_code, 200)
        self.assert_private(page)
        self.assertIn('<meta name="robots" content="noindex, nofollow">', page.text)
        unauthorized = self.machine("GET", "/api/swipes", token=None)
        self.assertEqual(unauthorized.status_code, 401)
        self.assert_private(unauthorized)
        missing = self.client.get("/nope")
        self.assertEqual(missing.status_code, 404)
        self.assert_private(missing)
        self.assert_private(self.client.get("/robots.txt"))
        self.assert_private(self.client.get("/", follow_redirects=False))
        os.environ.pop("SNIPE_API_TOKEN")
        closed = self.client.get("/")
        self.assertEqual(closed.status_code, 503)
        self.assert_private(closed)

    def test_no_api_docs(self):
        for path in ("/docs", "/redoc", "/openapi.json"):
            self.assertEqual(self.client.get(path).status_code, 404, path)

    def test_login_pages_carry_meta_robots(self):
        self.assertIn('content="noindex, nofollow"', self.client.get("/login").text)


class T4Bearer(SnipeCase):
    def test_missing_or_wrong_token(self):
        for token in (None, "wrong-token", TOKEN + "x"):
            self.assertEqual(self.machine("POST", "/api/sweeps", token=token, content=json.dumps(FIXTURE)).status_code, 401)
            self.assertEqual(self.machine("PUT", "/api/photos?ref=a:b:c", token=token, content=PNG).status_code, 401)
            self.assertEqual(self.machine("GET", "/api/swipes", token=token).status_code, 401)
        r = self.client.get("/api/swipes", headers={"Authorization": TOKEN})  # no "Bearer " scheme
        self.assertEqual(r.status_code, 401)

    def test_session_cookie_does_not_authorize_machine_api(self):
        self.sign_in()
        self.assertEqual(self.machine("GET", "/api/swipes", token=None).status_code, 401)
        self.assertEqual(self.machine("POST", "/api/sweeps", token=None, content=json.dumps(FIXTURE)).status_code, 401)
        self.assertEqual(self.machine("PUT", "/api/photos?ref=a:b:c", token=None, content=PNG).status_code, 401)


class T5Sweeps(SnipeCase):
    def test_store_and_repeat(self):
        first = self.push(FIXTURE)
        self.assertEqual(first.status_code, 200)
        stored_at = first.json()["stored_at"]
        self.assertRegex(stored_at, r"^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$")
        changed = bundle()
        changed["desk"]["title"] = "SYNTHETIC Changed"
        again = self.push(changed)
        self.assertEqual(again.json(), {"stored_at": stored_at})
        self.assertEqual(store.count_sweeps(self.data.name), 1)
        self.sign_in()
        self.assertIn("SYNTHETIC Desk", self.client.get("/").text)  # the first body is kept

    def test_unknown_keys_are_kept(self):
        doc = bundle(extra={"kept": True})
        self.push(doc)
        self.assertEqual(json.loads(store.latest_sweep(self.data.name)[1])["extra"], {"kept": True})

    def test_rejections(self):
        prices = bundle()
        prices["prices"]["schema_version"] = 2
        r = self.push(prices)
        self.assertEqual((r.status_code, r.json()), (422, {"error": "prices.schema_version"}))
        cases = {
            "schema_version": bundle(schema_version=True),
            "generated_at": bundle(generated_at="2026-10-03T23:00:00"),  # no offset
            "desk.title": bundle(desk={**FIXTURE["desk"], "title": 7}),
            "desk.decisions": bundle(desk={**FIXTURE["desk"], "decisions": {}}),
            "desk.watchlists[0].deals": bundle(desk={**FIXTURE["desk"], "watchlists": [{"label": "x"}]}),
            "deck.cards[0].slug": bundle(deck={"cards": [{"ref": "a:b:c"}]}),
            "prices.watchlists": bundle(prices={"schema_version": 1}),
        }
        for path, doc in cases.items():
            r = self.push(doc)
            self.assertEqual((r.status_code, r.json()), (422, {"error": path}), path)
        self.assertEqual(self.machine("POST", "/api/sweeps", content=b"not json").status_code, 400)
        self.assertEqual(self.machine("POST", "/api/sweeps", content=b"\xff\xfe").status_code, 400)
        self.assertEqual(self.machine("POST", "/api/sweeps", content=b" " * 10_000_001).status_code, 413)
        self.assertEqual(store.count_sweeps(self.data.name), 0)

    def test_generated_utc_is_normalized_from_the_offset(self):
        self.push(bundle(generated_at="2026-10-04T01:00:00+02:00"))
        with sqlite3.connect(Path(self.data.name) / "snipe.sqlite3") as conn:
            row = conn.execute("SELECT generated_at, generated_utc FROM sweeps").fetchone()
        self.assertEqual(row, ("2026-10-04T01:00:00+02:00", "2026-10-03T23:00:00.000Z"))

    def test_latest_is_by_utc_time_not_push_order(self):
        newer = bundle(generated_at="2026-10-03T23:30:00+00:00")
        newer["desk"]["title"] = "SYNTHETIC Newer"
        older = bundle(generated_at="2026-10-04T01:00:00+02:00")  # 23:00Z: earlier, though it sorts later as text
        older["desk"]["title"] = "SYNTHETIC Older"
        self.push(newer)
        self.push(older)
        self.sign_in()
        page = self.client.get("/").text
        self.assertIn("SYNTHETIC Newer", page)
        self.assertNotIn("SYNTHETIC Older", page)

    def test_history_keeps_newest_90(self):
        for n in range(91):
            self.assertEqual(self.push(bundle(generated_at=f"2026-07-{1 + n // 24:02d}T{n % 24:02d}:00:00+00:00")).status_code, 200)
        self.assertEqual(store.count_sweeps(self.data.name), 90)
        with sqlite3.connect(Path(self.data.name) / "snipe.sqlite3") as conn:
            oldest = conn.execute("SELECT MIN(generated_utc) FROM sweeps").fetchone()[0]
        self.assertEqual(oldest, "2026-07-01T01:00:00.000Z")


class T6Photos(SnipeCase):
    def test_upload_and_serve(self):
        png = self.machine("PUT", "/api/photos?ref=synthetic-hw:synthetic-gpu:local-steal", content=PNG,
                           headers={"Content-Type": "image/png"})
        self.assertEqual(png.status_code, 200)
        self.assertRegex(png.json()["url"], r"^/photos/[0-9a-f]{64}\.png$")
        jpg = self.machine("PUT", "/api/photos?ref=a:b:c", content=JPEG, headers={"Content-Type": "image/jpeg"})
        self.assertRegex(jpg.json()["url"], r"^/photos/[0-9a-f]{64}\.jpg$")
        self.assertEqual(self.machine("PUT", "/api/photos?ref=a:b:c", content=PNG).json(), png.json())  # idempotent
        self.assertEqual(self.client.get(png.json()["url"]).status_code, 401)
        self.sign_in()
        got = self.client.get(png.json()["url"])
        self.assertEqual((got.status_code, got.content, got.headers["content-type"]), (200, PNG, "image/png"))
        self.assertEqual(got.headers["x-content-type-options"], "nosniff")
        got = self.client.get(jpg.json()["url"])
        self.assertEqual((got.content, got.headers["content-type"]), (JPEG, "image/jpeg"))
        self.assertEqual(self.client.get("/photos/" + "0" * 64 + ".png").status_code, 404)
        self.assertEqual(self.client.get("/photos/x.png").status_code, 404)
        for name in ("../snipe.sqlite3", "..%2Fsnipe.sqlite3", "g" * 64 + ".png", "0" * 64 + ".gif", "0" * 64 + ".png/x"):
            self.assertIsNone(store.photo_path(self.data.name, name), name)

    def test_rejections(self):
        self.assertEqual(self.machine("PUT", "/api/photos?ref=a:b:c", content=b"GIF89a....").status_code, 415)
        self.assertEqual(self.machine("PUT", "/api/photos?ref=a:b", content=PNG).status_code, 422)
        self.assertEqual(self.machine("PUT", "/api/photos?ref=" + "a:b:" + "c" * 509, content=PNG).status_code, 422)
        self.assertEqual(self.machine("PUT", "/api/photos?ref=a:b:c", content=PNG + b"0" * 5_000_000).status_code, 413)

    def test_site_cli_flow(self):
        """push uploads photos, rewrites card photos to the returned URLs, posts the bundle; pull reads swipes."""
        ref = FIXTURE["deck"]["cards"][0]["ref"]
        url = self.machine("PUT", "/api/photos?ref=" + ref, content=PNG, headers={"Content-Type": "image/png"}).json()["url"]
        doc = bundle(generated_at="2026-01-01T00:00:00+00:00")
        doc["deck"]["cards"][0]["photo"] = url
        self.assertIn("stored_at", self.push(doc).json())
        self.sign_in()
        self.assertEqual(embedded(self.client.get("/deck").text, "deck-data")["cards"][0]["photo"], url)
        self.assertEqual(self.swipe({"ref": ref, "verdict": "pass", "price": "700.00", "alert_id": "x"}).status_code, 201)
        rows = self.machine("GET", "/api/swipes").json()["swipes"]
        self.assertEqual([(r["ref"], r["verdict"], r["price"]) for r in rows], [(ref, "pass", "700.00")])

    def test_photos_from_other_hosts_are_dropped(self):
        doc = bundle()
        doc["deck"]["cards"][0]["photo"] = "/_blob/synthetic"
        doc["deck"]["cards"][0]["comps"] = [{"price": 1.0, "date": "2026-09-01", "condition": "used", "same": True,
                                             "source": "SYNTHETIC", "url": None, "photo": "https://example.test/x.png"}]
        self.push(doc)
        self.sign_in()
        card = embedded(self.client.get("/deck").text, "deck-data")["cards"][0]
        self.assertEqual((card["photo"], card["comps"][0]["photo"]), (None, None))


class T7Swipes(SnipeCase):
    REF = FIXTURE["deck"]["cards"][0]["ref"]

    def body(self, **changes):
        return {"ref": self.REF, "verdict": "want", "price": "700.00", "alert_id": FIXTURE["deck"]["cards"][0]["alert_id"],
                **changes}

    def test_post_rules(self):
        self.assertEqual(self.swipe(self.body()).status_code, 401)
        self.sign_in()
        r = self.swipe(self.body())
        self.assertEqual(r.status_code, 201)
        self.assertRegex(r.json()["at"], r"^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d\.\d{3}Z$")
        self.assertEqual(self.swipe(self.body(), origin="https://bayes-iq.com").status_code, 403)
        self.assertEqual(self.swipe(self.body(), origin=f"http://{HOST}").status_code, 403)
        self.assertEqual(self.swipe(self.body(), origin=None).status_code, 403)  # C-003: missing Origin
        self.assertEqual(self.swipe(self.body(verdict="like")).status_code, 422)
        self.assertEqual(self.swipe(self.body(price="7.001")).status_code, 422)
        self.assertEqual(self.swipe(self.body(price=700)).status_code, 422)
        self.assertEqual(self.swipe(self.body(ref="a:b")).status_code, 422)
        rows = self.machine("GET", "/api/swipes").json()["swipes"]
        self.assertEqual(len(rows), 1)
        self.assertEqual(set(rows[0]), {"ref", "verdict", "price", "at"})

    def test_rows_oldest_first(self):
        self.sign_in()
        for verdict in ("pass", "maybe", "want"):
            self.swipe(self.body(verdict=verdict))
        self.assertEqual([r["verdict"] for r in self.machine("GET", "/api/swipes").json()["swipes"]],
                         ["pass", "maybe", "want"])

    def test_overlay_after_generated_at(self):
        self.push(bundle(generated_at="2026-01-01T00:00:00+00:00"))
        self.sign_in()
        self.assertNotIn("you said want", self.client.get("/").text)
        self.swipe(self.body(verdict="want"))
        self.assertEqual(embedded(self.client.get("/deck").text, "deck-data")["cards"][0]["swipe"], "want")
        desk = self.client.get("/").text
        self.assertIn("You said want", desk)
        self.assertIn("you said want", desk)

    def test_no_overlay_before_generated_at(self):
        self.push(bundle(generated_at="2099-01-01T00:00:00+00:00"))
        self.sign_in()
        self.swipe(self.body(verdict="want"))
        self.assertIsNone(embedded(self.client.get("/deck").text, "deck-data")["cards"][0]["swipe"])
        self.assertNotIn("you said want", self.client.get("/").text)


class T8Login(SnipeCase):
    def test_link_sent_only_to_operator(self):
        sent_body = self.request_link(OPERATOR.upper()).text
        self.assertEqual(len(self.sent), 1)
        to, _, text = self.sent[0]
        self.assertEqual(to, OPERATOR)
        self.assertTrue(text.split("\n")[2].startswith(f"https://{HOST}/login/verify?t="))
        other = self.request_link("someone@example.test")
        self.assertEqual(len(self.sent), 1)
        self.assertEqual((other.status_code, other.text), (200, sent_body))
        self.assertIn("If that is the operator's address, a link is on its way.", sent_body)

    def test_login_forms_refuse_oversized_bodies(self):
        big = "x" * 5000
        r = self.client.post("/login", data={"email": big})
        self.assertEqual(r.status_code, 413)
        self.assertEqual(self.sent, [])
        self.assertEqual(self.client.post("/login/verify", data={"t": big}).status_code, 413)

    def test_link_host_comes_from_env_not_request(self):
        self.client.post("/login", data={"email": OPERATOR}, headers={"Host": "SNIPE-SALES.test:8443"})
        self.assertTrue(self.sent[0][2].split("\n")[2].startswith(f"https://{HOST}/login/verify?t="))

    def test_sixth_send_in_an_hour_is_skipped(self):
        for _ in range(6):
            self.assertEqual(self.request_link().status_code, 200)
        self.assertEqual(len(self.sent), 5)
        with mock.patch("time.time", return_value=time.time() + 3601):
            self.request_link()
        self.assertEqual(len(self.sent), 6)

    def test_resend_key_unset(self):
        os.environ.pop("RESEND_API_KEY")
        self.assertEqual(self.request_link().status_code, 503)
        self.assertEqual(self.sent, [])

    def test_verify_get_does_not_consume_and_post_sets_cookie(self):
        self.request_link()
        token = self.link_token()
        page = self.client.get("/login/verify", params={"t": token})
        self.assertEqual(page.status_code, 200)
        self.assertIn("Sign in</button>", page.text)
        self.assertNotIn("set-cookie", page.headers)
        r = self.client.post("/login/verify", data={"t": token}, follow_redirects=False)
        self.assertEqual((r.status_code, r.headers["location"]), (303, "/"))
        cookie = r.headers["set-cookie"]
        self.assertTrue(cookie.startswith(auth.SESSION_COOKIE + "="))
        parts = {p.strip().split("=")[0].lower(): p.strip() for p in cookie.split(";")}
        self.assertIn("httponly", parts)
        self.assertIn("secure", parts)
        self.assertEqual(parts["samesite"].lower(), "samesite=lax")
        self.assertEqual(parts["path"], "Path=/")
        self.assertNotIn("domain", parts)
        self.assertEqual(self.client.get("/", follow_redirects=False).status_code, 200)

    def test_reuse_tamper_and_expiry(self):
        self.request_link()
        token = self.link_token()
        tampered = token[:-1] + ("0" if token[-1] != "0" else "1")
        self.assertEqual(self.client.post("/login/verify", data={"t": tampered}).status_code, 400)
        self.assertEqual(self.client.post("/login/verify", data={"t": "garbage"}).status_code, 400)
        self.assertEqual(self.client.post("/login/verify", data={}).status_code, 400)
        with mock.patch("time.time", return_value=time.time() + 16 * 60):
            self.assertEqual(self.client.post("/login/verify", data={"t": token}).status_code, 400)
        self.assertEqual(self.client.post("/login/verify", data={"t": token}, follow_redirects=False).status_code, 303)
        fresh = TestClient(main.app, base_url=ORIGIN)
        self.assertEqual(fresh.post("/login/verify", data={"t": token}).status_code, 400)  # reuse

    def test_bad_sessions_redirect_to_login(self):
        self.sign_in()
        good = self.client.cookies.get(auth.SESSION_COOKIE)
        for value in (good[:-1] + ("0" if good[-1] != "0" else "1"), "1.2", ""):
            c = TestClient(main.app, base_url=ORIGIN, cookies={auth.SESSION_COOKIE: value})
            r = c.get("/prices", follow_redirects=False)
            self.assertEqual((r.status_code, r.headers["location"]), (303, "/login"))
        with mock.patch("time.time", return_value=time.time() + auth.SESSION_TTL + 1):
            self.assertEqual(self.client.get("/", follow_redirects=False).status_code, 303)
        os.environ["SNIPE_SESSION_SECRET"] = "rotated-secret-not-real"
        self.assertEqual(self.client.get("/", follow_redirects=False).status_code, 303)

    def test_unauthenticated_pages_redirect(self):
        for path in ("/", "/deck", "/prices"):
            r = self.client.get(path, follow_redirects=False)
            self.assertEqual((r.status_code, r.headers["location"]), (303, "/login"), path)

    def test_logs_carry_no_secrets(self):
        def boom(to, subject, text):
            raise OSError("synthetic failure " + text)
        with mock.patch.object(auth, "send_email", boom), self.assertLogs("bayesiq.snipe", logging.INFO) as logs:
            self.request_link()
            self.push(FIXTURE)
        joined = "\n".join(logs.output)
        self.assertIn("sign-in email failed (OSError)", joined)
        for secret in (TOKEN, SECRET, OPERATOR, "login/verify", "SYNTHETIC"):
            self.assertNotIn(secret, joined)

    def test_used_links_older_than_a_day_are_pruned(self):
        with sqlite3.connect(Path(self.data.name) / "snipe.sqlite3") as conn:
            conn.executescript(store.SCHEMA)
            conn.execute("INSERT INTO used_links VALUES ('old', '2020-01-01T00:00:00.000Z')")
            conn.execute("INSERT INTO used_links VALUES ('recent', ?)", (store.utc_stamp(),))
        self.assertTrue(store.use_nonce(self.data.name, "new"))
        self.assertFalse(store.use_nonce(self.data.name, "recent"))
        with sqlite3.connect(Path(self.data.name) / "snipe.sqlite3") as conn:
            nonces = {n for (n,) in conn.execute("SELECT nonce FROM used_links")}
        self.assertEqual(nonces, {"recent", "new"})


class T9Pages(SnipeCase):
    def test_before_any_bundle(self):
        self.sign_in()
        for path in ("/", "/deck", "/prices"):
            r = self.client.get(path)
            self.assertEqual(r.status_code, 200)
            self.assertIn("No sweep uploaded yet.", r.text)

    def test_pages_render_the_fixture(self):
        self.push(FIXTURE)
        self.sign_in()
        desk = self.client.get("/")
        self.assertEqual(desk.status_code, 200)
        for text in ("<title>SYNTHETIC Desk</title>", "SYNTHETIC decision", "SYNTHETIC 32 GB GPU", "SYNTHETIC hardware",
                     "not enough recent sales to judge", 'href="/deck"', 'href="/prices"'):
            self.assertIn(text, desk.text)
        self.assertTrue(desk.text.startswith("<!doctype html>"))
        self.assertLess(desk.text.index("<style>"), desk.text.index("</head>"))
        self.assertLess(desk.text.index("</head>"), desk.text.index('<main class="desk">'))
        deck = self.client.get("/deck").text
        self.assertIn("fetch('/api/swipes'", deck)
        self.assertIn('href="/">Desk</a>', deck)
        self.assertEqual(embedded(deck, "deck-data")["cards"][0]["item"], "SYNTHETIC 32 GB GPU")
        prices = self.client.get("/prices").text
        self.assertIn("<title>Price Watch</title>", prices)
        self.assertEqual(embedded(prices, "price-data")["watchlists"][0]["id"], "synthetic-hw")
        for page in (desk.text, deck, prices):
            self.assertNotIn("fonts.googleapis", page)
            self.assertIn('<meta name="robots" content="noindex, nofollow">', page)

    def test_no_hosted_ai_dependency_in_snipe(self):
        forbidden = ("claude.use", "claude.ai", "anthropic", "/_blob/", "fonts.googleapis")
        files = sorted((SERVER / "snipe").rglob("*.py"))
        self.assertGreaterEqual(len(files), 8)
        for path in files:
            text = path.read_text().lower()
            for word in forbidden:
                self.assertNotIn(word, text, f"{path.name}: {word}")


if __name__ == "__main__":
    unittest.main()

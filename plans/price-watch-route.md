---
schema_version: 1
work_unit:
  id: price-watch-route
  state: draft
  branch: feat/price-watch-route
  repo: bayesiq-website
  parent_run_id: null
  approval_run_id: null
  approval_decision: null
  approval_timestamp: null
  approved_by: null
  issue: 95
---

# PR: snipe-sales.bayes-iq.com on the Railway server (Fixes #95)

Last Updated: 2026-10-03

PR Type: Platform. **Repo:** bayesiq-website. Plan Archetype: Platform.

Spec: the operator's decision comment on #95 (2026-10-03T22:46Z) and its correction (23:10Z): the host is `snipe-sales.bayes-iq.com`, not `bayesiq.com`. bayesiq.com has no DNS. bayes-iq.com is the Cloudflare zone, with www on Vercel. This plan replaces the earlier Vercel Blob design.

## Roadmap Position

This is operator tooling, outside the marketing roadmap in `docs/ai/ROADMAP.md`. It is the site half of estate-scout #25 and #26 (client `site_cli`, `origin/main` `d8cee28`). Alert delivery stays in Bayes-IQ/bayesiq#1387. The machine credential scope is Bayes-IQ/bayesiq-workspace#1481.

## Layers Affected

| Layer | What changes |
|-------|-------------|
| `server/` | new `snipe/` package (routes, store, auth, vendored renderers), a two-line hook in `main.py`, one `COPY` line in `Dockerfile`, new `tests/` |
| `.github/` | `ci.yml` gains a separate `server-tests` job |

**Invariant touched:** credential non-leak (new bearer token, session secret, Resend key).

## Goal

The operator opens `https://snipe-sales.bayes-iq.com/` on a phone and signs in with a magic link. They then see the Deal Desk (`/`), the Deal Deck (`/deck#<slug>`) and Price Watch (`/prices`), rendered from the latest sweep bundle that estate-scout pushed. Swipes are saved on the site and pulled back by the next sweep. The whole host is served by the existing Railway FastAPI service in `server/`. Data lives on a Railway volume. Nothing touches the Next.js site or Vercel, and nothing depends on a Claude or Anthropic service.

## Decisions

- **D1 One service, host-dispatched.** `server/snipe/` is a separate FastAPI app. A pure ASGI `SnipeHostMiddleware`, added to `main.app`, sends a request to it only when the `Host` header (lowercased, port stripped) equals env `SNIPE_HOST`. Every other request, and every request when `SNIPE_HOST` is unset, goes to the existing app unchanged. So `/health` and `/audit` behave as today on every other host. On the snipe host they 404, and the snipe routes 404 everywhere else. Because the middleware is added last, it is outermost, and snipe responses bypass the audit CORS policy. Rejected: a Next.js route on Vercel, which would need cross-service auth plus a TypeScript port of the Python renderers.
- **D2 Storage: SQLite plus a photo directory under env `SNIPE_DATA_DIR`** (a Railway volume): `snipe.sqlite3` and `photos/`. Fail closed: if `SNIPE_DATA_DIR` is unset or not an existing directory, or `SNIPE_API_TOKEN`, `SNIPE_SESSION_SECRET` or `SNIPE_OPERATOR_EMAIL` is unset, every snipe route except `/robots.txt` returns 503. The env is read per request. Tables:
  - `sweeps(generated_at TEXT PRIMARY KEY, generated_utc TEXT NOT NULL, stored_at TEXT NOT NULL, body TEXT NOT NULL)`
  - `swipes(id INTEGER PRIMARY KEY AUTOINCREMENT, ref, verdict, price, alert_id, at)`
  - `used_links(nonce TEXT PRIMARY KEY, used_at TEXT)`
  - **History policy:** `INSERT OR IGNORE` on `generated_at`. A repeat push returns the stored row's `stored_at` and keeps the first body. After each insert, rows beyond the newest 90 by `generated_utc` are deleted. Pages render the newest row only. Charts need no older rows, because the bundle's `prices` export already carries each item's full series (R2).
  - **Photos are content-addressed:** `photos/<sha256 hex>.png|.jpg`, returned as `{"url": "/photos/<name>"}`.
- **D3 Machine API (bearer).** It checks `Authorization: Bearer` against `SNIPE_API_TOKEN` with `hmac.compare_digest` over SHA-256 digests. A session cookie never authorizes it. This matches `site_cli` exactly (R1):
  - `POST /api/sweeps`: 401, 413 over 10,000,000 bytes, 400 if not JSON, 422 `{"error": "<field path>"}`, 200 `{"stored_at"}`. The validator checks only what the pages read:
    - `schema_version == 1`, and `generated_at` is an ISO 8601 string with an offset
    - `desk.title` (str), `desk.decisions` (list) and `desk.watchlists[].{label, deals(list)}`
    - `deck.cards[].{ref, slug}` (str)
    - `prices.schema_version == 1` and `prices.watchlists` (list)

    Unknown keys are kept.
  - `PUT /api/photos?ref=`: `ref` must have at least two `:` and at most 512 characters (else 422). The body must start with `\x89PNG` or `\xff\xd8` (else 415) and be at most 5,000,000 bytes (else 413).
  - `GET /api/swipes`: returns `{"swipes": [{ref, verdict, price, at}]}`, every row, oldest first. `alert_id` is stored but not returned.
- **D4 Browser side (operator session).**
  - `/`, `/deck` and `/prices` redirect (303) to `/login` without a session. Before any bundle exists, they show "No sweep uploaded yet."
  - `GET /photos/<name>` needs a session. The name must match `^[0-9a-f]{64}\.(png|jpg)$`, and the response sets `X-Content-Type-Options: nosniff`.
  - `POST /api/swipes` takes `{ref, verdict, price, alert_id}`. It needs a session and `Origin == https://$SNIPE_HOST` (else 403; this blocks same-site bayes-iq.com pages). `verdict` must be `pass|maybe|want` and `price` must match `^[0-9]{1,9}(\.[0-9]{1,2})?$` (the estate-scout `amount` rule) (else 422). The server sets `at` (UTC, `Z`) and returns 201 `{"at"}`.
  - **Swipe overlay:** a stored swipe whose `at` is later than the bundle's `generated_utc` overrides `swipe` on deck cards (by `ref`) and desk deals (by `f"{watchlist}:{item_id}:{listing_key}"`, R3). Older swipes are already reflected in the bundle's grading through `pull-swipes`.
- **D5 Login: magic link by email via Resend.** A passkey would need WebAuthn registration, a bootstrap path and a JS ceremony, so it is not simpler.
  - `GET /login` shows an email form. `POST /login` always answers "If that is the operator's address, a link is on its way." It sends only when the address equals `SNIPE_OPERATOR_EMAIL` (case-insensitive), at most 5 emails per rolling hour (in-memory).
  - The link is `https://$SNIPE_HOST/login/verify?t=<exp>.<nonce>.<sig>`, with `sig = HMAC-SHA256(SNIPE_SESSION_SECRET, "link|exp|nonce")`, 15-minute expiry and a 128-bit nonce. The host comes from env, never from the request.
  - `GET /login/verify` only shows a "Sign in" button, so mail scanners that prefetch links do not spend the token. `POST /login/verify` checks the signature and expiry and inserts the nonce into `used_links` (a duplicate gives 400). It then sets `__Host-snipe_session=<exp>.<sig>`, with `sig = HMAC(secret, "session|exp")`, 30 days, `HttpOnly; Secure; SameSite=Lax; Path=/` and no `Domain`, and redirects 303 to `/`.
  - Sending is a `POST https://api.resend.com/emails` with `Authorization: Bearer $RESEND_API_KEY`, a `User-Agent` and JSON `{from, to:[...], subject, text}`, the same request the website's `resend` SDK makes (R6). It uses stdlib `urllib`, so there is no new dependency. `from` is env `SNIPE_FROM_EMAIL`, defaulting to `website@bayes-iq.com` (the contact form's default, `src/app/contact/actions.ts:10`). If `RESEND_API_KEY` is unset, `POST /login` returns 503.
  - Rotating `SNIPE_SESSION_SECRET` ends every session. There is no logout.
- **D6 Port, don't redesign.** The renderers are copied into `server/snipe/vendor/` from estate-scout `d8cee28`, which has the same code as `dcb2a80` at these lines. The SHA and source line ranges sit in each file's header. Only these edits are made:
  - imports trimmed to stdlib, since the copied functions use only `html`, `json` and `decimal`
  - the two Google Fonts `<link>` lines removed, so pages make no third-party request and fall back to the existing system font stack
  - the deck's artifact-database calls (R4) replaced with a same-origin `fetch('/api/swipes', {method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ref: c.ref, verdict, price: c.price.toFixed(2), alert_id: c.alert_id})})`. A non-OK response shows the existing "Could not save that swipe" status. The `claude.use('db')`/`onSnapshot` block is deleted. Verdicts on load come from the overlaid `card.swipe`.

  The adapter in `server/snipe/pages.py` calls the vendored `render_desk(config, sections, as_of)`, `render_deck(config, cards, as_of)` and `render_page(config, watchlists, as_of)` with `document=False`, and wraps each result in its own document head (charset, viewport, `<meta name="robots" content="noindex, nofollow">`). Nav links are `/`, `/deck` and `/prices`. Two adaptations are needed:
  - Desk deals in the bundle have no `reasons` key, but `card(g)` evaluates `g.get("why", g["reasons"])` eagerly, so a raw bundle deal raises `KeyError('reasons')`. This was reproduced against a bundle generated at `d8cee28`. The adapter sets `reasons = why or []`.
  - Card and comp `photo` values that are not `/photos/…` or `data:image/…` (the claude.ai `/_blob/` paths, R5) become `null`.
- **D7 Privacy.** A middleware on the snipe app sets these headers on every snipe response, including 401, 403, 404 and 503:
  - `X-Robots-Tag: noindex, nofollow, noarchive`
  - `Cache-Control: private, no-store`
  - `Referrer-Policy: no-referrer`
  - `Content-Security-Policy: default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src 'self' data:; connect-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'`

  `/robots.txt` returns `User-agent: *\nDisallow: /\n` without auth. There are no analytics. Vercel Analytics is mounted only in the Next app (`src/app/layout.tsx:92`), which this host never serves, and the CSP blocks any third-party script or beacon. The snipe app sets `docs_url`, `redoc_url` and `openapi_url` to `None`. Logs never contain tokens, links, nonces, emails or bundle content.

## Invariants

| Invariant | Preserved? | Notes |
|-----------|------------|-------|
| Session boundary / gateway choke point / policy ordering / handler purity (bayesiq platform) | N/A | No bayesiq platform code |
| Credential non-leak | YES | Secrets come only from env. They are compared in constant time and never logged, returned or rendered |
| Existing audit API behavior | YES | `main.py` gains only the import and `add_middleware` (P1). Non-snipe hosts reach the unchanged app. Tested in T1 |
| No runtime dependency on Anthropic or claude.ai APIs, SDKs or URLs in `server/` | YES | D6 removes `claude.use`, `/_blob/` photos and the Fonts links. T9 greps `server/snipe/` |
| Fail closed | YES | Missing config gives 503 (D2). An unset `SNIPE_HOST` makes the snipe app unreachable |

## Scope

### Files Added

| File | Purpose |
|------|---------|
| `server/snipe/__init__.py` | exports `SnipeHostMiddleware` and `snipe_app` |
| `server/snipe/app.py` | snipe FastAPI app, routes, privacy middleware, config check |
| `server/snipe/store.py` | SQLite schema, sweeps, swipes, used links, photos |
| `server/snipe/auth.py` | bearer check, link and session sign/verify, `send_email` |
| `server/snipe/pages.py` | bundle-to-renderer adapter, swipe overlay, document wrapper, login pages |
| `server/snipe/vendor/__init__.py` | `SOURCE = "Bayes-IQ/estate-scout@d8cee28bd3e83fec3d85785a2c344e092916a967"` |
| `server/snipe/vendor/desk.py` | `money`, `STYLE`, `STATUS_TONE`, `card` and `render_desk` from `deals.py` 33–35 and 331–435 |
| `server/snipe/vendor/deck.py` | `STYLE`, `SCRIPT` and `render_deck` from `deck.py` 115–340 |
| `server/snipe/vendor/price_page.py` | `STYLE`, `SCRIPT` and `render_page` from `price_page.py` 102–289 and 300–319 |
| `server/tests/__init__.py`, `server/tests/test_snipe.py` | unittest suite (Test Plan) |
| `server/tests/fixtures/snipe_bundle.json` | synthetic bundle (P6) |

### Files Modified

| File | What changes |
|------|-------------|
| `server/main.py` | after the CORS block (line 87): `from snipe import SnipeHostMiddleware` and `app.add_middleware(SnipeHostMiddleware)` |
| `server/Dockerfile` | `COPY snipe ./snipe` after `COPY main.py .` |
| `.github/workflows/ci.yml` | new `server-tests` job (P7). The `build-and-test` job is unchanged |

### Non-goals

- logout, multiple users, passkeys or account management
- alert delivery (#1387) and push notifications
- estate-scout or bayesiq-workspace changes (see Follow-ups)
- the price page's localStorage filters and table, which are kept as-is from the vendored script and not redesigned
- data migration from the claude.ai artifact databases

### Forbidden Changes

- `src/`, `public/`, `next.config.mjs`, `package.json`, `package-lock.json`: the Next site is untouched
- the plans layout, `config/project.yaml` and ESLint config: owned by #96
- `server/main.py` beyond the two added lines, including `/health`, `/audit`, CORS, `_verify_api_key` and rate limiting
- `server/railway.toml`, `server/requirements.txt`, `server/build.sh` and `server/run_dev.sh`
- the existing `build-and-test` job in `ci.yml`

## Known Non-Existence

- `server/` has no tests, no persistent storage, no session or cookie code and no host routing. Nothing in `src/` calls it (`git grep` finds no Railway or audit-API URL in `src/`).
- CI (`ci.yml`) has one job, Node and Playwright only. No Python runs in CI.
- No `resend` Python package is installed, and none is added (D5).
- estate-scout's bundle carries no page URLs, and its desk deals carry no `reasons` (D6).
- The workspace scopes registry has no snipe-sales scope yet (#1481).

## Plan

1. **[P1] Host dispatch.** Add `SnipeHostMiddleware` and an empty `snipe_app` with the D7 middleware and `/robots.txt`. Wire them into `main.py` and `Dockerfile`.
2. **[P2] Store.** Write `store.py` per D2: one connection per call (`sqlite3.connect(path)`, `CREATE TABLE IF NOT EXISTS` on open), `put_sweep`, `latest_sweep`, `add_swipe`, `list_swipes`, `use_nonce` and `save_photo`.
3. **[P3] Auth.** Write `auth.py` per D3 and D5. `send_email(to, subject, text)` is a module function so tests can replace it.
4. **[P4] Machine API.** Add the three D3 endpoints with their status codes. Handlers are `async def` and read `await request.body()` after checking `Content-Length` against the cap.
5. **[P5] Pages and login.** Add the vendored renderers (D6), `pages.py`, the D4 routes and the D5 login routes.
6. **[P6] Fixture.** In an estate-scout `d8cee28` checkout, follow `tests/test_site.py` `setUp`: the synthetic watchlist, wants, a desk config titled `SYNTHETIC Desk`, and `record()` of `synthetic-price-watch-{1,2}.json`. Then run `python3 -m estate_scout.site_cli bundle desk.json --policy examples/synthetic-outing-policy.json --output snipe_bundle.json`. Commit the output (about 2.6 KB: 1 card, 1 deal, prices watchlist `synthetic-hw`), adding one synthetic decision `{"title": "SYNTHETIC decision", "status": "recheck", "due": null, "link": null}` so the desk renders that section. It contains no real personal data.
7. **[P7] CI.** Add this job to `ci.yml`:
   ```yaml
     server-tests:
       runs-on: ubuntu-latest
       defaults: { run: { working-directory: server } }
       steps:
         - uses: actions/checkout@v4
         - uses: actions/setup-python@v5
           with: { python-version: "3.12" }
         - run: pip install -r requirements.txt httpx
         - run: python -m unittest discover -s tests -t . -v
   ```
   `httpx` is needed by Starlette's `TestClient` and is CI-only. unittest follows CONTRIBUTING "No manual tests" (Python uses `python -m unittest discover`), so there is no pytest dependency.

## Acceptance Criteria

### Functional
- [ ] `site_cli`'s flow passes against the app: photo PUT, then a bundle POST whose card `photo` is the returned URL, then GET swipes (T5–T7).
- [ ] An unauthenticated `/`, `/deck` or `/prices` redirects to `/login`. After the magic-link flow, all three return 200 with the fixture's `SYNTHETIC` strings.
- [ ] A swipe POSTed from the deck appears in `GET /api/swipes` and in the deck's embedded `swipe` on reload.
- [ ] Every snipe response carries the D7 headers. `/robots.txt` disallows `/`.
- [ ] `/health` and `/audit` on a non-snipe host behave as before. Snipe paths there return 404.

### Structural
- [ ] Only Scope files change. `cd server && python -m unittest discover -s tests -t . -v` passes locally and in CI, and `npm test` is unaffected.

## Test Plan

### Unit tests

All tests are in `server/tests/test_snipe.py`. Before `import main`, `setUpModule` puts stub modules into `sys.modules` for `audit` and its seven submodules (`main.py:33-39`), each with a `run` stub, so the private audit kit is not needed. Clients are `TestClient(main.app, base_url="https://snipe-sales.test")` with `SNIPE_HOST=snipe-sales.test`, and `https://` so `Secure` cookies are sent. Env and a temp `SNIPE_DATA_DIR` are set per test with `unittest.mock.patch.dict(os.environ)`. `snipe.auth.send_email` is patched to capture the link.

| Test | What it covers |
|------|---------------|
| T1 host gating | Default host: `/health` gives `{"status":"ok"}`, and `/prices` and `/api/sweeps` give 404. Snipe host: `/health` gives 404. `SNIPE_HOST` unset: the snipe host reaches the audit app. A snipe response to `Origin: https://bayes-iq.com` has no `access-control-allow-origin` |
| T2 fail closed | Data dir unset, then missing, then token unset: `/`, `/api/sweeps` and `/login` give 503, and `/robots.txt` gives 200 |
| T3 privacy | D7 headers on a 200 page, a 401, a 404 and a 503. Page HTML has meta robots |
| T4 bearer | Missing or wrong token gives 401 on all three machine routes. A valid session cookie alone gives 401 |
| T5 sweeps | Fixture gives 200 `stored_at`. A repeat returns the same `stored_at` with one row. Prices `schema_version` 2 gives 422 `prices.schema_version`. Non-JSON gives 400, oversize gives 413, and an older `generated_at` pushed later does not become latest. 91 pushes keep 90 rows |
| T6 photos | PNG and JPEG give `/photos/<64 hex>.png|.jpg`. GET with a session returns the bytes and type. Without a session gives 401. GIF bytes give 415, and `ref=a:b` gives 422 |
| T7 swipes | A session plus the right Origin gives 201. No session gives 401, a wrong Origin 403, and verdict `like` or price `7.001` 422. `GET /api/swipes` rows have exactly `{ref, verdict, price, at}`. The overlay shows on `/deck` and `/` for a swipe after `generated_at` and not for one before |
| T8 login | The operator email (any case) sends one email whose link starts `https://snipe-sales.test/login/verify?t=`. Another email sends none and gets the same body. A sixth send in an hour is skipped. Verify GET does not consume. POST sets `__Host-snipe_session` with `HttpOnly`, `Secure`, `SameSite=lax` and `Path=/`, and the response has no `Domain`. Reuse, tamper and expiry (patched `time.time`) give 400. A tampered or expired session cookie redirects |
| T9 pages | `/`, `/deck` and `/prices` render the fixture. `/deck` HTML contains `fetch('/api/swipes'`. No file under `server/snipe/` contains `claude.use`, `claude.ai`, `anthropic`, `/_blob/` or `fonts.googleapis` |

### Integration / manual tests

None in CI. Operator post-deploy checks are listed under Operator steps (O7).

## Risks

- **Railway runs more than one replica, or has no volume.** SQLite and the photo dir need one replica with a volume. Without the volume, D2 fails closed with 503.
- **Railway healthchecks** must still reach the audit app. They do unless their Host equals `SNIPE_HOST`, and the healthcheck host could not be verified from here.
- **Resend sending domain.** If `bayes-iq.com` is not verified in Resend, the link email fails. The operator checks this at O3. Login cannot work until it is verified.
- **Merge overlap with #96** in `ci.yml`. #96 adds steps inside `build-and-test`, and this PR adds a separate job, so the hunks are separate.

## Operator steps (no secrets generated or seen by agents)

- **O1.** In the Railway service for `server/`, attach a volume (for example at `/data`) and set `SNIPE_DATA_DIR` to that path. Keep 1 replica.
- **O2.** Set `SNIPE_HOST=snipe-sales.bayes-iq.com` and `SNIPE_OPERATOR_EMAIL` (your address). Set `SNIPE_SESSION_SECRET` and `SNIPE_API_TOKEN`, each at least 32 random bytes that you generate yourself.
- **O3.** Set `RESEND_API_KEY` (and optionally `SNIPE_FROM_EMAIL`). Confirm in Resend that the from-domain is verified.
- **O4.** In Railway, add the custom domain `snipe-sales.bayes-iq.com` and note the CNAME target, plus any verification TXT record it shows.
- **O5.** In Cloudflare (zone bayes-iq.com), add CNAME `snipe-sales` pointing to that target, set to **DNS only (grey cloud)**, plus the TXT record if Railway lists one. Proxying through Railway was not verified.
- **O6.** Redeploy. Put the same `SNIPE_API_TOKEN` value into the #1481 scope, as the client's `SNIPE_SALES_TOKEN`.
- **O7.** On a phone, sign in, confirm the three pages load, then run `site_cli push` and `pull-swipes` once.

## Follow-ups (filed by the parent session; not in this PR)

- **bayesiq-workspace#1481:** declare the scope that holds `SNIPE_SALES_TOKEN` for the sweep host.
- **estate-scout:** the base URL is already `snipe-sales.bayes-iq.com` (#26, `cb3e033`). After cutover, set the desk config's `page`, `deck_page` and `prices_page` to the site URLs (#95 comment). Optionally add `reasons` to the bundle's desk deals so the adapter shim in D6 can go.
- **Retire the interim claude.ai pages** (Price Watch, Deal Desk, Deal Deck artifacts) after cutover. Each delete needs operator confirmation.

## Reference excerpts

R1. estate-scout `d8cee28` `estate_scout/site_cli.py` (the client this server must satisfy):
```python
req = request.Request(url, data=body, method=method,
                      headers={"Authorization": f"Bearer {token}", "Content-Type": content_type,
                               "Accept": "application/json"})
    with request.urlopen(req, timeout=TIMEOUT) as resp:
        raw = resp.read(5_000_001)
    return json.loads(raw) if raw else {}
# push:
        kind = "image/png" if data.startswith(b"\x89PNG") else "image/jpeg"
        answer = call("PUT", endpoint(base, "/api/photos?" + parse.urlencode({"ref": ref})), data, kind)
        if not isinstance(answer.get("url"), str):
            fail(f"photo {ref}", "site did not return a photo url")
    for card in bundle_doc["deck"]["cards"]:
        if card["ref"] in urls:
            card["photo"] = urls[card["ref"]]
    answer = call("POST", endpoint(base, "/api/sweeps"), json.dumps(bundle_doc, ensure_ascii=False).encode())
    return {"photos": len(urls), "stored_at": answer.get("stored_at")}
# pull_swipes:
    answer = call("GET", endpoint(base, "/api/swipes"))
    rows = answer.get("swipes")
        if not isinstance(row, dict) or row.get("verdict") not in ("pass", "maybe", "want"):
        keep.append({k: row.get(k) for k in ("ref", "verdict", "price", "at")})
```

R2. `site_cli.bundle` (same file):
```python
    stamp = now().isoformat()
    keep = ("id", "grade", "why", "watchlist", "item_id", "item_label", "track", "priority", "listing_key", "source",
            "url", "channel", "condition", "price", "all_in", "baseline_median", "round_trip_miles", "listing_days",
            "max_price", "sold_30", "swipe", "slug", "listing_slug")
    desk = {"title": config["title"], "decisions": config["decisions"], "watchlists": [
        {"label": w["label"], "last_check": last, "sweep_tokens": cost and cost["agent_tokens"],
         "deals": [{k: g.get(k) for k in keep} for g in entries]} for w, entries, last, cost in sections]}
    return {"schema_version": BUNDLE_VERSION, "generated_at": stamp, "desk": desk, "deck": {"cards": cards},
            "prices": export(lists, stamp)}
```
A generated fixture has `generated_at` `2026-10-03T23:14:54+00:00`. The `price_page.export` body is `{"schema_version": EXPORT_VERSION, "generated_at": as_of, "watchlists": watchlists}`, where each item carries its full `series` and `sales`.

R3. `deals.py` (estate-scout `d8cee28`):
```python
def listing_ref(watchlist_id, item_id, listing_key):
    return f"{watchlist_id}:{item_id}:{listing_key}"
# card(g), line 386:
    chips += [f'<span class="chip warn">{e(w)}</span>' for w in g.get("why", g["reasons"])[:3]]
# render_desk(config, sections, as_of) reads config["title"], config["decisions"], config.get("deck_page"),
# config.get("prices_page"); each section is (w, entries, last, cost) with w["label"], w["chart_page"],
# w["best_deals_page"], and cost["agent_tokens"] when cost is not None.
```

R4. `deck.py` lines replaced by D6 (estate-scout `d8cee28`):
```js
async function save(c, verdict) {
  verdicts[c.listing_slug] = verdict;
  if (!db) return;
  try { await db.collection('swipes').doc(c.listing_slug).set({ref: c.ref, verdict, price: c.price.toFixed(2),
    alert_id: c.alert_id, item: c.item, at: new Date().toISOString()}); }
  catch (e) { const n = document.getElementById('status'); n.textContent = 'Could not save that swipe; it will show again next time.'; }
}
...
(async () => { try { db = await claude.use('db'); } catch (e) { db = null; }
  const n = document.getElementById('status');
  if (!db) { n.textContent = 'Swipes are not saved in this view.'; return; }
  db.collection('swipes').onSnapshot(snap => { let changed = false;
    snap.docs.forEach(d => { const v = d.data(); if (v && verdicts[d.id] !== v.verdict) { verdicts[d.id] = v.verdict; changed = true; } });
    if (changed) render(); }, () => { n.textContent = 'Swipes could not sync; they will show again next time.'; });
})();
```
On load, `DECK.cards.forEach(c => { if (c.swipe) verdicts[c.listing_slug] = c.swipe; });` (line 198) seeds verdicts. `render_deck(config, deck, as_of, document=False)` reads `config.get("page")` and `config.get("prices_page")`. `render_page(config, watchlists, as_of, document=False)` reads `config.get("page")`.

R5. `deck.py` `read_photos`, line 31: `if isinstance(p, dict) and isinstance(p.get("url"), str) and p["url"].startswith(("/_blob/", "data:image/"))`. The Fonts links are at `deals.py:408` and `deck.py:326`. `price_page.py` has none.

R6. Website `node_modules/resend` 6.9.3 `dist/index.cjs` (the SDK used by `src/app/contact/actions.ts`): `Authorization: \`Bearer ${this.key}\`, "User-Agent": userAgent, "Content-Type": "application/json"`; `this.resend.post("/emails", parseEmailToApiOptions(payload))`, which maps to `{from, to, subject, text, ...}` against base URL `https://api.resend.com`.

R7. This repo's `server/main.py`, lines 78–87 and 111–113 (the hook goes after line 87):
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://bayes-iq.com",
        "https://www.bayes-iq.com",
    ],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type", "Authorization"],
)
...
@app.get("/health")
def health():
    return {"status": "ok"}
```
`server/Dockerfile`: `COPY main.py .` comes just before `ENV PYTHONUNBUFFERED=1`. `server/requirements.txt` already has `fastapi>=0.110`, `uvicorn[standard]>=0.27` and `python-multipart>=0.0.9` (needed for the login forms).

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

# PR: Private Price Watch route (Fixes #95)

Last Updated: 2026-10-03

PR Type: Platform (new private route, ingest endpoint, private store). **Repo:** bayesiq-website. Plan Archetype: Platform.

## Roadmap Position

Operator tooling outside the website's marketing roadmap (`docs/ai/ROADMAP.md`). The consumer half of estate-scout PR #22 (`47917e4`). Alert delivery stays in Bayes-IQ/bayesiq#1387.

## Goal

The operator opens `https://bayes-iq.com/prices` on a phone, signs in, and sees one line chart per watched item, drawn from the estate-scout export (schema 1) unchanged. Tapping or dragging snaps to a check and shows price, listing, condition and date. The data is stored privately, read per request, never bundled, never in `public/`, and never indexed.

## Decisions

- **D1 Auth: single-operator password, signed cookie, gate in the page.** `bayesiq-auth-services` is a Phase 0 scaffold with no code (Reference R4), and its charter is operator-side credential acquisition over `bayesiq-creds`, not web sessions. The site has no auth, middleware or session code today. `server/` is the unrelated FastAPI audit API, and `contact/actions.ts` only reads `RESEND_*`/`CONTACT_*` env. The scheme:
  - `/prices/login` posts a password to a server action, which compares SHA-256 digests with `timingSafeEqual` against env `PRICE_WATCH_PASSWORD`.
  - On a match it sets cookie `pw_session` = `v1.<exp>.<base64url HMAC-SHA256(key=PRICE_WATCH_PASSWORD, "price-watch|"+exp)>`. Attributes: HttpOnly, SameSite=Lax (Lax so an alert link from another app keeps the session), Path=/prices, Max-Age 30 days, and `Secure` when `process.env.VERCEL` is set (`next start` in CI serves http).
  - `src/app/prices/page.tsx` verifies the cookie before loading any data and calls `redirect("/prices/login")` otherwise.
  - When `PRICE_WATCH_PASSWORD` is unset, both pages call `notFound()`. Previews get no secret (O2), so they fail closed.
  - Rotating the password invalidates every session.
  - No middleware: one gate sits where the data is loaded, there is no Edge runtime, and there is no second code path to keep in sync.
  - No rate limit: the password is operator-generated and high-entropy (O2).
  - This is app login code reading `process.env`, the same pattern as `RESEND_API_KEY`. It is not a credential wrapper or resolver (CONTRIBUTING "Credential files").
- **D2 Storage: one private Vercel Blob object, written through an authenticated ingest endpoint.**
  - Pathname `price-watch/latest.json`, using `@vercel/blob@^2.8.0` (new dependency). 2.8.0's `put`/`get` take `access: 'private'` and read `BLOB_READ_WRITE_TOKEN` (R3).
  - `POST /api/prices/ingest` checks `Authorization: Bearer` against env `PRICE_WATCH_INGEST_TOKEN` (digest plus `timingSafeEqual`), caps the body at 4,000,000 bytes (under Vercel's 4.5 MB function body limit), validates it, then calls `put(..., {access:'private', addRandomSuffix:false, allowOverwrite:true, contentType:'application/json'})` with the raw body bytes.
  - The Blob token stays in Vercel. The producer holds only a write-one-object token, so it never holds read access.
  - Local and CI: when `PRICE_WATCH_DATA_FILE` is set **and** `VERCEL` is unset, `loadExport()` reads that file instead of Blob. This seam is unreachable on Vercel.
  - Rejected: committing the JSON or putting it in `public/` (violates #95), Edge Config (size limits, not meant for data), and handing the producer `BLOB_READ_WRITE_TOKEN` (full store access off-platform).
- **D3 No indexing or caching.**
  - `src/app/prices/layout.tsx` sets metadata `robots: {index:false, follow:false}`, overriding the root layout's `index: true`.
  - `next.config.mjs` `headers()` gets one entry, `source: "/prices/:path*"`, with `X-Robots-Tag: noindex, nofollow, noarchive`.
  - `robots.ts` adds `disallow: "/prices"`.
  - `sitemap.ts` is unchanged, since the route is not listed.
  - Both prices pages set `dynamic = "force-dynamic"`. They read `cookies()` and call `get(..., {useCache:false})`, so Next serves them `no-store` and prerenders nothing.
- **D4 Chart: inline SVG client component.** `package.json` has no chart library. Port the estate-scout `SCRIPT` behavior (R2) to React:
  - lowest and median lines with point markers, and verified sales as dots (the export's `sales[]` are verified, non-suspect sales only)
  - a 60-day window and 5th–95th percentile scaling
  - dashed `typical` and dotted `max` reference lines with labels, plus a "now" ring
  - pointerdown, and pointermove while pressed, snap to the nearest check. ArrowLeft/Right do the same. `touch-action: pan-y`
  - the readout shows lowest price, date, median of n, and `source · condition · channel`, with an "open listing" link only for `https://` URLs, otherwise the listing `key`. It adds "Sold within a week"
  - header chips (Alert $x, can alert/watch only, scarce), a stats row (lowest ask now, typical sold, your max) and the "Not an alert: why" line
  - filters: All, one per watchlist, and "Alertable only", as `aria-pressed` buttons at least 44px tall
  - `viewBox 0 0 340 180`, `width:100%`, and cards with `min-w-0`, so nothing scrolls sideways at 360px
  - colors: `--series-1/2/3` copied from estate-scout, with surfaces and text from the site's `biq-*` tokens
- **D5 Contract fidelity.** `parsePriceWatch(unknown)` is a hand-written validator with no runtime dependency. It accepts exactly the shipped schema 1 (R1), ignores unknown extra keys, and rejects `schema_version !== 1` or bad types with a field path. Issue #95 describes a per-watchlist `{date, price, listing, condition, channel, verified}` series. The shipped export is one document per desk with the shape in R1, and this PR consumes that unchanged.

## Scope

**Added:**
- `src/lib/price-watch/parse.ts`: types and `parsePriceWatch`
- `src/lib/price-watch/session.ts`: `signSession`, `verifySession`, `passwordMatches`, `tokenMatches`, using `node:crypto`
- `src/lib/price-watch/store.ts`: `loadExport()` (Blob or D2 file) and `saveExport(text)`
- `src/app/prices/layout.tsx`
- `src/app/prices/page.tsx`
- `src/app/prices/login/page.tsx`
- `src/app/prices/login/actions.ts`
- `src/app/api/prices/ingest/route.ts`
- `src/components/price-watch/PriceWatch.tsx`: client component for filters and cards
- `src/components/price-watch/PriceChart.tsx`: client component for the SVG and readout
- `e2e/fixtures/price-watch.json`: synthetic data only. Labels are prefixed `SYNTHETIC`, and URLs use `https://example.com`
- `e2e/price-watch.spec.ts`
- `src/lib/__tests__/price-watch-{parse,session,ingest}.test.ts`
- `docs/price-watch.md`: the ingest contract and operator steps

**Modified:**
- `package.json` and `package-lock.json`: add `@vercel/blob`
- `src/app/robots.ts`
- `next.config.mjs`: one `headers()` entry
- `playwright.config.ts`: `webServer.env` with a test-only password and `PRICE_WATCH_DATA_FILE=e2e/fixtures/price-watch.json`

**Non-goals:**
- any public page
- alert delivery (#1387)
- logout, rate limiting, or multi-user accounts
- the estate-scout table `<details>` and its localStorage-persisted filters
- changes to estate-scout or bayesiq-workspace (see Follow-ups)

**Forbidden:**
- `public/` (no data or fixture there)
- `src/app/sitemap.ts`
- `src/app/layout.tsx`
- `server/`
- the existing `redirects()` entries and existing `headers()` entries
- `.github/workflows/ci.yml`, `config/project.yaml`, ESLint config and the plans layout. #96 (`plans/rejoin-rotation-repo-hygiene.md`) owns these. This PR neither depends on nor edits them.

## Known Non-Existence

- No `middleware.ts`, auth, session or cookie code exists anywhere in `src/`.
- No chart library is installed, and `@vercel/blob` is not installed.
- No Blob store is connected to the Vercel project yet (O1).
- `bayesiq-auth-services` has no SDK, schema or endpoints (R4).
- The workspace `config/scopes.yaml` has no website scope and no Vercel-env destination kind. Its only hosted kind is `github_actions_secrets`.

## Plan

1. **[P1] Contract.** Write `parse.ts` with types matching R1, and the synthetic fixture: 2 watchlists, 3 items, one with `max`, `typical` and `grade` all null, one alertable with `grade.grade = "alert"`, 3 or more checks per item, and 2 sales.
2. **[P2] Session.** Write `session.ts` (D1). Every function returns false when `PRICE_WATCH_PASSWORD` is unset.
3. **[P3] Store and ingest.** Write `store.ts` and `route.ts` (D2). Ingest responses:
   - 404: token env unset
   - 401: bad or missing bearer
   - 413: body over the cap
   - 400: not JSON
   - 422: `{error:"<path>"}`
   - 502: the `put` call threw
   - 204: stored

   Only POST is exported.
4. **[P4] Pages.** Login page and server action: a password field with `autocomplete="current-password"`, a generic "Wrong password" error, and a redirect to `/prices` on success. Prices page flow:
   - verify the session, otherwise redirect
   - `loadExport()`, then `parsePriceWatch`
   - render `<PriceWatch data>`, showing "Updated {generated_at}"

   Empty state: "No price data uploaded yet." Invalid stored data: "Stored export is unreadable" plus the field path. Both return 200 with no data.
5. **[P5] Chart and cards.** `PriceWatch.tsx` and `PriceChart.tsx` per D4. Chart math (window, ticks, scale, nearest index) is a pure function in `PriceChart.tsx`, exported for tests.
6. **[P6] Indexing.** Make the D3 edits to `layout.tsx`, `next.config.mjs` and `robots.ts`.
7. **[P7] Tests and docs.** Write the tests below, `docs/price-watch.md`, and the `playwright.config.ts` env. If #96 has landed first, `npm run lint` also reports 0 errors on the new files.

## Acceptance Criteria

- [ ] With no cookie, `/prices` returns 307 to `/prices/login`, and the HTML contains no fixture string.
- [ ] After login with the right password, every fixture item renders a chart. The watchlist and "Alertable only" filters change which cards are shown.
- [ ] At a 360×740 touch viewport, `documentElement.scrollWidth <= innerWidth` holds on `/prices` and `/prices/login`.
- [ ] Tapping the left edge of a chart shows the first check's price, date, listing source and condition from the fixture.
- [ ] `/prices` and `/prices/login` send `X-Robots-Tag: noindex…` and `<meta name="robots" content="noindex, nofollow">`. `/prices` sends a `Cache-Control` that includes `no-store`.
- [ ] `/robots.txt` contains `Disallow: /prices`, and `/sitemap.xml` does not contain `/prices`.
- [ ] After `next build`, no `.next/server/app/prices*.html` exists, and no file under `.next/static` contains `SYNTHETIC`.
- [ ] Ingest returns the P3 codes, and on 204 it calls `put` with `access:'private'`.
- [ ] `npm run test:unit`, `npm test` and `npm run build` pass. No files outside Scope change.

## Test Plan

- **`price-watch-parse.test.ts`** (Vitest, node env):
  - the fixture parses
  - `schema_version` 2 or missing is rejected
  - a series point missing `cheapest.condition` is rejected with that field path
  - nullable `max`, `typical` and `grade` are accepted, and extra keys are ignored
- **`price-watch-session.test.ts`:**
  - a signed cookie round-trips
  - expired, tampered and wrong-key cookies are rejected
  - every check returns false when the env is unset
  - `passwordMatches` handles inputs of different lengths
- **`price-watch-ingest.test.ts`:** each P3 status, with `vi.mock("@vercel/blob")` asserting the `put` arguments.
- **`e2e/price-watch.spec.ts`** (Chromium against the `npm run build && npm run start` webServer): one test per acceptance bullet above except ingest. Login goes through the UI, and the tap test uses `hasTouch` and `locator.tap({position})`.
- **Manual (post-deploy, operator):** sign in on a phone, then check that a 360px view does not scroll sideways and that tap and drag snap.

## Risks

- **The export grows past 4 MB.** Ingest returns 413 instead of truncating. Follow-up E1 sends compact JSON. `indent=2` is most of the size.
- **The password leaks.** The operator rotates `PRICE_WATCH_PASSWORD` in Vercel and redeploys, which invalidates every session.
- **Merge overlap with #96.** Both PRs touch `package.json`, `package-lock.json` and `next.config.mjs`, in separate hunks. Whichever PR lands second rebases and regenerates the lock with `npm install`.

## Operator steps (no values are generated or seen by agents)

- **O1. Create a private Blob store.** In Vercel project `bayesiq-website`, go to Storage and create a Blob store with **private** access. Connect it to the **Production** environment only, which injects `BLOB_READ_WRITE_TOKEN`.
- **O2. Set `PRICE_WATCH_PASSWORD`** (Production only). Generate it yourself with at least 24 random characters and save it in the phone's password manager.
- **O3. Set `PRICE_WATCH_INGEST_TOKEN`** (Production only). Generate it yourself, then provision the same value on the sweep host through the scope from W1 (`bayesiq-creds`).
- **O4. Redeploy Production.** Never set `PRICE_WATCH_DATA_FILE` in Vercel.
- **O5. Approve the W1 scope** before O3's host copy is made.

## Follow-ups (filed by the parent session; not in this PR)

- **W1, bayesiq-workspace.** Declare scope `website-price-watch` in `config/scopes.yaml`:
  - keys `PRICE_WATCH_PASSWORD` and `PRICE_WATCH_INGEST_TOKEN`
  - a dotenv destination on the sweep host for the token
  - the Vercel env copy recorded as attended-paste, the same pattern as `workspace-ci`'s description

  No Vercel destination kind exists, so this PR does not invent one.
- **E1, estate-scout.** After `sweep_cli finish`, upload `price-watch.json` per the contract:
  - `POST https://bayes-iq.com/api/prices/ingest`
  - headers `Authorization: Bearer $PRICE_WATCH_INGEST_TOKEN` and `Content-Type: application/json`
  - body: the export bytes (compact JSON), at most 4,000,000 bytes

  Responses are those in P3, and the latest upload wins. Run it via `bayesiq-creds run website-price-watch …`, without putting the token on a command line. Add the step to `docs/price-watch-sweep.md`.
- **E2, estate-scout.** Decide whether `publish.json` keeps publishing `price-watch.html` to `prices_page` once the site route is live, or sets `prices_page` to the site URL.

## Reference excerpts

R1. estate-scout `origin/main` (`de8fb18`), `estate_scout/price_page.py` and `docs/deals.md`:
```
def listing(o):
    return {"price": float(Decimal(o["price"])), "source": o["source"], "url": o["url"], "condition": o["condition"],
            "channel": o["channel"], "key": o["listing_key"]}
series.append({"check": check_id, "date": c["date"], "low": ..., "median": ..., "n": len(asks), "cheapest": listing(asks[0])})
sales[...] = dict(listing(o), date=o["sold_on"])   # only o["verified"] and not o["suspect"]
items.append({"id", "label", "priority", "track", "alertable", "max": float|None, "typical": typical(...)|None,
  "series", "sales", "grade": g and {"grade": g["grade"], "reasons": ..., "why": ..., "price": float}})
return {"id": watchlist["id"], "label": label, "items": items}
def export(watchlists, as_of):
    return {"schema_version": EXPORT_VERSION, "generated_at": as_of, "watchlists": watchlists}
```
`as_of = now().strftime("%Y-%m-%d %H:%M UTC")`. `why` is a list of strings (`deals.py:175`). `sweep_cli.py:117-119` writes `price-watch.html` and `price-watch.json` and publishes the page to `config["prices_page"]`.

R2. `price_page.py` SCRIPT: `const W = 340, H = 180, L = 52, R = 10, T = 10, B = 26;`, `const WINDOW = 60 * 864e5;`. `svg.addEventListener('pointerdown', e => show(nearest(e)));` and `pointermove` while `e.buttons`, plus ArrowLeft/ArrowRight. The readout reads `` `${c.source} · ${c.condition} · ${c.channel} · ` ``, and the link is shown only when `/^https:\/\//.test(c.url)`.

R3. `@vercel/blob@2.8.0` `dist/index.d.ts`: `declare function get(urlOrPathname: string, options: GetCommandOptions): Promise<GetBlobResult | null>;`. `access - (Required) Must be 'public' or 'private'. Public blobs are accessible via URL, private blobs require authentication.` and `useCache - (Optional) When false, bypasses the CDN cache and reads the latest content directly from origin storage.` `put` options include `addRandomSuffix?` and `allowOverwrite?`.

R4. bayesiq-auth-services `origin/main` (`1fbdd1a`, "Phase 0 initial scaffold"). The tree is only docs, `scripts/install.sh` and empty `conformance/`, `openapi/` and `schema/`. Its CAPABILITIES.md says: "Phase 0: no capabilities registered yet."

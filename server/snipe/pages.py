"""Bundle-to-renderer adapter: overlay recent swipes, call the vendored renderers, wrap each in a document.

The vendored renderers return a fragment that opens with <title>/<link>/<style>
and then <main>; `render_desk` has no `document` switch at all. So every
fragment is split at its first <main>: what precedes it goes into <head>, the
rest into <body>.
"""

import copy
import html

from snipe.vendor.deck import render_deck
from snipe.vendor.desk import render_desk
from snipe.vendor.price_page import render_page

ROBOTS_META = '<meta name="robots" content="noindex, nofollow">'

LOGIN_STYLE = """
:root { --bg: #f6f4ef; --panel: #ffffff; --ink: #16150f; --muted: #5d5a50; --line: #e5e1d6; color-scheme: light; }
@media (prefers-color-scheme: dark) { :root { --bg: #141412; --panel: #1f1e1b; --ink: #f4f2ea; --muted: #b9b5a8;
  --line: #33312c; color-scheme: dark; } }
body { margin: 0; background: var(--bg); color: var(--ink); }
main { font: 16px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif; max-width: 420px; margin: 0 auto;
  padding: 48px 20px; display: grid; gap: 14px; }
h1 { font-size: 24px; margin: 0; } p { margin: 0; color: var(--muted); }
form { display: grid; gap: 10px; }
input, button { font: inherit; padding: 12px 14px; border-radius: 12px; border: 1px solid var(--line); }
input { background: var(--panel); color: var(--ink); }
button { background: var(--ink); color: var(--bg); border-color: var(--ink); font-weight: 600; cursor: pointer; }
"""


def document(fragment):
    """A full HTML document around a renderer fragment (or a plain <main>)."""
    cut = fragment.find("<main")
    head, body = (fragment[:cut], fragment[cut:]) if cut >= 0 else ("", fragment)
    return ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" '
            f'content="width=device-width, initial-scale=1, viewport-fit=cover">{ROBOTS_META}{head}</head>'
            f'<body>{body}</body></html>\n')


def _simple(title, inner):
    return document(f"<title>{html.escape(title)}</title><style>{LOGIN_STYLE}</style><main>{inner}</main>")


def _servable(photo):
    """Only photos this site serves, or data URIs; anything else (e.g. another host's paths) is dropped."""
    return photo if isinstance(photo, str) and photo.startswith(("/photos/", "data:image/")) else None


def overlay(bundle, generated_utc, swipes):
    """A copy of the bundle with swipes made after it was generated applied (latest per ref wins).

    Older swipes are already in the bundle's grading: estate-scout pulls swipes before it builds a bundle.
    """
    doc = copy.deepcopy(bundle)
    recent = {}
    for s in swipes:  # oldest first, so later rows overwrite earlier ones
        if s["at"] > generated_utc:
            recent[s["ref"]] = s["verdict"]
    for card in doc["deck"]["cards"]:
        if card["ref"] in recent:
            card["swipe"] = recent[card["ref"]]
        card["photo"] = _servable(card.get("photo"))
        for comp in card.get("comps") or []:
            if isinstance(comp, dict):
                comp["photo"] = _servable(comp.get("photo"))
    for w in doc["desk"]["watchlists"]:
        for deal in w["deals"]:
            ref = f"{deal.get('watchlist')}:{deal.get('item_id')}:{deal.get('listing_key')}"
            if ref in recent:
                deal["swipe"] = recent[ref]
    return doc


def desk_page(doc):
    desk = doc["desk"]
    config = {"title": desk["title"], "decisions": desk["decisions"], "deck_page": "/deck", "prices_page": "/prices"}
    sections = []
    for w in desk["watchlists"]:
        # Bundle deals carry `why` but no `reasons`; the vendored card() reads g["reasons"] eagerly.
        deals = [dict(d, reasons=d.get("why") or []) for d in w["deals"]]
        tokens = w.get("sweep_tokens")
        cost = {"agent_tokens": tokens} if tokens is not None else None
        sections.append(({"label": w["label"], "chart_page": None, "best_deals_page": None}, deals, w.get("last_check"), cost))
    return document(render_desk(config, sections, doc["generated_at"]))


def deck_page(doc):
    return document(render_deck({"page": "/", "prices_page": "/prices"}, doc["deck"]["cards"], doc["generated_at"]))


def prices_page(doc):
    return document(render_page({"page": "/"}, doc["prices"]["watchlists"], doc["generated_at"]))


def no_sweep_page():
    return _simple("Snipe sales", "<h1>Snipe sales</h1><p>No sweep uploaded yet.</p>")


def login_page():
    return _simple("Sign in", '<h1>Sign in</h1><p>Enter the operator address and a sign-in link is emailed.</p>'
                   '<form method="post" action="/login"><input type="email" name="email" autocomplete="email" required '
                   'aria-label="Email"><button type="submit">Email me a link</button></form>')


def login_sent_page():
    return _simple("Check your email", "<h1>Check your email</h1>"
                   "<p>If that is the operator's address, a link is on its way.</p>")


def verify_page(token):
    return _simple("Sign in", '<h1>Sign in</h1><p>Finish signing in on this device.</p>'
                   f'<form method="post" action="/login/verify"><input type="hidden" name="t" value="{html.escape(token)}">'
                   '<button type="submit">Sign in</button></form>')


def bad_link_page():
    return _simple("Link not valid", '<h1>Link not valid</h1><p>That sign-in link is invalid, used or expired.</p>'
                   '<p><a href="/login">Request a new one</a></p>')


def message_page(title, text):
    return _simple(title, f"<h1>{html.escape(title)}</h1><p>{html.escape(text)}</p>")

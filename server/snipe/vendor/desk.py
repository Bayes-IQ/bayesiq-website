"""Deal Desk renderer (money, STYLE, STATUS_TONE, card, render_desk).

Vendored from Bayes-IQ/estate-scout@d8cee28bd3e83fec3d85785a2c344e092916a967
estate_scout/deals.py, lines 33-35 and 331-435. Edits, and nothing else:
- imports trimmed to the stdlib modules these functions use
- the Google Fonts <link> line removed (no third-party request; the system font stack applies)
"""

from decimal import Decimal
import html


def money(value):
    v = float(value)
    return f"${v:,.0f}" if v >= 100 else f"${v:,.2f}"


STYLE = """
/* A single-column operator board: what needs you first (alerts, decisions), then what is being watched. */
:root { --surface: #f6f4ef; --panel: #ffffff; --line: #e5e1d6; --ink: #16150f; --muted: #5d5a50; --chip: #efece4;
  --act: #1d7a45; --act-soft: #dff1e6; --warn: #a35a00; --warn-soft: #fbeedb; --accent: #2a5fa8; color-scheme: light;
  --display: "Bricolage Grotesque", "Avenir Next", system-ui, sans-serif; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --surface: #141412; --panel: #1f1e1b;
  --line: #33312c; --ink: #f4f2ea; --muted: #b9b5a8; --chip: #2b2a26; --act: #5fc68c; --act-soft: #1b3326;
  --warn: #f0a640; --warn-soft: #3a2c16; --accent: #7fa9e6; color-scheme: dark; } }
:root[data-theme="dark"] { --surface: #141412; --panel: #1f1e1b; --line: #33312c; --ink: #f4f2ea; --muted: #b9b5a8;
  --chip: #2b2a26; --act: #5fc68c; --act-soft: #1b3326; --warn: #f0a640; --warn-soft: #3a2c16; --accent: #7fa9e6;
  color-scheme: dark; }
body { margin: 0; background: var(--surface); color: var(--ink); }
.desk { font: 15px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif; max-width: 640px; margin: 0 auto;
  padding-block: 20px 40px; padding-inline: 16px; display: grid; gap: 22px; }
h1 { font: 700 26px/1.1 var(--display); margin: 0; letter-spacing: -.01em; }
h2 { font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin: 0 0 8px; }
.sub { color: var(--muted); margin: 6px 0 0; font-size: 13px; }
.summary { font-size: 15px; margin: 8px 0 0; } .summary b { font-variant-numeric: tabular-nums; }
.go { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 12px; }
.go a { text-decoration: none; font-weight: 600; font-size: 15px; padding: 10px 16px; border-radius: 12px; min-height: 22px; }
.go .primary { background: var(--ink); color: var(--surface); } .go .secondary { border: 1px solid var(--line); color: var(--ink); }
.list { display: grid; gap: 10px; }
.card { background: var(--panel); border-radius: 14px; padding: 12px 14px; min-width: 0; border: 1px solid var(--line); }
.card.act { background: var(--act-soft); border-color: var(--act); }
.row { display: flex; justify-content: space-between; gap: 4px 12px; align-items: baseline; }
.name { font-weight: 600; min-width: 0; } .price { font: 700 18px/1.2 var(--display); font-variant-numeric: tabular-nums; white-space: nowrap; }
.meta { color: var(--muted); font-size: 13px; font-variant-numeric: tabular-nums; margin-top: 2px; }
.deal { font-size: 13px; margin-top: 4px; } .deal b { color: var(--act); }
.chips { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
.chip { font-size: 12px; padding: 3px 9px; border-radius: 999px; background: var(--chip); color: var(--muted); }
.chip.warn { background: var(--warn-soft); color: var(--warn); } .chip.act { background: var(--act-soft); color: var(--act); font-weight: 600; }
.decision .title { font-weight: 600; } .decision .when { font-size: 13px; color: var(--muted); margin-top: 6px; display: flex;
  gap: 8px; flex-wrap: wrap; align-items: center; }
a { color: var(--accent); } .empty { color: var(--muted); font-size: 14px; margin: 0; }
.sweeps { display: grid; gap: 6px; font-size: 13px; color: var(--muted); }
.sweeps div { display: flex; flex-wrap: wrap; gap: 2px 10px; } .sweeps b { color: var(--ink); font-weight: 600; }
"""

STATUS_TONE = {"waiting on seller": "warn", "recheck": "warn", "fallback": "", "after card": ""}


def card(g):
    e = html.escape
    where = f"{e(g['channel'])}" + (f", {e(g['round_trip_miles'])} mi" if g["round_trip_miles"] else "")
    deal = ""
    if g["baseline_median"]:
        under = Decimal(g["baseline_median"]) - Decimal(g["price"])
        pct = (under * 100 / Decimal(g["baseline_median"])).quantize(Decimal("1"))
        deal = (f'<div class="deal"><b>{money(under)} under</b> typical {money(g["baseline_median"])} ({pct}%)</div>' if under > 0
                else f'<div class="deal">typical {money(g["baseline_median"])}</div>')
    sold = g.get("sold_30") or {"count": 0}
    if sold["count"]:
        deal = deal.replace("</div>", f' · {sold["count"]} sold in 30 days</div>', 1) if deal else f'<div class="deal">{sold["count"]} sold in 30 days</div>'
    link = f' · <a href="{e(g["url"])}">listing</a>' if g["url"] else ""
    chips = [f'<span class="chip act">you said {e(g["swipe"])}</span>'] if g.get("swipe") in ("want", "maybe") else []
    chips += [f'<span class="chip warn">{e(w)}</span>' for w in g.get("why", g["reasons"])[:3]]
    return (f'<div class="card{" act" if g["grade"] == "alert" else ""}"><div class="row"><span class="name">{e(g["item_label"])}</span>'
            f'<span class="price">{money(g["price"])}</span></div><div class="meta">{e(g["source"])} · {e(g["condition"])} · {where}'
            f'{link}</div>{deal}' + (f'<div class="chips">{"".join(chips)}</div>' if chips else "") + "</div>")


def render_desk(config, sections, as_of):
    """`sections`: per configured watchlist, (config row, graded entries, last check, cost row or None)."""
    e = html.escape
    graded = [g for _, entries, _, _ in sections for g in entries]
    act = [g for g in graded if g["grade"] == "alert"]
    wanted = [g for g in graded if g["grade"] == "watching" and g.get("swipe") in ("want", "maybe")]
    watching = [g for g in graded if g["grade"] == "watching" and g not in wanted and g.get("swipe") != "pass"][:10]
    to_swipe = sum(1 for g in graded if not g.get("swipe"))
    counts = [f"<b>{len(act)}</b> alert{'s' if len(act) != 1 else ''}", f"<b>{len(config['decisions'])}</b> open decision"
              + ("s" if len(config["decisions"]) != 1 else ""), f"<b>{to_swipe}</b> deal{'s' if to_swipe != 1 else ''} to swipe"]
    go = []
    if config.get("deck_page"):
        go.append(f'<a class="primary" href="{e(config["deck_page"])}">Swipe deals ({to_swipe})</a>')
    if config.get("prices_page"):
        go.append(f'<a class="secondary" href="{e(config["prices_page"])}">Price charts</a>')
    parts = [f'<title>{e(config["title"])}</title>'
             f'<style>{STYLE}</style><main class="desk">',
             f'<header><h1>{e(config["title"])}</h1><p class="summary">{" · ".join(counts)}</p>'
             + (f'<div class="go">{"".join(go)}</div>' if go else "")
             + f'<p class="sub">Updated {e(as_of)}. Read-only: nothing here buys, bids or messages.</p></header>']
    if act:
        parts.append('<section><h2>Act on these</h2><div class="list">' + "".join(card(g) for g in act) + "</div></section>")
    if config["decisions"]:
        items = []
        for d in config["decisions"]:
            tone = STATUS_TONE.get(d["status"], "")
            when = (f'<span class="chip {tone}">{e(d["status"])}</span>' + (f"<span>due {e(d['due'])}</span>" if d["due"] else "")
                    + (f'<a href="{e(d["link"])}">open</a>' if d["link"] else ""))
            items.append(f'<div class="card decision"><div class="title">{e(d["title"])}</div><div class="when">{when}</div></div>')
        parts.append('<section><h2>Decisions in progress</h2><div class="list">' + "".join(items) + "</div></section>")
    if wanted:
        parts.append('<section><h2>You said want</h2><div class="list">' + "".join(card(g) for g in wanted) + "</div></section>")
    parts.append('<section><h2>Watching</h2><div class="list">'
                 + ("".join(card(g) for g in watching) or '<p class="empty">Nothing flagged.</p>') + "</div></section>")
    rows = []
    for w, entries, last, cost in sections:
        pages = " · ".join(f'<a href="{e(link)}">{name}</a>' for name, link in
                           (("charts", w["chart_page"]), ("best deals", w["best_deals_page"])) if link)
        spent = f"{cost['agent_tokens']:,} tokens" if cost and cost["agent_tokens"] is not None else "cost not recorded"
        rows.append(f"<div><b>{e(w['label'])}</b><span>last swept {e(last or 'never')}</span><span>{e(spent)}</span>"
                    f"<span>{pages}</span></div>")
    parts.append(f'<section><h2>Sweeps</h2><div class="sweeps">{"".join(rows)}</div></section></main>\n')
    return "".join(parts)

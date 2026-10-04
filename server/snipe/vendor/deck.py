"""Deal Deck renderer (STYLE, SCRIPT, render_deck).

Vendored from Bayes-IQ/estate-scout@d8cee28bd3e83fec3d85785a2c344e092916a967
estate_scout/deck.py, lines 115-340. Edits, and nothing else:
- imports trimmed to the stdlib modules these functions use
- the Google Fonts <link> line removed (no third-party request; the system font stack applies)
- save() POSTs to the same-origin /api/swipes instead of the hosted-artifact database; a non-OK answer shows the existing status text
- the artifact-database load/onSnapshot block deleted; verdicts on load come from each card's (overlaid) swipe
"""

import html
import json


STYLE = """
/* A single card stack, phone first: photo, price verdict, three numbers, recent sales strip, then the swipe row. */
:root { --bg: #f6f4ef; --card: #ffffff; --ink: #16150f; --muted: #5d5a50; --line: #e5e1d6; --chip: #efece4;
  --good: #1d7a45; --good-soft: #dff1e6; --warn: #a35a00; --warn-soft: #fbeedb; --bad: #b3261e; --bad-soft: #f9e1df;
  --fair: #2a5fa8; --fair-soft: #e3ecf8; --shadow: 0 10px 30px rgba(22, 21, 15, .14); color-scheme: light;
  --display: "Bricolage Grotesque", "Avenir Next", system-ui, sans-serif; --body: system-ui, -apple-system, "Segoe UI", sans-serif; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --bg: #141412; --card: #1f1e1b; --ink: #f4f2ea;
  --muted: #b9b5a8; --line: #33312c; --chip: #2b2a26; --good: #5fc68c; --good-soft: #1b3326; --warn: #f0a640;
  --warn-soft: #3a2c16; --bad: #f08a83; --bad-soft: #3d1f1d; --fair: #7fa9e6; --fair-soft: #1d2a3d;
  --shadow: 0 10px 30px rgba(0, 0, 0, .5); color-scheme: dark; } }
:root[data-theme="dark"] { --bg: #141412; --card: #1f1e1b; --ink: #f4f2ea; --muted: #b9b5a8; --line: #33312c;
  --chip: #2b2a26; --good: #5fc68c; --good-soft: #1b3326; --warn: #f0a640; --warn-soft: #3a2c16; --bad: #f08a83;
  --bad-soft: #3d1f1d; --fair: #7fa9e6; --fair-soft: #1d2a3d; --shadow: 0 10px 30px rgba(0, 0, 0, .5); color-scheme: dark; }
body { margin: 0; background: var(--bg); color: var(--ink); }
.app { font: 15px/1.45 var(--body); max-width: 460px; margin: 0 auto; padding-block: 14px 28px; padding-inline: 16px;
  display: grid; gap: 12px; }
.top { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
h1 { font: 700 22px/1.1 var(--display); margin: 0; letter-spacing: -.01em; }
.count { color: var(--muted); font-size: 13px; font-variant-numeric: tabular-nums; }
.tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.tabs button { font: inherit; font-size: 13px; border: 1px solid var(--line); background: transparent; color: var(--ink);
  border-radius: 999px; padding: 6px 12px; min-height: 34px; cursor: pointer; }
.tabs button[aria-pressed="true"] { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.stack { position: relative; min-height: 420px; }
.card { position: absolute; inset: 0 0 auto 0; background: var(--card); border-radius: 18px; box-shadow: var(--shadow);
  overflow: hidden; touch-action: pan-y; user-select: none; will-change: transform; }
.card.under { transform: scale(.96) translateY(10px); opacity: .7; pointer-events: none; }
.photo { position: relative; aspect-ratio: 4 / 3; background: var(--chip); max-width: 100%; }
.photo img { width: 100%; height: 100%; object-fit: cover; display: block; pointer-events: none; }
.ph { position: absolute; inset: 0 0 44px 0; display: grid; place-items: center; color: var(--muted); text-align: center;
  background: repeating-linear-gradient(135deg, var(--chip) 0 14px, var(--card) 14px 28px); }
.ph-mark { display: block; font: 400 40px/1 var(--display); opacity: .7; }
.ph small { display: block; font: 12px/1.3 var(--body); margin-top: 6px; padding-inline: 24px; }
.tags { position: absolute; left: 10px; right: 10px; bottom: 10px; display: flex; gap: 6px; flex-wrap: wrap; }
.tag { background: rgba(0, 0, 0, .62); color: #fff; font-size: 12px; padding: 3px 9px; border-radius: 999px; }
.stamp { position: absolute; top: 18px; font: 800 30px/1 var(--display); padding: 4px 12px; border: 4px solid; border-radius: 10px;
  opacity: 0; letter-spacing: .04em; background: var(--card); }
.stamp.want { left: 16px; color: var(--good); transform: rotate(-12deg); }
.stamp.pass { right: 16px; color: var(--bad); transform: rotate(12deg); }
.stamp.maybe { left: 50%; transform: translateX(-50%); color: var(--warn); }
.body { padding: 14px 16px 16px; display: grid; gap: 10px; }
.item { font: 600 17px/1.25 var(--display); margin: 0; text-wrap: balance; }
.where { color: var(--muted); font-size: 13px; }
.priceline { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.price { font: 800 34px/1 var(--display); font-variant-numeric: tabular-nums; letter-spacing: -.02em; }
.pill { font-size: 13px; font-weight: 600; padding: 4px 10px; border-radius: 999px; }
.pill.good { background: var(--good-soft); color: var(--good); } .pill.fair { background: var(--fair-soft); color: var(--fair); }
.pill.warn, .pill.suspect { background: var(--warn-soft); color: var(--warn); } .pill.neutral { background: var(--chip); color: var(--muted); }
.nums { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
.num { background: var(--chip); border-radius: 12px; padding: 8px 10px; min-width: 0; }
.num b { display: block; font: 700 17px/1.2 var(--display); font-variant-numeric: tabular-nums; }
.num span { font-size: 11px; color: var(--muted); line-height: 1.25; display: block; }
h3 { font-size: 12px; letter-spacing: .06em; text-transform: uppercase; color: var(--muted); margin: 2px 0 0; }
.comps { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scroll-snap-type: x mandatory; }
.comp { flex: 0 0 104px; scroll-snap-align: start; background: var(--chip); border-radius: 10px; overflow: hidden;
  color: inherit; text-decoration: none; }
.comp .thumb { aspect-ratio: 1; background: var(--line); display: grid; place-items: center; color: var(--muted); font-size: 11px; }
.comp img { width: 100%; height: 100%; object-fit: cover; display: block; }
.comp div.meta { padding: 5px 7px 7px; font-size: 11px; color: var(--muted); line-height: 1.3; }
.comp b { display: block; color: var(--ink); font: 700 15px/1.3 var(--display); font-variant-numeric: tabular-nums; }
.comp .src { display: block; opacity: .8; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.facts { margin: 0; padding: 0; list-style: none; display: grid; gap: 4px; font-size: 13px; color: var(--muted); }
.facts li::before { content: "·"; margin-right: 6px; }
.open { color: var(--fair); font-weight: 600; font-size: 14px; }
.actions { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; }
.actions button { font: 700 15px/1 var(--body); min-height: 52px; border-radius: 14px; border: 2px solid; cursor: pointer;
  background: var(--card); }
.actions .pass { color: var(--bad); border-color: var(--bad); } .actions .maybe { color: var(--warn); border-color: var(--warn); }
.actions .want { color: var(--card); background: var(--good); border-color: var(--good); }
button:focus-visible, a:focus-visible { outline: 3px solid var(--fair); outline-offset: 2px; }
.hint { text-align: center; color: var(--muted); font-size: 12px; }
.done { text-align: center; padding: 48px 16px; display: grid; gap: 8px; }
.done b { font: 700 24px/1.2 var(--display); }
.note { font-size: 12px; color: var(--muted); text-align: center; }
@media (prefers-reduced-motion: reduce) { .card { transition: none !important; } }
"""

SCRIPT = r"""
const DECK = JSON.parse(document.getElementById('deck-data').textContent);
const money = v => v == null ? '—' : (v >= 100 ? '$' + Math.round(v).toLocaleString() : '$' + v.toFixed(2));
const node = (tag, cls, text) => { const e = document.createElement(tag); if (cls) e.className = cls;
  if (text != null) e.textContent = text; return e; };
const verdicts = {};               // listing_slug -> verdict, from this page's database and this session
DECK.cards.forEach(c => { if (c.swipe) verdicts[c.listing_slug] = c.swipe; });
let tab = 'review', db = null;
try { tab = localStorage.getItem('deck-tab') || 'review'; } catch (e) {}

function filtered() {
  return DECK.cards.filter(c => { const v = verdicts[c.listing_slug];
    return tab === 'review' ? !v : tab === 'want' ? v === 'want' || v === 'maybe' : v === 'pass'; });
}

function photo(c) {
  const p = node('div', 'photo');
  if (c.photo) { const img = node('img'); img.src = c.photo; img.alt = c.item; p.append(img); }
  else { const ph = node('div', 'ph'); const inner = node('div');
    inner.append(node('span', 'ph-mark', '▢'), node('small', null, 'No photo yet; the next sweep captures one')); ph.append(inner); p.append(ph); }
  const tags = node('div', 'tags'); [c.condition, c.channel === 'local' ? 'local pickup' : c.channel, c.source]
    .forEach(t => tags.append(node('span', 'tag', t))); p.append(tags);
  ['want', 'pass', 'maybe'].forEach(k => p.append(node('div', 'stamp ' + k, k.toUpperCase())));
  return p;
}

function build(c) {
  const el = node('article', 'card'); el.dataset.slug = c.slug; el.append(photo(c));
  const b = node('div', 'body');
  b.append(node('h2', 'item', c.item), node('div', 'where', `${c.watchlist}${c.grade === 'alert' ? ' · alert' : ''}`));
  const pl = node('div', 'priceline'); pl.append(node('span', 'price', money(c.price)), node('span', 'pill ' + c.tone, c.verdict));
  b.append(pl);
  const nums = node('div', 'nums'); const num = (v, t) => { const d = node('div', 'num'); d.append(node('b', null, v), node('span', null, t)); nums.append(d); };
  num(money(c.typical), `typical (${c.typical_basis})`);
  num(String(c.sold_30.count), c.sold_30.count ? `sold in 30 days · median ${money(c.sold_30.median && +c.sold_30.median)}` : `sold in 30 days (${c.condition})`);
  num(money(c.max), c.max != null ? (c.all_in != null && c.all_in > c.max ? `your max · ${money(c.all_in - c.max)} over` : 'your max') : 'no max set');
  b.append(nums);
  if (c.comps.length) {
    b.append(node('h3', null, 'Recent sales'));
    const strip = node('div', 'comps');
    c.comps.forEach(s => { const a = node(s.url ? 'a' : 'div', 'comp'); if (s.url) { a.href = s.url; a.target = '_blank'; a.rel = 'noopener'; }
      if (s.photo) { const t = node('div', 'thumb'), img = node('img'); img.src = s.photo; img.alt = ''; t.append(img); a.append(t); }
      const when = new Date(s.date + 'T12:00:00').toLocaleDateString(undefined, {month: 'short', day: 'numeric'});
      const m = node('div', 'meta'); m.append(node('b', null, money(s.price)), document.createTextNode(`${when} · ${s.same ? s.condition : s.condition + '*'}`),
        node('span', 'src', s.source));
      a.append(m); strip.append(a); });
    b.append(strip);
    if (c.comps.some(s => !s.same)) b.append(node('div', 'note', '* a different condition'));
  }
  const facts = node('ul', 'facts');
  if (c.listing_days != null) facts.append(node('li', null, `listed ${c.listing_days} day${c.listing_days === 1 ? '' : 's'} ago`));
  if (c.trip) facts.append(node('li', null, c.trip));
  if (c.all_in != null && c.all_in !== c.price) facts.append(node('li', null, `${money(c.all_in)} all-in with tax`));
  if (c.why.length) facts.append(node('li', null, 'Not an alert: ' + c.why.join('; ')));
  b.append(facts);
  if (c.url) { const a = node('a', 'open', 'Open the listing'); a.href = c.url; a.target = '_blank'; a.rel = 'noopener'; b.append(a); }
  el.append(b);
  return el;
}

async function save(c, verdict) {
  verdicts[c.listing_slug] = verdict;
  try { const r = await fetch('/api/swipes', {method: 'POST', headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ref: c.ref, verdict, price: c.price.toFixed(2), alert_id: c.alert_id})});
    if (!r.ok) throw new Error('HTTP ' + r.status); }
  catch (e) { const n = document.getElementById('status'); n.textContent = 'Could not save that swipe; it will show again next time.'; }
}

function render(focus) {
  document.querySelectorAll('.tabs button').forEach(b => b.setAttribute('aria-pressed', b.dataset.tab === tab));
  const stack = document.getElementById('stack'); stack.replaceChildren();
  let list = filtered();
  if (focus) { const i = list.findIndex(c => c.slug === focus); if (i > 0) list = list.slice(i).concat(list.slice(0, i)); }
  document.getElementById('count').textContent = list.length ? `${list.length} to ${tab === 'review' ? 'review' : 'see'}` : '';
  document.getElementById('actions').hidden = !list.length || tab !== 'review';
  if (!list.length) { const d = node('div', 'done'); d.append(node('b', null, tab === 'review' ? 'All caught up' : 'Nothing here yet'),
      node('span', 'note', tab === 'review' ? 'New deals arrive with the next sweep.' : 'Swipe deals in To review to fill this.'));
    stack.append(d); stack.style.minHeight = '0'; return; }
  stack.style.minHeight = '';
  if (list[1]) { const u = build(list[1]); u.classList.add('under'); stack.append(u); }
  const top = build(list[0]); stack.append(top); stack.style.height = top.offsetHeight + 12 + 'px';
  const under = stack.querySelector('.card.under'); if (under) { under.style.height = top.offsetHeight + 'px'; under.style.overflow = 'hidden'; }
  if (tab === 'review') drag(top, list[0]);
}

function fling(el, c, verdict) {
  const dx = verdict === 'want' ? 1 : verdict === 'pass' ? -1 : 0, dy = verdict === 'maybe' ? -1 : 0;
  el.style.transition = 'transform .25s ease-out, opacity .25s';
  el.style.transform = `translate(${dx * 140}%, ${dy * 120}%) rotate(${dx * 18}deg)`; el.style.opacity = '0';
  save(c, verdict); setTimeout(() => render(), 230);
}

function drag(el, c) {
  let x0 = 0, y0 = 0, dx = 0, dy = 0, live = false;
  const stamps = k => el.querySelector('.stamp.' + k);
  el.addEventListener('pointerdown', e => { if (e.target.closest('a,button,.comps')) return; live = true; x0 = e.clientX; y0 = e.clientY;
    el.setPointerCapture(e.pointerId); el.style.transition = 'none'; });
  el.addEventListener('pointermove', e => { if (!live) return; dx = e.clientX - x0; dy = e.clientY - y0;
    el.style.transform = `translate(${dx}px, ${Math.min(dy, 0)}px) rotate(${dx / 18}deg)`;
    stamps('want').style.opacity = Math.max(0, Math.min(1, dx / 90)); stamps('pass').style.opacity = Math.max(0, Math.min(1, -dx / 90));
    stamps('maybe').style.opacity = Math.abs(dx) < 50 ? Math.max(0, Math.min(1, -dy / 90)) : 0; });
  const end = () => { if (!live) return; live = false;
    if (dx > 110) fling(el, c, 'want'); else if (dx < -110) fling(el, c, 'pass');
    else if (dy < -110 && Math.abs(dx) < 60) fling(el, c, 'maybe');
    else { el.style.transition = 'transform .2s'; el.style.transform = ''; el.querySelectorAll('.stamp').forEach(s => s.style.opacity = 0); }
    dx = dy = 0; };
  el.addEventListener('pointerup', end); el.addEventListener('pointercancel', end);
}

document.querySelectorAll('.tabs button').forEach(b => b.addEventListener('click', () => { tab = b.dataset.tab;
  try { localStorage.setItem('deck-tab', tab); } catch (e) {} render(); }));
document.querySelectorAll('#actions button').forEach(b => b.addEventListener('click', () => {
  const top = document.querySelector('#stack .card:not(.under)'); const list = filtered();
  const c = top && list.find(x => x.slug === top.dataset.slug); if (c) fling(top, c, b.dataset.verdict); }));
document.addEventListener('keydown', e => { const k = {ArrowRight: 'want', ArrowLeft: 'pass', ArrowUp: 'maybe'}[e.key];
  if (k && tab === 'review') { const btn = document.querySelector(`#actions button[data-verdict="${k}"]`); if (btn) { btn.click(); e.preventDefault(); } } });
const focus = /^[0-9a-f]{16}$/.test(location.hash.slice(1)) ? location.hash.slice(1) : null;
if (focus) { const c = DECK.cards.find(x => x.slug === focus); if (c && verdicts[c.listing_slug]) tab = verdicts[c.listing_slug] === 'pass' ? 'pass' : 'want'; }
render(focus);
"""


def render_deck(config, deck, as_of, document=False):
    data = json.dumps({"cards": deck}, ensure_ascii=False).replace("</", "<\\/")
    desk = (f' · <a href="{html.escape(config["page"])}">Desk</a>' if config.get("page") else "")
    prices = (f' · <a href="{html.escape(config["prices_page"])}">Charts</a>' if config.get("prices_page") else "")
    body = ('<title>Deal Deck</title>'
            f'<style>{STYLE}</style><main class="app"><div class="top"><h1>Deal Deck</h1><span class="count" id="count"></span></div>'
            '<div class="tabs" role="toolbar" aria-label="Show"><button type="button" data-tab="review">To review</button>'
            '<button type="button" data-tab="want">Wanted &amp; maybe</button><button type="button" data-tab="pass">Passed</button></div>'
            '<div class="stack" id="stack" aria-live="polite"></div>'
            '<div class="actions" id="actions"><button type="button" class="pass" data-verdict="pass">Pass</button>'
            '<button type="button" class="maybe" data-verdict="maybe">Maybe</button>'
            '<button type="button" class="want" data-verdict="want">Want</button></div>'
            f'<p class="hint">Swipe right to want, left to pass, up for maybe.</p>'
            f'<p class="note" id="status"></p><p class="note">Updated {html.escape(as_of)}{desk}{prices}. Nothing here buys or messages.</p></main>'
            f'<script type="application/json" id="deck-data">{data}</script><script>{SCRIPT}</script>\n')
    if not document:
        return body
    return ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" '
            'content="width=device-width, initial-scale=1, viewport-fit=cover"></head><body>' + body + "</body></html>\n")

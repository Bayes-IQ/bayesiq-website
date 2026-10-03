"""Price Watch renderer (STYLE, SCRIPT, render_page).

Vendored from Bayes-IQ/estate-scout@d8cee28bd3e83fec3d85785a2c344e092916a967
estate_scout/price_page.py, lines 102-289 and 300-319. Edits, and nothing else:
- imports trimmed to the stdlib modules these functions use
"""

import html
import json


STYLE = """
/* One column of item cards: summary numbers, then a line chart with a tap readout. Filters in one row on top. */
:root { --surface-1: #fcfcfb; --surface-2: #f1f0ec; --grid: #e4e3df; --text-primary: #0b0b0b; --text-secondary: #52514e;
  --series-1: #2a78d6; --series-2: #eb6834; --series-3: #1baf7a; --good: #1f7a3f; --good-soft: #e2f1e7; --chip: #e9e8e3;
  color-scheme: light; }
@media (prefers-color-scheme: dark) { :root:not([data-theme="light"]) { --surface-1: #1a1a19; --surface-2: #252523;
  --grid: #383835; --text-primary: #ffffff; --text-secondary: #c3c2b7; --series-1: #3987e5; --series-2: #d95926;
  --series-3: #199e70; --good: #5cc48a; --good-soft: #1d3326; --chip: #30302d; color-scheme: dark; } }
:root[data-theme="dark"] { --surface-1: #1a1a19; --surface-2: #252523; --grid: #383835; --text-primary: #ffffff;
  --text-secondary: #c3c2b7; --series-1: #3987e5; --series-2: #d95926; --series-3: #199e70; --good: #5cc48a;
  --good-soft: #1d3326; --chip: #30302d; color-scheme: dark; }
body { margin: 0; background: var(--surface-1); color: var(--text-primary); }
.wrap { font: 15px/1.45 system-ui, -apple-system, "Segoe UI", sans-serif; max-width: 760px; margin: 0 auto;
  padding-block: 20px 48px; padding-inline: 16px; display: grid; gap: 16px; }
h1 { font-size: 21px; margin: 0; text-wrap: balance; } .sub { color: var(--text-secondary); font-size: 13px; margin: 2px 0 0; }
.filters { display: flex; flex-wrap: wrap; gap: 8px; position: sticky; top: env(safe-area-inset-top, 0px); z-index: 2;
  background: var(--surface-1); padding-block: 8px; }
.filters button { font: inherit; font-size: 14px; border: 1px solid var(--grid); background: var(--surface-1);
  color: var(--text-primary); border-radius: 999px; padding: 6px 12px; min-height: 36px; cursor: pointer; }
.filters button[aria-pressed="true"] { background: var(--text-primary); color: var(--surface-1); border-color: var(--text-primary); }
.filters button:focus-visible, svg:focus-visible { outline: 2px solid var(--series-1); outline-offset: 2px; }
.legend { display: flex; flex-wrap: wrap; gap: 4px 14px; color: var(--text-secondary); font-size: 12px; }
.legend span { display: inline-flex; align-items: center; gap: 6px; }
.cards { display: grid; gap: 14px; } .group { font-size: 12px; letter-spacing: .06em; text-transform: uppercase;
  color: var(--text-secondary); margin: 8px 0 0; }
.card { background: var(--surface-2); border-radius: 12px; padding: 12px 12px 8px; min-width: 0; }
.card.alert { box-shadow: inset 0 0 0 2px var(--good); }
.head { display: flex; justify-content: space-between; gap: 8px 12px; align-items: baseline; flex-wrap: wrap; }
.name { font-weight: 600; } .chips { display: flex; gap: 6px; flex-wrap: wrap; }
.chip { font-size: 11px; padding: 2px 8px; border-radius: 999px; background: var(--chip); color: var(--text-secondary); }
.chip.alert { background: var(--good-soft); color: var(--good); font-weight: 600; }
.stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; margin: 8px 0 2px; font-variant-numeric: tabular-nums; }
.stat { min-width: 0; } .stat b { font-size: 18px; display: block; line-height: 1.2; }
.stat span { font-size: 11px; color: var(--text-secondary); display: block; line-height: 1.25; }
.why { font-size: 12px; color: var(--text-secondary); margin: 4px 0 0; }
svg.chart { width: 100%; height: auto; display: block; touch-action: pan-y; margin-top: 6px; }
.axis text { fill: var(--text-secondary); font-size: 11px; font-variant-numeric: tabular-nums; }
.axis line { stroke: var(--grid); }
.low { fill: none; stroke: var(--series-1); stroke-width: 2; stroke-linejoin: round; }
.mid { fill: none; stroke: var(--series-3); stroke-width: 2; stroke-linejoin: round; }
.pt-low { fill: var(--series-1); stroke: var(--surface-2); stroke-width: 2; }
.pt-mid { fill: var(--series-3); stroke: var(--surface-2); stroke-width: 2; }
.sale { fill: var(--series-2); fill-opacity: .55; stroke: none; }
.now { fill: none; stroke: var(--series-1); stroke-width: 2.5; }
.now-label { fill: var(--text-primary); font-size: 11px; font-weight: 700; paint-order: stroke; stroke: var(--surface-2); stroke-width: 3px; }
.ref.max { stroke-dasharray: 2 3; }
.ref { stroke: var(--text-secondary); stroke-width: 1.5; stroke-dasharray: 4 4; }
.ref-label { fill: var(--text-secondary); font-size: 11px; paint-order: stroke; stroke: var(--surface-2); stroke-width: 3px; }
.cross { stroke: var(--text-primary); stroke-width: 1; } .sel { stroke: var(--text-primary); stroke-width: 2; fill: var(--surface-2); }
.readout { font-size: 13px; padding: 8px 2px 4px; font-variant-numeric: tabular-nums; min-height: 3.2em; }
.readout b { font-size: 15px; } .readout .muted { color: var(--text-secondary); }
.readout a { color: var(--series-1); }
details { font-size: 12px; color: var(--text-secondary); padding-bottom: 4px; }
.tablewrap { overflow-x: auto; } table { border-collapse: collapse; width: 100%; font-variant-numeric: tabular-nums; }
td, th { text-align: left; padding: 3px 10px 3px 0; white-space: nowrap; }
.empty { color: var(--text-secondary); }
@media (prefers-reduced-motion: no-preference) { .cross, .sel { transition: transform .08s; } }
"""

SCRIPT = r"""
const DATA = JSON.parse(document.getElementById('price-data').textContent);
const W = 340, H = 180, L = 52, R = 10, T = 10, B = 26;
const money = v => v == null ? '—' : (v >= 100 || v === 0 ? '$' + Math.round(v).toLocaleString() : '$' + v.toFixed(2));
const WINDOW = 60 * 864e5;
const day = s => new Date(s + 'T12:00:00');
const NS = 'http://www.w3.org/2000/svg';
const el = (tag, attrs, parent) => { const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
function ticks(lo, hi) { const raw = (hi - lo) / 4 || 1, p = Math.pow(10, Math.floor(Math.log10(raw)));
  const step = [1, 2, 2.5, 5, 10].map(m => m * p).find(s => s >= raw); const out = [];
  for (let v = Math.floor(lo / step) * step; v <= hi + step / 2; v += step) out.push(v); return out; }
function node(tag, cls, text) { const e = document.createElement(tag); if (cls) e.className = cls;
  if (text != null) e.textContent = text; return e; }

function chart(item, readout) {
  const s = item.series;
  // The last 60 days: asks are what you could buy now, so older sales would only squeeze them to one edge.
  const end = Math.max(...s.map(p => +day(p.date)).concat(item.sales.map(p => +day(p.date))));
  const sales = item.sales.filter(p => end - day(p.date) <= WINDOW);
  const svg = el('svg', {class: 'chart', viewBox: `0 0 ${W} ${H}`, role: 'img', tabindex: '0',
    'aria-label': `${item.label}: lowest and median asking price per check, sales as dots`});
  // Scale to the 5th-95th percentile of sales so a few absurd prices do not flatten the rest; extremes pin to the edge.
  const sp = sales.map(p => p.price).sort((a, b) => a - b), q = f => sp[Math.min(sp.length - 1, Math.floor(f * sp.length))];
  const all = s.flatMap(p => [p.low, p.median]).concat(sp.length >= 20 ? [q(0.05), q(0.95)] : sp);
  if (item.typical != null) all.push(item.typical); if (item.max != null) all.push(item.max);
  const dates = s.map(p => day(p.date)).concat(sales.map(p => day(p.date)));
  let d0 = Math.min(...dates), d1 = Math.max(...dates); if (d0 === d1) { d0 -= 3 * 864e5; d1 += 3 * 864e5; }
  d0 = Math.max(d0, end - WINDOW);
  let lo = Math.min(...all), hi = Math.max(...all); if (hi - lo < hi * 0.04) { lo *= 0.95; hi *= 1.05; }
  const tk = ticks(Math.max(0, lo), hi), y0 = tk[0], y1 = tk[tk.length - 1];
  const X = d => L + (d - d0) / (d1 - d0) * (W - L - R), Y = v => T + (y1 - Math.min(Math.max(v, y0), y1)) / (y1 - y0) * (H - T - B);
  const ax = el('g', {class: 'axis'}, svg);
  tk.forEach(t => { el('line', {x1: L, x2: W - R, y1: Y(t), y2: Y(t)}, ax);
    el('text', {x: L - 6, y: Y(t) + 4, 'text-anchor': 'end'}, ax).textContent = money(t); });
  [0, 0.5, 1].forEach((f, i) => { const d = new Date(d0 + (d1 - d0) * f);
    el('text', {x: X(+d), y: H - 8, 'text-anchor': ['start', 'middle', 'end'][i]}, ax).textContent =
      d.toLocaleDateString(undefined, {month: 'short', day: 'numeric'}); });
  // Reference lines carry short labels at the left edge; when two sit close, one label moves below its line.
  const refs = [[item.typical, 'typical', 'ref'], [item.max, 'your max', 'ref max']].filter(r => r[0] != null);
  refs.forEach(([v, text, cls], i) => { el('line', {class: cls, x1: L, x2: W - R, y1: Y(v), y2: Y(v)}, svg);
    const close = i === 1 && Math.abs(Y(v) - Y(refs[0][0])) < 14, below = close && Y(v) > Y(refs[0][0]);
    el('text', {class: 'ref-label', x: L + 4, y: Y(v) + (below ? 12 : -4)}, svg).textContent = text; });
  const path = key => s.map((p, i) => (i ? 'L' : 'M') + X(+day(p.date)).toFixed(1) + ' ' + Y(p[key]).toFixed(1)).join(' ');
  if (s.length > 1) { el('path', {class: 'mid', d: path('median')}, svg); el('path', {class: 'low', d: path('low')}, svg); }
  sales.forEach(p => el('circle', {class: 'sale', cx: X(+day(p.date)), cy: Y(p.price), r: 3}, svg));
  s.forEach(p => { el('circle', {class: 'pt-mid', cx: X(+day(p.date)), cy: Y(p.median), r: 3}, svg);
    el('circle', {class: 'pt-low', cx: X(+day(p.date)), cy: Y(p.low), r: 4}, svg); });
  if (s.length) { const p = s[s.length - 1], x = X(+day(p.date)), y = Y(p.low);
    el('circle', {class: 'now', cx: x, cy: y, r: 7}, svg);
    el('text', {class: 'now-label', x: x - 11, y: y < T + 16 ? y + 16 : y - 10, 'text-anchor': 'end'}, svg).textContent = 'now ' + money(p.low); }
  const cross = el('line', {class: 'cross', y1: T, y2: H - B, visibility: 'hidden'}, svg);
  const sel = el('circle', {class: 'sel', r: 6, visibility: 'hidden'}, svg);
  let at = s.length - 1;
  function show(i, quiet) {
    if (!s.length) return; at = Math.max(0, Math.min(s.length - 1, i)); const p = s[at], x = X(+day(p.date));
    cross.setAttribute('x1', x); cross.setAttribute('x2', x); cross.setAttribute('visibility', quiet ? 'hidden' : 'visible');
    sel.setAttribute('cx', x); sel.setAttribute('cy', Y(p.low)); sel.setAttribute('visibility', quiet ? 'hidden' : 'visible');
    readout.replaceChildren();
    const c = p.cheapest, line1 = node('div');
    line1.append(node('b', null, money(p.low)), ' lowest ask · ', node('span', 'muted',
      `${p.date} · median ${money(p.median)} of ${p.n} listing${p.n === 1 ? '' : 's'}`));
    const line2 = node('div', 'muted', `${c.source} · ${c.condition} · ${c.channel} · `);
    if (c.url && /^https:\/\//.test(c.url)) { const a = node('a', null, 'open listing'); a.href = c.url;
      a.target = '_blank'; a.rel = 'noopener'; line2.append(a); } else line2.append(c.key);
    const near = sales.filter(q => Math.abs(day(q.date) - day(p.date)) <= 7 * 864e5);
    readout.append(line1, line2);
    if (near.length) readout.append(node('div', 'muted', `Sold within a week: ${near.map(q => money(q.price)).join(', ')}`));
  }
  function nearest(evt) { const r = svg.getBoundingClientRect(), x = (evt.clientX - r.left) / r.width * W;
    let best = 0; s.forEach((p, i) => { if (Math.abs(X(+day(p.date)) - x) < Math.abs(X(+day(s[best].date)) - x)) best = i; });
    return best; }
  svg.addEventListener('pointerdown', e => show(nearest(e)));
  svg.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || e.buttons) show(nearest(e)); });
  svg.addEventListener('keydown', e => { if (e.key === 'ArrowLeft') { show(at - 1); e.preventDefault(); }
    if (e.key === 'ArrowRight') { show(at + 1); e.preventDefault(); } });
  if (s.length) show(s.length - 1, true);
  else readout.append(node('span', 'muted', 'No credible asking prices yet; sales only.'));
  return svg;
}

function card(item) {
  const alert = item.grade && item.grade.grade === 'alert';
  const c = node('article', 'card' + (alert ? ' alert' : '')); c.dataset.alertable = item.alertable;
  const head = node('div', 'head'), chips = node('div', 'chips');
  head.append(node('span', 'name', item.label), chips);
  if (alert) chips.append(node('span', 'chip alert', 'Alert ' + money(item.grade.price)));
  chips.append(node('span', 'chip', item.alertable ? 'can alert' : 'watch only'));
  if (item.track === 'availability') chips.append(node('span', 'chip', 'scarce'));
  const last = item.series[item.series.length - 1], stats = node('div', 'stats');
  const stat = (v, t) => { const d = node('div', 'stat'); d.append(node('b', null, v), node('span', null, t)); stats.append(d); };
  stat(last ? money(last.low) : '—', last ? 'lowest ask now' : 'no asks');
  stat(money(item.typical), 'typical sold');
  stat(money(item.max), item.max == null ? 'no max set' : last && last.low > item.max ? `max · ${money(last.low - item.max)} over` : 'your max');
  c.append(head, stats);
  if (item.grade && !alert && item.grade.why.length)
    c.append(node('p', 'why', 'Not an alert: ' + item.grade.why.join('; ')));
  const readout = node('div', 'readout'); readout.setAttribute('aria-live', 'polite');
  c.append(chart(item, readout), readout);
  const det = node('details'), sum = node('summary', null, 'Table'), wrap = node('div', 'tablewrap'), t = node('table');
  const hr = node('tr'); ['Date', 'Lowest ask', 'Median ask', 'Listings', 'Cheapest'].forEach(h => hr.append(node('th', null, h)));
  t.append(hr);
  item.series.slice().reverse().slice(0, 30).forEach(p => { const tr = node('tr');
    [p.date, money(p.low), money(p.median), String(p.n), `${p.cheapest.source} (${p.cheapest.condition})`]
      .forEach(v => tr.append(node('td', null, v))); t.append(tr); });
  wrap.append(t); det.append(sum, wrap); c.append(det);
  return c;
}

const state = {list: 'all', alertable: false};
try { const saved = JSON.parse(localStorage.getItem('price-page') || '{}'); Object.assign(state, saved); } catch (e) {}
function render() {
  const cards = document.getElementById('cards'); cards.replaceChildren(); let shown = 0;
  DATA.watchlists.forEach(w => { if (state.list !== 'all' && state.list !== w.id) return;
    const items = w.items.filter(i => !state.alertable || i.alertable); if (!items.length) return;
    cards.append(node('h2', 'group', w.label)); items.forEach(i => { cards.append(card(i)); shown++; }); });
  if (!shown) cards.append(node('p', 'empty', 'Nothing matches these filters.'));
  document.querySelectorAll('[data-list]').forEach(b => b.setAttribute('aria-pressed', b.dataset.list === state.list));
  document.getElementById('alertable').setAttribute('aria-pressed', state.alertable);
  try { localStorage.setItem('price-page', JSON.stringify(state)); } catch (e) {}
}
const filters = document.getElementById('filters');
[{id: 'all', label: 'All'}].concat(DATA.watchlists.map(w => ({id: w.id, label: w.label}))).forEach(f => {
  const b = node('button', null, f.label); b.type = 'button'; b.dataset.list = f.id;
  b.addEventListener('click', () => { state.list = f.id; render(); }); filters.append(b); });
const a = node('button', null, 'Alertable only'); a.type = 'button'; a.id = 'alertable';
a.addEventListener('click', () => { state.alertable = !state.alertable; render(); }); filters.append(a);
render();
"""


def render_page(config, watchlists, as_of, document=False):
    title = "Price Watch"
    data = json.dumps({"watchlists": watchlists}, ensure_ascii=False).replace("</", "<\\/")
    legend = ('<div class="legend">'
              '<span><svg width="18" height="8"><line x1="0" y1="4" x2="18" y2="4" stroke="var(--series-1)" stroke-width="2"/></svg>Lowest ask</span>'
              '<span><svg width="18" height="8"><line x1="0" y1="4" x2="18" y2="4" stroke="var(--series-3)" stroke-width="2"/></svg>Median ask</span>'
              '<span><svg width="10" height="10"><circle cx="5" cy="5" r="4" fill="var(--series-2)"/></svg>Verified sale</span>'
              '<span><svg width="18" height="8"><line x1="0" y1="4" x2="18" y2="4" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="4 4"/></svg>Typical sold (90 days)</span>'
              '<span><svg width="18" height="8"><line x1="0" y1="4" x2="18" y2="4" stroke="var(--text-secondary)" stroke-width="1.5" stroke-dasharray="2 3"/></svg>Your max</span>'
              '</div>')
    desk = (f' · <a href="{html.escape(config["page"])}">Deal Desk</a>' if config.get("page") else "")
    body = (f'<title>{title}</title><style>{STYLE}</style><main class="wrap"><header><h1>{title}</h1>'
            f'<p class="sub">Updated {html.escape(as_of)}. Tap or drag a chart to read a check; asking prices are not sales.{desk}</p>'
            f'</header><div class="filters" id="filters" role="toolbar" aria-label="Filters"></div>{legend}'
            f'<div class="cards" id="cards"></div></main>'
            f'<script type="application/json" id="price-data">{data}</script><script>{SCRIPT}</script>\n')
    if not document:
        return body
    return ('<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" '
            'content="width=device-width, initial-scale=1, viewport-fit=cover"></head><body>' + body + "</body></html>\n")

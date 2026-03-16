# Dogfood Fixes — 2026-03-16

Fixes for issues found during pre-CTO review dogfood session. Ordered by severity.

---

## Fix 1: Dead artifact/dashboard links (Issues #1, #4)

**Problem:** "View in Dashboard" links in DiscoverInsights component return "this site can't be reached" for hospital, retail, and likely all verticals.

**Root cause:** `discover_insights.json` contains `dashboard_link` URLs that point to non-existent hosts. The `artifact_links.json` files exist but have no `links` array entries.

**Fix:** Replace dead URLs with either:
- (a) Links to actual hosted demo dashboards (if they exist in the DAK)
- (b) Placeholder that shows a screenshot/preview of what the dashboard looks like instead of linking offsite
- (c) Remove the "View in Dashboard" link entirely until real dashboards exist

**Recommendation:** Option (b) — show a screenshot modal instead of linking out. The `screenshot_manifest.json` already exists per vertical with dashboard screenshot URLs. Wire DiscoverInsights to show these as preview images instead of dead links.

**Scope:** Modify `src/components/golden-flows/DiscoverInsights.tsx`

---

## Fix 2: Fintech cascade buttons not clickable (Issue #5)

**Problem:** The "Questions Executives Are Asking" buttons in fintech don't respond to clicks. They work in all other verticals.

**Root cause:** The slug in `site.config.yaml` is `fintech-gf` but the data directory is `public/golden-flows/fintech/`. The data loader uses the slug directly as the directory name. `tryPublicJson("fintech-gf", ...)` looks for `public/golden-flows/fintech-gf/` which doesn't exist. The data falls back to fixtures, but the cascade section requires public data to render the interactive version.

Similarly `real-estate` slug maps to `real_estate` directory — same mismatch, but real-estate happens to have fixture fallbacks that work.

**Fix:** Rename the data directory to match the slug:
```
mv public/golden-flows/fintech public/golden-flows/fintech-gf
```
Or add a slug-to-directory mapping in `golden-flows.ts`. Renaming is simpler and consistent.

**Scope:** File rename only. Verify all 5 verticals resolve correctly after rename.

---

## Fix 3: Feedback threads show internal content (Issue #3)

**Problem:** Feedback thread summaries expose internal pipeline details: "Evaluation: PR #27 Static Data Loader", "Staff SWE Review: PR-342", etc. These are real pipeline evaluation records, not client-facing demo content.

**Root cause:** The platform's `feedback_threads` exporter pulls all feedback items from the DB, including internal pipeline evaluations. No filtering by audience.

**Fix options:**
- (a) **Filter in the exporter** — add a `source` or `category` filter to exclude `pipeline` and `staff_review` feedback
- (b) **Filter in the website** — governance.ts or FeedbackThreadList filters out items where `source === "pipeline"` or summary starts with "# Evaluation:" / "# Staff SWE Review:"
- (c) **Seed demo-appropriate feedback** — create client-facing demo feedback items in the platform DB alongside the internal ones

**Recommendation:** Option (b) short-term (filter in website), option (a) long-term (filter in exporter). For the CTO demo, a quick client-side filter gets us there fastest.

**Scope:** Modify `src/components/golden-flows/FeedbackThreadList.tsx` to filter items, or modify `src/lib/governance.ts` `loadGovernance()` to skip internal feedback.

---

## Fix 4: Selector card height inconsistency (Issue #2)

**Problem:** Real Estate card is slightly taller than others at maximized desktop widths.

**Root cause:** `line-clamp-1` and `line-clamp-2` are already applied to the text, but the card container has no fixed height. If the reviewer name / trust_cue text varies in length across verticals, cards render at slightly different heights.

**Fix:** Add `min-h-[X]` to the card's outer `<a>` element in VerticalSelectorCard.tsx, or use a CSS grid with `grid-rows-subgrid` on the parent VerticalSelector to equalize heights.

**Scope:** Modify `src/components/golden-flows/VerticalSelectorCard.tsx` or `VerticalSelector.tsx`

---

## Fix 5: No reporting surfaces visible (Issue #6) — REVISED

**Problem:** The demo shows governance metadata (trust badges, approval chains, review context) but no actual deliverables. Per `golden_flows.md` in bayesiq, the golden flow is a governed delivery loop that culminates in **actual reports, dashboards, and GDocs**. The website stops at the governance layer and never shows what the client receives.

**Root cause:** The deliverables **already exist** in the DAK but aren't surfaced on the website. For each vertical, the DAK has:
- `outputs/month_{1,2,3}/audit_report.md` — full data reliability audit
- `outputs/month_{1,2,3}/board_report.md` — executive board report with score, risks, actions
- `outputs/month_{1,2,3}/board_report.json` — structured version
- `outputs/month_{1,2,3}/quality_checks.json` — detailed quality check results
- `outputs/month_{1,2,3}/dataset_profile.json` — dataset profile
- `outputs/month_{1,2,3}/discover_insights.json` — supplementary insights
- `narrative.md` — full 3-month remediation story (Month 1: Discovery → Month 2: Remediation → Month 3: Steady State)

These are exactly the "final outputs" from the golden flows vision (section 5). The website should show the **remediation arc** — how the score improves across months as issues get fixed — not just a static governance snapshot.

**Fix:** Surface the DAK output artifacts on the vertical page:

1. **Remediation Timeline component** — show the 3-month arc (Month 1 → 2 → 3) with score progression, key actions taken, and outcomes. This tells the story: "here's what happened when BayesIQ audited this data." The score trajectory component already shows the numbers; this adds the narrative and actions.

2. **Report Preview component** — render `board_report.md` inline (or as an expandable section) showing what the executive actually receives: score, key metrics table (reported vs audited vs delta), top risks, recommended actions. This is the proof that BayesIQ delivers real deliverables.

3. **Ingest DAK output artifacts** — create an ingestion script (like `ingest-contract-b.sh`) that copies `outputs/month_3/board_report.json` and `narrative.md` from each vertical into `public/golden-flows/{vertical}/`. The data loader serves them to the components.

**This reframes the demo story from:**
"Here's governance metadata about an audit" (current)

**To:**
"Here's what BayesIQ found, here's how the score improved over 3 months of remediation, here's the board report the executive received, and here's the governed feedback loop that made it happen" (vision)

**Scope:**
- New: ingestion script for DAK output artifacts
- New: `src/components/golden-flows/ReportPreview.tsx` (renders board report)
- Modify: `src/app/golden-flows/[vertical]/page.tsx` (wire in)
- Data: copy from `bayesiq-data-audit-kit/demo/golden_flows/{vertical}/outputs/`

---

## Priority Order for CTO Demo

1. **Fix 2** (fintech buttons) — quick rename, unblocks a whole vertical
2. **Fix 3** (internal feedback) — quick filter, removes embarrassing content
3. **Fix 1** (dead links) — screenshot preview instead of broken links
4. **Fix 5** (reporting surfaces) — artifact gallery, biggest impact for the demo story
5. **Fix 4** (card height) — cosmetic, lowest priority

# PR#38 — Report Surfaces and Remediation Arc

Last Updated: 2026-03-16

PR Type:
- [x] Website (biq_website)

---

## Goal

Surface the actual deliverables that BayesIQ produces: audit reports, board reports, and the 3-month remediation narrative. Transform the demo from "here's governance metadata about an audit" to "here's what BayesIQ found, how the score improved, and what the executive received."

This is the most important fix from the dogfood session. Per `golden_flows.md` in bayesiq, the golden flow is a governed delivery loop culminating in actual reports, dashboards, and GDocs. The website currently stops at the governance layer.

---

## Source Data (already exists in DAK)

For each vertical in `bayesiq-data-audit-kit/demo/golden_flows/{vertical}/`:

**Per-month outputs** (`outputs/month_{1,2,3}/`):
- `audit_report.md` — full data reliability audit with scores, issues, remediation plan
- `board_report.md` — executive board report: score, key metrics (reported vs audited vs delta), top risks, recommended actions
- `board_report.json` — structured version with typed fields
- `quality_checks.json` — detailed quality check results
- `dataset_profile.json` — dataset statistics

**Vertical-level:**
- `narrative.md` — 3-month remediation story (Month 1: Discovery → Month 2: Remediation → Month 3: Steady State)

**Key data from `board_report.json`:**
```json
{
  "score": 81,
  "score_label": "Good",
  "findings": [
    {
      "severity": "HIGH",
      "title": "Near-duplicate rows detected (54 rows)",
      "impact": "Duplicate records inflate aggregations..."
    }
  ],
  "metrics": [
    {
      "metric": "fee_revenue",
      "period": "2025-12",
      "reported": 299461.01,
      "audited": 274382.64,
      "delta_pct": 8.4
    }
  ],
  "actions": [
    {
      "priority": 1,
      "action": "Investigate duplicate records...",
      "owner": "Data Engineering",
      "effort": "M"
    }
  ]
}
```

---

## Implementation

### 1. Ingest DAK Output Artifacts

Create `scripts/ingest-dak-reports.sh`:
- For each vertical, copy `outputs/month_3/board_report.json` to `public/golden-flows/{slug}/board_report.json`
- Copy `narrative.md` to `public/golden-flows/{slug}/narrative.md`
- Optionally copy all 3 months for the remediation arc

Source: `$DAK_PATH/demo/golden_flows/{vertical}/`
Target: `public/golden-flows/{slug}/`

### 2. Data Loader

Add to `src/lib/golden-flows.ts`:
```typescript
export function getBoardReport(slug: string): BoardReport | null
export function getNarrativeMarkdown(slug: string): string | null
```

Type `BoardReport` derived from `board_report.json` structure (score, findings, metrics, actions).

### 3. ReportPreview Component

`src/components/golden-flows/ReportPreview.tsx`

Shows the board report inline on the vertical page:
- **Score badge**: large score number with severity color
- **Key Metrics table**: metric | period | reported | audited | delta — highlighting discrepancies
- **Top Findings**: severity-tagged finding cards (HIGH/MEDIUM/LOW)
- **Recommended Actions**: priority-ordered action items with owner and effort
- **Approval line**: "Reviewed by: ___" / "Approved for board distribution: ___" from the report

Styling matches existing bayesiq-* palette. Card-based layout consistent with CascadeCard patterns.

### 4. RemediationArc Component

`src/components/golden-flows/RemediationArc.tsx`

Shows the 3-month story from `narrative.md`:
- Month 1 (Discovery), Month 2 (Remediation), Month 3 (Steady State)
- Score progression with visual indicators (30 → 64 → 81 for fintech)
- Key actions taken per month
- Rendered from markdown or extracted sections

This tells the story: "BayesIQ didn't just find problems — the score improved from 30 to 81 over 3 months of governed remediation."

### 5. Wire into Vertical Page

Insert ReportPreview prominently — after the score trajectory, before the cascade drill-down. This puts the deliverable front and center: "Here's what the board report looks like."

Insert RemediationArc after ReportPreview or as a tab/toggle alongside the score trajectory.

---

## Test Plan

1. Fintech board report renders with score, metrics table, findings, actions
2. Hospital board report renders with different data
3. Remediation arc shows 3-month progression
4. Missing report data (no board_report.json) → section not rendered
5. `npm run build` passes
6. Existing e2e tests pass

---

## Exit Criteria

- [ ] Board report preview visible on each vertical page showing score, metrics, findings, actions
- [ ] Remediation arc shows the 3-month score improvement story
- [ ] Demo tells the full golden flows story: discovery → remediation → steady state → governed delivery
- [ ] Data ingested from DAK output artifacts
- [ ] Graceful fallback when report data missing
- [ ] All existing tests pass
- [ ] `npm run build` passes

---

## Why This Matters for CTO Demo

The current demo answers: "BayesIQ has a governance system."
After this PR, the demo answers: "BayesIQ audited real data, found real problems, improved the score from 30 to 81 over 3 months, and delivered a board-ready report. Here's the report. Here's the feedback loop. Here's the governance chain."

That's the difference between a feature demo and a product demo.

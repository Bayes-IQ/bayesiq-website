# Contract B Summary — data-audit-kit → biq_website

**For:** DAK team review before schema freeze (GF-1.5)
**Schemas:** `biq_website/schemas/golden-flows/contract-b/`

## Overview

The website consumes 8 payload types from the data-audit-kit at build time. All payloads are static JSON files placed in `public/golden-flows/` for production or `fixtures/golden-flows/` for development. No runtime API calls.

## Payloads

### executive_questions

**What it drives:** 5 question buttons per vertical (1 flagship + 4 secondary). Each button opens a cascade drill-down.

| Field | Why this shape | Rendering constraint |
|-------|---------------|---------------------|
| `question_id` | Lookup key into cascade_data | Must be stable across snapshots |
| `priority` | flagship/secondary | Flagship gets 2x visual weight |
| `question_text` | Button label | Must fit in ~80 chars on mobile |
| `answer_summary` | Collapsed cascade preview | Shown before user clicks; must be self-contained |
| `severity` | Color coding | Maps to design system severity palette |

### cascade_data

**What it drives:** The full correction timeline for each question. This is a **map keyed by question_id**, not an array. The website looks up cascades by question_id from executive_questions.

| Field | Why this shape | Rendering constraint |
|-------|---------------|---------------------|
| `cascades` (map) | O(1) lookup by question_id | Keys must match executive_questions.question_id exactly |
| `reported_value` / `audited_value` / `delta` | Side-by-side comparison | All three shown together; delta must be human-readable |
| `root_cause` / `consequence` | Persuasion copy | Shown in collapsed cascade; must be concise |
| `reviewer_badge` | Trust signal | Inline in collapsed view; name + status |
| `timeline_steps[]` | Expandable timeline (up to 6 steps) | Steps with missing artifacts omit gracefully; `presentation` step is optional |

**Key constraint for DAK:** The `timeline_steps` array has a fixed vocabulary of step types: `finding`, `correction`, `dashboard`, `report`, `presentation`, `governance`. The `presentation` step may be absent. Each step's `artifact_id` must reference a real entry in screenshot_manifest or artifact_links.

### trajectory

**What it drives:** 3-point score trajectory inline with the landing state (Month 1 → Month 3).

| Field | Why this shape | Rendering constraint |
|-------|---------------|---------------------|
| `month` | X-axis position | Integer, sequential |
| `as_of_date` | Tooltip/label | Must match the snapshot date in DAK |
| `score` | Y-axis value (0–100) | Rendered as gauge + line |
| `finding_count` / `resolved_count` | Annotation | Shown on hover or as subtitle |

### hook_metrics

**What it drives:** Vertical selector cards. One card per vertical on the hub page.

| Field | Why this shape | Rendering constraint |
|-------|---------------|---------------------|
| `discrepancy_headline` | Card headline | Must communicate the problem in <5 seconds |
| `consequence` | Card subtext | Business impact, plain language |
| `trust_cue` | Card footer | Reviewer name + credential |
| `score` | Visual indicator | 0–100, maps to gauge |
| `severity_level` | Card border/accent color | `critical`/`warning`/`moderate`/`healthy` |

### vertical_narrative

**What it drives:** Status-quo vs BayesIQ comparison block and CTA copy.

| Field | Why this shape | Rendering constraint |
|-------|---------------|---------------------|
| `status_quo` / `with_bayesiq` | Side-by-side comparison | Per-vertical, not generic |
| `headline_finding` | Above-fold hero text | One sentence max |
| `cta_label` | Button text | Per-vertical CTA (e.g., "Book a Hospital Data Diagnostic") |
| `cta_variant` | CTA routing logic | `diagnostic`/`reliability_program`/`book_session` |

### screenshot_manifest / artifact_links

**What they drive:** Artifact preview thumbnails and links to deployed dashboards/GDocs in cascade timeline steps.

`artifact_id` values must be consistent between screenshot_manifest, artifact_links, and cascade_data timeline_steps.

### discover_insights

**What it drives:** 3–5 supplementary insight cards per vertical below the cascade area.

Each insight is question-framed and links to a dashboard view. `finding_ids` cross-references cascade_data findings.

## Identity Model

All IDs follow `{vertical}_{snapshot}_{entity_id}` where applicable. This convention is a proposal — if DAK has existing ID patterns, we'll negotiate during GF-1.5.

## Next Step

Review these schemas against DAK export feasibility. Flag any fields that are structurally difficult to produce or where the naming conflicts with DAK conventions. The freeze gate (GF-1.5) will resolve disagreements.

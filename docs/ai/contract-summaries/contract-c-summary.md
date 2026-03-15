# Contract C Summary — bayesiq platform → biq_website

**Status:** Frozen (2026-03-15) — all schemas reconciled with merged platform exports
**Freeze artifact:** [`CONTRACT_FREEZE_v1.md`](../CONTRACT_FREEZE_v1.md)
**Schemas:** `biq_website/schemas/golden-flows/contract-c/`

## Overview

The website consumes 7 governance payload types from the platform at build time. These power trust badges, feedback threads, governance detail panels, business-event previews, review context blocks, and cascade governance overlays. All payloads are static JSON files — no runtime API calls.

The website will normalize all Contract C payloads through a single `src/lib/governance.ts` module (built in GF-16). Components never import raw governance JSON directly.

## Common Conventions (all payloads)

- `schema_version`: integer const (1), not semver string
- `payload_type`: `contract_c.<name>` format
- `generated_at`: required UTC ISO 8601 timestamp
- `items[]` (or `badges[]` for trust_badges): array of typed items
- `reviewer`: inline object `{reviewer_id, display_name?, role?}`
- `record_origin`: enum `demo_seeded`/`demo_approved`/`live`
- `approval_status`: enum `pending`/`approved`/`rejected`/`deferred`
- JSON Schema 2020-12, `$defs` (not `definitions`)

## Payloads

### approval_status (aligned with platform PR #316)

**What it drives:** Trust micro-badges on selector cards, collapsed cascades, artifact previews.

| Field | Purpose |
|-------|---------|
| `object_type` | Distinguishes finding/feedback/approval |
| `object_id` | Join key to Contract B cascade_data |
| `approval_status` | Badge state |
| `record_origin` | Demo vs live segmentation |
| `reviewer` (inline) | Name + role per item |
| `timestamp` | Badge tooltip (UTC ISO 8601) |
| `review_note` | Expandable detail (nullable, max 500 chars) |

### feedback_threads (aligned with platform PR #317)

**What it drives:** Feedback item state with linked approval chains in governance detail panels.

**Breaking change from pre-reconciliation:** Replaced thread/comment model with platform's feedback-item model. No more `thread_id`, `comments[]`. Now: `feedback_id`, `summary`, `disposition`, `timeline`, `linked_approvals[]`.

| Field | Purpose |
|-------|---------|
| `feedback_id` | Unique feedback item identifier |
| `summary` | Feedback description |
| `category`, `priority` | Optional classification |
| `status` | Current status string |
| `disposition` | Lifecycle state: `pending`/`in_progress`/`resolved`/`rejected` |
| `resolution_note` | Optional resolution explanation |
| `source` | Origin of feedback |
| `timeline` | `{created_at, updated_at, resolved_at}` timestamps |
| `linked_approvals[]` | Approval chain with reviewer, status, timestamps, notes |

### business_events (aligned with platform PR #318)

**What it drives:** Business-event governance state panels.

**Breaking change from pre-reconciliation:** Replaced domain fields (`event_type`, `state`, `description`, `finding_id`) with governance fields. Domain data will be composed from Contract B in the normalization layer (GF-16).

| Field | Purpose |
|-------|---------|
| `event_id` | Business event identifier |
| `approval_status` | Governance state |
| `record_origin` | Demo vs live |
| `source_approval_id` | Platform-internal traceability |
| `reviewer` | Inline reviewer object |
| `ts_requested`, `ts_resolved` | Governance lifecycle timestamps |
| `review_note` | Optional reviewer note |

### trust_badges (aligned with platform PR #323)

**What it drives:** Pre-compiled badge data with summary statistics for selector cards, cascades, and previews.

**Breaking change from pre-reconciliation:** Replaced `finding_id`/`badge_type`/`reviewer_name`/`status`/`verified_at` with platform's generic `object_type`/`object_id` model, reviewer object, `approval_count`, and `last_reviewed_at`. Added `summary` block with totals and breakdowns. Badge-type derivation moves to normalization layer.

| Field | Purpose |
|-------|---------|
| `summary.total_objects` | Total badge count |
| `summary.by_status` | Breakdown by approval status |
| `summary.by_object_type` | Per-type totals and status breakdown |
| `badges[].object_type` | Generic object type (finding, feedback, etc.) |
| `badges[].object_id` | Object identifier |
| `badges[].approval_status` | Badge state |
| `badges[].record_origin` | Demo vs live |
| `badges[].reviewer` | Inline reviewer object |
| `badges[].last_reviewed_at` | Most recent review timestamp |
| `badges[].approval_count` | Number of approvals |

### published_docs (no platform export yet — website-proposed)

**What it drives:** Links to published GDocs/GDrive files in governance detail panels.

Follows Contract C conventions but no platform export exists yet. Will be reconciled when platform ships the export.

| Field | Purpose |
|-------|---------|
| `doc_id` | Document identifier |
| `finding_id` | Join key to Contract B |
| `url` | Clickable link (URI) |
| `title` | Document title |
| `type` | `gdoc`/`gdrive`/`dashboard` |

### review_context (aligned with platform PR #325) — NEW

**What it drives:** Typed review context blocks in governance detail panels. Shows structured evidence the reviewer saw when making approval decisions.

| Field | Purpose |
|-------|---------|
| `object_type` | Object being reviewed |
| `object_id` | Object identifier |
| `source_approval_id` | Links to approval record |
| `timestamp` | When review occurred |
| `review_context[]` | Array of typed blocks |
| `review_context[].type` | Block discriminator: `summary_stat`/`finding_list`/`assumption_list`/`candidate_list`/`warning`/`artifact_link_group` |

### cascade_governance (aligned with platform PR #329) — NEW

**What it drives:** Per-question governance overlay in the cascade viewer. Shows aggregate approval status across all findings, feedback, and events linked to a question. Uses conservative status aggregation (rejected > pending > deferred > approved).

| Field | Purpose |
|-------|---------|
| `question_id` | Join key to Contract B cascade_data question |
| `approval_status` | Conservative aggregate across linked objects |
| `record_origin` | Demo vs live |
| `reviewer` | Inline reviewer object |
| `review_note` | Optional reviewer note |
| `finding_ids` | Linked finding IDs |
| `feedback_ids` | Linked feedback IDs |
| `event_ids` | Linked business event IDs |
| `ts_requested`, `ts_resolved` | Governance lifecycle timestamps |

## Cross-Payload Coherence

The website's governance normalization layer (GF-16) will validate:
- Every `object_id` in approval_status maps to a real finding in Contract B cascade_data (for object_type=finding)
- Linked approval IDs in feedback_threads reference real approval_status items
- Review context `object_id` references match approval_status items
- Reviewer objects are structurally consistent across all payloads

If cross-references are broken, the normalization layer will surface the error — it will not silently infer or fill in missing data.

## Reconciliation Status

| Payload | Platform PR | Status |
|---------|-------------|--------|
| approval_status | #316 | Aligned |
| feedback_threads | #317 | Aligned |
| business_events | #318 | Aligned |
| trust_badges | #323 | Aligned |
| review_context | #325 | Aligned (new) |
| cascade_governance | #329 | Aligned (new) |
| published_docs | — | Website-proposed, awaiting platform export |

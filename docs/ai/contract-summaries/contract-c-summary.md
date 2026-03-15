# Contract C Summary — bayesiq platform → biq_website

**For:** Platform team review before schema freeze (GF-1.5)
**Schemas:** `biq_website/schemas/golden-flows/contract-c/`

## Overview

The website consumes 6 governance payload types from the platform at build time. These power trust badges, feedback threads, governance detail panels, and business-event previews. All payloads are static JSON files — no runtime API calls.

The website will normalize all Contract C payloads through a single `src/lib/governance.ts` module (built in GF-16). Components never import raw governance JSON directly.

## Payloads

### approval_status

**What it drives:** Trust micro-badges on selector cards, collapsed cascades, artifact previews.

| Field | Why this shape | Rendering constraint |
|-------|---------------|---------------------|
| `finding_id` | Join key to Contract B cascade_data | Must match exactly |
| `status` | Badge state | `pending`/`approved`/`rejected` — colorblind-safe rendering |
| `approved_at` | Badge tooltip | ISO 8601 datetime; absent if pending |
| `reviewer_id` | Join key to reviewer_attribution | Must match exactly |

**Semantic clarification needed:** Does `approved` mean "approved for publication/demo" or just "reviewed"? The website renders this as a trust signal — the meaning must be unambiguous. Please confirm during GF-1.5.

### reviewer_attribution

**What it drives:** Reviewer name + role display on badges, feedback threads, governance panels.

| Field | Why this shape | Rendering constraint |
|-------|---------------|---------------------|
| `reviewer_id` | Lookup key from approval_status, feedback_threads | Stable across payloads |
| `name` | Display text | Shown at arm's length on badges |
| `role` | Context | Shown in governance detail |
| `organization` | Optional context | Shown in governance detail if present |

### feedback_threads

**What it drives:** GDoc-style comment bubbles showing feedback conversations per finding.

| Field | Why this shape | Rendering constraint |
|-------|---------------|---------------------|
| `thread_id` | Unique thread identifier | One thread per finding |
| `finding_id` | Join key to Contract B | Must match cascade_data |
| `comments[]` | Conversation chain | Rendered as bubbles, not audit log |
| `comments[].type` | Visual styling | `comment` (neutral), `review` (highlighted), `resolution` (green/closed) |
| `comments[].timestamp` | Sort order + display | ISO 8601 |

### published_docs

**What it drives:** Links to published GDocs/GDrive files in governance detail panels.

| Field | Why this shape | Rendering constraint |
|-------|---------------|---------------------|
| `finding_id` | Join key | Associates doc with a finding |
| `url` | Clickable link | Must be stable and publicly accessible (or accessible to prospect) |
| `type` | Icon selection | `gdoc`/`gdrive`/`dashboard` |

### trust_badges

**What it drives:** Pre-compiled badge data for rendering. This is the "read-optimized" view — the website doesn't compute badges from raw approval data, it consumes them pre-built.

| Field | Why this shape | Rendering constraint |
|-------|---------------|---------------------|
| `badge_type` | Badge variant | `audit_verified`/`governance_approved`/`stakeholder_reviewed` |
| `reviewer_name` | Inline display | Shown directly on badge (no join needed) |
| `status` | Badge state | Same enum as approval_status |
| `verified_at` | Tooltip | Optional datetime |

### business_events

**What it drives:** Business-event preview panels showing what happens when a metric redefinition or restatement flows through the system.

| Field | Why this shape | Rendering constraint |
|-------|---------------|---------------------|
| `event_type` | Visual categorization | `metric_redefinition`/`restatement`/`correction` |
| `state` | Visual distinction | `preview` (dotted border) vs `approved` (solid border) |
| `description` | Content | Plain language explanation |

## Cross-Payload Coherence

The website's governance normalization layer (GF-16) will validate:
- Every `finding_id` in approval_status maps to a real finding in Contract B
- Every `reviewer_id` in approval_status maps to a reviewer in reviewer_attribution
- Feedback thread `finding_id` references match Contract B
- Reviewer attribution is consistent across approval records and feedback threads

If these cross-references are broken, the normalization layer will surface the error — it will not silently infer or fill in missing data.

## Next Step

Review these schemas against platform governance payload structure. Flag any fields where the naming or semantics differ from the platform's internal model. The freeze gate (GF-1.5) will resolve disagreements.

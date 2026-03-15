# PR#29 — Contract C Governance Data Ingestion

Last Updated: 2026-03-15

PR Type:
- [x] Website (biq_website)

---

## Roadmap Position

```
Phase 5.0–5.3 ✅ (Contract B ingestion, schemas, data loader, UI components)
Phase 5.0 — Contract C Ingestion ← THIS PR
Phase 5.4 — Feedback + Trust (depends on this)
Phase 5.5 — Business Events + Status Quo (depends on this)
```

Cross-references:
- ROADMAP: docs/ai/ROADMAP.md
- Contract B ingestion pattern: scripts/ingest-contract-b.sh
- Static data loader: src/lib/golden-flows.ts
- Contract C types: src/types/golden-flows/contract-c/

---

## Goal

Ingest Contract C governance payloads from the DAK platform exports into `public/golden-flows/governance/`, making all 7 payload types available to the static data loader. This unblocks Phases 5.4-5.5 (feedback/trust components, business event previews).

---

## Layers Affected

| Layer | What changes |
|-------|-------------|
| `scripts/` | New `ingest-contract-c.sh` script (mirrors Contract B pattern) |
| `public/golden-flows/governance/` | 7 JSON payload files ingested from DAK exports |
| `scripts/validate-schemas.mjs` | Extend to validate Contract C payloads against schemas |
| `src/lib/golden-flows.ts` | No changes needed — accessor functions already coded |

---

## Scope

### Files Added

| File | Purpose |
|------|---------|
| `scripts/ingest-contract-c.sh` | Ingestion script: reads DAK platform exports, transforms/explodes into per-payload JSON |
| `public/golden-flows/governance/approval_status.json` | Approval metadata for findings, feedback, events |
| `public/golden-flows/governance/feedback_threads.json` | Feedback items with linked approval chains |
| `public/golden-flows/governance/business_events.json` | Business event governance state |
| `public/golden-flows/governance/trust_badges.json` | Pre-compiled badge data with summary statistics |
| `public/golden-flows/governance/review_context.json` | Typed review context blocks |
| `public/golden-flows/governance/cascade_governance.json` | Per-question governance overlay |
| `public/golden-flows/governance/published_docs.json` | GDoc/GDrive governance document links |

### Files Modified

| File | What changes |
|------|-------------|
| `scripts/validate-schemas.mjs` | Add Contract C schema validation targets |

### Files NOT Touched

- `src/lib/golden-flows.ts` — accessor functions already exist
- `src/types/golden-flows/contract-c/*` — types already generated
- `schemas/golden-flows/contract-c/*` — schemas already defined

---

## Implementation Steps

### Step 1: Locate DAK Contract C Exports

Determine the source path for Contract C payloads in the DAK repo. Contract B used:
```
{DAK_PATH}/demo/golden_flows/{vertical}/website_payloads/{vertical}.json
```

Contract C governance exports may be in:
- `{DAK_PATH}/demo/golden_flows/{vertical}/governance_seed.json`
- `{DAK_PATH}/demo/golden_flows/{vertical}/feedback_seed.json`
- `{DAK_PATH}/demo/golden_flows/{vertical}/business_events/`
- Or a compiled governance payload similar to Contract B's compiled website_payloads

### Step 2: Create ingest-contract-c.sh

Mirror the Contract B ingestion pattern:
1. Accept `DAK_PATH` as argument (default: sibling repo)
2. For each vertical, read governance exports
3. Transform into 7 separate payload files matching Contract C schemas
4. Write to `public/golden-flows/governance/`
5. Validate output with `npm run validate:schemas`

Key differences from Contract B:
- Contract C payloads are **not per-vertical** — they're global governance overlays
- The `governance/` directory is flat (not per-vertical subdirs)
- Cross-references link to Contract B data via `object_id` fields

### Step 3: Validate Payloads

Extend `scripts/validate-schemas.mjs` to include Contract C targets:
```javascript
// Add Contract C validation entries
{ schema: 'contract-c/approval_status', data: 'governance/approval_status.json' },
{ schema: 'contract-c/feedback_threads', data: 'governance/feedback_threads.json' },
// ... etc for all 7 payloads
```

### Step 4: Verify Data Loader

Run a smoke test confirming `getApprovalStatus()`, `getTrustBadges()`, etc. return non-null after ingestion.

---

## Payload Conventions (Contract C)

All payloads follow these conventions:
- `schema_version`: 1 (integer)
- `payload_type`: `"contract_c.<name>"`
- `generated_at`: UTC ISO 8601
- `record_origin`: "demo_seeded" | "demo_approved" | "live"
- `approval_status`: "pending" | "approved" | "rejected" | "deferred"
- `reviewer`: inline `{reviewer_id, display_name?, role?}`

---

## Exit Criteria

- [ ] All 7 Contract C JSON files exist in `public/golden-flows/governance/`
- [ ] `npm run validate:schemas` passes for all Contract C payloads
- [ ] Static loader functions return non-null data
- [ ] Cross-references (object_id -> Contract B cascade_data) are valid
- [ ] `npm run build` succeeds with governance data in place

---

## Risks

| Risk | Mitigation |
|------|-----------|
| DAK exports may not match expected schema exactly | Validate against schemas before committing; transform in ingestion script |
| published_docs has no platform exporter yet | Seed with demo data; mark as `record_origin: "demo_seeded"` |
| Cross-payload coherence (object_id refs) | Defer full validation to GF-16 normalization layer; basic spot checks here |

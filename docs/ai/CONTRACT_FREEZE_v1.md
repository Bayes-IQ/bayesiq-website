# Contract B + C Schema Freeze — v1

**Date:** 2026-03-15
**Traceability:** bayesiq.db eval feedback_id a18b60ba

---

## Frozen Schemas

### Contract B (8 schemas)

| Schema | Description |
|--------|-------------|
| `executive_questions` | Top-level questions driving the executive scan flow |
| `discover_insights` | Insight cards surfaced in the discover panel |
| `cascade_data` | Full cascade timeline data per question |
| `trajectory` | Metric trajectory over time for before/after views |
| `screenshot_manifest` | Screenshot references for artifact diff cards |
| `artifact_links` | Links to downstream artifacts (dashboards, reports) |
| `hook_metrics` | Hero metrics powering the flagship question hook |
| `vertical_narrative` | Per-vertical narrative copy and positioning |

### Contract C (7 schemas)

| Schema | Platform PR | Description |
|--------|-------------|-------------|
| `approval_status` | #316 | Trust micro-badges on selector cards, collapsed cascades, artifact previews |
| `feedback_threads` | #317 | Feedback item state with linked approval chains |
| `business_events` | #318 | Business-event governance state panels |
| `trust_badges` | #323 | Pre-compiled badge data with summary statistics |
| `review_context` | #325 | Typed review context blocks in governance detail panels |
| `cascade_governance` | #329 | Per-question governance overlay in the cascade viewer |
| `published_docs` | — (website-proposed, awaiting platform export) | Links to published GDocs/GDrive files |

---

## Change Protocol

Any post-freeze schema **shape** change requires:

1. Version bump (v1 → v2, etc.)
2. Cross-repo review involving all consumers and producers of the affected schema

---

## Scope

- **Frozen:** Schema shape (field names, types, required/optional, nesting structure)
- **NOT frozen:** Demo fixture data — fixture content may change freely without a version bump

---

## References

- Schema files: `schemas/golden-flows/contract-b/`, `schemas/golden-flows/contract-c/`
- Contract C summary: `docs/ai/contract-summaries/contract-c-summary.md`
- Roadmap: `docs/ai/ROADMAP.md` (GF-1.5 section)

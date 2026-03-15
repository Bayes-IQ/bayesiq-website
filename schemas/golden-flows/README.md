# Golden Flows — JSON Schema Conventions

## Versioning

Every schema root object includes:
- `schema_version` (integer const, required) — starts at `1`
- `payload_type` (const string, required) — discriminator using `contract_c.<name>` or `<name>` format
- `generated_at` (string, date-time, required) — UTC ISO 8601 export timestamp

Post-freeze changes require version bump + cross-repo review per `CONTRACT_FREEZE_v1.md`.

## JSON Schema Dialect

- **Contract B** schemas use **draft-07** (`http://json-schema.org/draft-07/schema#`)
- **Contract C** schemas use **2020-12** (`https://json-schema.org/draft/2020-12/schema`) with `$defs`

The validation script (`npm run validate:schemas`) handles both dialects automatically.

## Stable Identity Model

IDs follow `{vertical}_{snapshot}_{entity_id}` where applicable:
- `vertical`: `hospital`, `real_estate`, `saas`, `retail`, `fintech`
- `snapshot`: `month_1`, `month_2`, `month_3`
- `entity_id`: domain-specific (e.g., `QC_017`, `Q_001`, `INS_003`)

Example: `hospital_month_1_QC_017`

## Directory Layout

```
schemas/golden-flows/
├── contract-b/              # data-audit-kit → website payloads (8 schemas)
│   ├── executive_questions.schema.json
│   ├── discover_insights.schema.json
│   ├── cascade_data.schema.json
│   ├── trajectory.schema.json
│   ├── screenshot_manifest.schema.json
│   ├── artifact_links.schema.json
│   ├── hook_metrics.schema.json
│   └── vertical_narrative.schema.json
├── contract-c/              # platform → website payloads (7 schemas)
│   ├── approval_status.schema.json
│   ├── feedback_threads.schema.json
│   ├── business_events.schema.json
│   ├── trust_badges.schema.json
│   ├── review_context.schema.json
│   ├── cascade_governance.schema.json
│   └── published_docs.schema.json
└── README.md                # this file
```

## Type Generation

Run `npm run generate:types` to regenerate TypeScript types from schemas into `src/types/golden-flows/`.

## Validation

Run `npm run validate:schemas` to validate all schema files with ajv.

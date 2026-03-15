# Golden Flows — JSON Schema Conventions

## Versioning

Every schema root object includes:
- `schema_version` (string, required) — semver, starts at `"1.0.0"`
- `payload_type` (const string, required) — discriminator matching the schema name (e.g., `"executive_questions"`)

Post-freeze changes require version bump + cross-repo review per `CONTRACT_FREEZE_v1.md`.

## JSON Schema Draft

All schemas use **draft-07** (`http://json-schema.org/draft-07/schema#`) for maximum toolchain compatibility with `json-schema-to-typescript` and `ajv`.

## Stable Identity Model

IDs follow `{vertical}_{snapshot}_{entity_id}` where applicable:
- `vertical`: `hospital`, `real_estate`, `saas`, `retail`, `fintech`
- `snapshot`: `month_1`, `month_2`, `month_3`
- `entity_id`: domain-specific (e.g., `QC_017`, `Q_001`, `INS_003`)

Example: `hospital_month_1_QC_017`

## Directory Layout

```
schemas/golden-flows/
├── contract-b/          # data-audit-kit → website payloads
│   ├── executive_questions.schema.json
│   ├── discover_insights.schema.json
│   ├── cascade_data.schema.json
│   ├── trajectory.schema.json
│   ├── screenshot_manifest.schema.json
│   ├── artifact_links.schema.json
│   ├── hook_metrics.schema.json
│   └── vertical_narrative.schema.json
├── contract-c/          # platform → website payloads
│   ├── approval_status.schema.json
│   ├── reviewer_attribution.schema.json
│   ├── feedback_threads.schema.json
│   ├── published_docs.schema.json
│   ├── trust_badges.schema.json
│   └── business_events.schema.json
└── README.md            # this file
```

## Type Generation

Run `npm run generate:types` to regenerate TypeScript types from schemas into `src/types/golden-flows/`.

## Validation

Run `npm run validate:schemas` to validate all schema files with ajv.

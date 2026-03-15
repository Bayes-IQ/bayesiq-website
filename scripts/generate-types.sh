#!/usr/bin/env bash
# Generate TypeScript types from Golden Flows JSON schemas.
# Output: src/types/golden-flows/contract-b/*.ts, contract-c/*.ts, index.ts
set -euo pipefail

SCHEMA_DIR="schemas/golden-flows"
TYPES_DIR="src/types/golden-flows"

mkdir -p "$TYPES_DIR/contract-b" "$TYPES_DIR/contract-c"

# Generate one .ts file per schema
for contract in contract-b contract-c; do
  for schema in "$SCHEMA_DIR/$contract"/*.schema.json; do
    basename=$(basename "$schema" .schema.json)
    npx json2ts "$schema" > "$TYPES_DIR/$contract/$basename.ts"
  done
done

# Generate barrel exports
{
  echo "// Auto-generated — do not edit. Run: npm run generate:types"
  for f in "$TYPES_DIR/contract-b"/*.ts; do
    name=$(basename "$f" .ts)
    echo "export * from './contract-b/$name';"
  done
  for f in "$TYPES_DIR/contract-c"/*.ts; do
    name=$(basename "$f" .ts)
    echo "export * from './contract-c/$name';"
  done
} > "$TYPES_DIR/index.ts"

echo "Generated types in $TYPES_DIR"

#!/usr/bin/env node
// Validate all Golden Flows JSON schemas compile correctly with ajv.
import Ajv from "ajv";
import addFormats from "ajv-formats";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const ajv = new Ajv({ strict: true, allErrors: true });
addFormats(ajv);

const schemaDir = "schemas/golden-flows";
const contracts = ["contract-b", "contract-c"];
let errors = 0;

for (const contract of contracts) {
  const dir = join(schemaDir, contract);
  const files = readdirSync(dir).filter((f) => f.endsWith(".schema.json"));
  for (const file of files) {
    const path = join(dir, file);
    try {
      const schema = JSON.parse(readFileSync(path, "utf-8"));
      ajv.compile(schema);
      console.log(`  ✓ ${path}`);
    } catch (e) {
      console.error(`  ✗ ${path}: ${e.message}`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} schema(s) failed validation`);
  process.exit(1);
} else {
  console.log(`\n${contracts.length} contracts, all schemas valid`);
}

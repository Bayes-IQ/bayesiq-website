#!/usr/bin/env node
// Validate all Golden Flows JSON schemas compile correctly with ajv.
import Ajv from "ajv";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";

const ajvDraft07 = new Ajv({ strict: true, allErrors: true });
addFormats(ajvDraft07);

const ajv2020 = new Ajv2020({ strict: true, allErrors: true });
addFormats(ajv2020);

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
      const validator =
        schema.$schema === "https://json-schema.org/draft/2020-12/schema"
          ? ajv2020
          : ajvDraft07;
      validator.compile(schema);
      console.log(`  ✓ ${path}`);
    } catch (e) {
      console.error(`  ✗ ${path}: ${e.message}`);
      errors++;
    }
  }
}

if (errors > 0) {
  console.error(`\n${errors} schema(s) failed compilation`);
  process.exit(1);
} else {
  console.log(`\n${contracts.length} contracts, all schemas compile`);
}

// Phase 2: Validate data files against schemas (if they exist)
import { existsSync } from "fs";

const dataDir = "public/golden-flows";
const verticals = ["hospital", "real_estate", "saas", "retail", "fintech"];
const contractBSchemas = [
  "artifact_links",
  "cascade_data",
  "discover_insights",
  "executive_questions",
  "hook_metrics",
  "screenshot_manifest",
  "trajectory",
  "vertical_narrative",
];

if (existsSync(dataDir)) {
  console.log("\n--- Validating data files against schemas ---");
  let dataErrors = 0;
  let dataChecked = 0;

  // Build validators for contract-b schemas
  const validators = {};
  const ajvData = new Ajv({ strict: true, allErrors: true });
  addFormats(ajvData);

  for (const schemaName of contractBSchemas) {
    const schemaPath = join(schemaDir, "contract-b", `${schemaName}.schema.json`);
    const schema = JSON.parse(readFileSync(schemaPath, "utf-8"));
    validators[schemaName] = ajvData.compile(schema);
  }

  for (const vertical of verticals) {
    for (const schemaName of contractBSchemas) {
      const dataPath = join(dataDir, vertical, `${schemaName}.json`);
      if (!existsSync(dataPath)) continue;
      dataChecked++;
      const data = JSON.parse(readFileSync(dataPath, "utf-8"));
      const valid = validators[schemaName](data);
      if (valid) {
        console.log(`  ✓ ${dataPath}`);
      } else {
        console.error(`  ✗ ${dataPath}:`);
        for (const err of validators[schemaName].errors) {
          console.error(`    - ${err.instancePath}: ${err.message}`);
        }
        dataErrors++;
      }
    }
  }

  if (dataErrors > 0) {
    console.error(`\n${dataErrors}/${dataChecked} data file(s) failed validation`);
    process.exit(1);
  } else if (dataChecked > 0) {
    console.log(`\n${dataChecked} data files validated successfully`);
  } else {
    console.log("\nNo data files found to validate");
  }
}

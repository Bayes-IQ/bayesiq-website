import { test } from "@playwright/test";

// SKIPPED: Governance detail tests depend on golden flows routes (/golden-flows/[vertical])
// which moved to /consulting/explore in PR Rewrite-06.
// These tests will be re-enabled when the golden flows migration lands.
test.skip("Governance detail tests skipped pending golden flows migration", () => {});

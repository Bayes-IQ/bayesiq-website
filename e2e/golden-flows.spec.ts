import { test, expect } from "@playwright/test";

// These tests run against the dev server which defaults to
// NEXT_PUBLIC_GOLDEN_FLOWS_STATE=off. We test the off-state 404 behavior
// and the route structure (which renders regardless of state during build
// since generateStaticParams emits all verticals).

test.describe("Golden Flows routes", () => {
  test("/golden-flows returns 404 when state is off", async ({ page }) => {
    const response = await page.goto("/golden-flows");
    expect(response?.status()).toBe(404);
  });

  test("/golden-flows/hospital returns 404 when state is off", async ({
    page,
  }) => {
    const response = await page.goto("/golden-flows/hospital");
    expect(response?.status()).toBe(404);
  });

  test("/golden-flows/nonexistent returns 404", async ({ page }) => {
    const response = await page.goto("/golden-flows/nonexistent");
    expect(response?.status()).toBe(404);
  });
});

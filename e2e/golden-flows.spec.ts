import { test, expect } from "@playwright/test";

// Golden Flows rollout state defaults to "live". These tests verify the
// hub and vertical pages render successfully, and that nonexistent
// verticals still return 404.

test.describe("Golden Flows routes", () => {
  test("/golden-flows returns 200 when state is live", async ({ page }) => {
    const response = await page.goto("/golden-flows");
    expect(response?.status()).toBe(200);
  });

  test("/golden-flows/hospital returns 200 when state is live", async ({
    page,
  }) => {
    const response = await page.goto("/golden-flows/hospital");
    expect(response?.status()).toBe(200);
  });

  test("/golden-flows/nonexistent returns 404", async ({ page }) => {
    const response = await page.goto("/golden-flows/nonexistent");
    expect(response?.status()).toBe(404);
  });
});

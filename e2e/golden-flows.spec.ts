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

test.describe("Golden Flows tabs", () => {
  test("all three tabs are visible and clickable", async ({ page }) => {
    await page.goto("/golden-flows/hospital");
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(3);
    await expect(tabs.nth(0)).toHaveText("Dashboard");
    await expect(tabs.nth(1)).toHaveText("Board Report");
    await expect(tabs.nth(2)).toHaveText("Workflow");

    // Dashboard is selected by default
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");

    // Click Board Report tab
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "false");

    // Click Workflow tab
    await tabs.nth(2).click();
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  });

  test("tab selection persists via URL hash", async ({ page }) => {
    // Load directly with #workflow hash
    await page.goto("/golden-flows/hospital#workflow");
    const tabs = page.getByRole("tab");
    // useEffect reads hash after hydration — wait for it
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true", { timeout: 5000 });

    // Click Dashboard, then verify hash updated
    await tabs.nth(0).click();
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    expect(new URL(page.url()).hash).toBe("#dashboard");
  });

  test("tabs render on all verticals", async ({ page }) => {
    const verticals = ["hospital", "saas", "retail", "fintech-gf", "real-estate"];
    for (const v of verticals) {
      await page.goto(`/golden-flows/${v}`);
      const tabs = page.getByRole("tab");
      await expect(tabs).toHaveCount(3);
    }
  });

  test("hero shows vertical-specific content", async ({ page }) => {
    await page.goto("/golden-flows/hospital");
    // Hero should contain the reliability score label
    await expect(page.getByText("Reliability Score").first()).toBeVisible();
    // Hero should show the score movement (first → last)
    await expect(page.getByText("31 → 81")).toBeVisible();
  });

  test("reality reveal shows reported vs audited vs decision exposure", async ({ page }) => {
    await page.goto("/golden-flows/hospital");
    // Reality Reveal section headers (uppercase labels)
    await expect(page.getByText("Reported", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Audited", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Decision Exposure", { exact: true }).first()).toBeVisible();
  });
});

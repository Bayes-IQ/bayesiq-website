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
    // Hero should show a score number
    await expect(page.getByText("81").first()).toBeVisible();
  });

  test("reality reveal shows reported vs audited vs decision exposure", async ({ page }) => {
    await page.goto("/golden-flows/hospital");
    // Reality Reveal section headers (uppercase labels)
    await expect(page.getByText("Reported", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Audited", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Decision Exposure", { exact: true }).first()).toBeVisible();
  });
});

test.describe("Golden Flows Dashboard tab (PR#41)", () => {
  test("dashboard tab shows widget grid", async ({ page }) => {
    await page.goto("/golden-flows/hospital");
    // Dashboard is the default tab — widget grid should be visible
    const grid = page.getByTestId("dashboard-grid");
    await expect(grid).toBeVisible();
  });

  test("ScoreTrajectory is visible in dashboard tab", async ({ page }) => {
    await page.goto("/golden-flows/hospital");
    // The SVG chart should be visible in dashboard tab
    const chart = page.locator("svg[aria-label^='Score trajectory']");
    await expect(chart.first()).toBeVisible();
  });

  test("screenshot placeholder or image is present", async ({ page }) => {
    await page.goto("/golden-flows/hospital");
    const screenshot = page.getByTestId("dashboard-screenshot");
    await expect(screenshot).toBeVisible();
  });

  test("all 5 verticals render dashboard tab without errors", async ({ page }) => {
    const verticals = ["hospital", "saas", "retail", "fintech-gf", "real-estate"];
    for (const v of verticals) {
      const response = await page.goto(`/golden-flows/${v}`);
      expect(response?.status()).toBe(200);
      const dashboardPanel = page.getByRole("tabpanel");
      await expect(dashboardPanel).toBeVisible();
    }
  });
});

test.describe("Board Report document preview", () => {
  test("board report tab shows document-style preview", async ({ page }) => {
    await page.goto("/golden-flows/hospital");
    const tabs = page.getByRole("tab");
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    const doc = page.getByTestId("report-document");
    await expect(doc).toBeVisible();
  });

  test("narrative text is visible in the report", async ({ page }) => {
    await page.goto("/golden-flows/hospital");
    await page.getByRole("tab").nth(1).click();
    const narrative = page.getByTestId("report-narrative");
    await expect(narrative).toBeVisible();
    await expect(narrative).toContainText("BayesIQ");
  });

  test("score badge is visible in the document header", async ({ page }) => {
    await page.goto("/golden-flows/hospital");
    await page.getByRole("tab").nth(1).click();
    const badge = page.getByTestId("report-score-badge");
    await expect(badge).toBeVisible();
    await expect(badge).toContainText("81");
  });

  test("all 5 verticals render board report tab without errors", async ({ page }) => {
    const verticals = ["hospital", "saas", "retail", "fintech-gf", "real-estate"];
    for (const v of verticals) {
      await page.goto(`/golden-flows/${v}`);
      const tabs = page.getByRole("tab");
      await tabs.nth(1).click();
      await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
      const body = page.locator("body");
      await expect(body).not.toContainText("Application error");
    }
  });
});

test.describe("Golden Flows PR#43 — Dashboard grid + narrative sections", () => {
  test("dashboard tab shows 2x2 widget grid", async ({ page }) => {
    await page.goto("/golden-flows/hospital");
    const grid = page.getByTestId("dashboard-grid");
    await expect(grid).toBeVisible();
  });

  test("dashboard screenshot or placeholder is visible in grid", async ({ page }) => {
    await page.goto("/golden-flows/hospital");
    const screenshot = page.getByTestId("dashboard-screenshot");
    await expect(screenshot).toBeVisible();
  });

  test("board report shows executive summary narrative", async ({ page }) => {
    await page.goto("/golden-flows/hospital");
    await page.getByRole("tab").nth(1).click();
    const narrative = page.getByTestId("report-narrative");
    await expect(narrative).toBeVisible();
    await expect(narrative).toContainText("Mercy General");
  });

  test("remediation arc is visible with score badges", async ({ page }) => {
    await page.goto("/golden-flows/hospital");
    const arc = page.getByTestId("remediation-arc");
    await expect(arc).toBeVisible();
    await expect(arc).toContainText("Discovery");
    await expect(arc).toContainText("Steady State");
  });

  test("BayesIQ difference section is visible", async ({ page }) => {
    await page.goto("/golden-flows/hospital");
    const diff = page.getByTestId("bayesiq-difference");
    await expect(diff).toBeVisible();
    await expect(diff).toContainText("business meaning");
  });

  test("all 5 verticals render dashboard grid + narrative sections", async ({ page }) => {
    const verticals = ["hospital", "saas", "retail", "fintech-gf", "real-estate"];
    for (const v of verticals) {
      await page.goto(`/golden-flows/${v}`);
      await expect(page.getByTestId("dashboard-grid")).toBeVisible();
      await expect(page.getByTestId("remediation-arc")).toBeVisible();
      await expect(page.getByTestId("bayesiq-difference")).toBeVisible();
    }
  });
});

import { test, expect } from "@playwright/test";

// Golden Flows routes now live under /consulting/explore/[vertical].
// The hub at /consulting/explore redirects to /consulting/explore/fintech-gf.

test.describe("Explore routes", () => {
  test("/consulting/explore redirects to /consulting/explore/fintech-gf", async ({ page }) => {
    const response = await page.goto("/consulting/explore");
    expect(response?.status()).toBe(200);
    expect(page.url()).toContain("/consulting/explore/fintech-gf");
  });

  test("/consulting/explore/hospital returns 200 when state is live", async ({
    page,
  }) => {
    const response = await page.goto("/consulting/explore/hospital");
    expect(response?.status()).toBe(200);
  });

  test("/consulting/explore/nonexistent returns 404", async ({ page }) => {
    const response = await page.goto("/consulting/explore/nonexistent");
    expect(response?.status()).toBe(404);
  });
});

test.describe("Explore tabs", () => {
  test("all three tabs are visible and clickable", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    const tabs = page.getByRole("tab");
    await expect(tabs).toHaveCount(3);
    await expect(tabs.nth(0)).toHaveText("Board Report");
    await expect(tabs.nth(1)).toHaveText("Workflow");
    await expect(tabs.nth(2)).toHaveText("Dashboard");

    // Board Report is selected by default
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");

    // Click Workflow tab
    await tabs.nth(1).click();
    await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "false");

    // Click Dashboard tab
    await tabs.nth(2).click();
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true");
  });

  test("tab selection persists via URL hash", async ({ page }) => {
    // Load directly with #dashboard hash
    await page.goto("/consulting/explore/hospital#dashboard");
    const tabs = page.getByRole("tab");
    // useEffect reads hash after hydration — wait for it
    await expect(tabs.nth(2)).toHaveAttribute("aria-selected", "true", { timeout: 5000 });

    // Click Board Report, then verify hash updated
    await tabs.nth(0).click();
    await expect(tabs.nth(0)).toHaveAttribute("aria-selected", "true");
    expect(new URL(page.url()).hash).toBe("#report");
  });

  test("tabs render on all verticals", async ({ page }) => {
    const verticals = ["hospital", "saas", "retail", "fintech-gf", "real-estate"];
    for (const v of verticals) {
      await page.goto(`/consulting/explore/${v}`);
      const tabs = page.getByRole("tab");
      await expect(tabs).toHaveCount(3);
    }
  });

  test("hero shows vertical-specific content", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    // Hero should contain the reliability score label
    await expect(page.getByText("Reliability Score").first()).toBeVisible();
    // Hero should show a score number
    await expect(page.getByText("81").first()).toBeVisible();
  });

  test("reality reveal shows reported vs audited vs decision exposure", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    // Reality Reveal section headers (uppercase labels)
    await expect(page.getByText("Reported", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Audited", { exact: true }).first()).toBeVisible();
    await expect(page.getByText("Decision Exposure", { exact: true }).first()).toBeVisible();
  });

  test("framing copy is visible above vertical selector", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    await expect(page.getByText("Explore a Live Engagement")).toBeVisible();
    await expect(page.getByText("governed analytics engagement")).toBeVisible();
  });
});

test.describe("Explore Dashboard tab", () => {
  test("dashboard tab shows widget grid", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    await page.getByRole("tab", { name: "Dashboard" }).click();
    const grid = page.getByTestId("dashboard-grid");
    await expect(grid).toBeVisible();
  });

  test("screenshot placeholder or image is present", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    await page.getByRole("tab", { name: "Dashboard" }).click();
    const screenshot = page.getByTestId("dashboard-screenshot");
    await expect(screenshot).toBeVisible();
  });

  test("dashboard shows before/after comparison", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    await page.getByRole("tab", { name: "Dashboard" }).click();
    await expect(page.getByText("Before BayesIQ")).toBeVisible();
    await expect(page.getByText("After BayesIQ")).toBeVisible();
    await expect(page.getByText("Going forward")).toBeVisible();
  });

  test("all 5 verticals render dashboard tab", async ({ page }) => {
    const verticals = ["hospital", "saas", "retail", "fintech-gf", "real-estate"];
    for (const v of verticals) {
      await page.goto(`/consulting/explore/${v}`);
      await page.getByRole("tab", { name: "Dashboard" }).click();
      await expect(page.getByTestId("dashboard-grid")).toBeVisible();
    }
  });
});

test.describe("Board Report document preview", () => {
  test("board report tab shows document-style preview", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    // Board Report is now the default tab
    const doc = page.getByTestId("report-document");
    await expect(doc).toBeVisible();
  });

  test("narrative text is visible in the report", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    const narrative = page.getByTestId("report-narrative");
    await expect(narrative).toBeVisible();
    await expect(narrative).toContainText("BayesIQ");
  });

  test("score badge is visible in the document header", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    const badge = page.getByTestId("report-score-badge");
    await expect(badge).toBeVisible();
    await expect(badge).toContainText("81");
  });

  test("all 5 verticals render board report tab without errors", async ({ page }) => {
    const verticals = ["hospital", "saas", "retail", "fintech-gf", "real-estate"];
    for (const v of verticals) {
      await page.goto(`/consulting/explore/${v}`);
      // Board Report is the default tab — just check it rendered
      await expect(page.getByTestId("report-document")).toBeVisible();
    }
  });
});

test.describe("Explore Dashboard grid + narrative sections", () => {
  test("board report is default tab with executive summary", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    const narrative = page.getByTestId("report-narrative");
    await expect(narrative).toBeVisible();
    await expect(narrative).toContainText("healthcare organization");
  });

  test("dashboard tab shows widget grid after clicking", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    await page.getByRole("tab", { name: "Dashboard" }).click();
    await expect(page.getByTestId("dashboard-grid")).toBeVisible();
    await expect(page.getByTestId("dashboard-screenshot")).toBeVisible();
  });

  test("all 5 verticals render all three tabs", async ({ page }) => {
    const verticals = ["hospital", "saas", "retail", "fintech-gf", "real-estate"];
    for (const v of verticals) {
      await page.goto(`/consulting/explore/${v}`);
      // Board Report is default
      await expect(page.getByTestId("report-document")).toBeVisible();
      // Workflow
      await page.getByRole("tab", { name: "Workflow" }).click();
      await expect(page.getByTestId("workflow-tab")).toBeVisible();
      // Dashboard
      await page.getByRole("tab", { name: "Dashboard" }).click();
      await expect(page.getByTestId("dashboard-grid")).toBeVisible();
    }
  });
});

test.describe("Explore Workflow tab", () => {
  test("workflow tab shows Governance header", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    await page.getByRole("tab", { name: "Workflow" }).click();
    const tab = page.getByTestId("workflow-tab");
    await expect(tab).toBeVisible();
    await expect(tab.getByText("Governance", { exact: true })).toBeVisible();
  });

  test("governance progress bar shows coverage percentage", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    await page.getByRole("tab", { name: "Workflow" }).click();
    const bar = page.getByTestId("governance-progress-bar");
    await expect(bar).toBeVisible();
    await expect(bar).toContainText("Governance Coverage");
  });

  test("decision log shows individual decisions with reviewer attribution", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    await page.getByRole("tab", { name: "Workflow" }).click();
    const log = page.getByTestId("decision-log");
    await expect(log).toBeVisible();
    // Should show at least one reviewer name
    await expect(log.getByText("John Doe").first()).toBeVisible();
  });

  test("rejected decisions show review notes", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    await page.getByRole("tab", { name: "Workflow" }).click();
    const log = page.getByTestId("decision-log");
    // Hospital has a billing code swap rejection
    await expect(log.getByText(/rejected/i).first()).toBeVisible();
  });

  test("workflow tab shows decision log without investigation content", async ({ page }) => {
    await page.goto("/consulting/explore/hospital");
    await page.getByRole("tab", { name: "Workflow" }).click();
    await expect(page.getByTestId("decision-log")).toBeVisible();
    // Cascade and insights should NOT be in this tab
    await expect(page.locator("text=Evidence — questions traced through source data")).not.toBeVisible();
  });

  test("all 5 verticals render workflow tab", async ({ page }) => {
    const verticals = ["hospital", "saas", "retail", "fintech-gf", "real-estate"];
    for (const v of verticals) {
      await page.goto(`/consulting/explore/${v}`);
      await page.getByRole("tab", { name: "Workflow" }).click();
      await expect(page.getByTestId("workflow-tab")).toBeVisible();
    }
  });
});

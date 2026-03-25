import { test, expect } from "@playwright/test";

// Decision Log rows in the Workflow tab open the GovernanceDetailPanel.
const VERTICAL = "/consulting/explore/hospital";

async function clickFirstDecision(page: import("@playwright/test").Page) {
  await page.goto(VERTICAL);
  await page.getByRole("tab", { name: "Workflow" }).click();
  const log = page.getByTestId("decision-log");
  await expect(log).toBeVisible();
  // Click the first decision row (a button element)
  const row = log.locator("button").first();
  await row.click();
}

test.describe("Governance Detail Panel", () => {
  test("clicking a decision row opens governance detail dialog", async ({
    page,
  }) => {
    await clickFirstDecision(page);
    const dialog = page.locator('[data-testid="governance-detail-dialog"]');
    await expect(dialog).toHaveAttribute("open", "");
  });

  test("panel shows approval status and reviewer info", async ({ page }) => {
    await clickFirstDecision(page);
    const panel = page.locator('[data-testid="governance-detail-panel"]');
    await expect(panel).toBeVisible();
    await expect(panel.locator('[data-testid="status-pill"]')).toBeVisible();
    const hasDetails = await panel.locator('[data-testid="governance-details"]').isVisible();
    const hasNoGov = await panel.locator('[data-testid="no-governance-message"]').isVisible();
    expect(hasDetails || hasNoGov).toBe(true);
  });

  test("clicking close button closes the panel", async ({ page }) => {
    await clickFirstDecision(page);
    const dialog = page.locator('[data-testid="governance-detail-dialog"]');
    await expect(dialog).toHaveAttribute("open", "");
    const closeBtn = page.locator('[data-testid="panel-close-button"]');
    await closeBtn.click();
    await expect(dialog).not.toHaveAttribute("open", "");
  });

  test("pressing Escape closes the panel", async ({ page }) => {
    await clickFirstDecision(page);
    const dialog = page.locator('[data-testid="governance-detail-dialog"]');
    await expect(dialog).toHaveAttribute("open", "");
    await page.keyboard.press("Escape");
    await expect(dialog).not.toHaveAttribute("open", "");
  });

  test("clicking dialog backdrop closes the panel", async ({ page }) => {
    await clickFirstDecision(page);
    const dialog = page.locator('[data-testid="governance-detail-dialog"]');
    await expect(dialog).toHaveAttribute("open", "");
    await dialog.click({ position: { x: 10, y: 10 } });
    await expect(dialog).not.toHaveAttribute("open", "");
  });
});

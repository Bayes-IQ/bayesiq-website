import { test, expect } from "@playwright/test";

// Hospital vertical has cascade data with matching question_ids in
// cascade_governance, so cascade cards render clickable trust badges.
const VERTICAL = "/golden-flows/hospital";

test.describe("Governance Detail Panel", () => {
  test("clicking a trust badge on cascade card opens governance detail dialog", async ({
    page,
  }) => {
    await page.goto(VERTICAL);

    // Cascade cards render trust badges for governed question_ids
    const badge = page.locator('[data-testid="trust-badge-button"]').first();
    await expect(badge).toBeVisible();
    await badge.click();

    const dialog = page.locator('[data-testid="governance-detail-dialog"]');
    await expect(dialog).toHaveAttribute("open", "");
  });

  test("panel shows approval status and reviewer info", async ({ page }) => {
    await page.goto(VERTICAL);

    const badge = page.locator('[data-testid="trust-badge-button"]').first();
    await badge.click();

    const panel = page.locator('[data-testid="governance-detail-panel"]');
    await expect(panel).toBeVisible();

    // Should show a status pill
    await expect(panel.locator('[data-testid="status-pill"]')).toBeVisible();

    // Should show governance details or no-governance message
    const hasDetails = await panel.locator('[data-testid="governance-details"]').isVisible();
    const hasNoGov = await panel.locator('[data-testid="no-governance-message"]').isVisible();
    expect(hasDetails || hasNoGov).toBe(true);
  });

  test("clicking close button closes the panel", async ({ page }) => {
    await page.goto(VERTICAL);

    const badge = page.locator('[data-testid="trust-badge-button"]').first();
    await badge.click();

    const dialog = page.locator('[data-testid="governance-detail-dialog"]');
    await expect(dialog).toHaveAttribute("open", "");

    const closeBtn = page.locator('[data-testid="panel-close-button"]');
    await closeBtn.click();

    await expect(dialog).not.toHaveAttribute("open", "");
  });

  test("pressing Escape closes the panel", async ({ page }) => {
    await page.goto(VERTICAL);

    const badge = page.locator('[data-testid="trust-badge-button"]').first();
    await badge.click();

    const dialog = page.locator('[data-testid="governance-detail-dialog"]');
    await expect(dialog).toHaveAttribute("open", "");

    await page.keyboard.press("Escape");

    await expect(dialog).not.toHaveAttribute("open", "");
  });

  test("clicking dialog backdrop closes the panel", async ({ page }) => {
    await page.goto(VERTICAL);

    const badge = page.locator('[data-testid="trust-badge-button"]').first();
    await badge.click();

    const dialog = page.locator('[data-testid="governance-detail-dialog"]');
    await expect(dialog).toHaveAttribute("open", "");

    // Click on the dialog element itself (the backdrop area), not on the inner panel
    // The panel is fixed right-0, so clicking far left hits the backdrop
    await dialog.click({ position: { x: 10, y: 10 } });

    await expect(dialog).not.toHaveAttribute("open", "");
  });
});

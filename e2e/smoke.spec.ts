import { test, expect } from "@playwright/test";
import { staticRoutes, getBlogSlugs } from "./fixtures/routes";

// Console error allowlist — each entry must explain why it is allowed.
// Start empty; add only if dev-mode noise appears during test runs.
const CONSOLE_ERROR_ALLOWLIST: string[] = [];

function isAllowlisted(text: string): boolean {
  return CONSOLE_ERROR_ALLOWLIST.some((pattern) => text.includes(pattern));
}

test.describe("Smoke tests — static routes", () => {
  for (const route of staticRoutes) {
    test(`${route.path} loads with correct title`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          const text = msg.text();
          if (!isAllowlisted(text)) {
            consoleErrors.push(text);
          }
        }
      });

      const response = await page.goto(route.path, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBe(200);

      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title).toContain(route.titleContains);

      expect(
        consoleErrors,
        `Unexpected console errors on ${route.path}:\n${consoleErrors.join("\n")}`
      ).toHaveLength(0);
    });
  }
});

const blogSlugs = getBlogSlugs();

test.describe("Smoke tests — blog posts", () => {
  for (const slug of blogSlugs) {
    test(`/blog/${slug} loads`, async ({ page }) => {
      const consoleErrors: string[] = [];
      page.on("console", (msg) => {
        if (msg.type() === "error") {
          const text = msg.text();
          if (!isAllowlisted(text)) {
            consoleErrors.push(text);
          }
        }
      });

      const response = await page.goto(`/blog/${slug}`, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBe(200);

      const title = await page.title();
      expect(title).toBeTruthy();

      expect(
        consoleErrors,
        `Unexpected console errors on /blog/${slug}:\n${consoleErrors.join("\n")}`
      ).toHaveLength(0);
    });
  }
});

import { test, expect } from "@playwright/test";
import { staticRoutes, routesWithJsonLd } from "./fixtures/routes";

test.describe("JSON-LD validation", () => {
  for (const route of staticRoutes) {
    test(`${route.path} — JSON-LD is valid if present`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      const scripts = await page.$$eval(
        'script[type="application/ld+json"]',
        (els) => els.map((el) => el.textContent ?? "")
      );

      if (scripts.length > 0) {
        // Log which routes have JSON-LD for visibility
        // eslint-disable-next-line no-console
        console.log(`  [JSON-LD] ${route.path}: ${scripts.length} block(s)`);
      }

      for (let i = 0; i < scripts.length; i++) {
        const raw = scripts[i].trim();
        let parsed: unknown;

        try {
          parsed = JSON.parse(raw);
        } catch {
          expect(
            false,
            `${route.path}: JSON-LD script[${i}] is not valid JSON`
          ).toBe(true);
          continue;
        }

        // Support both single object and array of objects
        const nodes = Array.isArray(parsed) ? parsed : [parsed];

        for (const node of nodes) {
          expect(
            node,
            `${route.path}: JSON-LD node missing @context`
          ).toHaveProperty("@context");
          expect(
            node,
            `${route.path}: JSON-LD node missing @type`
          ).toHaveProperty("@type");
        }
      }
    });
  }

  // Regression guard: pages that should have JSON-LD actually do
  for (const route of routesWithJsonLd) {
    test(`${route.path} — has at least one JSON-LD block`, async ({ page }) => {
      await page.goto(route.path, { waitUntil: "domcontentloaded" });

      const count = await page.$$eval(
        'script[type="application/ld+json"]',
        (els) => els.length
      );

      expect(
        count,
        `${route.path} should have JSON-LD structured data`
      ).toBeGreaterThan(0);
    });
  }
});

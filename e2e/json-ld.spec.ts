import { test, expect } from "@playwright/test";

// Routes with explicit per-page JSON-LD (in addition to global Organization from layout.tsx)
const routesWithJsonLd = ["/services", "/audit-kit"];

// All public routes — check that any JSON-LD present is valid
const allRoutes = [
  "/",
  "/services",
  "/audit-kit",
  "/approach",
  "/case-studies",
  "/sample-report",
  "/playground",
  "/assessment",
  "/contact",
  "/privacy",
  "/terms",
  "/blog",
  "/fintech",
  "/healthcare",
];

test.describe("JSON-LD validation", () => {
  for (const route of allRoutes) {
    test(`${route} — JSON-LD is valid if present`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      const scripts = await page.$$eval(
        'script[type="application/ld+json"]',
        (els) => els.map((el) => el.textContent ?? "")
      );

      for (let i = 0; i < scripts.length; i++) {
        const raw = scripts[i].trim();
        let parsed: unknown;

        try {
          parsed = JSON.parse(raw);
        } catch {
          expect(
            false,
            `${route}: JSON-LD script[${i}] is not valid JSON`
          ).toBe(true);
          continue;
        }

        // Support both single object and array of objects
        const nodes = Array.isArray(parsed) ? parsed : [parsed];

        for (const node of nodes) {
          expect(
            node,
            `${route}: JSON-LD node missing @context`
          ).toHaveProperty("@context");
          expect(
            node,
            `${route}: JSON-LD node missing @type`
          ).toHaveProperty("@type");
        }
      }
    });
  }

  // Ensure pages that should have JSON-LD actually do
  for (const route of routesWithJsonLd) {
    test(`${route} — has at least one JSON-LD block`, async ({ page }) => {
      await page.goto(route, { waitUntil: "domcontentloaded" });

      const count = await page.$$eval(
        'script[type="application/ld+json"]',
        (els) => els.length
      );

      expect(
        count,
        `${route} should have JSON-LD structured data`
      ).toBeGreaterThan(0);
    });
  }
});

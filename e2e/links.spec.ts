import { test, expect } from "@playwright/test";
import { getAllSeedPaths } from "./fixtures/routes";

const seedRoutes = getAllSeedPaths();

test("All internal links resolve (no 404/500)", async ({ page, request }) => {
  test.setTimeout(60_000);
  const brokenLinks: { source: string; href: string; status: number }[] = [];
  const checked = new Set<string>();

  for (const route of seedRoutes) {
    await page.goto(route, { waitUntil: "domcontentloaded" });

    // Collect all internal hrefs
    const hrefs = await page.$$eval("a[href]", (anchors) =>
      anchors
        .map((a) => a.getAttribute("href") ?? "")
        .filter(
          (h) =>
            h.startsWith("/") &&
            !h.startsWith("//") &&
            !h.startsWith("/api/")
        )
    );

    for (const rawHref of hrefs) {
      // Strip hash and query for route-level checks
      const path = rawHref.split(/[?#]/)[0];
      if (!path || checked.has(path)) continue;
      checked.add(path);

      const res = await request.get(path);
      if (res.status() >= 400) {
        brokenLinks.push({ source: route, href: path, status: res.status() });
      }
    }
  }

  if (brokenLinks.length > 0) {
    const report = brokenLinks
      .map((b) => `  ${b.source} → ${b.href} (${b.status})`)
      .join("\n");
    expect(brokenLinks, `Broken internal links found:\n${report}`).toHaveLength(
      0
    );
  }
});

test("Non-existent path returns 404", async ({ request }) => {
  const res = await request.get("/nonexistent-test-path");
  expect(res.status()).toBe(404);
});

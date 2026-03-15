import { test, expect } from "@playwright/test";

// Same seed routes as smoke tests
const seedRoutes = [
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

test("All internal links resolve (no 404/500)", async ({ page, request }) => {
  test.setTimeout(60_000);
  const brokenLinks: { source: string; href: string; status: number }[] = [];
  const checked = new Set<string>();

  for (const route of seedRoutes) {
    await page.goto(route, { waitUntil: "networkidle" });

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

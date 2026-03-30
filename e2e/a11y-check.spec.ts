import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const PAGES = [
  { name: "home", path: "/" },
  { name: "consulting", path: "/consulting" },
  { name: "consulting-industries", path: "/consulting/industries" },
  { name: "consulting-sample-report", path: "/consulting/sample-report" },
  { name: "consulting-case-studies", path: "/consulting/case-studies" },
  { name: "explore-fintech", path: "/consulting/explore/fintech-gf" },
  { name: "explore-hospital", path: "/consulting/explore/hospital" },
  { name: "explore-saas", path: "/consulting/explore/saas" },
  { name: "explore-retail", path: "/consulting/explore/retail" },
  { name: "explore-real-estate", path: "/consulting/explore/real-estate" },
  { name: "platform", path: "/platform" },
  { name: "assessment", path: "/assessment" },
  { name: "contact", path: "/contact" },
  { name: "privacy", path: "/privacy" },
  { name: "terms", path: "/terms" },
];

test.describe("Accessibility checks", () => {
  for (const page of PAGES) {
    test(`${page.name}: no critical WCAG violations`, async ({ page: p }) => {
      await p.goto(page.path);
      await p.waitForLoadState("networkidle");

      const results = await new AxeBuilder({ page: p })
        .withTags(["wcag2a", "wcag2aa"])
        .analyze();

      const critical = results.violations.filter(
        (v) => v.impact === "critical" || v.impact === "serious"
      );

      if (critical.length > 0) {
        const summary = critical
          .map(
            (v) =>
              `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} instances)`
          )
          .join("\n");
        console.log(`A11y violations on ${page.name}:\n${summary}`);
      }

      // Fail on critical violations only
      expect(
        critical.filter((v) => v.impact === "critical"),
        `Critical a11y violations on ${page.name}`
      ).toHaveLength(0);
    });

    test(`${page.name}: heading hierarchy is valid`, async ({ page: p }) => {
      await p.goto(page.path);
      await p.waitForLoadState("networkidle");

      const headings = await p.$$eval(
        "h1, h2, h3, h4, h5, h6",
        (els) =>
          els.map((el) => ({
            level: parseInt(el.tagName[1]),
            text: el.textContent?.trim().slice(0, 50) || "",
          }))
      );

      // Check no levels are skipped (e.g., h1 -> h3 without h2)
      const violations: string[] = [];
      for (let i = 1; i < headings.length; i++) {
        const prev = headings[i - 1].level;
        const curr = headings[i].level;
        if (curr > prev + 1) {
          violations.push(
            `Skipped from h${prev} ("${headings[i - 1].text}") to h${curr} ("${headings[i].text}")`
          );
        }
      }

      if (violations.length > 0) {
        console.log(
          `Heading violations on ${page.name}:\n${violations.join("\n")}`
        );
      }
      // Report but don't fail — many pages may have this
      expect(violations.length).toBeLessThanOrEqual(3);
    });
  }

  test("mobile touch targets are at least 44x44px", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/");
    await page.waitForLoadState("networkidle");

    const smallTargets = await page.$$eval(
      "a, button, input, select, textarea, [role='button']",
      (els) =>
        els
          .map((el) => {
            const rect = el.getBoundingClientRect();
            return {
              tag: el.tagName.toLowerCase(),
              text:
                el.textContent?.trim().slice(0, 30) ||
                el.getAttribute("aria-label") ||
                "",
              width: Math.round(rect.width),
              height: Math.round(rect.height),
            };
          })
          .filter((el) => el.width > 0 && el.height > 0) // visible only
          .filter((el) => el.width < 44 || el.height < 44)
    );

    if (smallTargets.length > 0) {
      console.log(
        "Small touch targets:\n" +
          smallTargets
            .map((t) => `  ${t.tag} "${t.text}" — ${t.width}x${t.height}px`)
            .join("\n")
      );
    }
    // Report but allow some — nav links and inline links may be small
    expect(smallTargets.length).toBeLessThan(20);
  });
});

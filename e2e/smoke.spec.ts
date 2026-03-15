import { test, expect } from "@playwright/test";
import { readdirSync } from "fs";
import { join } from "path";

// Static routes — every public page on the site
const staticRoutes = [
  { path: "/", titleContains: "BayesIQ" },
  { path: "/services", titleContains: "Platform" },
  { path: "/audit-kit", titleContains: "Audit Kit" },
  { path: "/approach", titleContains: "Approach" },
  { path: "/case-studies", titleContains: "Live Demo" },
  { path: "/sample-report", titleContains: "Sample" },
  { path: "/playground", titleContains: "Playground" },
  { path: "/assessment", titleContains: "Assessment" },
  { path: "/contact", titleContains: "Contact" },
  { path: "/privacy", titleContains: "Privacy" },
  { path: "/terms", titleContains: "Terms" },
  { path: "/blog", titleContains: "Blog" },
  { path: "/fintech", titleContains: "Fintech" },
  { path: "/healthcare", titleContains: "Healthcare" },
];

// Discover blog slugs dynamically from content/blog/
function getBlogSlugs(): string[] {
  try {
    const blogDir = join(__dirname, "..", "content", "blog");
    return readdirSync(blogDir)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

const blogSlugs = getBlogSlugs();

test.describe("Smoke tests — static routes", () => {
  for (const route of staticRoutes) {
    test(`${route.path} loads with correct title`, async ({ page }) => {
      const response = await page.goto(route.path, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBe(200);

      const title = await page.title();
      expect(title).toBeTruthy();
      expect(title).toContain(route.titleContains);
    });
  }
});

test.describe("Smoke tests — blog posts", () => {
  for (const slug of blogSlugs) {
    test(`/blog/${slug} loads`, async ({ page }) => {
      const response = await page.goto(`/blog/${slug}`, {
        waitUntil: "domcontentloaded",
      });
      expect(response?.status()).toBe(200);

      const title = await page.title();
      expect(title).toBeTruthy();
    });
  }
});

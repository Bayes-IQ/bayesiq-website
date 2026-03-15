import { readdirSync } from "fs";
import { join } from "path";

export interface RouteDefinition {
  path: string;
  titleContains: string;
  hasJsonLd?: boolean; // true if page has explicit JSON-LD
}

// All static routes — every public page on the site
export const staticRoutes: RouteDefinition[] = [
  { path: "/", titleContains: "BayesIQ" },
  { path: "/services", titleContains: "Platform", hasJsonLd: true },
  { path: "/audit-kit", titleContains: "Audit Kit", hasJsonLd: true },
  { path: "/approach", titleContains: "Approach" },
  { path: "/case-studies", titleContains: "Case Studies" },
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
export function getBlogSlugs(): string[] {
  try {
    const blogDir = join(__dirname, "..", "..", "content", "blog");
    return readdirSync(blogDir)
      .filter((f) => f.endsWith(".mdx"))
      .map((f) => f.replace(/\.mdx$/, ""));
  } catch {
    return [];
  }
}

// All route paths (static + blog) for link checking
export function getAllSeedPaths(): string[] {
  const paths = staticRoutes.map((r) => r.path);
  for (const slug of getBlogSlugs()) {
    paths.push(`/blog/${slug}`);
  }
  return paths;
}

// Routes with explicit JSON-LD (for regression guard)
export const routesWithJsonLd = staticRoutes.filter((r) => r.hasJsonLd);

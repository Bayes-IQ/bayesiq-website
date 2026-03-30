import { test, type Page, type BrowserContext } from "@playwright/test";
import path from "path";
import fs from "fs";

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
  { name: "404", path: "/nonexistent-page" },
];

const VIEWPORTS = [
  { name: "mobile", width: 375, height: 812 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1440, height: 900 },
];

const OUTPUT_DIR = path.join("test-results", "visual-qa");

/** Ensure the output directory exists. */
function ensureOutputDir() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

/** Take a full-page screenshot and save it. */
async function capture(page: Page, fileName: string) {
  const filePath = path.join(OUTPUT_DIR, `${fileName}.png`);
  await page.screenshot({ fullPage: true, path: filePath });
}

// ---------------------------------------------------------------------------
// Page x Viewport matrix
// ---------------------------------------------------------------------------

test.describe("Visual QA captures", () => {
  test.describe.configure({ mode: "serial" });

  let screenshotCount = 0;

  test.beforeAll(() => {
    ensureOutputDir();
  });

  for (const viewport of VIEWPORTS) {
    for (const pg of PAGES) {
      test(`${pg.name} @ ${viewport.name} (${viewport.width}x${viewport.height})`, async ({
        page,
      }) => {
        await page.setViewportSize({
          width: viewport.width,
          height: viewport.height,
        });
        const response = await page.goto(pg.path, {
          waitUntil: "networkidle",
          timeout: 30_000,
        });
        // Gracefully handle any status -- we still want the screenshot
        if (response) {
          // 404 pages are expected for /nonexistent-page
          const status = response.status();
          if (status >= 500) {
            console.warn(
              `  Warning: ${pg.path} returned status ${status}`
            );
          }
        }
        await capture(page, `${pg.name}-${viewport.name}`);
        screenshotCount++;
      });
    }
  }

  // -------------------------------------------------------------------------
  // Interaction state: mobile nav open
  // -------------------------------------------------------------------------

  test("interaction: mobile nav open", async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto("/", { waitUntil: "networkidle" });
    await page.click('button[aria-label="Toggle menu"]');
    // Brief wait for menu animation/render
    await page.waitForTimeout(300);
    await capture(page, "home-mobile-nav-open");
    screenshotCount++;
  });

  // -------------------------------------------------------------------------
  // Interaction state: contact form focused
  // -------------------------------------------------------------------------

  test("interaction: contact form focus", async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto("/contact", { waitUntil: "networkidle" });
    // Focus the first text input (name field)
    const nameField = page.locator(
      'input[type="text"], input[name="name"], input[id="name"]'
    ).first();
    await nameField.focus();
    await page.waitForTimeout(200);
    await capture(page, "contact-form-focused-desktop");
    screenshotCount++;
  });

  // -------------------------------------------------------------------------
  // Video: homepage scroll flow
  // -------------------------------------------------------------------------

  test("video: homepage scroll", async ({ browser }) => {
    const context: BrowserContext = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      recordVideo: {
        dir: OUTPUT_DIR,
        size: { width: 1440, height: 900 },
      },
    });
    const page = await context.newPage();
    await page.goto("/", { waitUntil: "networkidle" });

    // Smooth scroll to bottom in steps
    const totalHeight = await page.evaluate(() => document.body.scrollHeight);
    const step = Math.ceil(totalHeight / 8);
    for (let y = 0; y <= totalHeight; y += step) {
      await page.evaluate((scrollY) => {
        window.scrollTo({ top: scrollY, behavior: "smooth" });
      }, y);
      await page.waitForTimeout(400);
    }
    // Ensure we reach the very bottom
    await page.evaluate(() =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })
    );
    await page.waitForTimeout(600);

    await page.close();
    // Video is finalized on context close
    const videoPath = await page.video()?.path();
    await context.close();

    // Rename video to a predictable name
    if (videoPath && fs.existsSync(videoPath)) {
      const dest = path.join(OUTPUT_DIR, "home-scroll-desktop.webm");
      fs.renameSync(videoPath, dest);
      console.log(`  Video saved: ${dest}`);
    }
  });

  // -------------------------------------------------------------------------
  // Summary
  // -------------------------------------------------------------------------

  test.afterAll(() => {
    const pngs = fs.readdirSync(OUTPUT_DIR).filter((f) => f.endsWith(".png"));
    const videos = fs
      .readdirSync(OUTPUT_DIR)
      .filter((f) => f.endsWith(".webm"));
    console.log("\n--- Visual QA Summary ---");
    console.log(`  Pages in matrix: ${PAGES.length}`);
    console.log(`  Viewports: ${VIEWPORTS.length}`);
    console.log(`  Screenshots captured: ${pngs.length}`);
    console.log(`  Videos captured: ${videos.length}`);
    console.log("-------------------------\n");
  });
});

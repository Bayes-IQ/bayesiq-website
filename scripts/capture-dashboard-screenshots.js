/**
 * Capture screenshots of live Streamlit dashboards for all 5 verticals.
 * Run: node scripts/capture-dashboard-screenshots.js
 */
const { chromium } = require("playwright");

const DASHBOARDS = {
  hospital: "https://bayesiq-dashboard-golden-flows-hospital.streamlit.app",
  saas: "https://bayesiq-dashboard-golden-flows-saas.streamlit.app",
  retail: "https://bayesiq-dashboard-golden-flows-retail.streamlit.app",
  "fintech-gf": "https://bayesiq-dashboard-golden-flows-fintech.streamlit.app",
  "real-estate":
    "https://bayesiq-dashboard-golden-flows-realestate.streamlit.app",
};

(async () => {
  const browser = await chromium.launch();
  for (const [slug, url] of Object.entries(DASHBOARDS)) {
    try {
      const page = await browser.newPage({
        viewport: { width: 1280, height: 800 },
      });
      console.log(`loading ${slug}...`);
      await page.goto(url, { timeout: 45000, waitUntil: "networkidle" });
      // Wait for Streamlit to fully render
      await page.waitForTimeout(5000);
      const path = `public/golden-flows/${slug}/dashboard-preview.png`;
      await page.screenshot({ path, fullPage: false });
      await page.close();
      console.log(`captured: ${slug} → ${path}`);
    } catch (e) {
      console.log(`FAILED: ${slug} — ${e.message.slice(0, 100)}`);
    }
  }
  await browser.close();
  console.log("done");
})();

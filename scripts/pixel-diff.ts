import { readFileSync, writeFileSync, existsSync, mkdirSync, readdirSync } from "fs";
import { join } from "path";
import { PNG } from "pngjs";
import pixelmatch from "pixelmatch";

const BASELINE_DIR = "test-results/visual-qa/baseline";
const CURRENT_DIR = "test-results/visual-qa";
const DIFF_DIR = "test-results/visual-qa/diffs";

function run() {
  if (!existsSync(BASELINE_DIR)) {
    console.log("No baseline found. Run: npm run visual-qa:baseline approve");
    process.exit(0);
  }

  const baselineFiles = readdirSync(BASELINE_DIR).filter(f => f.endsWith(".png"));
  if (baselineFiles.length === 0) {
    console.log("Baseline is empty. Run: npm run visual-qa && npm run visual-qa:baseline approve");
    process.exit(0);
  }

  // Check if there are any current screenshots to compare against
  const currentPngs = existsSync(CURRENT_DIR)
    ? readdirSync(CURRENT_DIR).filter(
        f => f.endsWith(".png") && !f.startsWith("diff-")
      )
    : [];

  if (currentPngs.length === 0) {
    console.log("No latest screenshots found. Run: npm run visual-qa");
    process.exit(1);
  }

  mkdirSync(DIFF_DIR, { recursive: true });

  let changed = 0;
  let unchanged = 0;
  let missing = 0;
  const results: Array<{ file: string; status: string; diffPercent?: number }> = [];

  for (const file of baselineFiles) {
    const baselinePath = join(BASELINE_DIR, file);
    const currentPath = join(CURRENT_DIR, file);

    if (!existsSync(currentPath)) {
      results.push({ file, status: "missing" });
      missing++;
      continue;
    }

    const baselineImg = PNG.sync.read(readFileSync(baselinePath));
    const currentImg = PNG.sync.read(readFileSync(currentPath));

    if (baselineImg.width !== currentImg.width || baselineImg.height !== currentImg.height) {
      results.push({ file, status: "size-changed", diffPercent: 100 });
      changed++;
      continue;
    }

    const { width, height } = baselineImg;
    const diff = new PNG({ width, height });
    const numDiffPixels = pixelmatch(
      baselineImg.data,
      currentImg.data,
      diff.data,
      width,
      height,
      { threshold: 0.1 }
    );

    const diffPercent = (numDiffPixels / (width * height)) * 100;

    if (numDiffPixels === 0) {
      results.push({ file, status: "unchanged", diffPercent: 0 });
      unchanged++;
    } else {
      results.push({ file, status: "changed", diffPercent: Math.round(diffPercent * 100) / 100 });
      changed++;
      writeFileSync(join(DIFF_DIR, `diff-${file}`), PNG.sync.write(diff));
    }
  }

  // Check for new screenshots not in baseline
  for (const file of currentPngs) {
    if (!baselineFiles.includes(file)) {
      results.push({ file, status: "new" });
    }
  }

  console.log("\n=== Pixel Diff Summary ===");
  console.log(`Unchanged: ${unchanged}`);
  console.log(`Changed:   ${changed}`);
  console.log(`Missing:   ${missing}`);
  console.log("");

  for (const r of results.filter(r => r.status !== "unchanged")) {
    const detail = r.diffPercent !== undefined ? ` (${r.diffPercent}% diff)` : "";
    console.log(`  [${r.status.toUpperCase()}] ${r.file}${detail}`);
  }

  if (changed === 0 && missing === 0) {
    console.log("\nNo visual changes detected.");
    process.exit(0);
  } else {
    console.log(`\n${changed} page(s) changed, ${missing} missing.`);
    console.log(`Diff images saved to ${DIFF_DIR}/`);
    process.exit(1);
  }
}

run();

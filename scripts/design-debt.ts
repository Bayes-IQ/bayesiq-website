import { readFileSync, existsSync, readdirSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const FINDINGS_DIR = "test-results/visual-qa/findings";
const DEBT_FILE = "test-results/visual-qa/debt-scores.json";
const SEVERITY_WEIGHTS: Record<string, number> = {
  regression: 5,
  violation: 3,
  nit: 1,
  suggestion: 0.5,
};
const THRESHOLD = 10;

interface Finding {
  layer: string;
  severity: string;
  description: string;
}

interface PageFindings {
  page: string;
  findings: Finding[];
}

interface FindingsReport {
  timestamp: string;
  pages: PageFindings[];
}

function run() {
  if (!existsSync(FINDINGS_DIR)) {
    mkdirSync(FINDINGS_DIR, { recursive: true });
    console.log("No findings directory. Creating empty one.");
    console.log("Run visual reviews and save findings to test-results/visual-qa/findings/");
    process.exit(0);
  }

  const files = readdirSync(FINDINGS_DIR).filter(f => f.endsWith(".json"));
  if (files.length === 0) {
    console.log("No findings files found. Run a visual review first.");
    process.exit(0);
  }

  const debtScores: Record<string, { score: number; findings: number; breakdown: Record<string, number> }> = {};

  for (const file of files) {
    try {
      const report: FindingsReport = JSON.parse(readFileSync(join(FINDINGS_DIR, file), "utf-8"));
      for (const page of report.pages) {
        if (!debtScores[page.page]) {
          debtScores[page.page] = { score: 0, findings: 0, breakdown: {} };
        }
        for (const finding of page.findings) {
          const weight = SEVERITY_WEIGHTS[finding.severity] ?? 1;
          debtScores[page.page].score += weight;
          debtScores[page.page].findings++;
          debtScores[page.page].breakdown[finding.severity] =
            (debtScores[page.page].breakdown[finding.severity] ?? 0) + 1;
        }
      }
    } catch {
      console.warn(`Skipping invalid findings file: ${file}`);
    }
  }

  console.log("\n=== Design Debt Scores ===\n");
  console.log("Page".padEnd(40) + "Score".padEnd(8) + "Findings".padEnd(10) + "Status");
  console.log("-".repeat(70));

  const sorted = Object.entries(debtScores).sort((a, b) => b[1].score - a[1].score);
  let alertCount = 0;

  for (const [page, data] of sorted) {
    const status = data.score >= THRESHOLD ? "OVER THRESHOLD" : "OK";
    if (data.score >= THRESHOLD) alertCount++;
    console.log(
      page.padEnd(40) +
      data.score.toFixed(1).padEnd(8) +
      String(data.findings).padEnd(10) +
      status
    );
  }

  if (sorted.length === 0) {
    console.log("  No pages with findings.");
  }

  // Save scores
  mkdirSync("test-results/visual-qa", { recursive: true });
  writeFileSync(DEBT_FILE, JSON.stringify({
    timestamp: new Date().toISOString(),
    scores: debtScores
  }, null, 2));
  console.log(`\nScores saved to ${DEBT_FILE}`);

  if (alertCount > 0) {
    console.log(`\n${alertCount} page(s) exceed debt threshold (${THRESHOLD}).`);
  }
}

run();

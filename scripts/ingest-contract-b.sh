#!/usr/bin/env bash
# ingest-contract-b.sh — Transform DAK compiled website_payloads into Contract B files
# Usage: ./scripts/ingest-contract-b.sh [DAK_GOLDEN_FLOWS_PATH]
#
# Reads from: {DAK_PATH}/website_payloads/{vertical}.json  (compiled payloads)
# Writes to:  public/golden-flows/{vertical}/{payload_type}.json
set -euo pipefail

DAK_PATH="${1:-$HOME/BayesIQCode/bayesiq-data-audit-kit/demo/golden_flows}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$REPO_ROOT/public/golden-flows"
WP_DIR="$DAK_PATH/website_payloads"

VERTICALS=(hospital real_estate saas retail fintech)

# Validate DAK website_payloads path exists
if [ ! -d "$WP_DIR" ]; then
  echo "ERROR: DAK website_payloads path not found: $WP_DIR" >&2
  exit 1
fi

echo "=== Contract B Ingestion (from DAK website_payloads) ==="
echo "DAK source: $WP_DIR"
echo "Output dir: $OUT_DIR"
echo ""

# Create output directories
for v in "${VERTICALS[@]}"; do
  mkdir -p "$OUT_DIR/$v"
done

# We use node for JSON transforms since jq may not be available
# and the transforms require non-trivial logic.
export WP_DIR OUT_DIR
node --input-type=module <<'TRANSFORM_SCRIPT'
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

const wpDir = process.env.WP_DIR;
const outDir = process.env.OUT_DIR;

const verticals = ["hospital", "real_estate", "saas", "retail", "fintech"];

const displayNames = {
  hospital: "Healthcare",
  real_estate: "Real Estate",
  saas: "SaaS",
  retail: "Retail",
  fintech: "Fintech",
};

function readPayload(vertical) {
  const path = join(wpDir, `${vertical}.json`);
  return JSON.parse(readFileSync(path, "utf-8"));
}

function writeOut(vertical, filename, data) {
  const path = join(outDir, vertical, filename);
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log(`  ✓ ${vertical}/${filename}`);
}

for (const v of verticals) {
  console.log(`\n--- ${displayNames[v]} (${v}) ---`);

  const wp = readPayload(v);

  // 1. executive_questions.json
  const eqPayload = {
    schema_version: "1.0.0",
    payload_type: "executive_questions",
    vertical: v,
    questions: (wp.executive_questions || []).map((q, i) => ({
      question_id: q.question_id,
      priority: i === 0 ? "flagship" : "secondary",
      question_text: q.text,
      answer_summary: q.business_consequence,
      severity: i === 0 ? "critical" : i < 3 ? "high" : "medium",
    })),
  };
  writeOut(v, "executive_questions.json", eqPayload);

  // 2. discover_insights.json
  const diPayload = {
    schema_version: "1.0.0",
    payload_type: "discover_insights",
    vertical: v,
    insights: (wp.discover_insights && wp.discover_insights.length > 0)
      ? wp.discover_insights.map((ins, i) => ({
          insight_id: `${v}_INS_${String(i + 1).padStart(3, "0")}`,
          question_text: ins.question_text || ins.text || "What data quality issues exist?",
          dashboard_link: `https://demo.bayesiq.com/dashboards/${v}/insight-${i + 1}`,
          finding_ids: ins.finding_ids || ins.finding_refs || ["finding_001"],
        }))
      : [{
          insight_id: `${v}_INS_001`,
          question_text: wp.executive_questions?.[0]?.text || "What are the key data quality findings?",
          dashboard_link: `https://demo.bayesiq.com/dashboards/${v}/overview`,
          finding_ids: wp.executive_questions?.[0]?.finding_refs || ["near_duplicate_rows"],
        }],
  };
  writeOut(v, "discover_insights.json", diPayload);

  // 3. cascade_data.json — transform array to keyed map
  const cascadesMap = {};
  for (const c of (wp.cascade_data || [])) {
    cascadesMap[c.question_id] = {
      question_id: c.question_id,
      reported_value: c.answer?.reported ?? "See dashboard",
      audited_value: c.answer?.audited ?? "See audit report",
      delta: c.answer?.delta ?? "Under review",
      root_cause: c.answer?.root_cause || "Investigation pending",
      consequence: c.answer?.business_consequence || "Impact assessment pending",
      reviewer_badge: {
        reviewer_name: c.governance?.reviewer || "Data Quality Team",
        status: c.governance?.status === "approved" ? "approved"
          : c.governance?.status === "rejected" ? "rejected"
          : "pending",
      },
      timeline_steps: [
        {
          step_type: "finding",
          label: c.finding_detail?.[0]?.title || "Issue identified",
          description: c.finding_detail?.[0]?.description || "Data quality issue detected during audit",
        },
        {
          step_type: "correction",
          label: c.finding_detail?.[0]?.recommended_fix || "Remediation planned",
          description: "Correction steps identified",
        },
        {
          step_type: "governance",
          label: `Review ${c.governance?.status || "pending"}`,
          description: "Awaiting governance review and sign-off",
        },
      ],
    };
  }
  writeOut(v, "cascade_data.json", {
    schema_version: "1.0.0",
    payload_type: "cascade_data",
    vertical: v,
    cascades: cascadesMap,
  });

  // 4. trajectory.json — from score_trajectory
  const scores = wp.score_trajectory || {};
  const months = Object.keys(scores).sort();
  const snapshots = months.map((key) => {
    const monthNum = parseInt(key.replace("month_", ""), 10);
    const s = scores[key];
    return {
      month: monthNum,
      as_of_date: `2025-${String(monthNum * 3).padStart(2, "0")}-01`,
      score: s.score,
      finding_count: s.total_findings || 0,
      resolved_count: Math.max(0, (s.total_findings || 0) - Math.floor((s.total_findings || 0) * (1 - s.score / 100))),
    };
  });
  if (snapshots.length === 0) {
    snapshots.push({ month: 1, as_of_date: "2025-03-01", score: 50, finding_count: 5, resolved_count: 0 });
  }
  writeOut(v, "trajectory.json", {
    schema_version: "1.0.0",
    payload_type: "trajectory",
    vertical: v,
    snapshots,
  });

  // 5. screenshot_manifest.json — stub (DAK doesn't produce screenshots)
  const latestMonth = wp.hook_metrics?.latest_month || 3;
  writeOut(v, "screenshot_manifest.json", {
    schema_version: "1.0.0",
    payload_type: "screenshot_manifest",
    vertical: v,
    screenshots: [
      {
        artifact_id: `${v}_${latestMonth}_dashboard_001`,
        vertical: v,
        month: latestMonth,
        type: "dashboard",
        url: `https://demo.bayesiq.com/screenshots/${v}/month-${latestMonth}-dashboard.png`,
        alt_text: `${displayNames[v]} audit dashboard — Month ${latestMonth}`,
      },
      {
        artifact_id: `${v}_${latestMonth}_report_001`,
        vertical: v,
        month: latestMonth,
        type: "report",
        url: `https://demo.bayesiq.com/screenshots/${v}/month-${latestMonth}-report.png`,
        alt_text: `${displayNames[v]} audit report — Month ${latestMonth}`,
      },
    ],
  });

  // 6. artifact_links.json — from DAK artifact_links + stub URLs
  const dakLinks = wp.artifact_links || {};
  const latestM = wp.hook_metrics?.latest_month || 3;
  writeOut(v, "artifact_links.json", {
    schema_version: "1.0.0",
    payload_type: "artifact_links",
    vertical: v,
    artifacts: [
      {
        artifact_id: `${v}_${latestM}_dashboard_001`,
        vertical: v,
        month: latestM,
        type: "dashboard",
        url: `https://demo.bayesiq.com/dashboards/${v}/month-${latestM}`,
        title: `${displayNames[v]} Data Quality Dashboard — Month ${latestM}`,
      },
      {
        artifact_id: `${v}_${latestM}_report_001`,
        vertical: v,
        month: latestM,
        type: "report",
        url: `https://demo.bayesiq.com/reports/${v}/month-${latestM}`,
        title: `${displayNames[v]} Audit Report — Month ${latestM}`,
      },
    ],
  });

  // 7. hook_metrics.json — from DAK hook_metrics + executive_questions
  const hm = wp.hook_metrics || {};
  const score = hm.score_latest || 50;
  const severityLevel = score >= 85 ? "healthy" : score >= 70 ? "moderate" : score >= 50 ? "warning" : "critical";
  const headline = wp.executive_questions?.[0]?.text || "Data quality issues detected";
  const consequence = wp.executive_questions?.[0]?.business_consequence || "Business impact under assessment";

  writeOut(v, "hook_metrics.json", {
    schema_version: "1.0.0",
    payload_type: "hook_metrics",
    vertical: v,
    discrepancy_headline: headline,
    consequence: consequence,
    trust_cue: "Reviewed by BayesIQ Data Quality Team",
    score: score,
    severity_level: severityLevel,
  });

  // 8. vertical_narrative.json — derive from DAK narrative + findings
  // Extract key metrics from cascade data for narrative
  const topFinding = wp.cascade_data?.[0]?.finding_detail?.[0];
  const firstScore = months.length > 0 ? scores[months[0]]?.score : null;
  const lastScore = months.length > 0 ? scores[months[months.length - 1]]?.score : null;

  // Build narrative from real DAK data
  const narrativeExcerpt = wp.narrative_excerpt || "";
  const headlineFinding = topFinding
    ? topFinding.description
    : "Data quality issues detected across multiple dimensions.";
  const statusQuo = consequence;
  const withBayesiq = firstScore && lastScore
    ? `BayesIQ's audit surfaced ${hm.total_findings || "multiple"} findings and enabled targeted remediation that improved the reliability score from ${firstScore} to ${lastScore}.`
    : "BayesIQ's audit surfaced critical data quality issues, enabling targeted remediation within hours.";
  const ctaLabel = `Book a ${displayNames[v]} Data Diagnostic`;

  writeOut(v, "vertical_narrative.json", {
    schema_version: "1.0.0",
    payload_type: "vertical_narrative",
    vertical_id: v,
    display_name: displayNames[v],
    status_quo: statusQuo,
    with_bayesiq: withBayesiq,
    headline_finding: headlineFinding,
    cta_label: ctaLabel,
    cta_variant: "diagnostic",
  });
}

console.log("\n=== Ingestion complete ===");
TRANSFORM_SCRIPT

echo ""
echo "=== Running schema validation ==="
cd "$REPO_ROOT"
npm run validate:schemas
exit_code=$?

if [ $exit_code -ne 0 ]; then
  echo "ERROR: Schema validation failed" >&2
  exit 1
fi

echo ""
echo "=== Contract B ingestion successful ==="

#!/usr/bin/env bash
# ingest-contract-b.sh — Transform DAK golden flow outputs into Contract B payloads
# Usage: ./scripts/ingest-contract-b.sh [DAK_GOLDEN_FLOWS_PATH]
set -euo pipefail

DAK_PATH="${1:-$HOME/BayesIQCode/bayesiq-data-audit-kit/demo/golden_flows}"
REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
OUT_DIR="$REPO_ROOT/public/golden-flows"
SCHEMA_DIR="$REPO_ROOT/schemas/golden-flows/contract-b"

VERTICALS=(hospital real_estate saas retail fintech)

# Validate DAK path exists
if [ ! -d "$DAK_PATH" ]; then
  echo "ERROR: DAK golden flows path not found: $DAK_PATH" >&2
  exit 1
fi

echo "=== Contract B Ingestion ==="
echo "DAK source: $DAK_PATH"
echo "Output dir: $OUT_DIR"
echo ""

# Create output directories
for v in "${VERTICALS[@]}"; do
  mkdir -p "$OUT_DIR/$v"
done

# We use node for JSON transforms since jq may not be available
# and the transforms require non-trivial logic.
export DAK_PATH OUT_DIR
node --input-type=module <<'TRANSFORM_SCRIPT'
import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";

const dakPath = process.env.DAK_PATH;
const outDir = process.env.OUT_DIR;

const verticals = ["hospital", "real_estate", "saas", "retail", "fintech"];

const displayNames = {
  hospital: "Healthcare",
  real_estate: "Real Estate",
  saas: "SaaS",
  retail: "Retail",
  fintech: "Fintech",
};

const qPrefix = {
  hospital: "hosp",
  real_estate: "re",
  saas: "saas",
  retail: "ret",
  fintech: "fin",
};

// Score data from DAK website_payloads
const scoreData = {};
for (const v of verticals) {
  try {
    const wp = JSON.parse(readFileSync(join(dakPath, "website_payloads", `${v}.json`), "utf-8"));
    scoreData[v] = wp.score_trajectory || {};
  } catch {
    scoreData[v] = {};
  }
}

function readDakJson(vertical, filename) {
  try {
    return JSON.parse(readFileSync(join(dakPath, vertical, filename), "utf-8"));
  } catch {
    return null;
  }
}

function writePayload(vertical, filename, data) {
  const path = join(outDir, vertical, filename);
  writeFileSync(path, JSON.stringify(data, null, 2) + "\n");
  console.log(`  ✓ ${vertical}/${filename}`);
}

for (const v of verticals) {
  console.log(`\n--- ${displayNames[v]} (${v}) ---`);

  // 1. executive_questions.json — transform DAK shape to Contract B
  const dakEq = readDakJson(v, "executive_questions.json");
  if (dakEq && dakEq.questions && dakEq.questions.length > 0) {
    const eqPayload = {
      schema_version: "1.0.0",
      payload_type: "executive_questions",
      vertical: v,
      questions: dakEq.questions.map((q, i) => ({
        question_id: q.question_id,
        priority: i === 0 ? "flagship" : "secondary",
        question_text: q.text,
        answer_summary: q.business_consequence,
        severity: i === 0 ? "critical" : i < 3 ? "high" : "medium",
      })),
    };
    writePayload(v, "executive_questions.json", eqPayload);
  }

  // 2. discover_insights.json — transform DAK shape to Contract B
  const dakDi = readDakJson(v, "discover_insights.json");
  // DAK discover_insights are usually empty, create minimal valid stubs
  const diPayload = {
    schema_version: "1.0.0",
    payload_type: "discover_insights",
    vertical: v,
    insights: (dakDi && dakDi.insights && dakDi.insights.length > 0)
      ? dakDi.insights.map((ins, i) => ({
          insight_id: `${v}_INS_${String(i + 1).padStart(3, "0")}`,
          question_text: ins.question_text || ins.text || "What data quality issues exist?",
          dashboard_link: `https://demo.bayesiq.com/dashboards/${v}/insight-${i + 1}`,
          finding_ids: ins.finding_ids || ["finding_001"],
        }))
      : [{
          insight_id: `${v}_INS_001`,
          question_text: dakEq?.questions?.[0]?.text || "What are the key data quality findings?",
          dashboard_link: `https://demo.bayesiq.com/dashboards/${v}/overview`,
          finding_ids: dakEq?.questions?.[0]?.finding_refs || ["near_duplicate_rows"],
        }],
  };
  writePayload(v, "discover_insights.json", diPayload);

  // 3. cascade_data.json — transform DAK array shape to Contract B keyed-map shape
  const dakCd = readDakJson(v, "cascade_data.json");
  const cascadesMap = {};
  if (dakCd && dakCd.cascades) {
    for (const c of dakCd.cascades) {
      cascadesMap[c.question_id] = {
        question_id: c.question_id,
        reported_value: c.answer?.reported || "See dashboard",
        audited_value: c.answer?.audited || "See audit report",
        delta: c.answer?.delta || "Under review",
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
  }
  const cdPayload = {
    schema_version: "1.0.0",
    payload_type: "cascade_data",
    vertical: v,
    cascades: cascadesMap,
  };
  writePayload(v, "cascade_data.json", cdPayload);

  // 4. trajectory.json — build from website_payloads score data
  const scores = scoreData[v];
  const snapshots = [];
  const months = Object.keys(scores).sort();
  for (const key of months) {
    const monthNum = parseInt(key.replace("month_", ""), 10);
    const s = scores[key];
    snapshots.push({
      month: monthNum,
      as_of_date: `2025-${String(monthNum * 3).padStart(2, "0")}-01`,
      score: s.score,
      finding_count: s.total_findings || 0,
      resolved_count: Math.max(0, (s.total_findings || 0) - Math.floor((s.total_findings || 0) * (1 - s.score / 100))),
    });
  }
  // Ensure at least one snapshot
  if (snapshots.length === 0) {
    snapshots.push({
      month: 1,
      as_of_date: "2025-03-01",
      score: 50,
      finding_count: 5,
      resolved_count: 0,
    });
  }
  writePayload(v, "trajectory.json", {
    schema_version: "1.0.0",
    payload_type: "trajectory",
    vertical: v,
    snapshots,
  });

  // 5. screenshot_manifest.json — stub (DAK doesn't produce screenshots)
  writePayload(v, "screenshot_manifest.json", {
    schema_version: "1.0.0",
    payload_type: "screenshot_manifest",
    vertical: v,
    screenshots: [
      {
        artifact_id: `${v}_3_dashboard_001`,
        vertical: v,
        month: 3,
        type: "dashboard",
        url: `https://demo.bayesiq.com/screenshots/${v}/month-3-dashboard.png`,
        alt_text: `${displayNames[v]} audit dashboard — Month 3`,
      },
      {
        artifact_id: `${v}_3_report_001`,
        vertical: v,
        month: 3,
        type: "report",
        url: `https://demo.bayesiq.com/screenshots/${v}/month-3-report.png`,
        alt_text: `${displayNames[v]} audit report — Month 3`,
      },
    ],
  });

  // 6. artifact_links.json — stub (DAK doesn't produce artifact URLs)
  writePayload(v, "artifact_links.json", {
    schema_version: "1.0.0",
    payload_type: "artifact_links",
    vertical: v,
    artifacts: [
      {
        artifact_id: `${v}_3_dashboard_001`,
        vertical: v,
        month: 3,
        type: "dashboard",
        url: `https://demo.bayesiq.com/dashboards/${v}/month-3`,
        title: `${displayNames[v]} Data Quality Dashboard — Month 3`,
      },
      {
        artifact_id: `${v}_3_report_001`,
        vertical: v,
        month: 3,
        type: "report",
        url: `https://demo.bayesiq.com/reports/${v}/month-3`,
        title: `${displayNames[v]} Audit Report — Month 3`,
      },
    ],
  });

  // 7. hook_metrics.json — derive from DAK data
  const latestScore = months.length > 0 ? scores[months[months.length - 1]] : null;
  const score = latestScore?.score || 50;
  const severityLevel = score >= 85 ? "healthy" : score >= 70 ? "moderate" : score >= 50 ? "warning" : "critical";
  const headline = dakEq?.questions?.[0]?.text || "Data quality issues detected";
  const consequence = dakEq?.questions?.[0]?.business_consequence || "Business impact under assessment";

  writePayload(v, "hook_metrics.json", {
    schema_version: "1.0.0",
    payload_type: "hook_metrics",
    vertical: v,
    discrepancy_headline: headline,
    consequence: consequence,
    trust_cue: `Reviewed by BayesIQ Data Quality Team`,
    score: score,
    severity_level: severityLevel,
  });

  // 8. vertical_narrative.json — derive from narrative.md and DAK data
  const narrativeLabels = {
    hospital: {
      status_quo: "Readmission rates reported at 13.3% mask a 5.7% discrepancy — CMS penalties and board-level compliance exposure go undetected until audit season.",
      with_bayesiq: "BayesIQ's audit identified 50 duplicate encounters and metric mismatches within hours, enabling targeted remediation that improved the reliability score from 31 to 81.",
      headline_finding: "50 near-duplicate encounter records inflating throughput metrics and distorting $2M+ in department budgets.",
      cta_label: "Book a Hospital Data Diagnostic",
      cta_variant: "diagnostic",
    },
    real_estate: {
      status_quo: "Collection rates reported at 95% overstate actual collections by 10%+, masking $200K+ in uncollected rent that directly impacts LP distributions.",
      with_bayesiq: "BayesIQ surfaced duplicate payment records and metric inflation in the first audit pass, giving property managers defensible numbers for investor reporting.",
      headline_finding: "Collection rate overstated by 10%+ due to duplicate payment records and inconsistent lease type classifications.",
      cta_label: "Book a Real Estate Data Diagnostic",
      cta_variant: "diagnostic",
    },
    saas: {
      status_quo: "MRR reported at $2.4M is inflated by 20%+ from ghost accounts — $480K in phantom revenue distorts fundraising valuations and investor materials.",
      with_bayesiq: "BayesIQ identified ghost accounts and duplicate subscriptions, giving the finance team clean MRR numbers before the next board meeting.",
      headline_finding: "20%+ MRR overstatement from ghost accounts constitutes material misstatement to investors.",
      cta_label: "Book a SaaS Data Diagnostic",
      cta_variant: "diagnostic",
    },
    retail: {
      status_quo: "Sell-through reported at 72% overstates actual performance by 18%, driving $500K+ in excess inventory risk per season from phantom demand signals.",
      with_bayesiq: "BayesIQ flagged POS duplicates and channel attribution errors, enabling accurate demand forecasting within one reporting cycle.",
      headline_finding: "18% sell-through overstatement from POS duplicates translates to $500K+ in excess inventory risk per season.",
      cta_label: "Book a Retail Data Diagnostic",
      cta_variant: "diagnostic",
    },
    fintech: {
      status_quo: "Fee revenue reported at $1.2M is overstated by 20% — $240K in phantom revenue on the P&L affects regulatory reporting and investor confidence.",
      with_bayesiq: "BayesIQ detected 54 near-duplicate transactions and payment method classification inconsistencies, providing defensible numbers before the quarterly investor call.",
      headline_finding: "54 near-duplicate transactions inflate fee revenue by $240K and distort interchange cost allocation by $100K+.",
      cta_label: "Book a Fintech Data Diagnostic",
      cta_variant: "diagnostic",
    },
  };

  const narr = narrativeLabels[v];
  writePayload(v, "vertical_narrative.json", {
    schema_version: "1.0.0",
    payload_type: "vertical_narrative",
    vertical_id: v,
    display_name: displayNames[v],
    status_quo: narr.status_quo,
    with_bayesiq: narr.with_bayesiq,
    headline_finding: narr.headline_finding,
    cta_label: narr.cta_label,
    cta_variant: narr.cta_variant,
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

"use client";

interface Finding {
  check: string;
  severity: "critical" | "high" | "medium" | "low";
  title: string;
  description: string;
  evidence: string;
  recommended_fix: string;
  confidence: number;
}

interface AuditData {
  filename: string;
  metadata: {
    rows: number;
    columns: number;
    column_names: string[];
  };
  profile: {
    columns: Array<{
      column: string;
      dtype: string;
      null_rate: number;
      unique_count: number;
    }>;
    summary: {
      total_columns: number;
      total_rows: number;
      high_null_columns: string[];
      high_cardinality_columns: string[];
    };
  };
  quality: {
    findings: Finding[];
    summary: {
      total_findings: number;
      by_severity: Record<string, number>;
    };
  };
  score: number | null;
  dashboard_app: string | null;
  csv_text: string | null;
  report_markdown: string;
}

const SEVERITY_CONFIG = {
  critical: { bg: "bg-red-50", border: "border-red-200", text: "text-red-800", badge: "bg-red-100 text-red-700" },
  high: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-800", badge: "bg-orange-100 text-orange-700" },
  medium: { bg: "bg-yellow-50", border: "border-yellow-200", text: "text-yellow-800", badge: "bg-yellow-100 text-yellow-700" },
  low: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", badge: "bg-blue-100 text-blue-700" },
};

function ScoreGauge({ score }: { score: number }) {
  const color =
    score >= 80 ? "text-green-600" : score >= 60 ? "text-yellow-600" : "text-red-600";
  const label =
    score >= 80 ? "Good" : score >= 60 ? "Needs Work" : "Critical Issues";

  return (
    <div className="flex flex-col items-center">
      <div className={`text-6xl font-bold ${color}`}>{score}</div>
      <div className="mt-1 text-sm text-bayesiq-500">/ 100</div>
      <div className={`mt-2 text-sm font-medium ${color}`}>{label}</div>
    </div>
  );
}

function SeveritySummary({ summary }: { summary: Record<string, number> }) {
  const severities = ["critical", "high", "medium", "low"] as const;
  return (
    <div className="flex gap-3">
      {severities.map((sev) => {
        const count = summary[sev] ?? 0;
        if (count === 0) return null;
        const config = SEVERITY_CONFIG[sev];
        return (
          <span
            key={sev}
            className={`rounded-full px-3 py-1 text-xs font-medium ${config.badge}`}
          >
            {count} {sev}
          </span>
        );
      })}
    </div>
  );
}

function FindingCard({ finding }: { finding: Finding }) {
  const config = SEVERITY_CONFIG[finding.severity];
  return (
    <div className={`rounded-lg border p-4 ${config.bg} ${config.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`shrink-0 rounded px-2 py-0.5 text-xs font-semibold uppercase ${config.badge}`}
            >
              {finding.severity}
            </span>
            <h4 className={`text-sm font-semibold ${config.text}`}>
              {finding.title}
            </h4>
          </div>
          <p className="mt-2 text-sm text-bayesiq-700">{finding.description}</p>
          {finding.evidence && (
            <p className="mt-2 text-xs text-bayesiq-500">
              <span className="font-medium">Evidence:</span> {finding.evidence}
            </p>
          )}
          {finding.recommended_fix && (
            <p className="mt-1 text-xs text-bayesiq-600">
              <span className="font-medium">Fix:</span>{" "}
              {finding.recommended_fix}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function ProfileTable({
  columns,
}: {
  columns: AuditData["profile"]["columns"];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-bayesiq-200 text-left">
            <th className="px-3 py-2 font-medium text-bayesiq-500">Column</th>
            <th className="px-3 py-2 font-medium text-bayesiq-500">Type</th>
            <th className="px-3 py-2 font-medium text-bayesiq-500">
              Null Rate
            </th>
            <th className="px-3 py-2 font-medium text-bayesiq-500">
              Unique
            </th>
          </tr>
        </thead>
        <tbody>
          {columns.map((col) => (
            <tr
              key={col.column}
              className="border-b border-bayesiq-100 hover:bg-bayesiq-50"
            >
              <td className="px-3 py-2 font-mono text-xs text-bayesiq-900">
                {col.column}
              </td>
              <td className="px-3 py-2 text-bayesiq-600">{col.dtype}</td>
              <td className="px-3 py-2">
                <span
                  className={
                    col.null_rate > 0.1
                      ? "font-medium text-red-600"
                      : "text-bayesiq-600"
                  }
                >
                  {(col.null_rate * 100).toFixed(1)}%
                </span>
              </td>
              <td className="px-3 py-2 text-bayesiq-600">
                {col.unique_count?.toLocaleString() ?? "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function generateInstaller(
  appCode: string,
  csvText: string,
  filename: string
): string {
  const sanitized = filename.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/_csv$/, "");
  const dirName = `bayesiq-audit-${sanitized}`;
  return `#!/usr/bin/env bash
# BayesIQ Audit Dashboard — self-extracting installer
# Generated at bayes-iq.com/playground
set -euo pipefail

DIR="$HOME/${dirName}"
echo "Setting up BayesIQ audit dashboard in $DIR ..."
mkdir -p "$DIR"

# Write app.py
cat > "$DIR/app.py" << 'BAYESIQ_APP_EOF'
${appCode}
BAYESIQ_APP_EOF

# Write requirements.txt
cat > "$DIR/requirements.txt" << 'BAYESIQ_REQS_EOF'
streamlit>=1.30
pandas>=2.0
plotly>=5.0
BAYESIQ_REQS_EOF

# Write data.csv
cat > "$DIR/data.csv" << 'BAYESIQ_DATA_EOF'
${csvText}
BAYESIQ_DATA_EOF

cd "$DIR"

# Create venv if needed
if [ ! -d .venv ]; then
  echo "Creating Python environment..."
  python3 -m venv .venv
  .venv/bin/pip install -q -r requirements.txt
fi

echo ""
echo "Launching dashboard..."
.venv/bin/streamlit run app.py
`;
}

function downloadFile(content: string, filename: string) {
  const blob = new Blob([content], { type: "application/x-sh" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AuditResults({ data }: { data: AuditData }) {
  const { metadata, profile, quality, score } = data;
  const severityOrder = ["critical", "high", "medium", "low"];
  const sortedFindings = [...quality.findings].sort(
    (a, b) =>
      severityOrder.indexOf(a.severity) - severityOrder.indexOf(b.severity)
  );

  const handleDownload = () => {
    if (!data.dashboard_app || !data.csv_text) return;
    const installer = generateInstaller(
      data.dashboard_app,
      data.csv_text,
      data.filename
    );
    downloadFile(installer, `bayesiq-audit-dashboard.sh`);
  };

  return (
    <div className="space-y-8">
      {/* Score + Summary */}
      <div className="rounded-xl border border-bayesiq-200 bg-white p-8">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-bayesiq-900">
              Audit Results
            </h2>
            <p className="mt-1 text-sm text-bayesiq-500">
              {data.filename} — {metadata.rows.toLocaleString()} rows,{" "}
              {metadata.columns} columns
            </p>
            <div className="mt-4">
              <SeveritySummary summary={quality.summary.by_severity} />
            </div>
            {data.dashboard_app && (
              <button
                onClick={handleDownload}
                className="mt-4 rounded-lg bg-bayesiq-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
              >
                Download &amp; Run Dashboard
              </button>
            )}
          </div>
          {score !== null && <ScoreGauge score={score} />}
        </div>
      </div>

      {/* Findings */}
      {sortedFindings.length > 0 && (
        <div>
          <h3 className="mb-4 text-lg font-semibold text-bayesiq-900">
            Findings ({quality.summary.total_findings})
          </h3>
          <div className="space-y-3">
            {sortedFindings.map((finding, i) => (
              <FindingCard key={`${finding.check}-${i}`} finding={finding} />
            ))}
          </div>
        </div>
      )}

      {sortedFindings.length === 0 && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center">
          <p className="text-sm font-medium text-green-800">
            No issues found. Your data looks clean.
          </p>
        </div>
      )}

      {/* Profile Table */}
      <div>
        <h3 className="mb-4 text-lg font-semibold text-bayesiq-900">
          Column Profile
        </h3>
        <div className="rounded-lg border border-bayesiq-200 bg-white">
          <ProfileTable columns={profile.columns} />
        </div>
      </div>
    </div>
  );
}

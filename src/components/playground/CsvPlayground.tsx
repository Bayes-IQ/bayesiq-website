"use client";

import { useState, useCallback, useRef } from "react";
import { track } from "@vercel/analytics";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ColumnProfile {
  column: string;
  dtype: "string" | "int" | "float" | "datetime" | "boolean";
  nullCount: number;
  nullPct: number;
  uniqueCount: number;
  topValues: { value: string; count: number }[];
  min?: string | number;
  max?: string | number;
}

interface DatasetProfile {
  rowCount: number;
  columnCount: number;
  columns: ColumnProfile[];
  timestampField: string | null;
  dimensions: { column: string; uniqueValues: number; values: string[] }[];
}

type Stage = "idle" | "profiling" | "done" | "downloaded";

// ---------------------------------------------------------------------------
// CSV Parsing (client-side, no dependencies)
// ---------------------------------------------------------------------------

function parseCsv(text: string): { headers: string[]; rows: string[][] } {
  const lines = text.split("\n");
  if (lines.length === 0) return { headers: [], rows: [] };

  const parseLine = (line: string): string[] => {
    const fields: string[] = [];
    let current = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (inQuotes) {
        if (ch === '"' && line[i + 1] === '"') {
          current += '"';
          i++;
        } else if (ch === '"') {
          inQuotes = false;
        } else {
          current += ch;
        }
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        fields.push(current.trim());
        current = "";
      } else {
        current += ch;
      }
    }
    fields.push(current.trim());
    return fields;
  };

  const headers = parseLine(lines[0]);
  const rows: string[][] = [];
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (line === "") continue;
    rows.push(parseLine(line));
  }
  return { headers, rows };
}

// ---------------------------------------------------------------------------
// Profiling
// ---------------------------------------------------------------------------

const TS_NAMES = new Set([
  "timestamp", "created_at", "updated_at", "recorded_at",
  "last_activity", "event_time", "date", "time", "datetime",
]);

function inferDtype(values: string[]): ColumnProfile["dtype"] {
  const sample = values.filter((v) => v !== "").slice(0, 200);
  if (sample.length === 0) return "string";

  const boolVals = new Set(["true", "false", "0", "1", "yes", "no"]);
  if (sample.every((v) => boolVals.has(v.toLowerCase()))) return "boolean";

  if (sample.every((v) => /^-?\d+$/.test(v))) return "int";
  if (sample.every((v) => /^-?\d+\.?\d*$/.test(v) || /^-?\.\d+$/.test(v)))
    return "float";

  // datetime: try parsing a few
  const dateHits = sample
    .slice(0, 20)
    .filter((v) => !isNaN(Date.parse(v)) && v.length > 5).length;
  if (dateHits >= sample.slice(0, 20).length * 0.8) return "datetime";

  return "string";
}

function profileDataset(
  headers: string[],
  rows: string[][],
): DatasetProfile {
  const columns: ColumnProfile[] = headers.map((header, colIdx) => {
    const values = rows.map((r) => r[colIdx] ?? "");
    const nonEmpty = values.filter((v) => v !== "");
    const dtype = inferDtype(nonEmpty);
    const nullCount = values.length - nonEmpty.length;

    // Cardinality
    const counts = new Map<string, number>();
    for (const v of nonEmpty) {
      counts.set(v, (counts.get(v) ?? 0) + 1);
    }

    const sorted = [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const profile: ColumnProfile = {
      column: header,
      dtype,
      nullCount,
      nullPct: values.length > 0 ? Math.round((nullCount / values.length) * 100) : 0,
      uniqueCount: counts.size,
      topValues: sorted.map(([value, count]) => ({ value, count })),
    };

    if (dtype === "int" || dtype === "float") {
      const nums = nonEmpty.map(Number).filter((n) => !isNaN(n));
      if (nums.length > 0) {
        profile.min = Math.min(...nums);
        profile.max = Math.max(...nums);
      }
    }

    return profile;
  });

  // Detect timestamp field
  let timestampField: string | null = null;
  for (const col of columns) {
    if (col.dtype === "datetime") {
      timestampField = col.column;
      break;
    }
  }
  if (!timestampField) {
    for (const col of columns) {
      if (
        TS_NAMES.has(col.column.toLowerCase()) ||
        col.column.toLowerCase().endsWith("_at")
      ) {
        timestampField = col.column;
        break;
      }
    }
  }

  // Discover dimensions
  const dimensions = columns
    .filter(
      (c) =>
        c.dtype === "string" &&
        c.uniqueCount >= 2 &&
        c.uniqueCount <= 50 &&
        !c.column.toLowerCase().endsWith("_id") &&
        !c.column.toLowerCase().endsWith("_key"),
    )
    .map((c) => ({
      column: c.column,
      uniqueValues: c.uniqueCount,
      values: c.topValues.map((tv) => tv.value),
    }));

  return {
    rowCount: rows.length,
    columnCount: headers.length,
    columns,
    timestampField,
    dimensions,
  };
}

// ---------------------------------------------------------------------------
// Streamlit App Generation
// ---------------------------------------------------------------------------

function generateStreamlitApp(profile: DatasetProfile): string {
  const { columns, timestampField, dimensions } = profile;
  const sidebarDims = dimensions.filter((d) => d.uniqueValues <= 20);

  const numericCols = columns.filter(
    (c) =>
      (c.dtype === "int" || c.dtype === "float") &&
      !c.column.toLowerCase().endsWith("_id") &&
      !c.column.toLowerCase().endsWith("_key"),
  );

  const lines: string[] = [
    '"""BayesIQ Dashboard — Generated at bayesiq.com/playground"""',
    "",
    "import os",
    "import pandas as pd",
    "import plotly.express as px",
    "import streamlit as st",
    "",
    'st.set_page_config(page_title="BayesIQ Dashboard", layout="wide")',
    "",
    "",
    "def prepare(df):",
    '    """Clean and prepare the dataframe."""',
  ];

  if (timestampField) {
    lines.push(`    if "${timestampField}" in df.columns:`);
    lines.push(
      `        df["${timestampField}"] = pd.to_datetime(df["${timestampField}"], utc=True, errors="coerce")`,
    );
  }

  lines.push("    return df");
  lines.push("");
  lines.push("");
  lines.push("def main():");
  lines.push('    st.title("BayesIQ Data Dashboard")');
  lines.push("");
  lines.push("    # Load data: try data.csv first, otherwise show uploader");
  lines.push('    data_path = os.path.join(os.path.dirname(__file__), "data.csv")');
  lines.push("    if os.path.exists(data_path):");
  lines.push("        df = prepare(pd.read_csv(data_path))");
  lines.push('        st.sidebar.file_uploader("Replace CSV", type=["csv"], key="replace",');
  lines.push('            on_change=lambda: None)');
  lines.push('        replacement = st.session_state.get("replace")');
  lines.push("        if replacement is not None:");
  lines.push("            df = prepare(pd.read_csv(replacement))");
  lines.push("    else:");
  lines.push('        uploaded = st.file_uploader("Drop your CSV here to get started", type=["csv"])');
  lines.push("        if uploaded is None:");
  lines.push("            st.stop()");
  lines.push("        df = prepare(pd.read_csv(uploaded))");
  lines.push("");

  // Sidebar filters
  lines.push('    st.sidebar.header("Filters")');
  lines.push("");

  if (timestampField) {
    lines.push(`    if "${timestampField}" in df.columns:`);
    lines.push(
      `        min_date = df["${timestampField}"].min()`,
    );
    lines.push(
      `        max_date = df["${timestampField}"].max()`,
    );
    lines.push("        if pd.notna(min_date) and pd.notna(max_date):");
    lines.push('            date_range = st.sidebar.date_input(');
    lines.push('                "Date Range",');
    lines.push(
      "                value=(min_date.date(), max_date.date()),",
    );
    lines.push("                min_value=min_date.date(),");
    lines.push("                max_value=max_date.date(),");
    lines.push("            )");
    lines.push("            if len(date_range) == 2:");
    lines.push(
      `                df = df[(df["${timestampField}"].dt.date >= date_range[0]) & (df["${timestampField}"].dt.date <= date_range[1])]`,
    );
    lines.push("");
  }

  for (const dim of sidebarDims) {
    const safeVar = dim.column.toLowerCase().replace(/[^a-z0-9_]/g, "_");
    lines.push(`    if "${dim.column}" in df.columns:`);
    lines.push(
      `        ${safeVar}_opts = sorted(df["${dim.column}"].dropna().unique().tolist())`,
    );
    lines.push(`        ${safeVar}_sel = st.sidebar.multiselect(`);
    lines.push(`            "${dim.column}",`);
    lines.push(`            options=${safeVar}_opts,`);
    lines.push(`            default=${safeVar}_opts,`);
    lines.push("        )");
    lines.push(`        df = df[df["${dim.column}"].isin(${safeVar}_sel)]`);
    lines.push("");
  }

  lines.push('    st.sidebar.metric("Rows (filtered)", f"{len(df):,}")');
  lines.push("");

  // Tabs
  lines.push('    tabs = st.tabs(["Overview", "Metrics", "Raw Data"])');
  lines.push("");

  // Overview tab
  lines.push("    with tabs[0]:");
  lines.push('        st.header("Dataset Overview")');
  lines.push(
    `        st.markdown(f"**{len(df):,}** rows and **{len(df.columns)}** columns")`,
  );
  lines.push("");
  lines.push("        col1, col2 = st.columns(2)");
  lines.push("        with col1:");
  lines.push('            st.subheader("Column Types")');
  lines.push(
    "            type_counts = df.dtypes.astype(str).value_counts().reset_index()",
  );
  lines.push('            type_counts.columns = ["Type", "Count"]');
  lines.push(
    '            fig = px.pie(type_counts, names="Type", values="Count", title="Column Types")',
  );
  lines.push("            st.plotly_chart(fig, use_container_width=True)");
  lines.push("        with col2:");
  lines.push('            st.subheader("Null Counts")');
  lines.push(
    "            nulls = df.isnull().sum().reset_index()",
  );
  lines.push('            nulls.columns = ["Column", "Nulls"]');
  lines.push('            nulls = nulls[nulls["Nulls"] > 0].sort_values("Nulls", ascending=False)');
  lines.push("            if len(nulls) > 0:");
  lines.push(
    '                fig = px.bar(nulls, x="Column", y="Nulls", title="Null Values by Column")',
  );
  lines.push(
    "                st.plotly_chart(fig, use_container_width=True)",
  );
  lines.push("            else:");
  lines.push('                st.success("No null values found!")');
  lines.push("");

  // Metrics tab
  lines.push("    with tabs[1]:");
  lines.push('        st.header("Metrics")');
  lines.push("");

  if (numericCols.length > 0 && timestampField) {
    for (const col of numericCols.slice(0, 6)) {
      const humanName = col.column.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      lines.push(`        if "${col.column}" in df.columns and "${timestampField}" in df.columns:`);
      lines.push(`            st.subheader("${humanName}")`);
      lines.push(
        `            grouped = df.groupby(df["${timestampField}"].dt.to_period("M"))["${col.column}"].sum().reset_index()`,
      );
      lines.push(
        `            grouped.columns = ["period", "${col.column}"]`,
      );
      lines.push(
        '            grouped["period"] = grouped["period"].astype(str)',
      );
      lines.push(
        `            fig = px.bar(grouped, x="period", y="${col.column}", title="${humanName} Over Time")`,
      );
      lines.push(
        "            st.plotly_chart(fig, use_container_width=True)",
      );
      lines.push("            st.divider()");
      lines.push("");
    }
  } else if (numericCols.length > 0) {
    for (const col of numericCols.slice(0, 6)) {
      const humanName = col.column.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
      lines.push(`        if "${col.column}" in df.columns:`);
      lines.push(
        `            st.metric("${humanName} (Total)", f"{df['${col.column}'].sum():,.2f}")`,
      );
    }
    lines.push("");
  } else {
    lines.push(
      '        st.info("No numeric columns detected for metric charts.")',
    );
    lines.push("");
  }

  // Raw data tab
  lines.push("    with tabs[2]:");
  lines.push('        st.header("Raw Data")');
  lines.push(
    "        st.dataframe(df.head(1000), use_container_width=True)",
  );
  lines.push("");
  lines.push("");
  lines.push('if __name__ == "__main__":');
  lines.push("    main()");
  lines.push("");

  return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Self-extracting script generation
// ---------------------------------------------------------------------------

function generateInstaller(appCode: string, csvData: string): string {
  return `#!/usr/bin/env bash
set -e

# -----------------------------------------------------------------
# BayesIQ Dashboard — self-extracting installer + launcher
# One file. One command. No unzipping.
# -----------------------------------------------------------------

DIR="$HOME/bayesiq-dashboard"

echo ""
echo "  BayesIQ Dashboard"
echo "  ────────────────────────────"
echo ""

# Check for Python
if ! command -v python3 &> /dev/null; then
    echo "  Python 3 is not installed."
    echo ""
    echo "  Install it from: https://www.python.org/downloads/"
    echo ""
    exit 1
fi

PY_VERSION=$(python3 -c 'import sys; print(f"{sys.version_info.major}.{sys.version_info.minor}")')
echo "  Python $PY_VERSION found"

# Create project directory
mkdir -p "$DIR"
cd "$DIR"

# Write app.py
cat > app.py << 'BAYESIQ_APP_EOF'
${appCode}
BAYESIQ_APP_EOF

# Write requirements.txt
cat > requirements.txt << 'BAYESIQ_REQ_EOF'
streamlit>=1.30.0
pandas>=2.0.0
plotly>=5.18.0
BAYESIQ_REQ_EOF

# Write data.csv
cat > data.csv << 'BAYESIQ_CSV_EOF'
${csvData}
BAYESIQ_CSV_EOF

# Create venv if needed
if [ ! -d ".venv" ]; then
    echo "  Creating virtual environment..."
    python3 -m venv .venv
fi

source .venv/bin/activate

# Install deps if needed
if ! python3 -c "import streamlit" 2>/dev/null; then
    echo "  Installing dependencies (one-time)..."
    pip install -q -r requirements.txt
fi

echo ""
echo "  Launching dashboard..."
echo "  (Press Ctrl+C to stop)"
echo ""
echo "  Files saved to: $DIR"
echo ""

streamlit run app.py
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

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export default function CsvPlayground() {
  const [stage, setStage] = useState<Stage>("idle");
  const [profile, setProfile] = useState<DatasetProfile | null>(null);
  const [fileName, setFileName] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [csvText, setCsvText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const processFile = useCallback((file: File) => {
    if (!file.name.endsWith(".csv")) {
      setError("Please upload a .csv file.");
      return;
    }
    if (file.size > 50 * 1024 * 1024) {
      setError("File too large. Maximum size is 50 MB.");
      return;
    }

    setError(null);
    setFileName(file.name);
    setStage("profiling");
    track("playground_csv_uploaded");

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        setCsvText(text);
        const { headers, rows } = parseCsv(text);
        if (headers.length === 0 || rows.length === 0) {
          setError("Could not parse CSV — check the file format.");
          setStage("idle");
          return;
        }
        const result = profileDataset(headers, rows);
        setProfile(result);
        setStage("done");
        track("playground_profile_complete", {
          rows: result.rowCount,
          columns: result.columnCount,
        });
      } catch {
        setError("Failed to profile the CSV. The file may be malformed.");
        setStage("idle");
      }
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) processFile(file);
    },
    [processFile],
  );

  const handleDownload = useCallback(() => {
    if (!profile) return;
    track("playground_download");
    const appCode = generateStreamlitApp(profile);
    const installer = generateInstaller(appCode, csvText);
    downloadFile(installer, "bayesiq-dashboard.sh");
    setStage("downloaded");
  }, [profile, csvText]);

  const reset = useCallback(() => {
    setStage("idle");
    setProfile(null);
    setFileName("");
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }, []);

  // --- Idle / Drop zone ---
  if (stage === "idle" || stage === "profiling") {
    return (
      <div className="space-y-4">
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-16 transition-colors ${
            dragOver
              ? "border-bayesiq-500 bg-bayesiq-50"
              : "border-bayesiq-300 hover:border-bayesiq-500 hover:bg-bayesiq-50/50"
          }`}
        >
          {stage === "profiling" ? (
            <>
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-bayesiq-300 border-t-bayesiq-900" />
              <p className="mt-4 text-sm text-bayesiq-600">
                Profiling {fileName}...
              </p>
            </>
          ) : (
            <>
              <svg
                className="h-12 w-12 text-bayesiq-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="mt-4 text-sm font-medium text-bayesiq-700">
                Drop a CSV file here, or click to browse
              </p>
              <p className="mt-1 text-xs text-bayesiq-400">
                Max 50 MB. All processing happens in your browser.
              </p>
            </>
          )}
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileInput}
          className="hidden"
        />
        {error && (
          <p className="text-center text-sm text-red-600">{error}</p>
        )}
      </div>
    );
  }

  // --- Results ---
  if (!profile) return null;

  const isWindows =
    typeof navigator !== "undefined" &&
    /win/i.test(navigator.platform);

  const launchCommand = "bash ~/Downloads/bayesiq-dashboard.sh";

  const copyCommand = () => {
    navigator.clipboard.writeText(launchCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Post-download launch card */}
      {stage === "downloaded" && (
        <div className="rounded-xl border-2 border-green-200 bg-green-50/50 p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-green-100">
              <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-bayesiq-900">
                Dashboard downloaded
              </h3>
              <p className="mt-1 text-sm text-bayesiq-600">
                Open Terminal and paste this command:
              </p>

              {/* Copyable command */}
              <div className="mt-4 flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-bayesiq-900 px-4 py-3 font-mono text-sm text-green-400">
                  {launchCommand}
                </code>
                <button
                  onClick={copyCommand}
                  className="shrink-0 rounded-lg border border-bayesiq-300 bg-white px-4 py-3 text-sm font-medium text-bayesiq-700 transition-colors hover:border-bayesiq-500"
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <p className="mt-4 text-xs text-bayesiq-500">
                This installs Python packages in an isolated environment and opens the dashboard in your browser.
                {isWindows && (
                  <> On Windows, use <a href="https://learn.microsoft.com/en-us/windows/wsl/install" className="underline" target="_blank" rel="noopener noreferrer">WSL</a> or Git Bash.</>
                )}
              </p>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setStage("done")}
                  className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
                >
                  Back to profile
                </button>
                <button
                  onClick={reset}
                  className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
                >
                  Try another file
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Summary bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-lg border border-bayesiq-200 bg-bayesiq-50/50 px-6 py-4">
        <div>
          <p className="text-sm font-medium text-bayesiq-900">{fileName}</p>
          <p className="text-xs text-bayesiq-500">
            {profile.rowCount.toLocaleString()} rows,{" "}
            {profile.columnCount} columns
            {profile.timestampField && (
              <> &middot; Timestamp: <code className="text-bayesiq-700">{profile.timestampField}</code></>
            )}
          </p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleDownload}
            className="rounded-lg bg-bayesiq-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800"
          >
            {stage === "downloaded" ? "Download again" : "Download & Run"}
          </button>
          <button
            onClick={reset}
            className="rounded-lg border border-bayesiq-300 px-4 py-2.5 text-sm font-medium text-bayesiq-700 transition-colors hover:border-bayesiq-500"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Column profiles */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-bayesiq-900">
          Column Profiles
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-bayesiq-200 text-xs uppercase tracking-wider text-bayesiq-500">
                <th className="py-3 pr-4">Column</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Nulls</th>
                <th className="py-3 pr-4">Unique</th>
                <th className="py-3 pr-4">Top Values</th>
                <th className="py-3">Range</th>
              </tr>
            </thead>
            <tbody>
              {profile.columns.map((col) => (
                <tr
                  key={col.column}
                  className="border-b border-bayesiq-100 last:border-0"
                >
                  <td className="py-3 pr-4 font-medium text-bayesiq-900">
                    {col.column}
                  </td>
                  <td className="py-3 pr-4">
                    <span className="rounded bg-bayesiq-100 px-2 py-0.5 text-xs text-bayesiq-700">
                      {col.dtype}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    {col.nullCount > 0 ? (
                      <span className="text-amber-600">
                        {col.nullCount.toLocaleString()} ({col.nullPct}%)
                      </span>
                    ) : (
                      <span className="text-green-600">0</span>
                    )}
                  </td>
                  <td className="py-3 pr-4">{col.uniqueCount.toLocaleString()}</td>
                  <td className="py-3 pr-4 text-xs text-bayesiq-600">
                    {col.topValues
                      .slice(0, 3)
                      .map((tv) => `${tv.value} (${tv.count})`)
                      .join(", ")}
                  </td>
                  <td className="py-3 text-xs text-bayesiq-600">
                    {col.min !== undefined && col.max !== undefined
                      ? `${col.min} — ${col.max}`
                      : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dimensions detected */}
      {profile.dimensions.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-bayesiq-900">
            Detected Dimensions
          </h2>
          <div className="flex flex-wrap gap-2">
            {profile.dimensions.map((dim) => (
              <span
                key={dim.column}
                className="rounded-full border border-bayesiq-200 bg-white px-3 py-1 text-sm text-bayesiq-700"
              >
                {dim.column}{" "}
                <span className="text-bayesiq-400">
                  ({dim.uniqueValues} values)
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

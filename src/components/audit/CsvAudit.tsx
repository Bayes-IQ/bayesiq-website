"use client";

import { useState, useCallback } from "react";
import AuditResults from "./AuditResults";

type Stage = "idle" | "uploading" | "auditing" | "done" | "error";

export default function CsvAudit() {
  const [stage, setStage] = useState<Stage>("idle");
  const [error, setError] = useState<string | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [results, setResults] = useState<any>(null);
  const [dragOver, setDragOver] = useState(false);

  const runAudit = useCallback(async (file: File) => {
    setError(null);
    setStage("uploading");

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a CSV file.");
      setStage("error");
      return;
    }

    if (file.size > 50 * 1024 * 1024) {
      setError("File too large. Maximum size is 50 MB.");
      setStage("error");
      return;
    }

    setStage("auditing");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/audit", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error ?? "Audit failed. Please try again.");
        setStage("error");
        return;
      }

      setResults(data);
      setStage("done");
    } catch {
      setError("Could not reach the audit service. Please try again later.");
      setStage("error");
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) runAudit(file);
    },
    [runAudit]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) runAudit(file);
    },
    [runAudit]
  );

  const reset = useCallback(() => {
    setStage("idle");
    setResults(null);
    setError(null);
  }, []);

  if (stage === "done" && results) {
    return (
      <div>
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-bayesiq-500">
            Audit complete for{" "}
            <span className="font-medium text-bayesiq-900">
              {results.filename}
            </span>
          </p>
          <button
            onClick={reset}
            className="text-sm font-medium text-bayesiq-600 transition-colors hover:text-bayesiq-900"
          >
            Audit another file
          </button>
        </div>
        <AuditResults data={results} />
      </div>
    );
  }

  return (
    <div>
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`flex min-h-[200px] flex-col items-center justify-center rounded-xl border-2 border-dashed p-12 text-center transition-colors ${
          dragOver
            ? "border-accent bg-blue-50"
            : "border-bayesiq-200 bg-bayesiq-50 hover:border-bayesiq-300"
        }`}
      >
        {stage === "idle" || stage === "error" ? (
          <>
            <p className="text-lg font-medium text-bayesiq-700">
              Drop a CSV file here
            </p>
            <p className="mt-1 text-sm text-bayesiq-400">
              or click to browse — 50 MB max
            </p>
            <label className="mt-4 cursor-pointer rounded-lg bg-bayesiq-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-bayesiq-800">
              Choose File
              <input
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
              />
            </label>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-bayesiq-300 border-t-bayesiq-900" />
            <p className="text-sm font-medium text-bayesiq-700">
              {stage === "uploading"
                ? "Uploading..."
                : "Running audit — this may take 10-30 seconds..."}
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3">
          <p className="text-sm text-red-800">{error}</p>
          <button
            onClick={reset}
            className="mt-2 text-sm font-medium text-red-600 hover:text-red-800"
          >
            Try again
          </button>
        </div>
      )}
    </div>
  );
}

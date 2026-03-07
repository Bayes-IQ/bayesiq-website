"""BayesIQ Audit API — lightweight FastAPI wrapper around the audit kit pipeline.

Accepts a CSV upload, runs profiling + quality checks + report generation,
and returns structured JSON with findings, score, and profile data.
"""

import io
import sys
import tempfile
from pathlib import Path

from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# Add the audit kit to the Python path
AUDIT_KIT_PATH = Path(__file__).resolve().parent.parent.parent / "bayesiq-data-audit-kit"
if AUDIT_KIT_PATH.exists():
    sys.path.insert(0, str(AUDIT_KIT_PATH))

import pandas as pd
from audit.dataset_loader import run as load_dataset
from audit.schema_profiler import run as profile_schema
from audit.quality_checker import run as check_quality
from audit.report_generator import run as generate_report

app = FastAPI(title="BayesIQ Audit API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://bayes-iq.com",
        "https://www.bayes-iq.com",
    ],
    allow_methods=["POST"],
    allow_headers=["*"],
)

MAX_FILE_SIZE = 5 * 1024 * 1024  # 5 MB


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/audit")
async def run_audit(file: UploadFile):
    # Validate file type
    if not file.filename or not file.filename.lower().endswith(".csv"):
        raise HTTPException(400, "Only CSV files are supported.")

    # Read and validate size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            413, f"File too large. Maximum size is {MAX_FILE_SIZE // (1024 * 1024)} MB."
        )
    if len(contents) == 0:
        raise HTTPException(400, "File is empty.")

    # Write to temp file (dataset_loader expects a path)
    with tempfile.NamedTemporaryFile(suffix=".csv", delete=False) as tmp:
        tmp.write(contents)
        tmp_path = tmp.name

    try:
        # Load
        config = {"row_limit": 50_000}
        loader_result = load_dataset(tmp_path, config)
        df = loader_result["dataframe"]
        metadata = loader_result["metadata"]

        # Profile
        profile = profile_schema(df, config)

        # Quality checks
        quality = check_quality(df, config)

        # Generate report (writes to temp dir)
        with tempfile.TemporaryDirectory() as out_dir:
            report_config = {
                "dataset": file.filename,
                "output_dir": out_dir,
            }
            report = generate_report(metadata, profile, quality, report_config)

        # Build response
        return {
            "status": "ok",
            "filename": file.filename,
            "metadata": {
                "rows": metadata["row_count"],
                "columns": metadata["column_count"],
                "column_names": metadata["columns"],
            },
            "profile": {
                "columns": profile["columns"],
                "summary": profile["summary"],
            },
            "quality": {
                "findings": quality["findings"],
                "summary": quality["summary"],
            },
            "score": _extract_score(report.get("report_markdown", "")),
            "report_markdown": report.get("report_markdown", ""),
        }

    except Exception as e:
        raise HTTPException(500, f"Audit failed: {str(e)}")

    finally:
        Path(tmp_path).unlink(missing_ok=True)


def _extract_score(markdown: str) -> int | None:
    """Pull the 0-100 score from the report markdown."""
    import re
    for line in markdown.splitlines():
        if "score" in line.lower() and "/" in line:
            match = re.search(r"(\d{1,3})\s*/\s*100", line)
            if match:
                return int(match.group(1))
    return None

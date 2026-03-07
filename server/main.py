"""BayesIQ Audit API — lightweight FastAPI wrapper around the audit kit pipeline.

Accepts a CSV upload, runs profiling + quality checks + report generation +
dashboard generation, and returns structured JSON with findings, score,
profile data, and a downloadable dashboard app.
"""

import json
import re
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
from audit.assumptions_generator import run as generate_assumptions
from audit.metrics_spec_generator import run as generate_metrics_spec
from audit.dashboard_generator import run as generate_dashboard

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

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB


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

    # Use a single work directory for the entire pipeline — temp file, report
    # artifacts, and dashboard all live here until the response is built.
    import shutil
    work_dir = tempfile.mkdtemp(prefix="bayesiq_audit_")
    tmp_path = str(Path(work_dir) / "upload.csv")
    Path(tmp_path).write_bytes(contents)
    out_dir = str(Path(work_dir) / "output")
    Path(out_dir).mkdir()

    print(f"[AUDIT] work_dir={work_dir}")
    print(f"[AUDIT] tmp_path={tmp_path} exists={Path(tmp_path).exists()} size={Path(tmp_path).stat().st_size}")

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

        # Generate report
        report_config = {
            "dataset": file.filename,
            "output_dir": out_dir,
        }
        report = generate_report(metadata, profile, quality, report_config)

        # Generate assumptions + metrics spec (needed by dashboard)
        try:
            generate_assumptions(out_dir, config)
        except Exception:
            pass  # Non-critical

        try:
            generate_metrics_spec(out_dir, config)
        except Exception:
            pass  # Non-critical

        # Generate dashboard
        dashboard_app = None
        try:
            dash_config = {
                "dashboard_output_dir": str(Path(out_dir) / "dashboard"),
                "dataset_path": "data.csv",
            }
            dash_result = generate_dashboard(out_dir, dash_config)
            app_py_path = Path(dash_result.get("output_dir", "")) / "app.py"
            if app_py_path.exists():
                dashboard_app = app_py_path.read_text()
        except Exception:
            pass  # Dashboard generation is best-effort

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
            "dashboard_app": dashboard_app,
            "csv_text": contents.decode("utf-8", errors="replace"),
        }

    except Exception as e:
        raise HTTPException(500, f"Audit failed: {str(e)}")

    finally:
        shutil.rmtree(work_dir, ignore_errors=True)


def _extract_score(markdown: str) -> int | None:
    """Pull the 0-100 score from the report markdown."""
    for line in markdown.splitlines():
        if "score" in line.lower() and "/" in line:
            match = re.search(r"(\d{1,3})\s*/\s*100", line)
            if match:
                return int(match.group(1))
    return None

"""BayesIQ Audit API — lightweight FastAPI wrapper around the audit kit pipeline.

Accepts a CSV upload, runs profiling + quality checks + report generation +
dashboard generation, and returns structured JSON with findings, score,
profile data, and a downloadable dashboard app.
"""

import asyncio
import hashlib
import logging
import os
import re
import shutil
import sys
import tempfile
import time
from collections import defaultdict
from concurrent.futures import ThreadPoolExecutor
from functools import partial
from pathlib import Path

from fastapi import FastAPI, UploadFile, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware

# Add the audit kit to the Python path — check Docker location first, then local dev
AUDIT_KIT_PATH = Path(__file__).resolve().parent / "bayesiq-data-audit-kit"
if not AUDIT_KIT_PATH.exists():
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

logger = logging.getLogger("bayesiq.audit")
logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")

# --- API key for server-to-server auth ---
API_KEY = os.environ.get("BAYESIQ_API_KEY", "")

# --- Rate limiting (in-memory, per-IP) ---
RATE_LIMIT_MAX = int(os.environ.get("RATE_LIMIT_MAX", "10"))  # requests per window
RATE_LIMIT_WINDOW = int(os.environ.get("RATE_LIMIT_WINDOW", "3600"))  # seconds
_rate_limit_store: dict[str, list[float]] = defaultdict(list)


def _check_rate_limit(client_ip: str) -> bool:
    """Return True if the request should be allowed."""
    now = time.time()
    window_start = now - RATE_LIMIT_WINDOW
    # Prune old entries
    _rate_limit_store[client_ip] = [
        t for t in _rate_limit_store[client_ip] if t > window_start
    ]
    if len(_rate_limit_store[client_ip]) >= RATE_LIMIT_MAX:
        return False
    _rate_limit_store[client_ip].append(now)
    return True


# --- App setup (disable docs in production) ---
DISABLE_DOCS = os.environ.get("DISABLE_DOCS", "true").lower() == "true"

app = FastAPI(
    title="BayesIQ Audit API",
    version="0.1.0",
    docs_url=None if DISABLE_DOCS else "/docs",
    redoc_url=None if DISABLE_DOCS else "/redoc",
    openapi_url=None if DISABLE_DOCS else "/openapi.json",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "https://bayes-iq.com",
        "https://www.bayes-iq.com",
    ],
    allow_methods=["POST", "GET"],
    allow_headers=["Content-Type", "Authorization"],
)

MAX_FILE_SIZE = 50 * 1024 * 1024  # 50 MB
AUDIT_TIMEOUT = int(os.environ.get("AUDIT_TIMEOUT", "120"))  # seconds

_executor = ThreadPoolExecutor(max_workers=2)


def _get_client_ip(request: Request) -> str:
    """Extract client IP, respecting proxy headers."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def _verify_api_key(request: Request) -> bool:
    """Check API key if one is configured."""
    if not API_KEY:
        return True  # No key configured = open (dev mode)
    auth = request.headers.get("authorization", "")
    return auth == f"Bearer {API_KEY}"


@app.get("/health")
def health():
    return {"status": "ok"}


def _run_pipeline(tmp_path: str, out_dir: str, filename: str) -> dict:
    """Run the full audit pipeline (synchronous, called in thread pool)."""
    config = {"row_limit": 50_000}
    loader_result = load_dataset(tmp_path, config)
    df = loader_result["dataframe"]
    metadata = loader_result["metadata"]

    profile = profile_schema(df, config)
    quality = check_quality(df, config)

    report_config = {"dataset": filename, "output_dir": out_dir}
    report = generate_report(metadata, profile, quality, report_config)

    # Non-critical steps
    try:
        generate_assumptions(out_dir, config)
    except Exception:
        pass
    try:
        generate_metrics_spec(out_dir, config)
    except Exception:
        pass

    # Dashboard (best-effort)
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
        pass

    return {
        "status": "ok",
        "filename": filename,
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
    }


@app.post("/audit")
async def run_audit(request: Request, file: UploadFile):
    # Auth check
    if not _verify_api_key(request):
        raise HTTPException(401, "Unauthorized.")

    # Rate limit
    client_ip = _get_client_ip(request)
    if not _check_rate_limit(client_ip):
        logger.warning(f"Rate limit exceeded for {client_ip}")
        raise HTTPException(429, "Rate limit exceeded. Try again later.")

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

    # Audit logging
    file_hash = hashlib.sha256(contents).hexdigest()[:16]
    logger.info(
        f"Audit request: ip={client_ip} file={file.filename} "
        f"size={len(contents)} hash={file_hash}"
    )

    # Use a single work directory for the entire pipeline
    work_dir = tempfile.mkdtemp(prefix="bayesiq_audit_")
    tmp_path = str(Path(work_dir) / "upload.csv")
    Path(tmp_path).write_bytes(contents)
    out_dir = str(Path(work_dir) / "output")
    Path(out_dir).mkdir()

    try:
        loop = asyncio.get_event_loop()
        result = await asyncio.wait_for(
            loop.run_in_executor(
                _executor,
                partial(_run_pipeline, tmp_path, out_dir, file.filename),
            ),
            timeout=AUDIT_TIMEOUT,
        )
        result["csv_text"] = contents.decode("utf-8", errors="replace")

        logger.info(f"Audit complete: hash={file_hash} score={result.get('score')}")
        return result

    except asyncio.TimeoutError:
        logger.error(f"Audit timed out: hash={file_hash} timeout={AUDIT_TIMEOUT}s")
        raise HTTPException(504, "Audit timed out. Try a smaller file.")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Audit failed: hash={file_hash} error={str(e)}")
        raise HTTPException(500, "Audit processing failed. Please try again.")

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

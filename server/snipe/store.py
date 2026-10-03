"""Snipe-sales storage: one SQLite file and a content-addressed photo directory under SNIPE_DATA_DIR.

One connection per call; the schema is created on open. Timestamps are UTC
strings in one fixed-width format (`utc_stamp`), so they compare as text.
"""

from contextlib import closing
from datetime import datetime, timedelta, timezone
import hashlib
import os
from pathlib import Path
import sqlite3
import tempfile

KEEP_SWEEPS = 90
NONCE_RETENTION = timedelta(hours=24)

SCHEMA = """
CREATE TABLE IF NOT EXISTS sweeps (generated_at TEXT PRIMARY KEY, generated_utc TEXT NOT NULL,
                                   stored_at TEXT NOT NULL, body TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS swipes (id INTEGER PRIMARY KEY AUTOINCREMENT, ref TEXT NOT NULL, verdict TEXT NOT NULL,
                                   price TEXT NOT NULL, alert_id TEXT, at TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS used_links (nonce TEXT PRIMARY KEY, used_at TEXT);
"""


def utc_stamp(moment=None):
    """`2026-10-03T23:14:54.000Z`: the format of a browser's toISOString(), used for every stored time."""
    moment = (moment or datetime.now(timezone.utc)).astimezone(timezone.utc)
    return moment.strftime("%Y-%m-%dT%H:%M:%S.") + f"{moment.microsecond // 1000:03d}Z"


def _connect(data_dir):
    conn = sqlite3.connect(Path(data_dir) / "snipe.sqlite3")
    conn.executescript(SCHEMA)
    return conn


def put_sweep(data_dir, generated_at, generated_utc, body):
    """Store a bundle once per `generated_at`; return the stored row's `stored_at` (the first push wins)."""
    with closing(_connect(data_dir)) as conn, conn:
        conn.execute("INSERT OR IGNORE INTO sweeps VALUES (?, ?, ?, ?)", (generated_at, generated_utc, utc_stamp(), body))
        (stored_at,) = conn.execute("SELECT stored_at FROM sweeps WHERE generated_at = ?", (generated_at,)).fetchone()
        # Rows past the newest 90 are pruned. They are not authoritative: estate-scout keeps the
        # sweep history, and any pruned bundle can be re-derived by re-running `site_cli bundle` + `push`.
        conn.execute("DELETE FROM sweeps WHERE generated_at NOT IN "
                     "(SELECT generated_at FROM sweeps ORDER BY generated_utc DESC LIMIT ?)", (KEEP_SWEEPS,))
    return stored_at


def latest_sweep(data_dir):
    """(generated_utc, body text) of the newest bundle by its UTC time, or None before any push."""
    with closing(_connect(data_dir)) as conn:
        return conn.execute("SELECT generated_utc, body FROM sweeps ORDER BY generated_utc DESC LIMIT 1").fetchone()


def count_sweeps(data_dir):
    with closing(_connect(data_dir)) as conn:
        return conn.execute("SELECT COUNT(*) FROM sweeps").fetchone()[0]


def add_swipe(data_dir, ref, verdict, price, alert_id):
    at = utc_stamp()
    with closing(_connect(data_dir)) as conn, conn:
        conn.execute("INSERT INTO swipes (ref, verdict, price, alert_id, at) VALUES (?, ?, ?, ?, ?)",
                     (ref, verdict, price, alert_id, at))
    return at


def list_swipes(data_dir):
    """Every swipe, oldest first, without alert_id."""
    with closing(_connect(data_dir)) as conn:
        rows = conn.execute("SELECT ref, verdict, price, at FROM swipes ORDER BY id").fetchall()
    return [{"ref": r, "verdict": v, "price": p, "at": a} for r, v, p, a in rows]


def use_nonce(data_dir, nonce):
    """Mark a sign-in link used. False if it already was. Prunes rows older than a day: links last 15 minutes."""
    now = datetime.now(timezone.utc)
    with closing(_connect(data_dir)) as conn, conn:
        conn.execute("DELETE FROM used_links WHERE used_at < ?", (utc_stamp(now - NONCE_RETENTION),))
        try:
            conn.execute("INSERT INTO used_links VALUES (?, ?)", (nonce, utc_stamp(now)))
        except sqlite3.IntegrityError:
            return False
    return True


def save_photo(data_dir, data):
    """Write photo bytes as photos/<sha256>.png|.jpg (atomic, idempotent) and return the file name."""
    name = hashlib.sha256(data).hexdigest() + (".png" if data.startswith(b"\x89PNG") else ".jpg")
    folder = Path(data_dir) / "photos"
    folder.mkdir(exist_ok=True)
    target = folder / name
    if not target.exists():
        fd, tmp = tempfile.mkstemp(dir=folder, prefix=".upload-")
        with os.fdopen(fd, "wb") as stream:
            stream.write(data)
        os.replace(tmp, target)
    return name


def photo_path(data_dir, name):
    return Path(data_dir) / "photos" / name

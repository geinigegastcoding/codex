#!/usr/bin/env python3
"""Bounded stdlib SQLite model for Ollo usage-interval density; no Android claims."""
import json
import platform
import sqlite3
import statistics
import time
from collections import defaultdict

DAYS = 32
OBSERVED_SECONDS_PER_DAY = 4 * 60 * 60
SWITCH_SECONDS = 5 * 60
PACKAGES = ("app.reader", "app.video", "app.chat", "app.music")
DAY_MS = 86_400_000
SECOND_MS = 1_000
BASE = 1_800_000_000_000 // DAY_MS * DAY_MS  # deterministic UTC midnight, Jan 15 2027
assert BASE % DAY_MS == 0
QUERY = "SELECT * FROM usage_interval WHERE endWall > ? AND startWall < ? ORDER BY startWall"


def raw_rows():
    for day in range(DAYS):
        day_start = BASE + day * DAY_MS
        for second in range(OBSERVED_SECONDS_PER_DAY):
            package = PACKAGES[(second // SWITCH_SECONDS) % len(PACKAGES)]
            start = day_start + second * SECOND_MS
            yield package, start, start + SECOND_MS, SECOND_MS, "UTC"


def coalesced_rows():
    for day in range(DAYS):
        day_start = BASE + day * DAY_MS
        for segment in range(OBSERVED_SECONDS_PER_DAY // SWITCH_SECONDS):
            package = PACKAGES[segment % len(PACKAGES)]
            start = day_start + segment * SWITCH_SECONDS * SECOND_MS
            duration = SWITCH_SECONDS * SECOND_MS
            yield package, start, start + duration, duration, "UTC"


def open_db(rows):
    db = sqlite3.connect(":memory:")
    db.execute("CREATE TABLE usage_interval (id INTEGER PRIMARY KEY AUTOINCREMENT, packageName TEXT NOT NULL, startWall INTEGER NOT NULL, endWall INTEGER NOT NULL, durationMs INTEGER NOT NULL, zone TEXT NOT NULL)")
    db.execute("CREATE INDEX index_usage_interval_startWall ON usage_interval(startWall)")
    db.execute("CREATE INDEX index_usage_interval_packageName ON usage_interval(packageName)")
    db.executemany("INSERT INTO usage_interval(packageName,startWall,endWall,durationMs,zone) VALUES (?,?,?,?,?)", rows)
    db.commit()
    return db


def grouped_coverage(rows):
    totals = defaultdict(int)
    bounds = defaultdict(lambda: [None, None])
    for package, start, end, duration, _zone in rows:
        day = (start - BASE) // DAY_MS
        key = (day, package)
        totals[key] += duration
        bounds[key][0] = start if bounds[key][0] is None else min(bounds[key][0], start)
        bounds[key][1] = end if bounds[key][1] is None else max(bounds[key][1], end)
    return dict(totals), {k: tuple(v) for k, v in bounds.items()}


def coverage_runs(rows):
    """Canonicalize adjacent same-package intervals; gaps/package switches remain explicit."""
    runs = []
    current = None
    for package, start, end, _duration, _zone in rows:
        if current is not None and current[0] == package and current[2] == start:
            current = (package, current[1], end)
            runs[-1] = current
        else:
            current = (package, start, end)
            runs.append(current)
    return runs


def query_sample(db, start, end, repeats=5):
    samples = []
    final = None
    for _ in range(repeats):
        before = time.perf_counter()
        final = db.execute(QUERY, (start, end)).fetchall()
        samples.append((time.perf_counter() - before) * 1000)
    plan = [r[3] for r in db.execute("EXPLAIN QUERY PLAN " + QUERY, (start, end))]
    return {
        "rows_returned": len(final),
        "duration_ms_sum": sum(row[4] for row in final),
        "package_totals_ms": dict(sorted(_group(final, 1, 4).items())),
        "median_fetch_ms_5_runs": round(statistics.median(samples), 3),
        "query_plan": plan,
    }


def query_daily_history(db, first_start, days=30, repeats=5):
    samples = []
    final = None
    for _ in range(repeats):
        before = time.perf_counter()
        final = []
        for day in range(days):
            start = first_start + day * DAY_MS
            final.extend(db.execute(QUERY, (start, start + DAY_MS)).fetchall())
        samples.append((time.perf_counter() - before) * 1000)
    return {
        "queries_per_read": days,
        "rows_returned": len(final),
        "duration_ms_sum": sum(row[4] for row in final),
        "package_totals_ms": dict(sorted(_group(final, 1, 4).items())),
        "median_fetch_ms_5_runs": round(statistics.median(samples), 3),
        "query_plan_per_day": [r[3] for r in db.execute("EXPLAIN QUERY PLAN " + QUERY, (first_start, first_start + DAY_MS))],
    }


def _group(rows, key_index, value_index):
    grouped = defaultdict(int)
    for row in rows:
        grouped[row[key_index]] += row[value_index]
    return grouped


def footprint(db):
    page_count = db.execute("PRAGMA page_count").fetchone()[0]
    page_size = db.execute("PRAGMA page_size").fetchone()[0]
    return {"page_count": page_count, "page_size_bytes": page_size, "page_count_times_page_size_bytes": page_count * page_size}


def main():
    raw_db = open_db(raw_rows())
    coal_db = open_db(coalesced_rows())
    raw_count = raw_db.execute("SELECT count(*) FROM usage_interval").fetchone()[0]
    coal_count = coal_db.execute("SELECT count(*) FROM usage_interval").fetchone()[0]
    raw_coverage = grouped_coverage(raw_db.execute("SELECT packageName,startWall,endWall,durationMs,zone FROM usage_interval ORDER BY startWall"))
    coal_coverage = grouped_coverage(coal_db.execute("SELECT packageName,startWall,endWall,durationMs,zone FROM usage_interval ORDER BY startWall"))
    assert raw_coverage == coal_coverage, "Coalescing changed per-day/package time coverage or bounds"
    raw_runs = coverage_runs(raw_db.execute("SELECT packageName,startWall,endWall,durationMs,zone FROM usage_interval ORDER BY startWall"))
    coal_runs = coverage_runs(coal_db.execute("SELECT packageName,startWall,endWall,durationMs,zone FROM usage_interval ORDER BY startWall"))
    assert raw_runs == coal_runs, "Coalescing changed any covered time, package switch, or gap"
    assert raw_count == DAYS * OBSERVED_SECONDS_PER_DAY
    assert coal_count == DAYS * OBSERVED_SECONDS_PER_DAY // SWITCH_SECONDS

    current_start = BASE + (DAYS - 1) * DAY_MS
    current_end = current_start + OBSERVED_SECONDS_PER_DAY * SECOND_MS
    thirty_start = current_start - 30 * DAY_MS
    samples = {}
    for label, bounds in (("current_day", (current_start, current_end)), ("30_day_history_single_range", (thirty_start, current_start))):
        raw = query_sample(raw_db, *bounds)
        coal = query_sample(coal_db, *bounds)
        assert raw["rows_returned"] == coal["rows_returned"] * SWITCH_SECONDS
        assert raw["duration_ms_sum"] == coal["duration_ms_sum"]
        assert raw["package_totals_ms"] == coal["package_totals_ms"]
        samples[label] = {"raw": raw, "coalesced": coal}
    history_raw = query_daily_history(raw_db, thirty_start)
    history_coal = query_daily_history(coal_db, thirty_start)
    assert history_raw["rows_returned"] == history_coal["rows_returned"] * SWITCH_SECONDS
    assert history_raw["duration_ms_sum"] == history_coal["duration_ms_sum"]
    assert history_raw["package_totals_ms"] == history_coal["package_totals_ms"]
    samples["30_day_history_app_shape"] = {"raw": history_raw, "coalesced": history_coal}

    result = {
        "scope": "Synthetic host-side SQLite model only; not Room, Android, device, user, startup, or battery measurement.",
        "environment": {"python": platform.python_version(), "sqlite": sqlite3.sqlite_version, "platform": platform.platform(), "database": ":memory:", "repeats_per_query": 5, "timing_statistic": "median fetchall wall time"},
        "fixture": {"base_epoch_ms": BASE, "base_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime(BASE / 1000)), "days": DAYS, "eligible_observed_hours_per_day": 4, "idle_gap_hours_per_day": 20, "apps": list(PACKAGES), "switch_interval_minutes": SWITCH_SECONDS // 60, "interval_duration_seconds": 1, "zone": "UTC", "rows_raw": raw_count, "rows_coalesced": coal_count, "coalescing_factor": round(raw_count / coal_count, 1), "per_day_package_totals_and_bounds_equal": True, "canonical_package_time_runs_equal_including_gaps": True},
        "storage": {"raw": footprint(raw_db), "coalesced": footprint(coal_db)},
        "queries": samples,
    }
    print(json.dumps(result, indent=2))
    raw_db.close(); coal_db.close()


if __name__ == "__main__":
    main()

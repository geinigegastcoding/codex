---
title: Ollo usage interval density — bounded SQLite model
created: 2026-10-17
updated: 2026-10-17
type: project
status: investigation
tags: [ollo, android, storage, performance, sqlite]
---

# Usage interval density review

## Decision

The write pattern can create many local rows: while the accessibility service is connected and `account()` considers a foreground interval eligible, it inserts a row for that tick (typically about one second); snapshot JSON persistence is separately throttled to about five seconds. The eligible predicate is conditional: interactive screen, no Ollo overlay, current decision allowed, known foreground, same boot, elapsed delta 1–15 seconds. It does not mean every tick always creates a row.

A deliberately dense 32-day host fixture reached 460,800 rows and about 33.9 MiB of SQLite pages. The 30-day app-shaped fetch loop took 1.14 seconds in this Python/SQLite environment. This is enough to justify **one bounded native Room/device benchmark before choosing a storage rewrite**, not enough to claim an Android latency, startup, battery or user problem. No production recommendation follows from host timing alone.

## Method and result

Ran the standard-library-only helper from ignored repo `artifacts/review/usage-density/`; the durable script copy is [model.py](<C:/Users/Daniël/Desktop/Codex/Kennis/company/ollo/assets/release/2026-10-17/usage-density-model/model.py>), its exact output is [results.json](<C:/Users/Daniël/Desktop/Codex/Kennis/company/ollo/assets/release/2026-10-17/usage-density-model/results.json>), and SHA-256 provenance is in [SHA256SUMS.txt](<C:/Users/Daniël/Desktop/Codex/Kennis/company/ollo/assets/release/2026-10-17/usage-density-model/SHA256SUMS.txt>). It creates two separate in-memory SQLite databases with the current Room entity columns, primary key, `startWall` and `packageName` indexes, and exact overlap/order query. Fixture: 32 UTC calendar days starting 2027-01-15T00:00:00Z (base epoch ms: 1799971200000), four eligible observed hours per day, 20 hours idle, four package names switching every five minutes, represented as one-second intervals. Five fetch-all trials per query; report medians. The app-shaped host helper issues the same 30 daily queries but appends all fetched rows to a combined list before timing ends; actual UsageReader processes each date separately, so helper memory behavior is not identical to the app. Environment: Windows 11, Python 3.14.3, SQLite 3.50.4.

| Measurement | Current per-tick rows | Contiguous same-package spans | Preserved |
|---|---:|---:|---|
| Rows across 32 days | 460,800 | 1,536 | 300:1 row reduction in this fixture |
| `page_count × page_size` | 35,524,608 B (33.9 MiB) | 139,264 B (136 KiB) | Both indexes included; in-memory SQLite page footprint, not installed-file size |
| Current-day range: rows; median fetch | 14,400; 60.0 ms | 48; 0.22 ms | 14,400,000 ms duration and per-package totals |
| Previous 30 days, app-shaped 30 per-day queries: rows; median total fetch | 432,000; 1,137 ms | 1,440; 3.18 ms | 432,000,000 ms duration and per-package totals |
| Same 30 days as one range query: rows; median fetch | 432,000; 726 ms | 1,440; 2.58 ms | Same totals |

The script asserts equality of grouped daily/package totals and bounds, plus canonical package/time runs. Canonical runs preserve every observed span, package switch and gap exactly in this fixture. The app-shaped loop reflects `UsageHistoryReader` calling `localDay` once for each prior day; a single 30-day query is included as a comparison, not as the current code path. Current focused-day re-aggregation is also requested when the controller refreshes usage about every 15 seconds.

All three EXPLAIN plans used `index_usage_interval_startWall (startWall<?)`. Because the overlap predicate also needs `endWall > start`, this plan does not show a lower-bound startWall constraint; for the synthetic monotonically growing table it can walk older indexed rows before filtering non-overlaps. This suggests a query-plan question for the native benchmark, not proof that an index change is better. The fixture has no app-level row-at-a-time Room write cost, Android filesystem/WAL behavior, CPU contention, device thermals, or Room transaction overhead. Coalescing is a hypothetical representation, not a proposed patch: production must preserve interval boundaries, package changes, gaps, timestamp/zone semantics and deletion/trim behavior.

## Minimal follow-up

On one representative Android device, use a disposable test database or synthetic fixture (do not overwrite the installed user's data). Compare the current schema/query with the span fixture at 32-day density. Record Room query wall time and rows materialized for one current-day refresh and the 30 per-day history read; include a write pass at the service's normal eligible tick cadence. Inspect the Room/SQLite query plan and actual database/WAL sizes. Capture a baseline and repeat once; this is a measurement, not a battery study.

Only if the native result is material should implementation options be considered: (1) coalesce the newest contiguous row when package and zone match—lower row count, but more delicate transactional update logic; or (2) adjust indexes/query shape—less semantic change, but may add index storage and sorting cost. Keep per-tick rows if the native benchmark shows acceptable behavior. Do not infer battery savings without a separate controlled power test.

### Native measurement boundary prepared

Source inspection confirms a native benchmark can use a disposable Room database and the actual `UsageReader.localDay` method via debug-only reflection, without adding a production API or querying OS history. Seed the same midnight-aligned 32 UTC days, four observed hours/day, four apps switching every five minutes. Compare 460,800 one-second rows with1,536 contiguous spans. Read one day and30 prior days sequentially; retain only the resulting daily aggregates, matching the actual reader rather than the host model’s combined raw-row list. Assert package totals, hourly coverage and unknown gaps agree before interpreting timing.

Use a fixed separate database name, close/delete it in `finally`, and verify its path cannot be `ollo.db`. Record database/WAL size and native query plans. Transaction-batched fixture seeding is not the normal one-second write cadence; a query benchmark cannot establish battery cost, normal write cost or physical-device responsiveness. Keep the preserved app-data baseline and restore emulator settings afterward. This is a prepared measurement scope, not a benchmark result or a chosen optimization.

## Source trace

- [AppController.account(), readUsage(), tick()](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/data/AppController.kt>)
- [OlloDatabase.kt: entity indexes and overlap query](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/data/OlloDatabase.kt>)
- [UsageReader.kt: focused-day query and interval processing](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/data/UsageReader.kt>)
- [UsageHistory.kt: 30-day per-day local reads](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/domain/UsageHistory.kt>)
- [OlloAccessibilityService.kt: approximately one-second tick scheduling](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/platform/OlloAccessibilityService.kt>)

At the original host-model milestone, no app code or existing shared document was changed. The durable helper, results and hashes are in the linked Kennis folder; the raw helper/results also remain under ignored repo `artifacts/`. Host timing cannot establish user impact or a battery/runtime defect.






## Native probe checkpoint

A debug-only probe is compiled and committed at421ecd9, but has not run. The first build failed from a missing row-count condition; one direct repair passed assembleDebug. Execution was deferred at94%primary usage. No APK install, app launch, fixture database, timing, query plan or DB-size measurement occurred. Continue after the reset from `docs/evidence/2026-10-17-usage-storage-benchmark.json`; the host model remains the only measured result so far.

## First native baseline — 17 October, 13:19 window

The isolated Room probe ran once on owned API 34emulator5568 using the compiled 421ecd9 debug helper. All tested daily aggregates matched the expected values: four packages at 1 h each, first four hourly buckets1h, other 20 hours unknown,30-day total 432,000,000 ms. Parent independently matched the raw result/summary arrays, fixture cardinality, installed debug APK and restored original APK hashes.

| Measured operation | Sample 1 | Sample 2 |
|---|---:|---:|
| One-day DAO query and materialization | 195.16 ms | 142.46 ms |
| Actual localDay including query/reflection/aggregation | 540.40 ms | 567.84 ms |
| 30 sequential localDay calls with correctness checks | 8,380.44 ms | 3,028.40 ms |

The single 460,800-insert Room transaction took 33,208 ms; this is fixture seeding, not production one-second write cadence. During-open main/WAL/SHM bytes were 52,703,232 /53,049,152 /131,072. These are open-file snapshots after the synthetic batch, not steady-state app disk usage. Native package strings are longer than the host fixture and zone is Z versus UTC; do not interpret byte differences as controlled Room overhead. SQLite chose `index_usage_interval_startWall(startWall<?)`. The exact named DB and sidecars were deleted; original nineteen-file baseline, Licenties APK and settings restored.

Only two ordered samples exist. Startup/JIT/cache effects and AppController background initialization are uncontrolled; the probe itself did not query OS usage but normal app initialization may do so concurrently. The 30-day timing includes assertions, and query-only/end-to-end samples are separate; subtracting them does not provide isolated aggregation timing. This demonstrates a measurable synthetic local-read cost on this emulator, not actual physical-device startup/battery cost.

The next smallest candidate is reducing repeated time-zone/hour-boundary work while preserving interval rows, clipping, duration prorating and unknown-hour semantics. Validate time-zone transitions before changing it. No schema migration, coalescing or new index is selected. SQLite’s [optimizer documentation](https://www.sqlite.org/optoverview.html#where_clause_analysis) also cautions that index columns after a range-constrained column are normally not usable to narrow the search. Thus a two-column overlap index is not automatically a two-bound range lookup; test any proposed query/index on the actual fixture. The [planner documentation](https://www.sqlite.org/queryplanner.html) explains the separate tradeoffs in filtering and ordered scans.

Durable app evidence: `docs/evidence/2026-10-17-usage-storage-benchmark/native-result.json`, `native-raw.json` and `native-instrumentation.txt`. Prior failed build and compiled-pending records remain historical evidence.

## Implemented hour-boundary refinement

The native baseline justified a small calculation change before any storage redesign. `UsageReader.localDay` now reuses the current hour label over a valid range, capped at the next local clock hour or offset transition. When a later record overlaps an earlier range, it recomputes. Interval rows, DAO query, schema and persistence are unchanged.

The original wall-time rounding could produce a boundary equal to the cursor at Lord Howe’s 2024 fall shift (`01:30 +10:30`), so the loop could stop advancing. After the spring shift, `02:30 +11:00` rounded to `03:30`, skipping the next clock hour. The JDK probe reproduces both; the native patched reader terminates and allocates those tested intervals correctly. Native checks also cover Amsterdam’s skipped/repeated hours, empty unknown data, overlaps, clipping and duration prorating: all eight observed results exactly match their expected maps and hourly arrays.

| Actual local read | Baseline ordered samples | Candidate ordered samples |
|---|---|---|
| One day, query + reflection + aggregation | 540.40 / 567.84 ms | 202.83 / 190.23 ms |
| 30 sequential daily reads + assertions | 8,380.44 / 3,028.40 ms | 2,430.63 / 1,756.22 ms |

The corpus, query plan and measured file sizes match the baseline. Small correctness fixtures run only after the large timings/sizes. Two samples, JIT/cache/startup contention and emulator host variation prevent a controlled speedup claim. No physical-device startup, provider timing or battery result is established. No further storage/index/coalescing change is selected from these results.

Standard build: 75 unit tests, lint 0 errors / 18 warnings, library inventory and all 12 review packaging checks passed. Parent independently parsed raw baseline/candidate fixture equality, timing arrays, all eight expected/observed cases, both APK hashes and guard/unit/lint reports. Original APK, nineteen-file baseline, permissions, font and adbd were restored; OS UsageStats launch records remain. A host absence preflight returned a contradictory nonzero result; a subsequent listing showed no test DB, but no preflight log was retained, so its root cause is unverified. The actual native run passed once without a retry.

Durable evidence: `docs/evidence/2026-10-17-usage-hour-boundary/results.json`, native raw result, JDK source/output, build, test XML, lint and guard. Release artifact `artifacts/review/Ollo-0.2.0-usage-hour-cache-release-2026-10-17.apk`, SHA-256 `4a4513843fbd1dc604fa772381627ac4be5e1b835d66fbaf818344354e8d4ea1`, remains development-signed. This is a calculation/correctness refinement, with no app-data migration.

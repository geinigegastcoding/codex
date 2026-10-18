---
title: Ollo privacy and export clarification
created: 2026-10-17
updated: 2026-10-17
type: project
status: verified-review-candidate
tags: [ollo, android, privacy, verification]
sources: [https://github.com/geinigegastcoding/Ollo]
---

# Ollo privacy and export clarification

The actual Settings, Privacy and measurement-deletion screens now explain where exports can go and what local deletion removes. Existing export formats, destinations, retention logic and deletion behavior are unchanged. No user's installation was updated, no export was saved and no destructive action was selected.

## Source-backed corrections

- Settings explains before the export buttons that Android lets the user choose a destination, a cloud folder follows that provider's handling, and deleting Ollo measurements does not delete saved exports.
- The JSON action is “Exporteer gegevens (JSON)”: it includes settings, baseline and day outcomes, rather than settings alone. The existing filename and schema are unchanged.
- Privacy uses plain Dutch for window changes and stored morning starts. It describes cleanup accurately: intervals older than 32 days are removed when Ollo processes a new day. It does not promise an independent cleanup job while Ollo is not running. Day results and morning occurrences each retain at most 370 records.
- Privacy distinguishes Android's OS-owned usage history and the user's saved export from Ollo's local measurement deletion. It describes the existing backup/device-transfer exclusions.
- “Meetgegevens wissen?” is a shorter enlarged-text title. The dialog explicitly says saved exports remain, preserves “Bewaren” and the existing destructive action, and supports scrolling if its body needs it.

## Verification

On OlloReview34, Android 14/API 34, 1080×2400 at 420 dpi, all **12 confirmation checks** passed across normal and 200% text. Retention/export explanations are reachable; both CSV and JSON open the native document picker with their expected filename and cancel before saving; the deletion explanation is readable and cancels. Fourteen PNG/XML pairs are retained in `screenshots/2026-10-17-privacy/confirmed/`. Font scale was restored and Accessibility grants were unchanged. The one-off standard-library/ADB helper is ignored at `artifacts/inspect-privacy.py`.

The first confirmation incorrectly required a scrollable node at 200% even when the entire deletion body fit. That runner failure is preserved in `first-pass/`. The check was corrected to accept fully contained text, the awkward original title was shortened, and the entire confirmation completed successfully. This is a recorded harness correction, not a hidden passing result.

Debug and minified release builds passed in 3m 16s; **75 existing unit tests** passed with zero failures, errors or skips. Lint completed with zero errors and 18 existing warnings. The packaged release guard and 16 KB zip alignment passed. Evidence is under `docs/evidence/2026-10-17-privacy/`.

Review APK: `artifacts/review/Ollo-0.2.0-privacy-2026-10-17.apk`, SHA-256 `3a822182e2576d7d557753eb3333343194aad4eb4c5f4bc1820506a30cb92393`. Version 0.2.0-review (3), development certificate, `productionSigningVerified=false`. Built from the working tree before the source checkpoint commit; no store or private-release upload was made.

## Packaged backup guard

`scripts/verify-release.ps1` now follows the actual manifest resource IDs into packaged legacy and Android 12+ backup XML. It verifies the five storage domains currently used by Ollo are excluded at `.` for legacy, cloud and device transfer; rejects unexpected includes/tree shape, missing rules and a custom backup agent. It does not assess future device-protected storage or prove every OEM honors the rules.

A signed standalone control fixture passed (exit 0). A separately compiled/signed fixture differing only by the missing device-transfer section failed specifically at that check (exit 1). Both signatures were independently verified with the existing development certificate. These are guard-test fixtures, not Ollo app builds. Hashes, source XML, JSON and exit codes are recorded in the evidence folder; generated APKs remain ignored under `artifacts/review/backup-fixtures/`. Windows PowerShell 5.1 and 7 checks passed. After the reset, the same privacy APK passed all 12 guard checks on local WSL2 Ubuntu 26.04 with Linux SDK tools; `docs/evidence/2026-10-17-linux-guard/` records the runtime and exact hash. Hosted Linux CI remains unobserved.

## Remaining boundaries

The checks deliberately cancel exports. They do not test a cloud provider's upload, encryption, sync or deletion behavior, or decide the final Play Data safety answers. See [[DATA-SAFETY-WORKSHEET]]. Physical devices, TalkBack, production signing and store review remain outstanding. Continue from [[CONTINUOUS-IMPROVEMENT]].

## Follow-up: morning-start retention — 17 October 2026

The policy/source review found that `clearMeasurement` retains morning-start records, which also prevent duplicate morning-routine execution. The dialog and Privacy text now explicitly say rules and morning starts remain. No deletion/rule behavior changed. Six targeted normal/200% checks passed; deletion was never selected, cancellation worked, fonts/grants/viewport were restored. The full clause was also visually inspected on the minified release at 200% in scrolled Privacy captures.

Debug/minified release built in 3m22s; 75 unit tests passed; lint 0 errors/18 existing warnings; review guard/16 KB alignment passed. Packaged DEX contains both changed explanations. Candidate `artifacts/review/Ollo-0.2.0-delete-scope-2026-10-17.apk`, SHA-256 `14dbae414d82cda7865bb0aed0ae17b33ed6ff75dc903a91c5be935f1f100040`, still development-signed 0.2.0-review (3). Evidence: app `screenshots/2026-10-17-deletion-scope/` and `docs/evidence/2026-10-17-deletion-scope/`. This was a new source-backed clarity gap after the earlier privacy milestone, not an arbitrary visual repolish. [[PRIVACY-POLICY-DRAFT]] and [[DATA-SAFETY-WORKSHEET]] describe the same boundary; full local app removal and outside exports/Android history are distinct.

---
title: Ollo statistics refinement and verification
created: 2026-10-16
updated: 2026-10-16
type: project
status: verified-review-candidate
tags: [ollo, design, android, verification]
sources: [https://github.com/geinigegastcoding/Ollo]
---

# Ollo statistics refinement and verification

The native statistics screen now puts the measured average, period chart and app comparison before the detailed reports. The orange pixel mascot and square chart bars preserve Ollo's identity. This is a local review candidate; no user's phone was updated and nothing was published.

## What changed

- A compact mascot header and clear 7/30-day selection lead into the observed average and date range. Thirty-day charts have date ticks.
- Missing days stay unknown and are excluded from the average. Known zero days remain in its denominator. Partial local measurement is visibly labelled beside the headline; it is not presented as a complete Android day.
- App totals have comparison bars and open the existing app settings. The source explanation, daily results, hourly details, text chart values and frozen starting week remain accessible on demand.
- With no selected apps, the page gives an immediate native app-selection action instead of a blank chart or an invented zero-use result.
- The navigation label “Ideeën” fits enlarged text while retaining the existing alternatives destination.
- Debug-only fixtures include a mixed period with missing, zero and partial days. Fictional usage is never written to the measured-usage store. The capture tool can select routes/states instead of recapturing the whole app.

The rule engine, permission capabilities, persistence schema, timers, privacy/network contract and paid-feature availability were not changed by this milestone.

## Evidence

On the disposable `OlloReview34` emulator, Android 14/API 34 at 1080×2400 and 420 dpi:

- Debug and minified release builds succeeded; all **75 existing unit tests passed**; Android lint completed without errors. Existing warning/deprecation output is retained in the build artifacts and was not treated as a reason for unrelated dependency changes.
- The confirmation suite completed **23 runtime checks** and **14 captures**. Checks cover 7/30-day switching, source disclosure open/close, retained day/hour/text detail controls, app navigation, the first-use action, missing-day coverage and the visible partial-measurement label.
- In the mixed week, six days are known, including one genuine zero-use day; one day is unknown. The displayed mean is **48 minutes**, with “1 dag deels gemeten” visible. The mixed month reports 24/30 available days. These are labelled synthetic fixture outcomes, not user outcomes or efficacy evidence.
- Screenshots cover default, 130% and 200% text and a 2400×1080 wide emulator viewport. Font scale and size were restored. The wide viewport verifies navigation-rail rendering and scrolling; it is not physical-tablet, orientation-sensor or split-screen acceptance.
- One initial inspection and one combined correction/confirmation pass completed the scoped Impeccable refinement. The CLI detector returned no findings for the Kotlin targets; native screenshots and actual controls are the substantive UI evidence.

Local evidence: `screenshots/2026-10-16-insights/confirmed/results.json` and its PNG/XML pairs. The first pass is retained separately in the parent folder. The screenshot gallery uses the confirmed images for Inzicht and labels the older captures. The one-off runnable UI check lives at ignored `artifacts/review-insights.py`; it uses only the Python standard library and ADB. App source changes are reviewable in Git.

## Packaged release checks

The new `scripts/verify-release.ps1` reads actual packaged manifest/resources and signature output. It verifies app identity/SDK levels, the current offline permission allowlist, backup disabled, no debug-only components, non-debuggable packaging, screen-content retrieval disabled, the non-accessibility-tool flag, and signature identity.

The candidate passed review inspection with `productionSigningVerified=false`. APK SHA-256: `c7a757063edf6dd2fcdc198cae3102a1f46ec7c6170a10c01cb4fe99a26b3f22`. It is still version 0.2.0-review (3), using the known development signing identity. The binary was built from the then-uncommitted working tree; a local milestone commit is a source checkpoint, not proof that its hash was embedded in the already-built APK.

Two negative checks behaved as intended: the debug APK is rejected even when review signing is allowed because it contains review components and is debuggable; default production validation rejects the release candidate's development signing. Production mode requires an explicitly supplied owner signer fingerprint. JSON results are under `docs/evidence/2026-10-16-insights/`. This is a packaging guard, not Play approval or physical-device qualification.

## Research used

The inspected [Fitbit weekly summary](https://mobbin.com/screens/7468a225-2b00-45c6-9e6a-eeae089a3717) supports a compact period/value/chart hierarchy; the [Jomo breakdown](https://mobbin.com/screens/1e81e6f2-25ef-4787-8471-1fc3448d9688) supports clear app comparisons. [Insight Timer](https://mobbin.com/screens/c22e09fb-2eac-4792-8c0d-d348b440ef47) separates primary chart groups, and [Future Pro](https://mobbin.com/screens/f925ebc4-c6a3-401f-b683-a09ef1bff131) keeps underlying values accessible. These are interpretations of inspected reference images; no Mobbin assets were shipped and Ollo kept native Android structure.

## Remaining work

Physical-device/TalkBack/OEM and long-duration usage acceptance remain in the existing device checklist. The separately identified disclosure wording and enlarged-text clipping were corrected and verified in [[CONSENT-REFINEMENT]]. Do not reopen this statistics surface for another arbitrary polish loop. Continue from [[CONTINUOUS-IMPROVEMENT]].

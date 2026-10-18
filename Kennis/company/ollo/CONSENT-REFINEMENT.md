---
title: Ollo Accessibility disclosure refinement
created: 2026-10-17
updated: 2026-10-17
type: project
status: verified-review-candidate
tags: [ollo, android, accessibility, verification]
sources: [https://github.com/geinigegastcoding/Ollo]
---

# Ollo Accessibility disclosure refinement

The real permission explanation now scrolls at 200% text and describes Ollo's existing data use accurately. This is a local review candidate. The user's test installation was not changed, and nothing was published.

## Observed problem and correction

The baseline emulator capture showed that enlarged text clipped the end of the disclosure without a scroll container. Its claim that only package names were processed was also narrower than the service: for Ollo's own package, the service checks its own window class to ignore overlay events.

The dialog title is now “Toegankelijkheid”. Its text explains foreground-app recognition, selected-app blocking, local active-usage measurement, and processing of app/window changes on this device. It explicitly states that screen content, messages, typed text and screenshots are not read, that data is not sent to a server, and that access can always be disabled in Android. A native vertical scroll modifier makes the complete explanation reachable. The existing service and its capabilities were not changed.

“Nu niet” still dismisses without recording consent. “Akkoord, naar instellingen” records the affirmative disclosure choice and opens Android Accessibility Settings; the separate system grant remains the user's action.

## Verified evidence

- Disposable OlloReview34 emulator, Android 14/API 34, 1080×2400 at 420 dpi. Baseline and confirmation PNG/XML pairs are under `screenshots/2026-10-16-consent/`; the folder preserves the date the inspection began.
- The confirmation runner exited successfully after eight checks: correct data-purpose text at both sizes, refusal and re-entry at both sizes, a genuine scroll container at 200%, and the affirmative settings route without automatically granting access. Access grants were unchanged and font scale was restored. `confirmed/results.json` records the checks.
- The default, 200% start/end and Android settings captures were visually inspected. UI hierarchy bounds confirm the title and actions stay fixed while the explanation scrolls.
- Debug and minified release builds succeeded. All 75 existing unit tests passed. Android lint completed with zero errors and 18 existing warnings; results are copied into `docs/evidence/2026-10-17-consent/`.
- Packaged review-mode checks and 16 KB zip alignment passed. The release guard also passed under Windows PowerShell 5.1 and PowerShell 7 after portability changes. The Ubuntu Actions step is wired but has not run remotely.

Candidate: `artifacts/review/Ollo-0.2.0-consent-2026-10-17.apk`, version 0.2.0-review (3), SHA-256 `4aa982a54dae76ca20305d115a93e7d65f67bff63a6a28595c99bf4482ecb984`. It uses the known development certificate. `productionSigningVerified=false` is deliberate; this is not a production-signed release. The APK was built from the working tree before the source milestone commit.

The release guard now selects Windows/Unix Android SDK tool names and temporary paths. CI inspects the packaged review APK and uploads its JSON result beside the APK. Existing rejection evidence for debug components, debuggable packaging and development signing remains under `docs/evidence/2026-10-16-insights/`. No external workflow execution is claimed.

## Remaining acceptance

Physical-device TalkBack, smaller screens, actual orientation changes, disabling/re-enabling the live service, OEM recovery and the production-signed binary still require acceptance. These eight consent checks do not retest actual blocking or certify Google Play compliance. The declaration/video draft is updated in [[ACCESSIBILITY-REVIEW-DRAFT]]. Continue from [[CONTINUOUS-IMPROVEMENT]].

---
title: Ollo reminder action clarity
created: 2026-10-18
updated: 2026-10-18
type: project
status: verified-local
tags: [ollo, copy, native-ui, opening-plan]
---

# A clearer reminder action

- **Changed:** the check-in now says **Herinner me over N minuten** instead of **Nog N minuten**. It also says **Je bestaande tijdregels blijven gelden.**, matching the explanation already in the purpose form.
- **Why:** the old label could suggest more app access, while its existing action only restarts the reminder. This is an inference from the actual UI and source, not an observed user-confusion finding.
- **Kept:** the orange pixel mascot, native layout, control order and reminder behavior. No controller/domain, permission, storage, network or timing change.
- **Verified:** 83 unit tests, lint 0 errors/18 existing warnings and 12 review packaging checks. Native full-flow fixtures passed 40 normal-text and 62 enlarged-text checks; a separate 25-check fixture primed the release. These fixtures and their exact artifact identities are separated in the evidence.
- **Actual release:** 35 independent native checks on the exact minified APK, including a real five-minute wait (300,702ms after opening), the new hint and reminder action, and finish/Home. Continue/dismiss were reachable here and executed in the debug fixtures. No private answer/deadline access in the release probe.
- **Visual review:** the new hint and full reminder label are readable at normal/200% text. Enlarged content uses the existing scroll view; each action was exercised. No additional polishing cycle was needed.
- **Test corrections retained:** two initial enlarged-text failures exposed launch/question readiness assumptions. The debug runner now waits for observed Home and the current visible question. Its initial nullable-access compile failure is retained alongside the corrected successful build. No production behavior was changed for these failures.
- **Review cleanup:** original APK and 19 private files/settings restored, synced and verified across a cold VM restart before app launch. Probe removed, shell adbd restored and emulator stopped. The founder's test installation was untouched.
- **Still open:** real comprehension/demand, natural ten/twenty-minute timing, TalkBack, physical/OEM/API36 and production signing. This is local acceptance, not a release announcement.

Impeccable 4.2.2 clarify/craft-floor guidance informed the bounded copy refinement; its update remains deferred. Two inspected iOS copy references were [Insight Timer](https://mobbin.com/screens/876b6a4b-2769-4501-8dd9-a06f487c2cdf) and [Google Health / Fitbit](https://mobbin.com/screens/c406c269-c33b-4f3e-becd-a060bc0c3d12). They informed action naming only, not Android behavior or layout.

[Exact evidence](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/docs/evidence/2026-10-18-cue-clarity/results.json) · [Native gallery](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/screenshots/index.html)

Current development-signed minified release SHA256: `1d97d94cb98aed48c351e92913899c061227555914db1fafcd2acab510c9a776`. Unpublished.

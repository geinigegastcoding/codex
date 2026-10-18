---
title: Ollo facts and reliable export implementation
created: 2026-10-18
updated: 2026-10-18
type: project
status: verified-local
tags: [ollo, implementation, quiz, export]
---

# Facts and reliable exports

- **Implemented:** six researched science/nature facts, bringing the facts catalog to twelve. Each session still has three questions. Full learning text teaches the answer before the question; source labels remain visible. All five primary sources were reopened. See [[QUIZ-CONTENT-CANDIDATES]].
- **Implemented:** both exports share a UTF-8 writer on an I/O dispatcher. A successful close produces visible confirmation. Null or failing output gives retry guidance and warns that a partial file may remain. Picker cancellation stays neutral; leaving the coroutine still cancels it. No provider files are automatically removed by Ollo.
- **Verified:**80unit tests;lint0errors/18existing warnings;12review packaging checks. Actual CSV and JSON writes, cancellation, normal/200% feedback, readable files and unchanged exported configuration passed15independent checks. A separate200%native service run passed149checks with25captures across three quiz topics and protection recovery. It sampled the new butterfly card; the other five new cards were not individually captured.
- **Restored:** original review APK,19persistent files with exact bytes/owners/modes, permissions/settings and shell adbd. Owned emulator stopped; the user's installation was untouched. OS UsageStats and other test-app history are outside restoration.
- **Later provider follow-up:** [[EXPORT-PROVIDER-REVIEW]] closes the real Settings open-failure path on the current minified release with30checks at normal/200% text, neutral cancellation and valid local retries. The full exported configuration matches pretest; no app source change.
- **Limits at initial verification:** failing providers were exercised at the shared JVM writer boundary; no failing real provider/UI crash was reproduced. Release runtime, TalkBack, physical/OEM/API36 and production acceptance remain separate. The first cancellation-object assertion, filename locator error and boot System UI ANR are preserved as test/preflight failures. Low disk was resolved by compressing two inactive Ollo snapshot caches with unchanged file hashes; nothing was deleted.

[Evidence and preserved attempts](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/docs/evidence/2026-10-18-facts-export/results.json) · [200% export feedback](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/screenshots/2026-10-18-facts-export/after-2.0/json-saved.png) · [New fact on device](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/screenshots/2026-10-18-facts-export/quiz-200/facts-question-3.png)

Development-signed release SHA256:`c3b4ba68fc303123fffa26341d20550d4dd1394080bbc947bd912efe9eb2552f`. Local source candidate only; unpublished.

## Later restoration finding —18October

The next cold boot after the facts/export run found the19restored private files zero-byte and the installed base.apk missing. The earlier record verified bytes before shutdown; it did not establish restart durability. Root cause is unknown. The intact host backup recovered the original APK/files, explicit device `sync` was added before VM shutdown, and recovery plus final opening-plan restoration each passed one cold stop/start check before app launch. The final original APK,19file contents/owners/modes/SELinux and settings matched; emulator stopped. This is owned-emulator recovery evidence, not an app/user-device durability guarantee. [Final cold-boot result](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/docs/evidence/2026-10-18-opening-plan/restoration-final-cold-boot.json).

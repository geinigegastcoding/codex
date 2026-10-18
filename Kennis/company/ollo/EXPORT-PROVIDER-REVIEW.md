---
title: Ollo actual document-provider failure check
created: 2026-10-18
updated: 2026-10-18
type: project
status: verified-local
tags: [ollo, export, reliability, production]
---

# Actual export failure and recovery

- **Closed a verification gap:** the existing export handler now has a real Android provider-failure check through Settings, beyond its earlier JVM writer tests. App source and the minified release were unchanged; no new app build was needed.
- **Controlled setup:** a separate test-only local DocumentsProvider appears in Android's real picker. It creates document metadata successfully, then rejects Ollo's write-open with a controlled FileNotFoundException. The trace records the picker creating first and Ollo's UID requesting the write afterward. No URI was injected into Ollo and no export payload entered the fixture.
- **Passed:** 30 checks, split 15 normal-text and 15 at 200% text, with seven native PNG/XML pairs. CSV and JSON failures leave Settings open, show the full recovery message and keep both export buttons enabled. No false saved confirmation or stuck pending label appeared.
- **Recovery passed:** canceling the next picker preserves the failure message without another provider request. A local CSV retry produces a valid 18-row file; a local JSON retry produces schemaVersion1 data. CSV classification and the full exported configuration match the pretest baseline.
- **Visual review:** parent inspected normal/200% failure feedback; the full explanation and both export actions remain readable. The native scroll view handles the enlarged content.
- **Cleanup passed:** retry-file hashes matched before removing only the preflight-absent task files. Provider uninstalled; original APK and 19 private files/settings/owners/modes/SELinux restored, synced and verified across cold restart before app launch. Shell adbd restored and owned emulator stopped. User phone untouched.
- **One driver correction:** an enabled native ListView row did not expose a clickable ancestor. The driver now handles that observed row; the initial failure remains in the evidence and preceded document creation.
- **Limits:** one disposable API 34 provider, not cloud-provider certification or an old-version crash reproduction. Actual provider write/close/null-stream, process death, physical/OEM/TalkBack/API36 and production signing remain separate. Earlier JVM cases still cover the shared writer's other failure boundaries.

The tested release is the same development-signed artifact (1d97d9…) from [[CUE-ACTION-CLARITY]]; its 83 unit tests, lint result (0 errors/18 existing warnings) and 12 packaging checks was retained, not rerun here. Raw retry exports/private backups remain ignored locally; the report records hashes and configuration equality.

[Exact evidence](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/docs/evidence/2026-10-18-export-provider/results.json) · [Native gallery](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/screenshots/index.html) · [Android provider contract](https://developer.android.com/reference/android/provider/DocumentsProvider)

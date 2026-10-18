---
title: Ollo support runbook
created: 2026-10-17
updated: 2026-10-18
type: project
status: internal-draft
tags: [ollo, support, android, runbook]
---

# Ollo 0.2.0-review — internal support runbook

**Scope:** private, accountless, local-only review build. Not a blocking guarantee or Play support policy. Never request inventories, private screens, exports, databases, identifiers or messages. Do not recommend uninstall/clear-data first.

## Blocking inactive or Android access missing

For the English candidate prepared18October, inspect **Settings → Android access**. **App protection** and **Usage access** report their states separately: **Service connected** means the blocking service is connected; **Granted · Android daily figures available** means Android history is available. Usage Access alone does not imply active blocking. “Enabled · check the connection” means Android says the service is enabled but Ollo sees no connection. Older installed review APKs may have Dutch labels and an aggregate Bescherming heading; confirm the installed build before describing its controls. See [[ENGLISH-UI-PREPARATION]].

Accessibility drives foreground rules/overlays. Usage Access supplies Android history/totals; its absence alone does not mean every rule is inactive. If disconnected, choose **Settings → Enable app protection**, read **Accessibility**, choose **Agree, open settings**, enable Ollo in Android settings, return and recheck. The **App protection** row opens Android settings directly once disclosure was accepted. Do not substitute Usage Access for Accessibility. For statistics, inspect Ollo’s Android switch at **Settings → Usage access**.

If still disconnected, record Ollo/Android version, device, status and rough time. Relaunch/restart is reversible but not guaranteed to fix OEM behavior. Escalate persistent cases; physical/OEM acceptance is unverified.

**Reply:** “App protection and usage figures use separate Android permissions. Check Settings → App protection and Usage access; share only the two status lines and your Android version. Keep Ollo installed.”

For the broad Android “full control” warning, use the English answer in [[ENGLISH-SUPPORT-COPY]]. The current service handles app/window metadata, displays overlays and can navigate Home; `canRetrieveWindowContent=false`. The API34 review dialog still used broad wording. Do not call the warning harmless, promise identical OEM wording, or change `isAccessibilityTool=false` to suppress it. The current-source explanation is not a physical-device privacy audit or a Play approval.

## Missing, partial, or zero-looking statistics

**Not yet known** or **—** means unknown, not zero. “X of 7/30 days” and “day partly measured” show coverage; partial Ollo measurement may miss use. “No distraction observed” means no selected-app use was observed in available figures. An absent day is not a zero.

Android daily UsageStats and Ollo’s current-day measurement are separate. Android buckets may span midnight and count once at the start date; Ollo does not infer missing history. Confirm the app is selected as a distraction app, check **Settings → Usage access**, then open **Insights → About these figures**. **Import last week as a baseline** replaces the saved baseline only on a successful import. Do not request exports.

**Reply:** “A dash or “Not yet known” means no known value is available. It does not mean zero. See “About these figures” and check Usage access. Do not share a usage export.”

## “Open app”, hard pause, essentials and emergency route

**Open app** is a decision prompt, possibly after a wait and optional quiz. It does not bypass a fixed schedule, pause or daily limit. During a hard pause, **Open essentials**, **I need an app** and **Go to Home** are separate routes. System safety packages such as Settings, phone and alarm are allowed first. A user-selected essential bypasses general pauses and essentials-only routines, but can still have its own schedule or limit. **I need an app** grants one selected app a two-minute exception, including from its applicable hard blocks. The underlying pause/time rules keep running and other apps receive no exception. Ollo is voluntary self-control, not an emergency-service substitute.

If a user-selected essential is blocked, ask which route was used and whether it has its own schedule or limit. Record a short reproduction and escalate. For immediate help, use the device’s normal emergency route.

**Reply:** ““Open app” applies only at an opening prompt. “I need an app” can allow one app for two minutes. Your pause and time blocks keep running; other apps get no exception. Use your device's normal emergency controls for urgent help.”

## CSV/JSON export and recovery limits

**Settings → Export daily figures (CSV)** and **Export data (JSON)** open Android’s document picker; the user chooses a local or cloud-provider destination. CSV contains available daily package totals, source and classification version. JSON contains configuration, baseline and day outcomes. Ollo does not control provider sync/deletion.

Neither export restores Ollo: there is no file-import path. JSON excludes raw local intervals and morning-start records; CSV is a report, not backup. **Delete Ollo measurements** does not delete exports. Ollo configures exclusions from Android backup/device transfer; device-specific compliance is unverified. Current18October source confirms a saved export only after writing and closing, with **Daily figures saved.** or **Data saved.** If it reports an unfinished export, a partial file may remain; choose a destination under the user's control and retry. Canceling the picker preserves previous feedback. Older installed builds may have no result feedback. Closing the picker alone does not prove the write succeeded. Never request the file.

**Reply:** “Ollo can save CSV and JSON where you choose. JSON cannot restore Ollo; do not share the export. A cloud folder is handled by its provider.”

## Update certificate mismatch or local-data risk

The current review build uses Gradle’s debug signing key, not a verified production key. Android requires a compatible signer for in-place updates. If installation reports a mismatch, do not suggest uninstall, clear-data or repeated installs. Preserve the installed app/data while the release owner checks the package ID and certificates and provides an update path.

Do not claim production signing, migration, cloud restore or JSON restore. If the app was already removed/data cleared, explain current exports cannot restore app state. Escalate with redacted Android error text and installed/offered versions.

**Reply:** “Keep Ollo installed and do not clear storage. This review version uses a development key; the release owner should check which update is compatible. JSON cannot restore app data.”

## Privacy-preserving intake and escalation

Request only Ollo/Android version, device model, expected/observed behavior, rough time, and whether short steps reproduce it. Redact names/paths from visible errors. Never collect inventory, notifications, private screens, logs, databases or exports. Escalate access issues with reproduction steps, statistics with period/source/coverage, and update failures with versions/signing provenance. Preserve installation until an update path is tested.

## Evidence and unresolved owner inputs

Source inspection does not establish production signing, physical/OEM or TalkBack acceptance, continuous enforcement, or Play approval. Public support contact and production signing owner are unknown; both are needed before offering launch support.

- [Permission labels](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/ui/OlloApp.kt:403>), [disclosure action](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/ui/OlloApp.kt:455>) and [status computation](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/data/AppController.kt:35>).
- [Statistics](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/ui/OlloApp.kt:196>) and [data semantics](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/docs/ARCHITECTURE.md:17>).
- [Pause routes](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/platform/OlloAccessibilityService.kt:96>), [emergency UI](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/ui/OlloApp.kt:344>) and [safety/block/temporary-access precedence](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/domain/RuleEngine.kt:22>).
- [Export/deletion](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/data/AppController.kt:263>), [review signing](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/build.gradle.kts:14>), [backup](<C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/AndroidManifest.xml:10>) and [privacy limits](<C:/Users/Daniël/Desktop/Codex/Kennis/company/ollo/PRIVACY-POLICY-DRAFT.md>).

## Optional opening purpose and timed check-in —18October source

On the ordinary decision prompt or completed quiz, **Choose a purpose and time** adds a preset purpose and5/10/20minute cue. **Open app** and **Open without a purpose** retain the ordinary route. Wait/quiz requirements and time rules still apply. The check-in appears only over its target app; Ollo cannot detect whether the task is done. **Done, go Home** clears the cue and goes Home; **Remind me in N minutes** restarts only the cue; **Continue without a reminder** clears it without withdrawing existing access. Screen-off, disconnect/restart, expired grant, a fresh prompt or a hard block clears the transient plan. This is not a persistent/background reminder or an access extension. A short return uses the existing two-minute grace. [[OPENING-PLAN-IMPLEMENTATION]] records emulator scope; no user result or OEM guarantee is established.

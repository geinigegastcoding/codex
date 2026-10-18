# Alternatives refinement —17 October 2026

**Status: verified locally; unpublished source change.** Local commit `41e2e44` on `codex/ollo-improvement-loop-2026-10-16`.

Done: a no-match result explains all three filters and offers “Wis filters”; each heart has the idea's title and native checked state. Existing orange theme, catalog, filtering, five-favorite policy and details dialog are preserved.

Verified:30 successful native assertions /15 candidate captures at normal/200% text,75 units, lint0/18 and12 review packaging checks. Large-text results are phased: nine completed assertions plus the six remaining recovery checks. Fast-fling locator failures, a first recovery miss and an overstrict current-viewport assertion are retained; only host drivers changed after the original app patch. Full configuration matched before restoration, ignoring JSON order of the favorites set. The original review APK and nineteen persistent files/settings were restored with exact hashes/owners/modes. No post-restore cold start; OS launch history remains.

Remaining: real TalkBack speech/focus and physical/OEM acceptance. The existing sixth-favorite eviction behavior is a separate product question. No favorite-cap change or user-install update was made.

- [Source](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/app/src/main/java/app/ollo/ui/OlloApp.kt:296)
- [Verification and preserved attempts](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/docs/evidence/2026-10-17-alternatives/results.json)
- [Normal no-match recovery](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/screenshots/2026-10-17-alternatives/after-1.0/no-matches.png)
- [200% recovery after scroll](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/screenshots/2026-10-17-alternatives/after-2.0-recovery-confirmed/no-matches-action.png)
- [Restoration evidence](C:/Users/Daniël/Desktop/Codex/projecten/Ollo/docs/evidence/2026-10-17-alternatives/restoration.json)

Candidate release SHA-256: `471243a24e1419390232b7bf7c9b03571dfed0a1d66ae1974273d4515d521a5d`. Development-signed; debug UI run only.

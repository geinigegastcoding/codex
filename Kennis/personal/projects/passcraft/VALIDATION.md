# Passcraft 0.1.0 validation

Completed 2026-10-16. Source: `C:/Users/Daniël/Desktop/Codex/projecten/Passcraft`.

## Installable artifact

- [Personal APK](<C:/Users/Daniël/Desktop/Codex/projecten/Passcraft/artifacts/Passcraft-0.1.0.apk>): 2,245,102 bytes; Android 9 or newer.
- SHA-256: `AA194127688A35C6C30FEA3C1A3AC27B7A0CB60C8F7466C45EFE5BD590A5FFD0`.
- Optimized release configuration, signed with the local development key. APK signature verification passed with v2 signing.
- Packaged permissions verified: NFC and the app-local receiver permission. No Internet or broad photo/storage access permission.

## Completed verification

The final build ran `assembleDebug`, `assembleDebugAndroidTest`, `lintDebug`, and `assembleRelease` successfully. [Build log](<C:/Users/Daniël/Desktop/Codex/projecten/Passcraft/artifacts/build-release.log>). Android lint reports 0 errors and 14 warnings: dependency version and optional Kotlin extension recommendations.

Seven instrumented checks passed on the dedicated Android 14 Pixel 6 emulator. [Test log](<C:/Users/Daniël/Desktop/Codex/projecten/Passcraft/artifacts/android-tests-final.log>). They verify exported QR decoding, read-only Wallet content URI handoff and offline permission, input validation, artwork resizing and persistent data integrity, Unicode NDEF parsing, account-free create/reopen flow, and disabled actions when NFC hardware is absent.

Manual checks exercised the real system photo picker, artwork import and display, export to Photos, and the manual Wallet import instructions when Wallet is unavailable. The optimized release APK was installed and launched successfully. Native captures cover light and dark appearance, font scale 1.3, editor, saved pass, export, and NFC states. [Capture folder](<C:/Users/Daniël/Desktop/Codex/screenshots/passcraft-2026-10-15>).

The finish review's two requested fixes were implemented and checked: readable system bar icons after a live theme change, and disabled scan/write controls with no settings recovery link when NFC hardware is absent. The scoped correction review resolved both findings and returned a ship disposition; that final disposition covers those two fixes.

## Real-phone limits

The emulator has neither physical NFC hardware nor Google Wallet installed. Physical tag reads/writes and completion of Google's own Wallet image-import flow still need a compatible phone. Passcraft cannot silently save to Wallet, set its sign-in/unlock policy, or guarantee its final layout. Its private local pass library requires no account, issuer setup, or server.

Unused downloaded Wallet button assets remain only in the ignored source artifacts directory because automatic approval review blocked their cleanup with “blocked by policy.” They are outside the APK and are not used by the app.

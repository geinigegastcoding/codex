# Passcraft — local Android app

Source: `C:\Users\Daniël\Desktop\Codex\projecten\Passcraft`.

## Use

Install [Passcraft 0.1.0 APK](<C:/Users/Daniël/Desktop/Codex/projecten/Passcraft/artifacts/Passcraft-0.1.0.apk>) on an Android 9+ phone. The optimized APK is approximately 2.2 MB. Copy it to your phone, open it, and allow installation from that file source if Android asks. It is signed with the local development key for personal testing; it is not a Play Store production release.

Create a pass, choose your picture, set its name and optional subtitle/notes/QR data/link, choose a color, and save. No account or server is needed. The app has no Internet permission and keeps pictures in its private storage until you explicitly export.

On a saved pass, choose **Continue in Google Wallet**. If the installed Wallet version supports image sharing, Passcraft opens its import flow with temporary read-only access to the exported PNG. Otherwise it saves the image to **Pictures/Passcraft** and explains how to import it: open Wallet, Add to Wallet, Everything else or Photo, choose the image, and confirm. Android 9 uses a system Save file dialog instead of direct Photos export.

**Save image to phone** exports without opening Wallet. Export includes the full picture without cropping, your details, and a scannable QR if configured. Deleting a local pass does not delete already exported pictures or any Wallet copy. Uninstalling Passcraft removes the private local library.

Google Wallet needs its own Google account. Its photo import and layout vary by version/region, and its own sign-in/unlock requirements apply. Passcraft cannot silently add a Wallet pass, override Wallet security, guarantee an arbitrary Wallet card background, or confirm that the user finished image import. No third-party issuer setup is required for this local photo-import route. See [Google's image import guide](https://support.google.com/wallet/answer/14188766?hl=en).

## NFC

Read NDEF tags and write URLs or UTF-8 text to compatible writable NDEF/formattable tags. Writing asks before replacing existing records, checks capacity where available, and never permanently locks tags. Scan and write stay disabled when NFC is absent or switched off. Physical NFC reads/writes require a real NFC phone and tags. Scanning tags does not make them Wallet NFC cards. Wallet contactless passes use Smart Tap with compatible readers and issuer configuration.

## Build and verify

From the source directory, run `./scripts/build.ps1` in PowerShell. It finds the installed Android SDK and JDK and handles Java's Windows socket issue with non-ASCII profile names. Other platforms can run `./gradlew assembleDebug lintDebug` with JDK 17+ and Android SDK 36 installed.

For the smaller personal APK, run `./scripts/build.ps1 -Tasks assembleRelease`. Output: `app/build/outputs/apk/release/app-release.apk`. Install with `adb install -r app/build/outputs/apk/release/app-release.apk`, or copy it to a phone and open it. The release build enables code and resource shrinking and uses the local debug signing key. Keep the same key for future updates to an existing installation; uninstalling to change keys removes the local library.

The default debug output is `app/build/outputs/apk/debug/app-debug.apk`.

Build checks: `./scripts/build.ps1 -Tasks assembleDebug,assembleDebugAndroidTest,lintDebug`.

With a dedicated emulator attached, run `./scripts/build.ps1 -Tasks connectedDebugAndroidTest`. The UI test expects an empty local library. Tests cover offline permissions, read-only Wallet image handoff, QR scanning of exported images, safe links, private persistence, image resizing, corruption reporting, Unicode NDEF records, create/reopen flow, and disabled NFC actions without hardware. Do not clear data on a user's real app installation to run tests.

See [validation evidence](VALIDATION.md) for the completed checks and real-phone testing limits.

## Assets

The launcher icon is original vector geometry. Interface icons are Android Material Icons. No bundled raster art, sample passes, hosted images, Google Wallet SDK, private credentials, or backend is included.

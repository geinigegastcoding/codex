---
title: Ollo production signing setup
updated: 2026-10-19
status: owner-inputs-pending
---

# Production signing

The 0.3.1-preview source wires a separate `ownerRelease` Gradle signing configuration. Release builds require all four owner inputs and an existing keystore file; there is no debug-signing fallback. Debug APKs remain available for free testing without production credentials. Build/negative-guard verification is being recorded in the current overnight evidence; a successful owner-signed production build is still pending.

| Environment variable | Equivalent Gradle property | Owner supplies |
|---|---|---|
| `OLLO_RELEASE_STORE_FILE` | `olloReleaseStoreFile` | Path to the selected owner keystore |
| `OLLO_RELEASE_STORE_PASSWORD` | `olloReleaseStorePassword` | Keystore password |
| `OLLO_RELEASE_KEY_ALIAS` | `olloReleaseKeyAlias` | Correct signing-key alias |
| `OLLO_RELEASE_KEY_PASSWORD` | `olloReleaseKeyPassword` | Key password |

Provide these through the local process environment or a secure CI secret mechanism. Do not commit the keystore or passwords, put passwords on a shared command line, or copy them into notes/logs. They are not Android BuildConfig fields. No owner key has been generated, selected, copied or accessed during this run.

Also supply the separate public RevenueCat Google Play key through `OLLO_REVENUECAT_PRODUCTION_API_KEY` / `olloRevenueCatProductionApiKey`, beginning `goog_`. The `test_` key remains debug-only. Dashboard/catalog/paywall configuration is still owner-deferred; no login request is needed now. See [[REVENUECAT-INTEGRATION]].

After the owner inputs exist, use Gradle:

```powershell
./scripts/build-windows.ps1 -Tasks @(':app:assembleRelease', ':app:testDebugUnitTest', ':app:lintRelease', ':app:verifyLicenseLibraryList')
./scripts/verify-release.ps1 -ApkPath app/build/outputs/apk/release/app-release.apk -SdkRoot $env:ANDROID_HOME -ExpectedSignerSha256 '<OWNER_APK_SIGNER_SHA256>'
```

The fingerprint placeholder must be replaced by the independently confirmed certificate for the intended APK distribution. Omit review/debug overrides in production validation. A Play upload certificate and the certificate Play uses for installed APKs may differ; record which artifact each fingerprint identifies.

The existing development signer is `561d5c50fb80b9a370f6fe08ee916e6b201e4c7b6ef9e1bb0dd8e57ecf260232`. It differs from the earlier 0.1.1 installation lineage recorded in the app README. Preserve signing continuity when choosing the real key. An incompatible-signature install failure is not a reason to uninstall and lose the owner's local data.

Signing alone does not clear the reported blocking bugs, physical-device checks, RevenueCat real-purchase acceptance, five Google SDK-terms reviews, store declarations or privacy/contact inputs. See [[BACKLOG]].

[Android's signing guide](https://developer.android.com/studio/publish/app-signing), reviewed19October2026, explains APK signatures, debug-certificate restrictions, update continuity and Play's upload/app-signing distinction. The variable names and fail-closed Gradle implementation above are Ollo's local configuration.

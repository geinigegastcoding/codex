# Luna APK signing across the laptop and main PC

Updated: 2026-10-15.

Luna (Test) uses package `com.magisdata.luna.debug`. The laptop APK is signed with its local Android debug keystore, `%USERPROFILE%/.android/debug.keystore`. Its signing certificate SHA-256 is:

```text
56:1D:5C:50:FB:80:B9:A3:70:F6:FE:08:EE:91:6E:6B:20:1E:4C:7B:6E:F9:E1:BB:0D:D8:E5:7E:CF:26:02:32
```

The main PC's certificate has not been available for comparison. Separate Android installations normally generate separate debug keys. Android requires compatible signing identities when updating an installed app, so a different computer's debug build can fail to install as an update. An APK's file hash is different from its signing certificate fingerprint. See [Android's app signing documentation](https://developer.android.com/studio/publish/app-signing).

## Use the original key on both computers

Use the key that signed the installed version you want to keep updating, normally the main PC's existing debug key. On the main PC, run this from the project folder:

```powershell
.\gradlew.bat :app:signingReport --no-configuration-cache
```

Under `Variant: debug`, check `Store`, `Alias`, and `SHA-256`. The store is usually `%USERPROFILE%/.android/debug.keystore`. Preserve that original file. Copy it securely to `%USERPROFILE%/.android/luna-debug.keystore` on both computers. Keep the private keystore outside Git and chat, with a private backup. This configuration supports the standard Android debug alias `androiddebugkey` and standard debug passwords; production/upload keys have separate signing requirements.

On each computer, add or update this property in `%USERPROFILE%/.gradle/gradle.properties`, using that computer's actual absolute path and forward slashes:

```properties
LUNA_DEBUG_KEYSTORE=C:/Users/YOUR_USER/.android/luna-debug.keystore
```

To print the exact property line for the current Windows user:

```powershell
$lunaKeyPath = Join-Path $env:USERPROFILE '.android\luna-debug.keystore'
"LUNA_DEBUG_KEYSTORE=$($lunaKeyPath.Replace('\', '/'))"
```

The project reads this optional property in `app/build.gradle.kts` and applies it only to debug signing. A configured path that does not identify an existing file stops the build rather than silently generating another key. Without this property, Android's existing default debug signing still applies. No permanent signing property or original keystore was changed on the laptop during setup.

## Verify before distributing

After the same original key has been copied and configured, run on both computers:

```powershell
.\gradlew.bat :app:signingReport :app:assembleDebug --no-configuration-cache
```

The debug `SHA-256` values must match each other and the certificate of the installed build. The cache flag avoids a signing-report deserialization failure observed with the current Gradle/Android plugin versions. The rebuilt APK is `app/build/outputs/apk/debug/app-debug.apk`. The currently delivered APK still uses the laptop certificate above; it cannot acquire the main PC's identity until it is rebuilt with the main PC's private key. An old APK or a public certificate alone cannot supply that private signing key.

If an app has already been installed using the other key, export its diary in **You > Local backup** before uninstalling anything. Import that backup after installing the chosen signed build. JSON backups contain nutrition data and photo IDs, not photo files; uninstalling removes the local photos. An in-place update using the same key preserves app data.

## Verified locally on 2026-10-15

- `signingReport`, `assembleDebug`, and `assembleDebugAndroidTest` passed with `LUNA_DEBUG_KEYSTORE` pointing to a temporary copy of the laptop's original key, outside the repository. Both debug variants selected that configured file. The release variant remained unsigned.
- `apksigner verify --print-certs` passed for both generated APKs and reported the certificate above. The app APK's file SHA-256 remained `3F8404A51A8DE9975E1156D3B11E27A33FFFD64D949D294C5C7375823C1A30B3`.
- A build configured with a nonexistent key failed with the explicit `LUNA_DEBUG_KEYSTORE` message. It did not generate a replacement key. This was an expected negative check.
- No permanent user-level signing configuration was enabled. The main PC's original private key is still needed to activate matching signatures across both computers.

DashLab - Android dashboards

INSTALL
Copy app/build/outputs/apk/debug/app-debug.apk to an Android phone running
Android 8.0 or newer and open it to install. Android may ask you to allow
installation from the app you used to open the file. This APK uses a debug
signing key and is intended for local installation, not a Play Store release.

USE
1. Open DashLab and choose Shopify, YouTube Studio, Phantom, TikTok Studio,
   Stripe, or Amazon Seller.
2. The app closes while Android updates its launcher name and icon. Open the
   newly named app from your app drawer. Some launchers may remove an old
   home-screen shortcut when the icon changes.
3. Tap metrics, the wallet balance, token rows, or video rows to change their
   values. Charts update automatically. The analytics dashboards keep separate
   values for each date range; the wallet uses one balance across ranges.
4. Open the three-dot menu or Settings and choose Switch dashboard to change.

Dashboard data is stored locally. Phantom's send, receive, swap, and buy
controls simulate activity only; no real accounts,
wallets, or money are connected. Uninstalling the app removes its local data.

BUILD
Install JDK 17 and Android SDK platform 36, then from this directory run:
  gradlew.bat assembleDebug

The APK appears at app/build/outputs/apk/debug/app-debug.apk.
To check the data, chart calculations, and receive flow, run:
  node tests/model.test.js
  node tests/receive.test.js

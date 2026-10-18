# RevenueCat in Ollo — implementation and setup

Updated18October2026. Implemented in the Android source with SDK10.28.1. **All current features remain free during testing.** Settings → Ollo Pro opens a non-gating preview; purchases on this screen are Test Store simulations only. Build evidence:87units passed; lint0errors/18existing warnings;13debug-package checks passed; production-key and release/debug rejection checks passed as expected. SDK Test Store purchase/cancel/error/restore and entitlement activation were observed on an official Android16 emulator. Rebuilt UI confirmation passed30reviewed normal/200%captures, including Pro/editor rotation and onboarding footer/keyboard controls; owner-deferred dashboard/production configuration and real Google Play acceptance remain open. No real purchase or account-plan change was made.

## 1. Gradle and build keys

`app/build.gradle.kts` already contains:

```kotlin
implementation("com.revenuecat.purchases:purchases:10.28.1")
implementation("com.revenuecat.purchases:purchases-ui:10.28.1")
```

The supplied public Test Store key is already configured in ignored `local.properties` as `olloRevenueCatDebugApiKey`. Do not commit that local file or put a secret RevenueCat REST API key in an Android app. The public production Google Play SDK key is a different value beginning `goog_`.

The build reads separate debug/production keys from Gradle properties, then environment variables, then local.properties:

| Variant | Gradle/local property | Environment variable |
|---|---|---|
| Debug | `olloRevenueCatDebugApiKey` | `OLLO_REVENUECAT_DEBUG_API_KEY` |
| Release | `olloRevenueCatProductionApiKey` | `OLLO_REVENUECAT_PRODUCTION_API_KEY` |

```kotlin
buildFeatures { compose = true; buildConfig = true }
buildTypes {
    debug { buildConfigField("String", "REVENUECAT_API_KEY", "\"$revenueCatDebugKey\"") }
    release { buildConfigField("String", "REVENUECAT_API_KEY", "\"$revenueCatProductionKey\"") }
}
```

The existing `verifyRevenueCatReleaseKey` task rejects missing/non-Google production keys. A Test Store key is debug-only; the SDK deliberately rejects it in ordinary release builds. Do not enable its dangerous release override. Source verification: [Test Store](https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store), [Android installation](https://www.revenuecat.com/docs/getting-started/installation/android#installation).

Build with Gradle/JDK21, Android SDK36/build-tools36.0.0. On this Windows workspace:

```powershell
.\scripts\build-windows.ps1 `
  -JavaHome 'C:/Program Files/Android/openjdk/jdk-21.0.8' `
  -SdkRoot 'C:/Users/Daniël/AppData/Local/Android/Sdk' `
  -WorkRoot 'C:/Temp/ollo-gradle-studio' `
  -Tasks @(':app:assembleDebug', ':app:testDebugUnitTest', ':app:lintDebug', ':app:verifyLicenseLibraryList')
```

Output: `app/build/outputs/apk/debug/app-debug.apk`, version0.3.0-preview/code4. This debuggable review artifact is not a Play production package. Use Android Studio Device Manager for a disposable test emulator; the old review VM stays stopped.

## 2. Product catalog — owner/dashboard setup

**Owner decision18October: dashboard setup is deferred until later.** No web sign-in is required to keep implementing/testing local code. The temporary login tab was closed; the owner's own browser/dashboard was untouched. Catalog/entitlement/offering/hosted-paywall settings have **not** been made or verified. The supplied SDK key does not grant dashboard administration. The following is the saved setup checklist for later in the existing Ollo project:

- Confirm the supplied test key belongs to that project/app.
- Create or verify entitlement **`ollo_pro`**.
- In **Test Store**, create or verify one-time/non-consumable product **`lifetime`**. Set the intended test price; around€15 is the owner's hypothesis, not a price hardcoded in the app.
- Attach that product to `ollo_pro`.
- Create or verify an offering, e.g. `default`, mark it current, and add a **Lifetime** package mapped to this Test Store product.
- Attach a RevenueCat Paywall to that offering. Use the Ollo orange/white palette, the existing pixel mascot, clear one-time price, visible dismissal and restore. Label all test/unfinished value truthfully.
- Keep the current offering lifetime-only for this preview. The app enables the hosted preview only when its validated lifetime package is present and all offered product IDs are `lifetime`.
- Before production, separately configure the Google Play app `app.ollo`, Play credentials and **one-time product** `lifetime`; map the Google Play product to the same entitlement and offering package. Enter the separate Google Play public SDK key only in the production build configuration.
- Verify localized store prices and restore behavior through Play testing. Do not assume a Test Store purchase establishes Google Play production behavior. Do not publish a paywall promising unfinished extras.

Product graph: **current offering → Lifetime package → store-specific lifetime product → ollo_pro**. A lifetime product does not renew; cancellation/upgrade/downgrade subscription controls are irrelevant to this offer.

## 3. Configure once and observe real customer info

`OlloApplication` owns one `ProAccess`. MainActivity calls `billing.refresh()` on STARTED so returning to the app checks current information. RevenueCat's update listener receives refreshed CustomerInfo; it is not a push-notification channel. [Configuration documentation](https://www.revenuecat.com/docs/getting-started/configuring-sdk).

```kotlin
package app.ollo

import android.app.Application
import app.ollo.data.AppController
import app.ollo.data.ProAccess

class OlloApplication : Application() {
    lateinit var controller: AppController
        private set
    lateinit var billing: ProAccess
        private set
    override fun onCreate() {
        super.onCreate()
        controller = AppController(this)
        billing = ProAccess(this, BuildConfig.REVENUECAT_API_KEY)
    }
}

```

`ProAccess` below is the complete implemented adapter. It fetches customer info and offerings, accepts only active `ollo_pro`, validates the Lifetime/INAPP product, serializes overlapping actions and handles errors without inventing an unlock. No entitlement currently gates a feature. SDK errors preserve the last confirmed access; an explicit inactive entitlement revokes the displayed badge. SDK-managed anonymous IDs and receipts are used instead of a custom purchase database.

## 4. Native preview and RevenueCat Paywall

The complete `ProScreen` below uses existing Ollo native components and `PaywallDialog` from purchases-ui10.28.1. It provides a simulated native purchase, official hosted paywall presentation, restore, refresh, unavailable/loading/error states and a free exit. Store price comes from `StoreProduct.price.formatted`; there is no fabricated price fallback. [Paywall presentation](https://www.revenuecat.com/docs/tools/paywalls/displaying-paywalls).

Behavior to verify on a disposable emulator:

- Valid current offering loads localized price; missing catalog shows unavailable/retry.
- Simulated success grants the **badge only**, via CustomerInfo; cancel stays neutral.
- Pending payment never grants access from a purchase-start event; retry/error leaves the free app usable.
- Restore grants only active `ollo_pro`; wrong/missing/inactive entitlements do not grant.
- Restart/foreground refresh, offline failure and restore after reinstall are checked separately. Restoring purchases never restores deleted usage/rules/history.
- Large text, screen reader, Back/dismiss and rotation work on both the native page and hosted paywall.
- Default release inspection rejects debug APKs; explicit debug-test inspection is labeled nonproduction. Production builds require the correct key and owner signer, plus native/Play acceptance.

## 5. Customer Center — optional later

The purchases-ui dependency already contains Customer Center, but no navigation was added for this lifetime-only testing preview. The clear Restore purchase action covers the immediate need. RevenueCat documents Customer Center availability for Pro/Enterprise plans; confirm the existing account's eligibility and dashboard setup before exposing it. Do not change paid plans to activate it. Android refund/support capabilities differ from iOS. [Customer Center](https://www.revenuecat.com/docs/tools/customer-center).

Complete minimal Compose presentation for a future configured screen (not currently installed in Ollo navigation):

```kotlin
import androidx.compose.runtime.Composable
import com.revenuecat.purchases.ui.revenuecatui.customercenter.CustomerCenter

@Composable
fun PurchaseSupportScreen(onClose: () -> Unit) {
    CustomerCenter(onDismiss = onClose)
}
```

Refresh CustomerInfo after returning. Do not add subscription retention offers or renewal wording to a lifetime product.

## 6. Production boundaries and privacy

- All normal/current features remain free. Track future themes/custom presets/expanded content as proposals; ship meaningful extras before enabling production sales.
- No AdMob/rewarded-ad implementation is included. “One minute of ads buys one day” remains an experiment, with no exact ad-duration promise or fake reward.
- No app account, PostHog or Firebase service was configured. Transitive firebase-encoders codecs are present as libraries; that is not an installed Firebase analytics/auth/crash service. RevenueCat does introduce a pseudonymous customer identity, purchase history and purchase/paywall service traffic. Ollo does not pass selected apps, rules or usage history to it. Configuration/customer-info calls can happen at app startup, so avoid describing all network activity as optional paywall-only traffic.
- INTERNET, ACCESS_NETWORK_STATE and BILLING accompany the existing usage/boot/signature permissions. AD_ID is explicitly removed; the SDK's transitive ad-identifier helper is not an installed ad network. No attribution collection methods are called.
- RevenueCat's [Google Play Data safety guide](https://www.revenuecat.com/docs/platform-resources/google-platform-resources/google-plays-data-safety) requires purchase-history disclosure. Reconcile its purchase analytics/identifier handling and the actual SDK/paywall configuration with the final whole-app form; a missing standalone analytics SDK does not mean no purchase analytics.
- Local measurement deletion does not delete provider purchase records. Choose a real privacy contact and provider-data deletion/support procedure before launch. Cloud-backed manual exports remain a separate provider boundary.
- The runtime list contains123 library versions.17previously missing primary POMs are now retrieved/hash-verified;12Apache declarations are resolved and5Google SDK-terms distribution/attribution reviews remain open; a coordinate-list pass is not complete legal clearance.
- Release key, owner signing/Play setup, real device/OEM/TalkBack checks, Google SDK terms review and hosted policy/contact remain launch gates. No production readiness is claimed by a successful debug compile.

## Complete implemented Kotlin: ProAccess.kt

```kotlin
package app.ollo.data

import android.app.Activity
import android.content.Context
import app.ollo.BuildConfig
import com.revenuecat.purchases.CustomerInfo
import com.revenuecat.purchases.LogLevel
import com.revenuecat.purchases.Offering
import com.revenuecat.purchases.Package
import com.revenuecat.purchases.PackageType
import com.revenuecat.purchases.ProductType
import com.revenuecat.purchases.Purchases
import com.revenuecat.purchases.PurchasesConfiguration
import com.revenuecat.purchases.PurchasesError
import com.revenuecat.purchases.PurchasesErrorCode
import com.revenuecat.purchases.interfaces.PurchaseCallback
import com.revenuecat.purchases.interfaces.ReceiveCustomerInfoCallback
import com.revenuecat.purchases.interfaces.ReceiveOfferingsCallback
import com.revenuecat.purchases.interfaces.UpdatedCustomerInfoListener
import com.revenuecat.purchases.models.StoreTransaction
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow

const val PRO_ENTITLEMENT_ID = "ollo_pro"

data class ProState(
    val configured: Boolean = false,
    val loading: Boolean = false,
    val purchasing: Boolean = false,
    val isPro: Boolean = false,
    val testStore: Boolean = false,
    val offering: Offering? = null,
    val lifetimePackage: Package? = null,
    val message: String? = null,
)

/** RevenueCat owns purchase persistence; this class only reflects verified customer info. */
class ProAccess(context: Context, apiKey: String) {
    private val mutableState = MutableStateFlow(ProState())
    val state: StateFlow<ProState> = mutableState.asStateFlow()
    private val purchases: Purchases?
    private var refreshResponses = 0
    private var refreshError: String? = null

    init {
        val isTestStore = apiKey.trim().startsWith("test_", ignoreCase = true)
        if (!BuildConfig.DEBUG && isTestStore) {
            purchases = null
            mutableState.value = ProState(testStore = true, message = "Purchases are unavailable in this build.")
        } else if (apiKey.isBlank()) {
            purchases = null
            mutableState.value = ProState(message = "Purchases are not configured.")
        } else {
            Purchases.logLevel = LogLevel.WARN
            purchases = try {
                Purchases.configure(PurchasesConfiguration.Builder(context.applicationContext, apiKey).build())
            } catch (_: Exception) {
                null
            }
            mutableState.value = ProState(
                configured = purchases != null,
                testStore = isTestStore,
                message = if (purchases == null) "Purchases could not be configured." else null,
            )
            purchases?.updatedCustomerInfoListener = UpdatedCustomerInfoListener(::accept)
        }
    }

    @Synchronized
    fun refresh() {
        val sdk = purchases ?: return
        if (state.value.loading || state.value.purchasing) return
        refreshResponses = 2
        refreshError = null
        mutableState.value = mutableState.value.copy(loading = true, message = null)

        try {
            sdk.getOfferings(object : ReceiveOfferingsCallback {
                override fun onReceived(offerings: com.revenuecat.purchases.Offerings) {
                    val current = offerings.current
                    val lifetime = current?.availablePackages?.firstOrNull {
                        it.packageType == PackageType.LIFETIME &&
                            it.product.id == LIFETIME_PRODUCT_ID &&
                            it.product.type == ProductType.INAPP
                    }
                    mutableState.value = mutableState.value.copy(offering = current, lifetimePackage = lifetime)
                    finishRefresh(if (lifetime == null) "The lifetime purchase is not available right now." else null)
                }

                override fun onError(error: PurchasesError) = finishRefresh("Could not load purchase options. Try again.")
            })
        } catch (_: Exception) {
            finishRefresh("Could not load purchase options. Try again.")
        }

        try {
            sdk.getCustomerInfo(object : ReceiveCustomerInfoCallback {
                override fun onReceived(customerInfo: CustomerInfo) {
                    accept(customerInfo)
                    finishRefresh(null)
                }

                override fun onError(error: PurchasesError) = finishRefresh("Could not check purchases. Try again.")
            })
        } catch (_: Exception) {
            finishRefresh("Could not check purchases. Try again.")
        }
    }

    @Synchronized
    fun restore() {
        val sdk = purchases ?: return
        if (state.value.loading || state.value.purchasing) return
        mutableState.value = mutableState.value.copy(loading = true, message = null)
        try {
            sdk.restorePurchases(object : ReceiveCustomerInfoCallback {
                override fun onReceived(customerInfo: CustomerInfo) {
                    accept(customerInfo)
                    mutableState.value = mutableState.value.copy(
                        loading = false,
                        message = if (state.value.isPro) "Purchase restored." else "No active Ollo Pro purchase was found.",
                    )
                }

                override fun onError(error: PurchasesError) {
                    mutableState.value = mutableState.value.copy(loading = false, message = "Could not check purchases. Try again.")
                }
            })
        } catch (_: Exception) {
            mutableState.value = mutableState.value.copy(loading = false, message = "Could not restore purchases. Try again.")
        }
    }

    @Synchronized
    fun purchase(activity: Activity) {
        val sdk = purchases ?: return
        if (state.value.purchasing || state.value.loading) return
        val product = state.value.lifetimePackage ?: run {
            mutableState.value = mutableState.value.copy(message = "The lifetime purchase is not available right now.")
            return
        }
        mutableState.value = mutableState.value.copy(purchasing = true, message = null)
        try {
            sdk.purchase(com.revenuecat.purchases.PurchaseParams.Builder(activity, product).build(), object : PurchaseCallback {
                override fun onCompleted(storeTransaction: StoreTransaction, customerInfo: CustomerInfo) {
                    accept(customerInfo)
                    mutableState.value = mutableState.value.copy(
                        purchasing = false,
                        message = if (state.value.isPro) "Ollo Pro is active." else "Purchase is processing. Ollo Pro will unlock when confirmed.",
                    )
                }

                override fun onError(error: PurchasesError, userCancelled: Boolean) {
                    mutableState.value = mutableState.value.copy(
                        purchasing = false,
                        message = when {
                            userCancelled || error.code == PurchasesErrorCode.PurchaseCancelledError -> null
                            error.code == PurchasesErrorCode.PaymentPendingError -> "Purchase is pending. Ollo Pro will unlock when confirmed."
                            else -> "Could not complete the purchase. Try again."
                        },
                    )
                }
            })
        } catch (_: Exception) {
            mutableState.value = mutableState.value.copy(purchasing = false, message = "Could not complete the purchase. Try again.")
        }
    }

    fun accept(customerInfo: CustomerInfo) {
        mutableState.value = mutableState.value.copy(
            isPro = customerInfo.entitlements.active.containsKey(PRO_ENTITLEMENT_ID),
        )
    }

    fun clearMessage() { mutableState.value = mutableState.value.copy(message = null) }

    @Synchronized
    private fun finishRefresh(error: String?) {
        if (refreshResponses <= 0) return
        if (refreshError == null) refreshError = error
        refreshResponses--
        if (refreshResponses == 0) {
            val message = refreshError ?: if (state.value.lifetimePackage == null) "The lifetime purchase is not available right now." else null
            mutableState.value = mutableState.value.copy(loading = false, message = message)
        }
    }

    private companion object {
        const val LIFETIME_PRODUCT_ID = "lifetime"
    }
}
```

## Complete implemented Kotlin: ProScreen.kt

```kotlin
package app.ollo.ui

import android.app.Activity
import android.content.Context
import android.content.ContextWrapper
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import app.ollo.OlloApplication
import com.revenuecat.purchases.CustomerInfo
import com.revenuecat.purchases.PurchasesError
import com.revenuecat.purchases.models.StoreTransaction
import com.revenuecat.purchases.ui.revenuecatui.PaywallDialog
import com.revenuecat.purchases.ui.revenuecatui.PaywallDialogOptions
import com.revenuecat.purchases.ui.revenuecatui.PaywallListener

@Composable fun ProScreen(back: () -> Unit) {
    val context = LocalContext.current
    val billing = (context.applicationContext as OlloApplication).billing
    val state by billing.state.collectAsStateWithLifecycle()
    var showPaywall by rememberSaveable { mutableStateOf(false) }
    var paywallMessage by rememberSaveable { mutableStateOf<String?>(null) }
    val activity = remember(context) { context.findActivity() }
    val busy = state.loading || state.purchasing
    val price = state.lifetimePackage?.product?.price?.formatted
    val testPurchaseReady = state.configured && state.testStore && !busy && !state.isPro && state.lifetimePackage != null
    val hostedReady = testPurchaseReady && state.offering?.availablePackages?.all { it.product.id == "lifetime" } == true
    LaunchedEffect(Unit) { billing.refresh() }

    Page("Make Ollo yours", "Ollo Pro · launch preview", back) {
        Row(Modifier.fillMaxWidth().padding(vertical = 12.dp), horizontalArrangement = Arrangement.spacedBy(16.dp)) {
            Mascot(80)
            Column(Modifier.weight(1f)) {
                Text("Calm, with character.", fontSize = 24.sp, fontWeight = FontWeight.Bold)
                Text("A little extra for your everyday Ollo.", color = Muted, modifier = Modifier.padding(top = 8.dp))
            }
        }
        Note("Every current feature is free while you test. This preview does not lock your apps, quizzes, routines or statistics.")
        Surface(color = Tint, shape = RoundedCornerShape(12.dp), modifier = Modifier.fillMaxWidth().padding(vertical = 16.dp)) {
            Column(Modifier.padding(20.dp)) {
                Text("Ultimate", fontSize = 22.sp, fontWeight = FontWeight.Bold)
                Text("Lifetime Pro · one-time purchase", color = Action, modifier = Modifier.padding(top = 4.dp))
                Text(if (state.testStore && price != null) "Test price: $price" else price ?: "Store price not available yet", fontSize = 28.sp, fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 14.dp))
                Text("No recurring subscription.", color = Muted, fontSize = 14.sp)
                Text("Ideas for Pro", fontWeight = FontWeight.Bold, modifier = Modifier.padding(top = 20.dp))
                Text("Extra learning packs, personal themes and custom presets.", modifier = Modifier.padding(top = 6.dp))
                Text("Pro extras are still being designed. They are not included as finished features in this test.", color = Muted, fontSize = 14.sp, modifier = Modifier.padding(top = 10.dp))
            }
        }
        if (state.testStore) Text("Test Store · simulated purchases, no real charge", color = Action, fontWeight = FontWeight.SemiBold)
        if (state.isPro) Note("Ollo Pro entitlement is active. All current features remain free for everyone during testing.")
        if (busy) Row(Modifier.padding(vertical = 16.dp), horizontalArrangement = Arrangement.spacedBy(12.dp)) {
            CircularProgressIndicator(Modifier.size(24.dp), color = Action)
            Text(if (state.purchasing) "Completing your test purchase…" else "Checking purchases…")
        }
        (paywallMessage ?: state.message)?.let { message ->
            Text(message, color = Ink, modifier = Modifier.padding(vertical = 12.dp).semantics { liveRegion = LiveRegionMode.Polite })
        }
        Primary(if (state.isPro) "Test purchase active" else "Try a test purchase", testPurchaseReady && activity != null) {
            paywallMessage = null; activity?.let(billing::purchase)
        }
        Secondary("Preview RevenueCat paywall", hostedReady) { paywallMessage = null; showPaywall = true }
        Secondary("Restore purchase", state.configured && !busy) { paywallMessage = null; billing.restore() }
        Secondary("Refresh purchase options", state.configured && !busy) { paywallMessage = null; billing.refresh() }
        Text("Restore checks your purchase access. It does not restore deleted settings or usage history.", color = Muted, fontSize = 13.sp, modifier = Modifier.padding(top = 8.dp))
        SectionTitle("Pro Lite · being explored")
        Text("We are exploring optional ad-earned access to selected extras. Ads and temporary Pro Lite access are not available in this build.", color = Muted)
        Secondary("Keep using Ollo for free") { back() }
    }
    if (showPaywall && state.offering != null && state.testStore) {
        val options = remember(state.offering) {
            PaywallDialogOptions.Builder()
                .setOffering(state.offering)
                .setShouldDisplayDismissButton(true)
                .setDismissRequest { showPaywall = false }
                .setListener(object : PaywallListener {
                    override fun onPurchaseCompleted(customerInfo: CustomerInfo, storeTransaction: StoreTransaction) {
                        billing.accept(customerInfo); showPaywall = false
                        paywallMessage = if (billing.state.value.isPro) "Test purchase confirmed." else "Purchase received. Pro access is not confirmed yet."
                    }
                    override fun onRestoreCompleted(customerInfo: CustomerInfo) {
                        billing.accept(customerInfo); showPaywall = false
                        paywallMessage = if (billing.state.value.isPro) "Purchase restored." else "No active Ollo Pro purchase was found."
                    }
                    override fun onPurchaseError(error: PurchasesError) { paywallMessage = "Purchase did not complete. Try again when you are ready." }
                    override fun onRestoreError(error: PurchasesError) { paywallMessage = "Could not restore purchases. Please try again." }
                    override fun onPurchaseCancelled() { paywallMessage = null }
                }).build()
        }
        PaywallDialog(options)
    }
}

private fun Context.findActivity(): Activity? = when (this) {
    is Activity -> this
    is ContextWrapper -> baseContext.takeUnless { it === this }?.findActivity()
    else -> null
}
```

Native SDK observation18October, unchanged f12649c debug APK on a fresh official Android16/Studio AVD: actual current offering supplied lifetime/INAPP at$99.99; the official RevenueCat paywall opened, simulated cancellation and failure were recoverable, simulated valid purchase confirmed ollo_pro, and native restore displayed Purchase restored with active entitlement. No real payment, dashboard login or catalog mutation occurred. The displayed RevenueCat default design and sandbox price are not the intended Ollo launch paywall or around€15price. Dashboard branding/production price/Google Play setup remain owner-deferred; native Google Play pending-payment/reinstall/OEM behavior remains unverified.

UI confirmation18October: candidate0e5e43f01e5635b9fb233d257c120d5635c06a369072f1b76a79456d835c19df retained the actual sandbox entitlement after install-r. The test price is explicitly labeled. Full pre/post Room config equality confirms deselections/setup survived and editor drafts were not silently saved.33offline XML assertions and28live action assertions cover30candidate viewports; overlapping scopes are separate. Real Play pending/reinstall/production restore, TalkBack/physical/OEM and minified RevenueCat release remain open.

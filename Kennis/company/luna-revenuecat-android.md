# Luna: RevenueCat Android integration

Updated: 2026-10-08. SDK version: 10.26.0.

The existing calorie tracker is restored in `E:\MData\projecten\calorie-tracker-android`. MainActivity starts `com.magisdata.luna.ui.LunaApp`, preserving the food log, assets, recipes, widgets, local data handling, WorkOS sign-in, and analytics consent. The previous folder is retained at `E:\MData\projecten\calorie-tracker-android-backup-20261008`.

RevenueCat controls are in **You > Luna Pro**. Existing food logging remains available; the subscription state exposes `hasPro` for any premium feature you choose to gate.

## 1. Open and run the actual Luna project

1. In Android Studio, open `E:\MData\projecten\calorie-tracker-android`.
2. Select **File > Sync Project with Gradle Files**.
3. Use Android Studio's bundled JDK for Gradle.
4. Select the **app** run configuration and your USB device.
5. Click **Run**. Debug builds appear as **Luna (Test)**, package `com.magisdata.luna.debug`. The production package remains `com.magisdata.luna`.

"Hello Android" came from the blank template. The restored MainActivity now starts LunaApp. If you launch an older template icon, use Run from this project to launch the current debug app.

The existing WorkOS dependency requires Kotlin 2.4.0. The Compose compiler and the built-in Android Kotlin compiler are aligned to that version. [Android's Kotlin version configuration](https://developer.android.com/build/releases/agp-9-0-0-release-notes).

## 2. Install RevenueCat with Gradle

Both the billing SDK and native UI SDK are pinned to `10.26.0`. This project uses a version catalog; its two SDK dependencies resolve to:

```kotlin
implementation("com.revenuecat.purchases:purchases:10.26.0")
implementation("com.revenuecat.purchases:purchases-ui:10.26.0")
```

Use the catalog references already installed in the module, without adding the same dependencies again. Maven Central is already configured. [Android installation](https://www.revenuecat.com/docs/getting-started/installation/android), [Paywall UI installation](https://www.revenuecat.com/docs/tools/paywalls/installation).


Complete current file: `gradle/libs.versions.toml`.

```toml
[versions]
agp = "9.4.1"
coreKtx = "1.17.0"
junit = "4.13.2"
junitVersion = "1.3.0"
espressoCore = "3.7.0"
lifecycleRuntimeKtx = "2.9.4"
activityCompose = "1.12.0"
kotlin = "2.4.0"
composeBom = "2026.02.01"
revenueCat = "10.26.0"

[libraries]
androidx-core-ktx = { group = "androidx.core", name = "core-ktx", version.ref = "coreKtx" }
junit = { group = "junit", name = "junit", version.ref = "junit" }
androidx-junit = { group = "androidx.test.ext", name = "junit", version.ref = "junitVersion" }
androidx-espresso-core = { group = "androidx.test.espresso", name = "espresso-core", version.ref = "espressoCore" }
androidx-lifecycle-runtime-ktx = { group = "androidx.lifecycle", name = "lifecycle-runtime-ktx", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-runtime-compose = { group = "androidx.lifecycle", name = "lifecycle-runtime-compose", version.ref = "lifecycleRuntimeKtx" }
androidx-lifecycle-viewmodel-compose = { group = "androidx.lifecycle", name = "lifecycle-viewmodel-compose", version.ref = "lifecycleRuntimeKtx" }
revenuecat-purchases = { module = "com.revenuecat.purchases:purchases", version.ref = "revenueCat" }
revenuecat-purchases-ui = { module = "com.revenuecat.purchases:purchases-ui", version.ref = "revenueCat" }
androidx-activity-compose = { group = "androidx.activity", name = "activity-compose", version.ref = "activityCompose" }
androidx-compose-bom = { group = "androidx.compose", name = "compose-bom", version.ref = "composeBom" }
androidx-compose-ui = { group = "androidx.compose.ui", name = "ui" }
androidx-compose-ui-graphics = { group = "androidx.compose.ui", name = "ui-graphics" }
androidx-compose-ui-tooling = { group = "androidx.compose.ui", name = "ui-tooling" }
androidx-compose-ui-tooling-preview = { group = "androidx.compose.ui", name = "ui-tooling-preview" }
androidx-compose-ui-test-manifest = { group = "androidx.compose.ui", name = "ui-test-manifest" }
androidx-compose-ui-test-junit4 = { group = "androidx.compose.ui", name = "ui-test-junit4" }
androidx-compose-material3 = { group = "androidx.compose.material3", name = "material3" }

[plugins]
android-application = { id = "com.android.application", version.ref = "agp" }
kotlin-compose = { id = "org.jetbrains.kotlin.plugin.compose", version.ref = "kotlin" }
```

Complete current file: `app/build.gradle.kts`.

```kotlin
plugins {
    alias(libs.plugins.android.application)
    alias(libs.plugins.kotlin.compose)
}

val revenueCatReleaseKey = providers.gradleProperty("REVENUECAT_ANDROID_API_KEY").orElse("")

android {
    namespace = "com.magisdata.luna"
    compileSdk {
        version = release(37)
    }

    defaultConfig {
        applicationId = "com.magisdata.luna"
        minSdk = 26
        targetSdk = 37
        versionCode = 1
        versionName = "1.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        buildConfigField("String", "POSTHOG_API_KEY", "\"${providers.gradleProperty("POSTHOG_API_KEY").orElse("").get()}\"")
        buildConfigField("String", "POSTHOG_HOST", "\"https://us.i.posthog.com\"")
        buildConfigField("String", "WORKOS_CLIENT_ID", "\"${providers.gradleProperty("WORKOS_CLIENT_ID").orElse("").get()}\"")
    }

    buildTypes {
        debug {
            applicationIdSuffix = ".debug"
            resValue("string", "app_name", "Luna (Test)")
            buildConfigField("String", "REVENUECAT_API_KEY", "\"test_DKAtDctoxdpmADqqcMeLGuFqvbQ\"")
        }
        release {
            buildConfigField("String", "REVENUECAT_API_KEY", "\"${revenueCatReleaseKey.get()}\"")
            optimization {
                enable = false
            }
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
        isCoreLibraryDesugaringEnabled = true
    }
    buildFeatures {
        compose = true
        buildConfig = true
        resValues = true
    }
    packaging {
        resources.excludes += "/META-INF/{AL2.0,LGPL2.1}"
    }
}

dependencies {
    implementation(platform(libs.androidx.compose.bom))
    implementation(libs.androidx.activity.compose)
    implementation(libs.androidx.compose.material3)
    implementation(libs.androidx.compose.ui)
    implementation(libs.androidx.compose.ui.graphics)
    implementation(libs.androidx.compose.ui.tooling.preview)
    implementation(libs.androidx.core.ktx)
    implementation(libs.androidx.lifecycle.runtime.ktx)
    implementation(libs.androidx.lifecycle.runtime.compose)
    implementation(libs.androidx.lifecycle.viewmodel.compose)
    implementation(libs.revenuecat.purchases)
    implementation(libs.revenuecat.purchases.ui)
    implementation("androidx.compose.foundation:foundation")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.browser:browser:1.8.0")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.10.2")
    implementation("androidx.glance:glance-appwidget:1.1.1")
    implementation("com.google.android.gms:play-services-code-scanner:16.1.0")
    implementation("com.posthog:posthog-android:3.64.1")
    implementation("com.workos:workos-android:0.2.1")
    coreLibraryDesugaring("com.android.tools:desugar_jdk_libs:2.1.5")
    testImplementation(libs.junit)
    androidTestImplementation(platform(libs.androidx.compose.bom))
    androidTestImplementation(libs.androidx.compose.ui.test.junit4)
    androidTestImplementation(libs.androidx.espresso.core)
    androidTestImplementation(libs.androidx.junit)
    debugImplementation(libs.androidx.compose.ui.test.manifest)
    debugImplementation(libs.androidx.compose.ui.tooling)
}

val validateRevenueCatReleaseKey = tasks.register("validateRevenueCatReleaseKey") {
    val apiKey = revenueCatReleaseKey
    doLast {
        require(apiKey.get().matches(Regex("goog_[A-Za-z0-9_]+"))) {
            "Set REVENUECAT_ANDROID_API_KEY to your public Google Play SDK key before building release."
        }
    }
}

tasks.configureEach {
    if (name == "preReleaseBuild") dependsOn(validateRevenueCatReleaseKey)
}
```

The supplied Test Store public key is configured in the **debug** build type. Release builds read `REVENUECAT_ANDROID_API_KEY` and fail validation until it contains a public Google Play SDK key beginning with `goog_`.

## 3. Initialize once in Application

The manifest registers LunaApplication, enables Internet access, and uses `singleTop` so a payment that backgrounds the app can complete. The existing WorkOS callback and widget declarations are retained. [Activity launch modes for purchases](https://www.revenuecat.com/docs/getting-started/installation/android#3-set-your-activitys-launchmode).


Complete current file: `app/src/main/AndroidManifest.xml`.

```xml
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />

    <application
        android:allowBackup="false"
        android:icon="@drawable/luna_logo"
        android:label="@string/app_name"
        android:name=".LunaApplication"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="@xml/backup_rules"
        android:supportsRtl="true"
        android:theme="@style/Theme.Luna">
        <meta-data
            android:name="com.google.mlkit.vision.DEPENDENCIES"
            android:value="barcode_ui" />
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:launchMode="singleTop"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <intent-filter>
                <action android:name="android.intent.action.VIEW" />
                <category android:name="android.intent.category.DEFAULT" />
                <category android:name="android.intent.category.BROWSABLE" />
                <data
                    android:scheme="${applicationId}"
                    android:host="callback" />
            </intent-filter>
        </activity>

        <receiver
            android:name=".widget.LunaWidgetReceiver"
            android:exported="true">
            <intent-filter>
                <action android:name="android.appwidget.action.APPWIDGET_UPDATE" />
            </intent-filter>
            <meta-data
                android:name="android.appwidget.provider"
                android:resource="@xml/luna_widget_info" />
        </receiver>
    </application>
</manifest>
```

Initialization happens once in Application.onCreate. A signed-in WorkOS user supplies a stable RevenueCat App User ID; otherwise RevenueCat manages an anonymous ID. Verbose SDK logs are limited to debug builds. Use public SDK keys in the app; keep RevenueCat secret API keys on your server. [SDK configuration](https://www.revenuecat.com/docs/getting-started/configuring-sdk).


Complete current file: `app/src/main/java/com/magisdata/luna/LunaApplication.kt`.

```kotlin
package com.magisdata.luna

import android.app.Application
import com.magisdata.luna.data.Analytics
import com.magisdata.luna.data.WorkOsAuth
import com.revenuecat.purchases.LogLevel
import com.revenuecat.purchases.Purchases
import com.revenuecat.purchases.PurchasesConfiguration

class LunaApplication : Application() {
    lateinit var workOsAuth: WorkOsAuth
        private set

    override fun onCreate() {
        super.onCreate()
        workOsAuth = WorkOsAuth(this)
        Purchases.logLevel = if (BuildConfig.DEBUG) LogLevel.DEBUG else LogLevel.ERROR
        Purchases.configure(
            PurchasesConfiguration.Builder(this, BuildConfig.REVENUECAT_API_KEY)
                .appUserID(workOsAuth.state.value.user?.id)
                .build()
        )
        Analytics.initialize(this)
        Analytics.capture("app opened")
    }
}
```

## 4. Retrieve customer info and check luna_pro

The ViewModel uses coroutine APIs, StateFlow, and the SDK customer-info listener. It retrieves customer info when the subscription section opens and when the app resumes. The SDK handles its cache; the listener is not a server push channel.

Access requires an active `luna_pro` entitlement belonging to the current billing identity. A cancelled subscription can stay active until its paid period ends; `willRenew == false` does not revoke access. Lifetime access has no expiration date. A purchase-completion callback alone does not unlock Pro. [Customer information and entitlement status](https://www.revenuecat.com/docs/customers/customer-info).

The implementation preserves the last known SDK customer info on retrieval errors, blocks purchases while access is unknown, serializes identity changes and restoration, and removes its SDK listener when cleared. It switches billing identity on WorkOS sign-in/sign-out and clears the previous customer's access while switching.


Complete current file: `app/src/main/java/com/magisdata/luna/data/Subscriptions.kt`.

```kotlin
package com.magisdata.luna.data

import android.util.Log
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.revenuecat.purchases.CustomerInfo
import com.revenuecat.purchases.Offering
import com.revenuecat.purchases.Purchases
import com.revenuecat.purchases.PurchasesError
import com.revenuecat.purchases.PurchasesErrorCode
import com.revenuecat.purchases.PurchasesException
import com.revenuecat.purchases.awaitCustomerInfo
import com.revenuecat.purchases.awaitLogIn
import com.revenuecat.purchases.awaitLogOut
import com.revenuecat.purchases.awaitOfferings
import com.revenuecat.purchases.awaitRestore
import com.revenuecat.purchases.interfaces.UpdatedCustomerInfoListener
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.flow.update
import kotlinx.coroutines.launch
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock

internal const val LUNA_PRO_ENTITLEMENT = "luna_pro"

internal data class SubscriptionState(
    val customerInfo: CustomerInfo? = null,
    val offering: Offering? = null,
    val identityReady: Boolean = false,
    val isLoading: Boolean = true,
    val isRestoring: Boolean = false,
    val error: String? = null,
    val message: String? = null
) {
    val proEntitlement get() = customerInfo?.entitlements?.get(LUNA_PRO_ENTITLEMENT)
        ?.takeIf { identityReady && it.isActive }
    val hasPro get() = proEntitlement != null
    val canPurchase get() = identityReady && customerInfo != null && !hasPro &&
        !isLoading && !isRestoring && offering?.availablePackages?.isNotEmpty() == true
}

internal fun subscriptionErrorMessage(error: PurchasesError): String? = when (error.code) {
    PurchasesErrorCode.PurchaseCancelledError -> null
    PurchasesErrorCode.PaymentPendingError ->
        "Your payment is pending. Luna Pro will unlock when it completes."
    PurchasesErrorCode.NetworkError ->
        "Could not connect. Check your connection and try again."
    PurchasesErrorCode.ConfigurationError, PurchasesErrorCode.InvalidCredentialsError ->
        "Plans are temporarily unavailable. Please try again later."
    else -> error.code.description
}

internal class SubscriptionViewModel : ViewModel(), UpdatedCustomerInfoListener {
    private val purchases = Purchases.sharedInstance
    private val identityLock = Mutex()
    private var desiredUserId: String? = null
    private var boundSdkUserId: String? = null
    private val mutableState = MutableStateFlow(SubscriptionState())
    val state = mutableState.asStateFlow()

    init {
        purchases.updatedCustomerInfoListener = this
    }

    fun setUserId(userId: String?) {
        desiredUserId = userId
        if (mutableState.value.identityReady && identityMatches()) {
            refresh()
            return
        }
        mutableState.value = SubscriptionState()
        viewModelScope.launch {
            identityLock.withLock {
                if (userId != desiredUserId) return@withLock
                try {
                    val info = when {
                        userId != null && purchases.appUserID != userId ->
                            purchases.awaitLogIn(userId).customerInfo
                        userId == null && !purchases.isAnonymous -> purchases.awaitLogOut()
                        else -> purchases.awaitCustomerInfo()
                    }
                    if (userId != desiredUserId) return@withLock
                    boundSdkUserId = purchases.appUserID
                    mutableState.update { it.copy(customerInfo = info, identityReady = true) }
                    loadOffering()
                } catch (error: PurchasesException) {
                    reportError(error.error)
                } finally {
                    if (userId == desiredUserId) mutableState.update { it.copy(isLoading = false) }
                }
            }
        }
    }

    fun refresh() {
        if (!mutableState.value.identityReady) {
            setUserId(desiredUserId)
            return
        }
        if (mutableState.value.isLoading || mutableState.value.isRestoring) return
        mutableState.update { it.copy(isLoading = true, error = null) }
        viewModelScope.launch {
            identityLock.withLock {
                try {
                    try {
                        onReceived(purchases.awaitCustomerInfo())
                    } catch (error: PurchasesException) {
                        reportError(error.error)
                    }
                    loadOffering()
                } finally {
                    mutableState.update { it.copy(isLoading = false) }
                }
            }
        }
    }

    private suspend fun loadOffering() {
        try {
            val offering = purchases.awaitOfferings().current
            mutableState.update { it.copy(offering = offering) }
            if (offering?.availablePackages.isNullOrEmpty()) {
                mutableState.update { it.copy(error = "Plans are temporarily unavailable. Please try again later.") }
                Log.w("LunaBilling", "No current offering with packages is configured")
            }
        } catch (error: PurchasesException) {
            reportError(error.error)
        }
    }

    fun restorePurchases() {
        if (!mutableState.value.identityReady || mutableState.value.isLoading || mutableState.value.isRestoring) return
        mutableState.update { it.copy(isRestoring = true, error = null, message = null) }
        viewModelScope.launch {
            identityLock.withLock {
                try {
                    restoreCompleted(purchases.awaitRestore())
                } catch (error: PurchasesException) {
                    reportError(error.error)
                } finally {
                    mutableState.update { it.copy(isRestoring = false) }
                }
            }
        }
    }

    override fun onReceived(customerInfo: CustomerInfo) {
        if (mutableState.value.identityReady && identityMatches()) {
            mutableState.update { it.copy(customerInfo = customerInfo) }
        }
    }

    fun purchaseCompleted(customerInfo: CustomerInfo) {
        onReceived(customerInfo)
        mutableState.update {
            it.copy(error = null, message = if (it.hasPro) "Luna Pro is active." else
                "Purchase completed. Your access is still being confirmed; try refreshing.")
        }
    }

    fun restoreCompleted(customerInfo: CustomerInfo) {
        onReceived(customerInfo)
        mutableState.update {
            it.copy(error = null, message = if (it.hasPro) "Luna Pro has been restored." else
                "No active Luna Pro purchase was found.")
        }
    }

    fun reportError(error: PurchasesError) {
        mutableState.update { it.copy(error = subscriptionErrorMessage(error), message = null) }
        if (error.code != PurchasesErrorCode.PurchaseCancelledError) {
            Log.w("LunaBilling", "RevenueCat operation failed: ${error.code}")
        }
    }

    private fun identityMatches(): Boolean = purchases.appUserID == boundSdkUserId &&
        (desiredUserId?.let { purchases.appUserID == it } ?: purchases.isAnonymous)

    override fun onCleared() {
        if (purchases.updatedCustomerInfoListener === this) purchases.removeUpdatedCustomerInfoListener()
        super.onCleared()
    }
}
```

## 5. Present the managed Paywall and Customer Center

The native Paywall uses the current Offering and the `luna_pro` entitlement. RevenueCat handles package selection, localized prices, and the purchase transaction. Completion and restoration callbacks update customer info; errors return to the subscription card. Cancellation does not grant access or become an error, and pending payments wait for an active entitlement.

The card includes user-triggered **Restore purchases**. Do not call restoration automatically at startup. [Presenting Paywalls](https://www.revenuecat.com/docs/tools/paywalls/displaying-paywalls), [Restoring purchases](https://www.revenuecat.com/docs/getting-started/restoring-purchases).

**Manage purchases** opens a full-screen Customer Center, with restoration and promotional-purchase callbacks, back navigation, and an access refresh on dismissal. Customer Center is useful once you offer subscriptions and need self-service management; its Dashboard configuration and RevenueCat plan eligibility still apply. It is currently available on RevenueCat Pro and Enterprise plans. [Customer Center availability](https://www.revenuecat.com/docs/tools/customer-center), [Android integration](https://www.revenuecat.com/docs/tools/customer-center/customer-center-integration-android).


Complete current file: `app/src/main/java/com/magisdata/luna/ui/SubscriptionCard.kt`.

```kotlin
package com.magisdata.luna.ui

import androidx.activity.compose.BackHandler
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.LinearProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.OutlinedCard
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Dialog
import androidx.compose.ui.window.DialogProperties
import androidx.lifecycle.Lifecycle
import androidx.lifecycle.LifecycleEventObserver
import androidx.lifecycle.compose.LocalLifecycleOwner
import androidx.lifecycle.compose.collectAsStateWithLifecycle
import androidx.lifecycle.viewmodel.compose.viewModel
import com.magisdata.luna.data.LUNA_PRO_ENTITLEMENT
import com.magisdata.luna.data.SubscriptionViewModel
import com.revenuecat.purchases.CustomerInfo
import com.revenuecat.purchases.PurchasesError
import com.revenuecat.purchases.customercenter.CustomerCenterListener
import com.revenuecat.purchases.models.StoreTransaction
import com.revenuecat.purchases.ui.revenuecatui.PaywallDialog
import com.revenuecat.purchases.ui.revenuecatui.PaywallDialogOptions
import com.revenuecat.purchases.ui.revenuecatui.PaywallListener
import com.revenuecat.purchases.ui.revenuecatui.customercenter.CustomerCenter
import com.revenuecat.purchases.ui.revenuecatui.customercenter.CustomerCenterOptions
import java.text.DateFormat

@Composable
internal fun LunaProCard(userId: String?, subscriptions: SubscriptionViewModel = viewModel()) {
    val state by subscriptions.state.collectAsStateWithLifecycle()
    var showPaywall by rememberSaveable { mutableStateOf(false) }
    var showCustomerCenter by rememberSaveable { mutableStateOf(false) }
    val lifecycleOwner = LocalLifecycleOwner.current

    LaunchedEffect(userId) { subscriptions.setUserId(userId) }
    LaunchedEffect(state.hasPro, state.identityReady) {
        if (state.hasPro || !state.identityReady) showPaywall = false
        if (!state.identityReady) showCustomerCenter = false
    }
    DisposableEffect(lifecycleOwner, subscriptions) {
        val observer = LifecycleEventObserver { _, event ->
            if (event == Lifecycle.Event.ON_RESUME) subscriptions.refresh()
        }
        lifecycleOwner.lifecycle.addObserver(observer)
        onDispose { lifecycleOwner.lifecycle.removeObserver(observer) }
    }

    OutlinedCard {
        Column(Modifier.padding(16.dp), verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Text("Luna Pro", style = MaterialTheme.typography.titleLarge)
            Text(when {
                state.hasPro -> "Luna Pro is active."
                state.isLoading -> "Checking your access..."
                state.customerInfo == null -> "Your access could not be checked."
                else -> "Choose a plan for Luna Pro."
            })
            state.proEntitlement?.let { entitlement ->
                Text(entitlement.expirationDate?.let {
                    "Access through ${DateFormat.getDateInstance().format(it)}"
                } ?: "Lifetime access", style = MaterialTheme.typography.bodySmall)
            }
            if (state.isLoading || state.isRestoring) LinearProgressIndicator(Modifier.fillMaxWidth())
            state.error?.let { Text(it, color = MaterialTheme.colorScheme.error) }
            state.message?.let { Text(it, color = LunaTeal) }
            if (!state.hasPro) {
                Button(
                    onClick = { showPaywall = true },
                    enabled = state.canPurchase,
                    modifier = Modifier.fillMaxWidth(),
                    shape = RoundedCornerShape(14.dp)
                ) { Text("View plans") }
            }
            OutlinedButton(
                onClick = subscriptions::restorePurchases,
                enabled = state.identityReady && !state.isLoading && !state.isRestoring,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp)
            ) { Text(if (state.isRestoring) "Restoring purchases..." else "Restore purchases") }
            OutlinedButton(
                onClick = { showCustomerCenter = true },
                enabled = state.identityReady && state.customerInfo != null && !state.isLoading && !state.isRestoring,
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp)
            ) { Text("Manage purchases") }
            TextButton(onClick = subscriptions::refresh, enabled = !state.isLoading && !state.isRestoring) {
                Text("Refresh access")
            }
        }
    }

    if (showPaywall) {
        PaywallDialog(
            remember(state.offering, subscriptions) { PaywallDialogOptions.Builder()
                .setOffering(state.offering)
                .setRequiredEntitlementIdentifier(LUNA_PRO_ENTITLEMENT)
                .setDismissRequest { showPaywall = false; subscriptions.refresh() }
                .setListener(object : PaywallListener {
                    override fun onPurchaseCompleted(customerInfo: CustomerInfo, storeTransaction: StoreTransaction) {
                        subscriptions.purchaseCompleted(customerInfo)
                    }
                    override fun onRestoreCompleted(customerInfo: CustomerInfo) {
                        subscriptions.restoreCompleted(customerInfo)
                    }
                    override fun onPurchaseError(error: PurchasesError) { subscriptions.reportError(error) }
                    override fun onRestoreError(error: PurchasesError) { subscriptions.reportError(error) }
                })
                .build() }
        )
    }

    if (showCustomerCenter) {
        val dismiss = { showCustomerCenter = false; subscriptions.refresh() }
        Dialog(
            onDismissRequest = dismiss,
            properties = DialogProperties(usePlatformDefaultWidth = false, decorFitsSystemWindows = false)
        ) {
            BackHandler(onBack = dismiss)
            Surface(Modifier.fillMaxSize()) {
                CustomerCenter(
                    modifier = Modifier.fillMaxSize(),
                    options = remember(subscriptions) { CustomerCenterOptions.Builder().setListener(object : CustomerCenterListener {
                        override fun onRestoreCompleted(customerInfo: CustomerInfo) {
                            subscriptions.restoreCompleted(customerInfo)
                        }
                        override fun onRestoreFailed(error: PurchasesError) { subscriptions.reportError(error) }
                        override fun onPromotionalOfferSucceeded(customerInfo: CustomerInfo, transaction: StoreTransaction) {
                            subscriptions.purchaseCompleted(customerInfo)
                        }
                    }).build() },
                    onDismiss = dismiss
                )
            }
        }
    }
}
```

The existing YouScreen adds the card immediately after its heading:

```kotlin
LunaProCard(userId = workOsState.user?.id)
```

The containing LunaTheme already provides Material 3 colors and typography.

## 6. Configure products, entitlement, and Offering

In the RevenueCat project associated with the supplied key:

1. Open **Product catalog > Products** and create or verify these Test Store products. Choose your prices in the Dashboard.

| Display name | Product ID | Purchase type / duration | Standard package |
| --- | --- | --- | --- |
| Lifetime | `lifetime` | Non-consumable, one-time lifetime access | Lifetime (`$rc_lifetime`) |
| Yearly | `yearly` | Auto-renewing subscription, 1 year | Annual (`$rc_annual`) |
| Monthly | `monthly` | Auto-renewing subscription, 1 month | Monthly (`$rc_monthly`) |

2. In **Entitlements**, create or verify the exact identifier **luna_pro**.
3. Attach **all three products** to that entitlement.
4. In **Offerings**, create or use your main Offering (for example, `default`).
5. Add the three standard packages from the table and attach each matching Test Store product.
6. Set that Offering as the project's default. The app reads `offerings.current`, so targeting and future Offering changes can remain in the Dashboard.

Products define what is purchased, packages organize the plans, and the entitlement defines access. Package IDs are different from store product IDs. The SDK fetches prices and available packages; the app does not invent prices. [Product configuration](https://www.revenuecat.com/docs/offerings/products-overview), [Offerings and packages](https://www.revenuecat.com/docs/offerings/overview).

The integration test has verified that the current Test Store Offering returns `lifetime`, `yearly`, and `monthly`. A simulated lifetime purchase has also verified that it grants `luna_pro`.

## 7. Publish a Paywall and configure Customer Center

1. In RevenueCat **Paywalls**, create a Paywall for the Offering above.
2. Include Lifetime, Yearly, and Monthly package choices, a purchase button, and restore/close controls.
3. Add the correct terms and privacy policy URLs and accurate plan benefits.
4. Publish the Paywall and associate it with the Offering.
5. In **Customer Center**, configure support details and the subscription-management options appropriate to your app and RevenueCat plan.

The app integration is complete; Paywall design, legal/support URLs, and Customer Center settings are Dashboard configuration. No Dashboard changes were made by this integration. [RevenueCat Paywalls](https://www.revenuecat.com/docs/tools/paywalls), [Customer Center](https://www.revenuecat.com/docs/tools/customer-center).

## 8. Test locally and over USB

The supplied `test_` key selects RevenueCat Test Store. Its purchase dialog can simulate success, failure, or cancellation without a real charge. [Test Store](https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store).

In Android Studio, run the debug app on a connected phone with USB debugging enabled, then open **You > Luna Pro**:

- **View plans** should open the RevenueCat Paywall.
- A simulated successful purchase should activate Luna Pro after customer info confirms the entitlement.
- Cancellation should leave access unchanged.
- A simulated failure should show an error without granting access.
- Restore should update access or explain that no active Pro purchase was found.
- Returning from Customer Center should refresh access.
- Refresh or resume the app after a test subscription expires.
- Test offline access and retry; a network error must not invent access or discard known SDK access.

For a local build in PowerShell:

```powershell
Set-Location 'E:\MData\projecten\calorie-tracker-android'
$env:JAVA_HOME = 'C:\Program Files\Android\Android Studio\jbr'
.\gradlew.bat :app:testDebugUnitTest :app:assembleDebug :app:assembleDebugAndroidTest --console=plain
```

The APK is `app\build\outputs\apk\debug\app-debug.apk`.

Automated tests include the existing nutrition tests, the real You-tab subscription controls, entitlement/identity/error cases, and a network-dependent Test Store integration check. The simulated-purchase test explicitly requires the Test Store key and uses a unique sandbox customer.

## 9. Prepare Google Play release

1. Add/connect the Google Play app with package `com.magisdata.luna` in RevenueCat.
2. In Google Play Console, create `lifetime` as a non-consumable one-time product. Create `yearly` and `monthly` as subscriptions with active auto-renewing base plans for 1 year and 1 month.
3. Set prices and regional availability, activate the products/base plans, and import them into RevenueCat. For subscriptions, select both subscription ID and base-plan ID.
4. Attach the Google Play products to `luna_pro` and to the same Offering packages.
5. Configure the Google Play service account and server notifications using RevenueCat's store setup instructions. [Google Play product setup](https://www.revenuecat.com/docs/offerings/products-overview).
6. Obtain this app's public Google Play SDK key in RevenueCat.
7. Supply the real public key when building release:

```powershell
$env:ORG_GRADLE_PROJECT_REVENUECAT_ANDROID_API_KEY = Read-Host 'RevenueCat public Google Play SDK key (goog_)'
.\gradlew.bat :app:bundleRelease
```

The release validation task rejects missing keys and Test Store keys. This is intentional: the RevenueCat SDK also rejects Test Store keys in non-debuggable releases, including Google Play testing-track builds. Use the Google Play public key and Google's billing sandbox for those builds. [Test Store release restrictions](https://www.revenuecat.com/docs/test-and-launch/sandbox/test-store#test-store-api-keys-in-release-builds).

For server-backed paid features, validate access on the server using RevenueCat webhooks or its REST API. A client-side `hasPro` flag is a UI gate, not server authorization. Keep account IDs stable, retain restoration, allow the SDK to complete transactions, and test refunds, grace periods, and expiration before production rollout. [Server subscription status](https://www.revenuecat.com/docs/customers/customer-info#getting-subscription-status-via-the-rest-api).

Real Google Play checkout, production signing, and WorkOS sign-in against your live project require their external configuration and were not exercised by the Test Store checks.


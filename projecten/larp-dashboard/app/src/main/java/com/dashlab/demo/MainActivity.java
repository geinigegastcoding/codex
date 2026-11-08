package com.dashlab.demo;

import android.app.Activity;
import android.content.ComponentName;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.os.Bundle;
import android.view.View;
import android.webkit.JavascriptInterface;
import android.webkit.WebResourceRequest;
import android.webkit.WebResourceResponse;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.util.Collections;

public class MainActivity extends Activity {
    private static final String ORIGIN = "https://appassets.androidplatform.net/";
    private WebView webView;

    private static String mimeFor(String path) {
        switch (path) {
            case "/index.html": return "text/html";
            case "/app.css": return "text/css";
            case "/model.js":
            case "/app.js": return "text/javascript";
            default: return null;
        }
    }

    private static String aliasFor(String profile) {
        switch (profile) {
            case "shopify": return "Shopify";
            case "youtube": return "Youtube";
            case "phantom": return "Phantom";
            case "tiktok": return "Tiktok";
            case "stripe": return "Stripe";
            case "amazon": return "Amazon";
            default: return null;
        }
    }

    @Override public void onCreate(Bundle state) {
        super.onCreate(state);
        getWindow().setStatusBarColor(Color.rgb(18, 19, 22));
        getWindow().setNavigationBarColor(Color.rgb(18, 19, 22));
        webView = new WebView(this);
        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setAllowFileAccess(false);
        settings.setAllowContentAccess(false);
        settings.setAllowFileAccessFromFileURLs(false);
        settings.setAllowUniversalAccessFromFileURLs(false);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_NEVER_ALLOW);
        webView.addJavascriptInterface(new Bridge(), "DashLab");
        webView.setWebViewClient(new WebViewClient() {
            @Override public boolean shouldOverrideUrlLoading(WebView view, WebResourceRequest request) { return true; }
            @Override public WebResourceResponse shouldInterceptRequest(WebView view, WebResourceRequest request) {
                String path = request.getUrl().getPath();
                String mime = mimeFor(path == null ? "" : path);
                if ("https".equals(request.getUrl().getScheme())
                        && "appassets.androidplatform.net".equals(request.getUrl().getHost())
                        && mime != null) {
                    try {
                        return new WebResourceResponse(mime, "UTF-8", getAssets().open(path.substring(1)));
                    } catch (IOException ignored) { }
                }
                return new WebResourceResponse("text/plain", "UTF-8", 404, "Not found", Collections.emptyMap(), new ByteArrayInputStream(new byte[0]));
            }
        });
        setContentView(webView);
        webView.loadUrl(ORIGIN + "index.html");
    }

    private final class Bridge {
        @JavascriptInterface public String getProfile() {
            return getSharedPreferences("dashlab", MODE_PRIVATE).getString("profile", "");
        }

        @JavascriptInterface public void setAppearance(String profile) {
            runOnUiThread(() -> {
                boolean light = "shopify".equals(profile) || "tiktok".equals(profile) || "amazon".equals(profile);
                boolean lightStatus = "tiktok".equals(profile);
                getWindow().setStatusBarColor(lightStatus ? Color.rgb(247, 247, 248) : Color.rgb(16, 16, 17));
                getWindow().setNavigationBarColor(light ? Color.WHITE : Color.rgb(16, 16, 17));
                getWindow().getDecorView().setSystemUiVisibility((light ? View.SYSTEM_UI_FLAG_LIGHT_NAVIGATION_BAR : 0)
                        | (lightStatus ? View.SYSTEM_UI_FLAG_LIGHT_STATUS_BAR : 0));
            });
        }

        @JavascriptInterface public void selectProfile(String profile) {
            String selected = aliasFor(profile);
            if (selected == null) return;
            runOnUiThread(() -> {
                try {
                    PackageManager pm = getPackageManager();
                    if (!getSharedPreferences("dashlab", MODE_PRIVATE).edit().putString("profile", profile).commit()) {
                        throw new IllegalStateException("Could not save selected dashboard");
                    }
                    pm.setComponentEnabledSetting(new ComponentName(MainActivity.this, getPackageName() + "." + selected),
                            PackageManager.COMPONENT_ENABLED_STATE_ENABLED, PackageManager.DONT_KILL_APP);
                    for (String alias : new String[] {"Chooser", "Shopify", "Youtube", "Phantom", "Tiktok", "Stripe", "Amazon"}) {
                        if (!alias.equals(selected)) {
                            pm.setComponentEnabledSetting(new ComponentName(MainActivity.this, getPackageName() + "." + alias),
                                    PackageManager.COMPONENT_ENABLED_STATE_DISABLED, PackageManager.DONT_KILL_APP);
                        }
                    }
                    finishAndRemoveTask();
                } catch (RuntimeException exception) {
                    webView.evaluateJavascript("window.showNativeError()", null);
                }
            });
        }
    }

    @Override public void onBackPressed() {
        webView.evaluateJavascript("window.handleBack()", result -> {
            if (!"true".equals(result)) finish();
        });
    }
}

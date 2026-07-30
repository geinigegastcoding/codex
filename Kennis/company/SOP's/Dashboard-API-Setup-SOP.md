# Dashboard API Credentials Setup Guide

This guide explains how to acquire the necessary API keys and credentials to enable automatic data syncing for the Magisdata Dashboard.

## 1. Stripe Secret Key (`STRIPE_SECRET_KEY`)
1. Log in to your [Stripe Dashboard](https://dashboard.stripe.com/).
2. In the top right (or developer menu), toggle **Test mode** off (if you want live data).
3. Navigate to **Developers > API keys**.
4. Under "Standard keys", locate the **Secret key**.
5. Click **Reveal live key** and copy it. It usually starts with `sk_live_`.

## 2. Google Analytics 4 Property ID (`GA4_PROPERTY_ID`)
1. Log in to [Google Analytics](https://analytics.google.com/).
2. Click the **Admin** gear icon in the bottom left corner.
3. Under the **Property** column, click **Property Settings**.
4. You will see a numeric **Property ID** (e.g., `123456789`). Copy this number.

## 3. Google Application Credentials (`google-credentials.json`)
To access GA4 programmatically, you need a Service Account JSON key.

1. **Create Project**: Go to the [Google Cloud Console](https://console.cloud.google.com/) and create a new project (e.g., "Magisdata Dashboard").
2. **Enable API**: In the search bar, search for **Google Analytics Data API** and click **Enable**.
3. **Create Service Account**: 
   - Go to **IAM & Admin > Service Accounts**.
   - Click **+ CREATE SERVICE ACCOUNT**.
   - Name it (e.g., `ga4-bot`), click Create, and skip role assignments (click Done).
   - Copy the new bot's email address (e.g., `ga4-bot@project.iam.gserviceaccount.com`).
4. **Generate JSON Key**:
   - Click the email address you just created to open its details.
   - Go to the **Keys** tab > **Add Key** > **Create new key**.
   - Select **JSON** and click Create. The file will download to your computer.
   - Move this file to your `E:\MData\dashboard` directory and rename it to `google-credentials.json`.
5. **Grant GA4 Access to Bot**:
   - Go back to your normal **Google Analytics 4** dashboard.
   - Go to **Admin > Property Access Management**.
   - Click the **+** button to add a user.
   - Paste the bot's email address, set their role to **Viewer**, and hit Add.

## 4. Finalizing Your `.env` File
Create or open the `.env` file inside your `E:\MData\dashboard\` folder and paste the credentials:

```env
STRIPE_SECRET_KEY="sk_live_..."
GA4_PROPERTY_ID="123456789"
GOOGLE_APPLICATION_CREDENTIALS="E:\MData\dashboard\google-credentials.json"
```

Once saved, the "Sync External Data" button in your dashboard will automatically pull live metrics.

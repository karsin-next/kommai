# Meta WhatsApp Cloud API: Developer Sandbox Setup Guide

This guide will walk you through setting up a **Meta Developer Account** to connect your personal WhatsApp number for testing and validating your **Kommai** receptionist FOC (Free of Charge).

---

## Step 1: Create a Meta Developer App

1. Go to the [Meta for Developers Portal](https://developers.facebook.com/).
2. Log in using your personal Facebook credentials.
3. Click **My Apps** in the top navigation, then click **Create App**.
4. **Select Use Case**: Under the modern setup wizard, select **"Other"** or **"Connect with customers through WhatsApp"**. Click Next.
5. **App Type Selection**: If you selected "Other" in the previous step, select **"Business"** (this is mandatory to unlock business-level integrations like the WhatsApp Cloud API). Click Next.
6. **Configure App Details**:
   * Provide your **App Name** (e.g. `Kommai Receptionist Test`).
   * Enter your **App Contact Email**.
   * **Business Portfolio (Optional/Required)**: Select or create a Business Portfolio to link with the App. Meta now uses Business Portfolios (formerly Business Manager accounts) to control assets.
7. Click **Create App** (you may be asked to re-enter your Facebook password).

---

## Step 2: Set up WhatsApp Cloud API Integration

1. Once your app is created, you will be in the App Dashboard.
2. Under **"Add products to your app"** (or in the Left Sidebar under **"Products"**), find **"WhatsApp"** and click **Set up**.
3. Under the WhatsApp product section in the left sidebar, click **API Setup** (previously called Quickstart).
4. Meta will automatically associate a **Temporary Sandbox Phone Number** (the sending number) and a **Test Business Account** with your application.
5. In the **Temporary Access Token** section at the top, copy the token. Save this in your `.env` file as `WHATSAPP_TOKEN`.
   > [!IMPORTANT]
   > Temporary sandbox access tokens expire after **24 hours**. For a permanent live connection, follow the instructions in Step 4/5 or create a Permanent Access Token via **Business Settings > System Users** in your Meta Business Portfolio.


---

## Step 3: Register Your Test Recipient Phone Number

Since your App is in Sandbox mode, Meta restricts it to sending messages *only* to verified developer numbers to prevent spam.

1. In the **API Setup** page, scroll down to **Step 5: To receive messages and test templates**.
2. Under the **To** phone number selection dropdown, click **Manage Phone Number List**.
3. Input your personal WhatsApp phone number (e.g. `+60123456789`) and click Next.
4. Meta will send a WhatsApp verification code to your phone.
5. Enter the verification code in the popup to confirm your number.
6. Your personal number is now verified and ready to send and receive messages with your chatbot.

---

## Step 4: Configure Webhooks (Link to Vercel Live Build)

To route customer messages from Meta's servers to your Vercel Next.js backend, you must bind your webhook URL.

1. Go to the Vercel Dashboard for your project and retrieve your live deployment URL (e.g., `https://kommai.nextblaze.asia`).
2. In the left sidebar of the Meta Developer Console, under the **WhatsApp** product dropdown, click **Configuration**.
3. Click the **Edit** button next to the **Webhook URL** section.
4. Set the fields:
   * **Callback URL**: `https://your-vercel-domain.com/api/whatsapp`
   * **Verify Token**: Input a secure, random text string of your choice (e.g. `KommaiVerifyToken2026`).
5. Save these configurations in your Vercel Environment Variables:
   * `WHATSAPP_VERIFY_TOKEN` = The same verify token you typed above.
   * `WHATSAPP_APP_SECRET` = Found on the Meta App **Basic Settings** page (used to secure signatures).
   * `WHATSAPP_PHONE_NUMBER_ID` = Found on the **API Setup** page (Meta's Sandbox Phone Number ID).
6. Click **Verify and Save** in the Meta Developer popup. Meta will test your server's GET endpoint and confirm the binding.
7. Click **Manage Webhook Fields** inside the Webhook panel.
8. Locate **messages** and click **Subscribe** (this is vital; it instructs Meta to forward incoming customer text messages to your route).

---

## Step 5: Test the Booking Automation

1. Use your personal WhatsApp number (the recipient number you registered in Step 3).
2. Send a direct WhatsApp message to the **Sandbox Phone Number** (the sending number shown on your Meta API Setup page).
3. Try sending intents:
   * *"Hi, I want to book a massage session tomorrow at 3pm"*
   * *"Slot urut pukul 2pm hari Sabtu ni kosong tak?"*
4. The Kommai automated chatbot will parse the intent via Claude Haiku, verify slot availability in Supabase, and respond directly to your WhatsApp with confirmation and deposit instructions!

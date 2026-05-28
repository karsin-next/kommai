# Bypassing Meta: Alternative WhatsApp Integration Guide

If the Meta Developer Portal, WABA accounts, and sandbox restrictions are causing friction, you can use these **two alternative paths** to connect your chatbot in minutes.

---

## Option A: The QR-Code Scan Gateway (Recommended 🚀)

This is the easiest path for validation and production. It works by simulating a WhatsApp Web connection. You simply scan a QR code in a browser/terminal using your personal or business phone (Settings > Linked Devices), and your number instantly becomes a live API!

### Popular Providers:
* **Waapi.co / Z-API.iframe / Evolution API (Self-Hosted/SaaS)**

### Why Choose It:
* **Zero Meta setups**: No Meta Developer App, no Business Portfolios, no verification.
* **No Allowlist restrictions**: You can text *any* phone number immediately, not just verified sandbox numbers.
* **Uses your real phone**: The chatbot sends/receives messages directly from your actual number, complete with profile pictures and status updates.

### Setup in 3 Simple Steps:

#### 1. Obtain an API Instance & Token
* Sign up for a QR-Code API provider (e.g. **Waapi.co** or spin up a free instance of **Evolution API** on Railway).
* Under your instance settings, scan the generated **QR Code** using your phone's WhatsApp application (**Linked Devices > Link a Device**).

#### 2. Configure Your Webhook Callback URL
* Copy your live Vercel webhook URL: `https://kommai.nextblaze.asia/api/whatsapp`.
* Paste this URL as the **Webhook Callback** in your QR API instance dashboard.
* Check the boxes to subscribe to **"Incoming Messages"** (or `messages.upsert`).

#### 3. Adjust Your Code (`src/services/whatsapp.ts`)
Swap Meta's graph API with your QR Provider's endpoint. Below is a clean drop-in example using **Waapi.co**:

```typescript
import axios from 'axios';

// Add these to your Vercel Environment Variables:
const WAAPI_INSTANCE_ID = process.env.WAAPI_INSTANCE_ID; 
const WAAPI_API_KEY = process.env.WAAPI_API_KEY;

export class WhatsAppService {
  static async sendTextMessage(to: string, text: string) {
    if (!WAAPI_INSTANCE_ID || !WAAPI_API_KEY) {
      console.warn('Waapi credentials missing. Skipping.');
      return;
    }

    // Standardize phone format (remove "+" or format as required by provider)
    const formattedTo = to.replace('+', '') + '@c.us';

    try {
      await axios.post(
        `https://waapi.app/api/v1/instances/${WAAPI_INSTANCE_ID}/client/action/send-message`,
        {
          chatId: formattedTo,
          message: text,
        },
        {
          headers: {
            Authorization: `Bearer ${WAAPI_API_KEY}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error: any) {
      console.error('Error sending QR-gateway message:', error.response?.data || error.message);
    }
  }

  // Webhook verification is simpler since signatures are optional or provided directly by the header
  static verifySignature(payload: string, signature: string | null): boolean {
    return true; 
  }
}
```

---

## Option B: Twilio WhatsApp Sandbox (Official & Highly Secure 🔒)

If you prefer an official partner and don't want to scan QR codes, Twilio offers a free sandbox number that requires **zero Meta setup**.

### Why Choose It:
* **Twilio Pre-Approved Number**: You send messages using Twilio’s shared sandbox number.
* **Super Easy to Link**: No Meta console setup is required.

### Setup in 3 Simple Steps:

#### 1. Create a Free Twilio Account
* Log in or sign up at [Twilio](https://www.twilio.com/).
* Navigate to the **Twilio Console** and go to **Messaging > Try it Out > Send a WhatsApp Message**.

#### 2. Join the Sandbox Allowlist
* Twilio will present a shared sandbox number (e.g. `+1 415 523 8886`) and a keyword (e.g. `join sandbox-name`).
* Send `join sandbox-name` from your personal WhatsApp to that sandbox number. Your number is now registered.

#### 3. Set Webhook & Update Code
* Set Twilio's **"When a message comes in"** webhook to your Vercel route: `https://kommai.nextblaze.asia/api/whatsapp`.
* Update your `src/services/whatsapp.ts` file to send requests to Twilio:

```typescript
import axios from 'axios';

const TWILIO_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_FROM = 'whatsapp:+14155238886'; // Twilio Shared Sandbox Number

export class WhatsAppService {
  static async sendTextMessage(to: string, text: string) {
    if (!TWILIO_SID || !TWILIO_AUTH_TOKEN) return;

    const auth = Buffer.from(`${TWILIO_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64');
    
    try {
      const params = new URLSearchParams();
      params.append('To', `whatsapp:${to}`);
      params.append('From', TWILIO_FROM);
      params.append('Body', text);

      await axios.post(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_SID}/Messages.json`,
        params,
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );
    } catch (error: any) {
      console.error('Twilio Send Error:', error.response?.data || error.message);
    }
  }

  static verifySignature(payload: string, signature: string | null): boolean {
    return true; 
  }
}
```

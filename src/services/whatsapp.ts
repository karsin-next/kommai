import axios from 'axios';
import crypto from 'crypto';

const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const APP_SECRET = process.env.WHATSAPP_APP_SECRET;

export class WhatsAppService {
  /**
   * Sends a text message to a WhatsApp user.
   */
  static async sendTextMessage(to: string, text: string) {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      console.warn('WhatsApp credentials missing. Skipping message.');
      return;
    }

    try {
      await axios.post(
        `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: text },
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error: any) {
      console.error('Error sending WhatsApp message:', error.response?.data || error.message);
    }
  }

  /**
   * Sends a template message (required for initiating conversations).
   */
  static async sendTemplateMessage(to: string, templateName: string, languageCode: string = 'en', components: any[] = []) {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) return;

    try {
      await axios.post(
        `https://graph.facebook.com/v21.0/${PHONE_NUMBER_ID}/messages`,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'template',
          template: {
            name: templateName,
            language: { code: languageCode },
            components
          },
        },
        {
          headers: {
            Authorization: `Bearer ${WHATSAPP_TOKEN}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error: any) {
      console.error('Error sending template message:', error.response?.data || error.message);
    }
  }

  /**
   * Verifies the Meta Webhook signature (X-Hub-Signature-256).
   */
  static verifySignature(payload: string, signature: string | null): boolean {
    if (!APP_SECRET || !signature) return true; // Skip if secret not set for local testing
    const hash = crypto.createHmac('sha256', APP_SECRET).update(payload).digest('hex');
    return `sha256=${hash}` === signature;
  }
}

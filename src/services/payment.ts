import axios from 'axios';
import crypto from 'crypto';
import { supabaseAdmin } from '@/lib/supabase';

const API_KEY = process.env.BILLPLZ_API_KEY;
const COLLECTION_ID = process.env.BILLPLZ_COLLECTION_ID;
const WEBHOOK_SECRET = process.env.BILLPLZ_WEBHOOK_SECRET;
const BASE_URL = 'https://www.billplz.com/api/v3';

export class PaymentService {
  /**
   * Creates a Billplz payment link.
   */
  static async createPaymentLink(
    bookingId: string,
    amount: number,
    customerName: string,
    customerEmail: string,
    customerPhone: string
  ): Promise<string> {
    if (!API_KEY || !COLLECTION_ID) {
      throw new Error('Billplz credentials missing.');
    }

    const auth = Buffer.from(`${API_KEY}:`).toString('base64');

    try {
      const response = await axios.post(
        `${BASE_URL}/bills`,
        {
          collection_id: COLLECTION_ID,
          email: customerEmail || 'no-email@kommai.nextblaze.asia',
          mobile: customerPhone,
          name: customerName || 'Valued Customer',
          amount: Math.round(amount * 100), // cents
          callback_url: `${process.env.NEXT_PUBLIC_APP_URL}/api/billplz`,
          description: `Deposit for Booking #${bookingId}`,
          metadata: { booking_id: bookingId },
        },
        {
          headers: {
            Authorization: `Basic ${auth}`,
            'Content-Type': 'application/json',
          },
        }
      );

      return response.data.url;
    } catch (error: any) {
      console.error('Billplz error:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Verifies Billplz X-Signature.
   */
  static verifySignature(data: any): boolean {
    if (!WEBHOOK_SECRET) return true;
    
    const source = Object.keys(data)
      .filter(key => key !== 'x_signature')
      .sort()
      .map(key => `${key}${data[key]}`)
      .join('|');

    const signature = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(source)
      .digest('hex');

    return signature === data.x_signature;
  }

  /**
   * Idempotency check for webhooks.
   */
  static async isEventProcessed(eventId: string): Promise<boolean> {
    const { data } = await supabaseAdmin
      .from('webhook_events')
      .select('id')
      .eq('event_id', eventId)
      .single();

    return !!data;
  }

  static async recordEvent(eventId: string, type: string, result: any) {
    await supabaseAdmin.from('webhook_events').insert({
      event_id: eventId,
      event_type: type,
      result
    });
  }
}

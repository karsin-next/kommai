import { supabaseAdmin } from '@/lib/supabase';
import crypto from 'crypto';

const SALT = process.env.FREEMIUM_SALT || 'default_salt';

export class FreemiumService {
  /**
   * Checks if a customer is new or existing, and if the 25-limit is reached.
   * Increments the count if allowed.
   */
  static async checkAndIncrement(businessId: string, phone: string): Promise<{ allowed: boolean; isNew: boolean }> {
    const hash = crypto.createHmac('sha256', SALT).update(phone).digest('hex');

    // 1. Check if existing customer
    const { data: existing } = await supabaseAdmin
      .from('customer_uniques')
      .select('first_seen')
      .eq('business_id', businessId)
      .eq('customer_phone_hash', hash)
      .single();

    if (existing) return { allowed: true, isNew: false };

    // 2. Check current count for business
    const { data: business } = await supabaseAdmin
      .from('businesses')
      .select('unique_customer_count, plan')
      .eq('id', businessId)
      .single();

    if (!business) return { allowed: false, isNew: true };

    if (business.plan === 'free' && (business.unique_customer_count || 0) >= 25) {
      return { allowed: false, isNew: true };
    }

    // 3. Increment and record
    await Promise.all([
      supabaseAdmin.from('customer_uniques').insert({ business_id: businessId, customer_phone_hash: hash }),
      supabaseAdmin.rpc('increment_customer_count', { biz_id: businessId })
    ]);

    return { allowed: true, isNew: true };
  }
}

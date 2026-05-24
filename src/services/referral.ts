import { supabaseAdmin } from '@/lib/supabase';
import { Referral, ReferralCode, ReferralDashboard } from '@/types/referral';
import crypto from 'crypto';

export class ReferralService {
  private static REFERRAL_BONUS_MONTHS = parseInt(process.env.REFERRAL_BONUS_MONTHS || '1');
  private static REFERRAL_ANNUAL_CAP = parseInt(process.env.REFERRAL_ANNUAL_CAP || '6');
  private static PRO_PRICE_RM = 79;

  /**
   * Generates a unique referral code for a business.
   * Format: KOMREF-XXXXXX
   */
  static async generateReferralCode(businessId: string): Promise<string> {
    // 1. Check if already exists
    const { data: existing } = await supabaseAdmin
      .from('referral_codes')
      .select('code')
      .eq('business_id', businessId)
      .single();

    if (existing) return existing.code;

    // 2. Generate new code
    let code: string;
    let isUnique = false;
    
    do {
      const suffix = crypto.randomBytes(3).toString('hex').toUpperCase();
      code = `KOMREF-${suffix}`;
      
      const { data } = await supabaseAdmin
        .from('referral_codes')
        .select('id')
        .eq('code', code)
        .single();
      
      if (!data) isUnique = true;
    } while (!isUnique);

    // 3. Store
    await supabaseAdmin.from('referral_codes').insert({
      business_id: businessId,
      code
    });

    return code;
  }

  /**
   * Validates a referral code and ensures it's not a self-referral.
   */
  static async validateReferral(code: string, newBusinessPhone: string): Promise<{ valid: boolean; referrerId?: string; error?: string }> {
    const { data: referralCode } = await supabaseAdmin
      .from('referral_codes')
      .select('business_id, businesses(owner_phone)')
      .eq('code', code)
      .eq('is_active', true)
      .single();

    if (!referralCode) {
      return { valid: false, error: 'Invalid or inactive referral code.' };
    }

    // Check for self-referral
    if ((referralCode as any).businesses.owner_phone === newBusinessPhone) {
      return { valid: false, error: 'You cannot refer yourself.' };
    }

    return { valid: true, referrerId: referralCode.business_id };
  }

  /**
   * Records a pending referral when a new business signs up.
   */
  static async trackReferral(code: string, referredBusinessId: string): Promise<void> {
    const { referrerId, valid } = await this.validateReferral(code, ''); // Phone check skipped here as it should be handled in onboarding
    if (!valid || !referrerId) return;

    await supabaseAdmin.from('referrals').insert({
      referrer_business_id: referrerId,
      referred_business_id: referredBusinessId,
      referral_code: code,
      status: 'pending'
    });
  }

  /**
   * Processes rewards when a referred business pays their first invoice.
   */
  static async processReferralReward(referredBusinessId: string): Promise<void> {
    // 1. Find the pending referral
    const { data: referral } = await supabaseAdmin
      .from('referrals')
      .select('*')
      .eq('referred_business_id', referredBusinessId)
      .eq('status', 'pending')
      .single();

    if (!referral) return;

    // 2. Mark as completed
    await supabaseAdmin
      .from('referrals')
      .update({ status: 'completed', completed_at: new Date().toISOString() })
      .eq('id', referral.id);

    // 3. Reward Referrer (subject to annual cap)
    const rollingYearStart = new Date();
    rollingYearStart.setFullYear(rollingYearStart.getFullYear() - 1);

    const { count } = await supabaseAdmin
      .from('referrals')
      .select('id', { count: 'exact', head: true })
      .eq('referrer_business_id', referral.referrer_business_id)
      .eq('status', 'completed')
      .gte('completed_at', rollingYearStart.toISOString());

    const currentAnnualCount = count || 0;

    if (currentAnnualCount <= this.REFERRAL_ANNUAL_CAP) {
      const rewardAmount = this.REFERRAL_BONUS_MONTHS * this.PRO_PRICE_RM;
      await supabaseAdmin.from('credits').insert({
        business_id: referral.referrer_business_id,
        amount_rm: rewardAmount,
        reason: 'referral_reward',
        source_referral_id: referral.id
      });
      console.log(`Referral reward credited to ${referral.referrer_business_id}: RM${rewardAmount}`);
    } else {
      console.log(`Annual referral cap reached for ${referral.referrer_business_id}. No credit awarded.`);
    }

    // 4. Reward Referred (2nd month free)
    await supabaseAdmin.from('credits').insert({
      business_id: referral.referred_business_id,
      amount_rm: this.PRO_PRICE_RM,
      reason: 'referred_friend_reward',
      source_referral_id: referral.id
    });
  }

  /**
   * Returns referral statistics for the dashboard.
   */
  static async getReferralDashboard(businessId: string): Promise<ReferralDashboard> {
    const code = await this.generateReferralCode(businessId);
    
    const [pendingRes, completedRes, balanceRes] = await Promise.all([
      supabaseAdmin.from('referrals').select('id', { count: 'exact', head: true }).eq('referrer_business_id', businessId).eq('status', 'pending'),
      supabaseAdmin.from('referrals').select('id', { count: 'exact', head: true }).eq('referrer_business_id', businessId).eq('status', 'completed'),
      supabaseAdmin.from('business_credit_balances').select('*').eq('business_id', businessId).single()
    ]);

    // Calculate rolling annual count
    const rollingYearStart = new Date();
    rollingYearStart.setFullYear(rollingYearStart.getFullYear() - 1);
    const { count: annualCount } = await supabaseAdmin
      .from('referrals')
      .select('id', { count: 'exact', head: true })
      .eq('referrer_business_id', businessId)
      .eq('status', 'completed')
      .gte('completed_at', rollingYearStart.toISOString());

    return {
      code,
      link: `https://whatsupcrm.nextblaze.asia/onboard?ref=${code}`,
      pending_count: pendingRes.count || 0,
      completed_count: completedRes.count || 0,
      total_earned_rm: balanceRes.data?.total_earned || 0,
      available_balance_rm: balanceRes.data?.available_balance || 0,
      annual_referral_count: annualCount || 0,
      annual_cap: this.REFERRAL_ANNUAL_CAP
    };
  }
}

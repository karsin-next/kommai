import { supabaseAdmin } from '@/lib/supabase';

export class BillingService {
  /**
   * Applies available credits to an amount and returns the remaining due.
   */
  static async applyCredits(businessId: string, amount: number): Promise<{ remainingDue: number; creditsUsed: number }> {
    const { data: balance } = await supabaseAdmin
      .from('business_credit_balances')
      .select('available_balance')
      .eq('business_id', businessId)
      .single();

    const available = balance?.available_balance || 0;
    const creditsUsed = Math.min(available, amount);
    const remainingDue = Math.max(0, amount - creditsUsed);

    // If credits used, record in credits table
    if (creditsUsed > 0) {
      await supabaseAdmin.from('credits').insert({
        business_id: businessId,
        amount_rm: -creditsUsed,
        reason: 'applied_to_invoice'
      });
    }

    return { remainingDue, creditsUsed };
  }

  /**
   * Upgrades a business plan.
   */
  static async upgradePlan(businessId: string, plan: 'pro' | 'premium') {
    await supabaseAdmin
      .from('businesses')
      .update({ plan, plan_status: 'active' })
      .eq('id', businessId);
  }
}

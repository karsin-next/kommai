export interface ReferralCode {
  id: string;
  business_id: string;
  code: string;
  is_active: boolean;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_business_id: string;
  referred_business_id: string;
  referral_code: string;
  status: 'pending' | 'completed';
  completed_at?: string;
  created_at: string;
}

export interface Credit {
  id: string;
  business_id: string;
  amount_rm: number;
  reason: 'referral_reward' | 'referred_friend_reward' | 'manual';
  source_referral_id?: string;
  applied_invoice_id?: string;
  created_at: string;
  expires_at?: string;
}

export interface ReferralDashboard {
  code: string;
  link: string;
  completed_count: number;
  pending_count: number;
  total_earned_rm: number;
  available_balance_rm: number;
  annual_referral_count: number; // For the rolling 12 months cap
  annual_cap: number;
}

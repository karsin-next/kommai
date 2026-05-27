export interface BusinessConfig {
  services: Service[];
  operating_hours: OperatingHours;
  deposit_required: boolean;
  deposit_amount_rm: number;
  auto_confirm: boolean;
  reminder_hours_before: number;
  language: 'bm' | 'en';
  referral_enabled?: boolean;
}

export interface Service {
  name: string;
  duration_minutes: number;
  price_rm: number;
}

export interface OperatingHours {
  open: string; // "HH:mm"
  close: string; // "HH:mm"
}

export type Plan = 'free' | 'pro' | 'premium';
export type PlanStatus = 'active' | 'past_due' | 'cancelled';

export interface Business {
  id: string;
  name: string;
  owner_name: string;
  owner_phone: string;
  whatsapp_phone: string;
  config: BusinessConfig;
  plan: Plan;
  plan_status: PlanStatus;
  unique_customer_count: number;
  google_sheet_id: string;
  created_at: string;
  updated_at: string;
}

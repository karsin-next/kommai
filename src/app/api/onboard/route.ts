import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { ReferralService } from '@/services/referral';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, owner_name, owner_id, owner_phone, whatsapp_phone, config, referralCode } = body;

    // 1. Basic Validation
    if (!name || !whatsapp_phone || !owner_phone || !owner_id) {
      return NextResponse.json({ success: false, error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Create Business using Admin Client (bypasses RLS)
    const { data, error } = await supabaseAdmin
      .from('businesses')
      .insert({
        name,
        owner_name,
        owner_id,
        owner_phone,
        whatsapp_phone,
        plan: 'free',
        plan_status: 'active',
        config: config || {}
      })
      .select()
      .single();

    if (error) {
      console.error('Database error during onboarding:', error);
      return NextResponse.json({ success: false, error: error.message }, { status: 500 });
    }

    // 3. Track Referral if provided
    if (referralCode) {
      try {
        await ReferralService.trackReferral(referralCode, data.id);
        console.log(`Referral tracked for business ${data.id} using code ${referralCode}`);
      } catch (refErr) {
        console.error('Failed to track referral:', refErr);
        // We don't block onboarding if referral tracking fails
      }
    }

    return NextResponse.json({ success: true, data });
  } catch (err: any) {
    console.error('Onboarding API failed:', err);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

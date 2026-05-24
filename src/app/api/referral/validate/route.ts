import { NextRequest, NextResponse } from 'next/server';
import { ReferralService } from '@/services/referral';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const phone = searchParams.get('phone'); // Optional phone for self-referral check

  if (!code) {
    return NextResponse.json({ success: false, error: 'Code required' }, { status: 400 });
  }

  const result = await ReferralService.validateReferral(code, phone || '');
  
  if (!result.valid) {
    return NextResponse.json({ success: false, error: result.error });
  }

  return NextResponse.json({ success: true, referrerId: result.referrerId });
}

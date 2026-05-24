import { NextRequest, NextResponse } from 'next/server';
import { ReferralService } from '@/services/referral';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('id');

  if (!businessId) {
    return NextResponse.json({ success: false, error: 'Business ID required' }, { status: 400 });
  }

  try {
    const stats = await ReferralService.getReferralDashboard(businessId);
    return NextResponse.json({ success: true, stats });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { ReferralService } from '@/services/referral';

export async function POST(req: NextRequest) {
  try {
    const { code, businessId } = await req.json();

    if (!code || !businessId) {
      return NextResponse.json({ success: false, error: 'Code and Business ID required' }, { status: 400 });
    }

    // Use the trackReferral logic
    await ReferralService.trackReferral(code, businessId);

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

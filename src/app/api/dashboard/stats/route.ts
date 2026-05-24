import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const businessId = searchParams.get('id');

  if (!businessId) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

  const today = new Date().toISOString().split('T')[0];

  const [countRes, todayRes, upcomingRes, depositsRes] = await Promise.all([
    supabaseAdmin.from('customer_uniques').select('id', { count: 'exact', head: true }).eq('business_id', businessId),
    supabaseAdmin.from('bookings').select('id', { count: 'exact', head: true }).eq('business_id', businessId).eq('booking_date', today),
    supabaseAdmin.from('bookings').select('id', { count: 'exact', head: true }).eq('business_id', businessId).gt('booking_date', today).eq('status', 'confirmed'),
    supabaseAdmin.from('bookings').select('service_name').eq('business_id', businessId).eq('deposit_status', 'paid')
  ]);

  // For deposits, we'd ideally sum the RM, but for MVP we can just count paid deposits or do a simple calculation
  const totalDeposits = (depositsRes.data?.length || 0) * 30; // Mock calculation based on RM30 default

  return NextResponse.json({
    customers: countRes.count || 0,
    today: todayRes.count || 0,
    upcoming: upcomingRes.count || 0,
    deposits: totalDeposits
  });
}

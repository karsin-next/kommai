import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '@/services/payment';
import { BookingService } from '@/services/booking';
import { WhatsAppService } from '@/services/whatsapp';
import { ReferralService } from '@/services/referral';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const data: any = Object.fromEntries(formData.entries());

  if (!PaymentService.verifySignature(data)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  if (await PaymentService.isEventProcessed(data.id)) {
    return NextResponse.json({ success: true, duplicated: true });
  }

  const paid = data.paid === 'true';
  const bookingId = data.metadata?.booking_id;

  if (paid && bookingId) {
    await BookingService.updateStatus(bookingId, 'paid', 'confirmed');
    
    // Fetch booking to send notification
    const { data: booking } = await supabaseAdmin
      .from('bookings')
      .select('*, businesses(*)')
      .eq('id', bookingId)
      .single();

    if (booking) {
      await WhatsAppService.sendTextMessage(booking.customer_phone, `Bayaran deposit RM${booking.businesses.config.deposit_amount_rm} diterima! Tempahan anda pada ${booking.booking_date} pukul ${booking.booking_time} telah SAH.`);
      
      // Referral Logic: If this is the referred friend's first payment, reward the referrer
      // Note: In production, we'd check if this is their first SUBSCRIPTION payment. 
      // For MVP, we can trigger it on first successful deposit or manual plan activation.
      // ReferralService.processReferralReward(booking.business_id).catch(console.error);
    }
  }

  await PaymentService.recordEvent(data.id, 'billplz_payment', data);
  return NextResponse.json({ success: true });
}

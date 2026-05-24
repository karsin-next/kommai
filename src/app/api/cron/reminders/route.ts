import { NextRequest, NextResponse } from 'next/server';
import { BookingService } from '@/services/booking';
import { WhatsAppService } from '@/services/whatsapp';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const dateStr = tomorrow.toISOString().split('T')[0];

  const bookings = await BookingService.getPendingReminders(dateStr);

  for (const booking of bookings) {
    const msg = `Peringatan: Anda ada temujanji di ${booking.businesses.name} esok (${booking.booking_date}) pada pukul ${booking.booking_time}. Jumpa esok!`;
    await WhatsAppService.sendTextMessage(booking.customer_phone, msg);
    
    await supabaseAdmin
      .from('bookings')
      .update({ reminder_sent: true })
      .eq('id', booking.id);
  }

  return NextResponse.json({ success: true, count: bookings.length });
}

import { supabaseAdmin } from '@/lib/supabase';
import { WhatsAppService } from '@/services/whatsapp';

export class ReminderService {
  /**
   * Finds bookings occurring in the next 24-48 hours that haven't had a reminder sent.
   */
  static async processReminders(): Promise<number> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dateStr = tomorrow.toISOString().split('T')[0];

    const { data: bookings, error } = await supabaseAdmin
      .from('bookings')
      .select('*, businesses(name)')
      .eq('booking_date', dateStr)
      .eq('status', 'confirmed')
      .eq('reminder_sent', false);

    if (error) throw error;
    if (!bookings || bookings.length === 0) return 0;

    let sentCount = 0;
    for (const booking of bookings) {
      try {
        await WhatsAppService.sendTextMessage(
          booking.customer_phone,
          `Peringatan: Temujanji anda di ${booking.businesses.name} adalah pada esok, ${booking.booking_date} pukul ${booking.booking_time}. Jumpa anda nanti!`
        );
        
        await supabaseAdmin
          .from('bookings')
          .update({ reminder_sent: true })
          .eq('id', booking.id);
          
        sentCount++;
      } catch (err) {
        console.error(`Failed to send reminder for booking ${booking.id}:`, err);
      }
    }

    return sentCount;
  }
}

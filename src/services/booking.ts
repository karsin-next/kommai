import { supabaseAdmin } from '@/lib/supabase';
import { SheetsLibrary } from '@/lib/sheets';
import { Booking } from '@/types/booking';

export class BookingService {
  /**
   * Creates a new booking and triggers async Google Sheets export.
   */
  static async createBooking(bookingData: Partial<Booking>): Promise<Booking> {
    const { data, error } = await supabaseAdmin
      .from('bookings')
      .insert({
        ...bookingData,
        status: 'confirmed',
        deposit_status: 'pending_deposit'
      })
      .select('*, businesses(name, google_sheet_id)')
      .single();

    if (error) throw error;

    // Async export to Google Sheets
    if (data.businesses?.google_sheet_id) {
      SheetsLibrary.appendBooking(data.businesses.google_sheet_id, data).catch(console.error);
    }

    return data;
  }

  /**
   * Checks if a slot is available (no conflicting confirmed/completed bookings).
   */
  static async checkAvailability(businessId: string, date: string, time: string): Promise<boolean> {
    const { count } = await supabaseAdmin
      .from('bookings')
      .select('id', { count: 'exact', head: true })
      .eq('business_id', businessId)
      .eq('booking_date', date)
      .eq('booking_time', time)
      .in('status', ['confirmed', 'completed']);

    return (count || 0) === 0;
  }

  /**
   * Updates booking status (e.g. after payment).
   */
  static async updateStatus(bookingId: string, depositStatus: string, status: string): Promise<void> {
    const { error } = await supabaseAdmin
      .from('bookings')
      .update({ deposit_status: depositStatus, status: status })
      .eq('id', bookingId);

    if (error) throw error;
  }

  /**
   * Fetches bookings needing reminders for a specific date range.
   */
  static async getPendingReminders(date: string) {
    const { data } = await supabaseAdmin
      .from('bookings')
      .select('*, businesses(name, owner_phone)')
      .eq('booking_date', date)
      .eq('reminder_sent', false)
      .eq('status', 'confirmed');
    
    return data || [];
  }
}

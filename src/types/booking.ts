export type DepositStatus = 'pending_deposit' | 'paid' | 'expired' | 'refunded';
export type BookingStatus = 'confirmed' | 'cancelled' | 'completed' | 'no_show';

export interface Booking {
  id: string;
  business_id: string;
  customer_name: string;
  customer_phone: string;
  service_name: string;
  booking_date: string; // YYYY-MM-DD
  booking_time: string; // HH:mm:ss
  deposit_status: DepositStatus;
  billplz_bill_id?: string;
  reminder_sent: boolean;
  status: BookingStatus;
  created_at: string;
  updated_at: string;
}

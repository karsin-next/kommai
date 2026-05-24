import { google } from 'googleapis';
import { JWT } from 'google-auth-library';

export class SheetsLibrary {
  private static getAuth(): JWT {
    const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const key = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!email || !key) {
      throw new Error('Google Sheets credentials missing.');
    }

    return new JWT({
      email,
      key,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
  }

  /**
   * Appends a booking record to a Google Sheet.
   */
  static async appendBooking(sheetId: string, booking: any): Promise<void> {
    const auth = this.getAuth();
    const sheets = google.sheets({ version: 'v4', auth });

    const values = [
      [
        booking.id,
        booking.customer_name,
        booking.customer_phone,
        booking.service_name,
        booking.booking_date,
        booking.booking_time,
        booking.deposit_status,
        booking.status,
        new Date().toISOString(),
      ],
    ];

    try {
      await sheets.spreadsheets.values.append({
        spreadsheetId: sheetId,
        range: 'A:I',
        valueInputOption: 'USER_ENTERED',
        requestBody: { values },
      });
    } catch (error) {
      console.error('Error appending to Google Sheets:', error);
      // We don't throw here to prevent breaking the booking flow as per conventions
    }
  }

  /**
   * Updates an existing booking record in Google Sheets.
   * Note: This is more complex as it requires finding the row first.
   * For MVP, we can just append a status update or leave it as is.
   */
  static async updateBookingStatus(sheetId: string, bookingId: string, status: string): Promise<void> {
    // Optional: Implement finding row by ID and updating column
  }
}

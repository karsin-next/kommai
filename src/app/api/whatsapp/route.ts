import { NextRequest, NextResponse } from 'next/server';
import { WhatsAppService } from '@/services/whatsapp';
import { IntentService } from '@/services/intent';
import { ConfigService } from '@/services/config';
import { FreemiumService } from '@/services/freemium';
import { BookingService } from '@/services/booking';
import { PaymentService } from '@/services/payment';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge);
  }
  return new NextResponse('Forbidden', { status: 403 });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const signature = req.headers.get('x-hub-signature-256');

  // 1. Signature Check
  if (!WhatsAppService.verifySignature(JSON.stringify(body), signature)) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  const entry = body.entry?.[0];
  const value = entry?.changes?.[0]?.value;
  const message = value?.messages?.[0];
  const metadata = value?.metadata;

  if (!message || message.type !== 'text') return NextResponse.json({ success: true });

  const from = message.from;
  const text = message.text.body;
  const bizPhone = metadata.display_phone_number;

  // 2. Load Business
  const business = await ConfigService.getBusinessByPhone(bizPhone);
  if (!business) return NextResponse.json({ success: true });

  // 3. Detect Intent
  const result = await IntentService.detectIntent(text);

  // 4. Handle Hot Lead
  if (result.isUrgent || result.intent === 'human_handoff') {
    await WhatsAppService.sendTextMessage(business.owner_phone, `🔥 *HOT LEAD*: ${from} says: "${text}"`);
    await WhatsAppService.sendTextMessage(from, "Terima kasih! Kami sedang menyemak slot segera untuk anda. Sila tunggu sebentar.");
    return NextResponse.json({ success: true });
  }

  // 5. Handle Booking Flow
  if (result.intent === 'book_appointment' || result.intent === 'check_availability') {
    const gate = await FreemiumService.checkAndIncrement(business.id, from);
    if (!gate.allowed) {
      await WhatsAppService.sendTextMessage(from, "Maaf, kami tidak dapat menerima tempahan baru buat masa ini. Sila hubungi kami kemudian.");
      await WhatsAppService.sendTextMessage(business.owner_phone, `⚠️ Limit free 25 customer sudah dicapai! Upgrade sekarang di kommai.nextblaze.asia/upgrade untuk terima tempahan ${from}.`);
      return NextResponse.json({ success: true });
    }

    const { date, time, service } = result.entities;
    if (!date || !time) {
      await WhatsAppService.sendTextMessage(from, "Boleh beritahu tarikh dan masa yang anda mahu?");
      return NextResponse.json({ success: true });
    }

    const isAvailable = await BookingService.checkAvailability(business.id, date, time);
    if (!isAvailable) {
      await WhatsAppService.sendTextMessage(from, `Maaf, slot ${date} pukul ${time} sudah penuh. Ada tarikh lain?`);
      return NextResponse.json({ success: true });
    }

    if (result.intent === 'book_appointment') {
      const booking = await BookingService.createBooking({
        business_id: business.id,
        customer_phone: from,
        customer_name: result.entities.name || 'Valued Customer',
        service_name: service || business.config.services[0].name,
        booking_date: date,
        booking_time: time
      });

      if (business.config.deposit_required) {
        const payUrl = await PaymentService.createPaymentLink(booking.id, business.config.deposit_amount_rm, booking.customer_name, '', from);
        await WhatsAppService.sendTextMessage(from, `Slot anda disimpan! Sila bayar deposit RM${business.config.deposit_amount_rm} untuk confirm: ${payUrl}`);
      } else {
        await WhatsAppService.sendTextMessage(from, `Tempahan anda pada ${date} pukul ${time} telah disahkan! Jumpa nanti.`);
      }
    } else {
      await WhatsAppService.sendTextMessage(from, `Slot ${date} ${time} masih ada. Nak saya booking untuk anda?`);
    }
  } else {
    await WhatsAppService.sendTextMessage(from, "Terima kasih! Ada apa-apa yang saya boleh bantu dengan tempahan anda?");
  }

  return NextResponse.json({ success: true });
}

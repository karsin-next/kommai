---
name: send-upgrade-prompt
description: Sends the upgrade WhatsApp message to business owner when freemium limit is reached.
---

# Send Upgrade Prompt Skill

## Trigger
Called by `enforce-freemium` skill when a new customer would exceed the 25-customer limit on a free plan.

## Template (Bilingual)
```
Tahniah, [Owner Name]! 🎉

Anda kini telah mencapai 25 pelanggan unik di Kommai.asia — perkhidmatan automasi WhatsApp anda berjalan dengan baik!

Untuk terus menerima tempahan automatik tanpa had, tingkatkan ke **Pro (RM99/bulan)** sekarang.

✨ Apa yang anda dapat dengan Pro:
• Tempahan tanpa had (tiada lagi had 25 pelanggan)
• Handoff segera untuk pelanggan urgent
• Laporan & eksport WhatsApp terus ke Google Sheets

[Klik Sini untuk Upgrade]

Pasukan Kommai.asia
```

## Delivery
- Send via WhatsApp Cloud API to `business.owner_phone`.
- Log the upgrade prompt event (for conversion tracking).
- If owner replies "upgrade" or "nak upgrade", route to manual follow-up or payment link.

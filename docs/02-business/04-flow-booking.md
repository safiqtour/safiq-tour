# Flow Booking

## Alur Booking

`
Jamaah memilih paket
        ↓
Mengisi form registrasi online
        ↓
Data tersimpan di database (status: LEAD)
        ↓
CS melakukan follow up via WhatsApp/Telepon
        ↓
Jamaah setuju → CS konfirmasi ketersediaan kuota
        ↓
Booking dibuat (status: BOOKED)
        ↓
Generate nomor booking & invoice
        ↓
Jamaah melakukan pembayaran DP
`

## Aturan Booking

1. Satu booking dapat berisi multiple pilgrims (1 family)
2. Booking memerlukan data: Nama, No HP, Email, Alamat, Paket, Jadwal
3. Setiap booking memiliki nomor unik format: STMS/YYYY/MM/XXXXX
4. Booking dapat dibatalkan sebelum DP dibayar
5. Pembatalan setelah DP dikenakan biaya sesuai kebijakan

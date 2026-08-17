# Flow Pembayaran

## Alur Pembayaran

`
Booking dibuat → Generate invoice
        ↓
Jamaah memilih metode pembayaran:
  - Transfer bank (manual)
  - Virtual account (future)
  - Payment gateway (future)
        ↓
Jamaah melakukan transfer
        ↓
Upload bukti transfer (manual) atau auto-verifikasi (future)
        ↓
Admin / Sistem memverifikasi pembayaran
        ↓
Status pembayaran: PAID / VERIFIED
        ↓
Update status booking
`

## Status Pembayaran

| Status | Deskripsi |
|--------|-----------|
| UNPAID | Belum dibayar |
| WAITING_VERIFICATION | Bukti transfer diupload, menunggu verifikasi |
| PARTIAL | DP/Lunas sebagian |
| PAID | Lunas |
| REFUNDED | Dikembalikan |
| CANCELLED | Dibatalkan |

## Aturan Pembayaran

- Minimal DP: 50% dari harga paket
- Pelunasan: H-30 sebelum keberangkatan
- Mata uang: IDR (utama), USD (opsional)
- Setiap transaksi dicatat dengan audit trail

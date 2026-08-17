# Business Requirement Document — STMS

**Version:** 1.0  
**Status:** Draft

---

## 1. Pendahuluan

STMS (Safiq Tour Management System) adalah platform enterprise untuk mengelola seluruh operasional travel umroh. Sistem ini mencakup manajemen paket, jamaah, booking, pembayaran, dokumen, konten, dan marketing.

## 2. Ruang Lingkup

Sistem terdiri dari dua domain utama:

1. **Public Website** — Informasi perusahaan, paket umroh, blog, galeri, registrasi
2. **Admin Dashboard** — Manajemen data, operasional, laporan

## 3. Modul Utama

| Modul | Deskripsi |
|-------|-----------|
| Master Data | Country, City, Hotel, Airline, dll |
| Package Management | Paket umroh, jadwal, itinerary, fasilitas |
| Booking | Pemesanan paket oleh jamaah |
| Pilgrim | Data jamaah, dokumen, visa, passport |
| Payment | Pembayaran, invoice, riwayat transaksi |
| CMS | Artikel, kategori, tags, komentar |
| Media Library | Galeri, upload, manajemen aset |
| Marketing | Promo, diskon, campaign |
| Analytics | Dashboard, laporan, statistik |
| User Management | Role, permission, staff |

## 4. Batasan Sistem

- Sistem tidak menyimpan file binary di database
- Storage provider harus replaceable
- Setiap request tervalidasi di server
- Semua data sensitif dienkripsi

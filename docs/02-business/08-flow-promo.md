# Flow Promo

## Alur Promo

`
Admin membuat promo
        ↓
Menentukan jenis promo:
  - Diskon persentase (%)
  - Diskon nominal (IDR)
  - Early bird
  - Last minute
  - Bundle / paket khusus
        ↓
Menentukan syarat & ketentuan:
  - Minimal pembelian
  - Periode berlaku
  - Kuota terbatas
  - Paket tertentu
        ↓
Promo ditampilkan di public website
        ↓
Promo otomatis diterapkan saat booking
        ↓
Monitoring penggunaan promo
`

## Aturan Promo

1. Promo dapat digabungkan (stackable) atau tidak
2. Promo memiliki kuota maksimal penggunaan
3. Promo memiliki periode berlaku (start_date - end_date)
4. Promo dapat dibatasi untuk paket/kategori tertentu
5. Promo otomatis nonaktif setelah kuota habis atau periode berakhir

# Authorization & RBAC

## Role Model

STMS menggunakan **RBAC (Role-Based Access Control)**.

### Roles

| Role | Level | Deskripsi |
|------|-------|-----------|
| SUPER_ADMIN | 100 | Akses penuh seluruh sistem |
| ADMIN | 80 | Manajemen operasional |
| FINANCE | 60 | Manajemen keuangan & pembayaran |
| MARKETING | 50 | Manajemen konten & promo |
| CS | 40 | Layanan jamaah & booking |
| MUTHOWIF | 30 | Tour leader / pembimbing |
| OWNER | 99 | Pemilik bisnis (read-only sensitive) |

### Permission Check Flow

`
Request ke resource
        ↓
Middleware memeriksa session
        ↓
Service memeriksa role permission
        ↓
Jika tidak memiliki akses → 403 Forbidden
Jika memiliki akses → lanjut ke business logic
`

## Implementation

- Permission disimpan di database (tabel Role & Permission)
- Setiap action di service layer memeriksa permission
- Frontend menyembunyikan tombol/route yang tidak diizinkan
- Backend tetap memvalidasi (defense in depth)

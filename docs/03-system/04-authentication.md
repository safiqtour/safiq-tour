# Deployment Architecture

## Infrastructure

`
┌─────────────────────────────────────┐
│           Vercel (Hosting)          │
│  ┌───────────────────────────────┐  │
│  │    Next.js 15 Application     │  │
│  │  (Edge + Serverless Functions)│  │
│  └───────────────────────────────┘  │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│        PostgreSQL (Production)      │
│     (Supabase / Neon / Render)      │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│         Object Storage              │
│  (Cloudinary / R2 / S3 / MinIO)     │
└─────────────────────────────────────┘
`

## Environment

| Environment | URL | Database | Storage |
|-------------|-----|----------|---------|
| Development | localhost:3000 | SQLite | Local / Cloudinary Dev |
| Staging | stg.safiqtour.com | PostgreSQL (Staging) | Cloudinary Staging |
| Production | safiqtour.com | PostgreSQL (Production) | Cloudinary Production |

## Deployment Flow

`
Push ke main branch
        ↓
GitHub Actions trigger
        ↓
Lint & Type Check
        ↓
Build
        ↓
Run Migration
        ↓
Deploy ke Vercel
`
"@ | Set-Content -Path "D:\test-safiq-iid\docs\03-system\03-deployment.md" -Encoding UTF8

@"
# Authentication Strategy

## Teknologi

Menggunakan **Auth.js v5** (formerly NextAuth.js) dengan prisma adapter.

## Flow Login

`
User memasukkan email & password
        ↓
Server memvalidasi kredensial
        ↓
Session dibuat (JWT / Database session)
        ↓
Cookie disimpan di browser
        ↓
Middleware membaca session untuk proteksi route
`

## Session Strategy

- **JWT Strategy** untuk production (stateless)
- **Database Strategy** opsional
- Session di-cookie dengan httpOnly, secure, sameSite

## Protected Routes

Semua route /admin/** diproteksi oleh middleware.

## Password Policy

- Hash: bcryptjs (salt rounds: 12)
- Minimal password: 8 karakter
- Kombinasi huruf dan angka (future)

## Future Enhancement

- OAuth (Google, Apple) untuk jamaah portal
- 2FA (Two Factor Authentication)
- Magic link login (tanpa password)

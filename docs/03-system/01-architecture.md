# System Architecture

**Version:** 1.0  
**Pattern:** Monolith Modular

---

## 1. Architecture Style

STMS menggunakan **Monolith Modular Architecture** — seluruh fitur dalam satu deployment, tetapi dipisahkan secara modular dalam kode.

### Alasan

- MVP lebih cepat dikembangkan
- Mudah dipelihara
- Tidak ada kompleksitas microservices
- Siap berkembang menjadi modular services di masa depan

## 2. High Level Architecture

`
                Internet
                    │
                    ▼
             Next.js 15 App Router
                    │
        ┌───────────┴───────────┐
        │                       │
 Public Website          Admin Dashboard
        │                       │
        └───────────┬───────────┘
                    │
             Server Actions / API Routes
                    │
               Service Layer
                    │
             Repository Layer
                    │
               Prisma ORM
                    │
           PostgreSQL Database
                    │
              Object Storage
        (Cloudinary / R2 / S3 / MinIO)
`

## 3. Clean Architecture

### Presentation Layer
- Tanggung jawab: UI, Layout, Form, Navigation
- DILARANG: Akses database, eksekusi SQL, business logic

### Application Layer
- Tanggung jawab: Use Cases, Business Logic, Validation Flow
- Middleware: validasi, otentikasi, otorisasi

### Domain Layer
- Tanggung jawab: Entity, Rules, Types
- Framework-independent

### Infrastructure Layer
- Tanggung jawab: Prisma, Storage, External Services

## 4. Layer Dependency

`
Allowed:         
UI → API → Service → Repository → Database

Forbidden:
UI → Repository (bypass service)
UI → Prisma (bypass semua)
Service → UI Component
Repository → UI Component
`

## 5. Rendering Strategy

| Halaman | Strategy |
|---------|----------|
| Landing | Static Rendering |
| Package List | Server Rendering (ISR optional) |
| Package Detail | Server Rendering |
| Blog | Static Rendering (ISR) |
| Dashboard | Dynamic Rendering |
| Admin Pages | Dynamic Rendering |

## 6. Scalability Roadmap

| Phase | Arsitektur |
|-------|-----------|
| Phase 1 | Monolith (single deployment) |
| Phase 2 | Monolith + Background Jobs |
| Phase 3 | Extract API Services |
| Phase 4 | Separate Admin & Public |
| Phase 5 | Microservices (jika diperlukan) |

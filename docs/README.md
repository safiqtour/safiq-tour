# STMS — Safiq Tour Management System

**Version:** 1.0.0  
**Status:** Foundation Planning (Sprint 0)  

---

## Visi

Menjadi platform enterprise terdepan untuk pengelolaan operasional travel umroh yang terintegrasi, modular, dan siap berkembang.

## Misi

- Menyediakan sistem manajemen travel umroh end-to-end
- Memberikan pengalaman digital terbaik bagi jamaah dan operator
- Membangun arsitektur yang scalable, maintainable, dan vendor-independent

---

## Arsitektur

`
┌─────────────────────────────────────────────────────┐
│                   Internet                           │
└──────────────────┬──────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────┐
│              Next.js 15 App Router                   │
├──────────────────┬──────────────────────────────────┤
│   Public Website │      Admin Dashboard              │
├──────────────────┴──────────────────────────────────┤
│               Server Actions / API Routes            │
├─────────────────────────────────────────────────────┤
│                  Service Layer                       │
├─────────────────────────────────────────────────────┤
│                 Repository Layer                     │
├─────────────────────────────────────────────────────┤
│                  Prisma ORM                          │
├─────────────────────────────────────────────────────┤
│                PostgreSQL Database                   │
└─────────────────────────────────────────────────────┘
`

## Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (Strict Mode) |
| Styling | Tailwind CSS 4 + Shadcn/ui |
| Database | PostgreSQL + Prisma ORM |
| Authentication | Auth.js (NextAuth v5) |
| Storage | Cloudinary / UploadThing + R2/S3 abstraction |
| Animation | Framer Motion |
| Validation | Zod |
| Deployment | Vercel |

---

## Cara Menjalankan Project

`ash
git clone <repo-url>
cd stms
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
`

---

## Folder Structure

`
stms/
├── docs/                        # Dokumentasi proyek
├── src/
│   ├── app/                     # Next.js App Router pages
│   ├── components/              # UI components
│   ├── features/                # Feature modules
│   ├── services/                # Business logic layer
│   ├── repositories/            # Database access layer
│   ├── validations/             # Zod schemas
│   ├── lib/                     # Utilities & configurations
│   ├── hooks/                   # Custom React hooks
│   └── types/                   # TypeScript type definitions
├── prisma/                      # Database schema & seed
└── public/                      # Static assets
`

---

## Roadmap

| Sprint | Tema |
|--------|------|
| Sprint 0 | Foundation & Documentation |
| Sprint 1 | Authentication & Dashboard |
| Sprint 2 | Master Data Management |
| Sprint 3 | Package Management |
| Sprint 4 | CMS |
| Sprint 5 | Media Library |
| Sprint 6 | Booking System |
| Sprint 7 | Pilgrim Management |
| Sprint 8 | Finance & Payment |
| Sprint 9 | Marketing & Promo |
| Sprint 10 | Analytics |
| Sprint 11 | Mobile Admin |

---

## Prinsip Arsitektur

1. Single Responsibility
2. Separation of Concerns
3. Dependency Inversion
4. Composition over Inheritance
5. Convention over Configuration
6. Anti Vendor Lock-in
7. Build MVP First, Scale Later

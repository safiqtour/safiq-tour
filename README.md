# STMS — Safiq Tour Management System

**Version:** 1.0.0  
**Status:** Foundation Phase (Sprint 0)  

## Visi

Platform enterprise untuk mengelola seluruh operasional travel umroh — terintegrasi, modular, dan siap berkembang.

## Tech Stack

Next.js 15 · TypeScript · Tailwind CSS 4 · Shadcn/ui · Prisma · PostgreSQL · Auth.js · Cloudinary · Framer Motion · Vercel

## Quick Start

```bash
npm install
cp .env.example .env
npx prisma migrate dev
npx prisma db seed
npm run dev
```

## Project Structure

```
src/
├── app/              # Next.js App Router
├── components/       # UI & shared components
├── features/         # Feature modules (auth, packages, booking, etc.)
├── services/         # Business logic
├── repositories/     # Database access
├── validations/      # Zod schemas
├── lib/              # Utilities & configs
├── hooks/            # Custom React hooks
└── types/            # TypeScript definitions
```

## Documentation

Detailed documentation is in the [docs/](docs/) folder.

## Roadmap

| Sprint | Focus |
|--------|-------|
| 0 | Foundation & Documentation |
| 1 | Authentication & Dashboard |
| 2 | Master Data |
| 3 | Package Management |
| 4 | CMS |
| 5 | Media Library |
| 6 | Booking |
| 7 | Pilgrim |
| 8 | Finance |
| 9 | Marketing |
| 10 | Analytics |
| 11 | Mobile Admin |

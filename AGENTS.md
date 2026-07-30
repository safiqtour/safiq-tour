# AGENTS.md — STMS Development Rules

This project follows **STMS (Safiq Tour Management System)** blueprint.

## Critical Rules

1. **Read blueprint first** — All documentation is in `docs/` folder
2. **Layer architecture** — UI → Service → Repository → Database (never bypass)
3. **No direct DB access** from React components
4. **All business logic** in Service layer
5. **All data access** in Repository layer
6. **Validate with Zod** on every server action
7. **Permission check** on every admin action
8. **No binary data** in PostgreSQL
9. **Storage provider** must be replaceable

## Reference Order

Before coding any feature:
1. Read `docs/03-system/01-architecture.md`
2. Read `docs/04-database/` relevant ERD
3. Read `docs/05-api/` relevant API contract
4. Read `docs/07-development/` for conventions

## Architecture Flow

```
UI (Server/Client Component)
  ↓ (Server Action / API Route)
Service Layer (Business Logic)
  ↓
Repository Layer (Prisma Access)
  ↓
Database (PostgreSQL)
```

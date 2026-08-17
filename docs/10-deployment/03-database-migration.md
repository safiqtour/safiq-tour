# Deployment — Database Migration

## Tool
Prisma Migrate

## Workflow

### Development
```
npx prisma migrate dev --name add-booking-table
```
- Auto-applies migration
- Generates Prisma Client

### Staging / Production
```
npx prisma migrate deploy
```
- Only applies pending migrations
- No schema generation (already in build)

### Migration Files
- Stored in prisma/migrations/
- Versioned in git
- Never edit manually after creation

## Rules
1. Always create migration through Prisma (not manual SQL)
2. Review migration SQL before deploying
3. Never modify production database directly
4. Backup before migration in production
5. One migration per schema change

## Seed Data
```
npx prisma db seed
```
- Seeds: default admin user, master data, sample packages
- Run in development and staging only
- Never run seed in production

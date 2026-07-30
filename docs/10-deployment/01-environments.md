# Deployment — Environments

## Environment Matrix

| Environment | URL | Database | Storage | Purpose |
|-------------|-----|----------|---------|---------|
| Development | localhost:3000 | SQLite / Local PG | Local / Dev Cloudinary | Daily development |
| Staging | stg.safiqtour.com | PostgreSQL (Staging) | Cloudinary Staging | QA & UAT |
| Production | safiqtour.com | PostgreSQL (Production) | Cloudinary Production | Live |

## Development Environment
```
# .env.local
DATABASE_URL="file:./dev.db"  # SQLite for dev
# or
DATABASE_URL="postgresql://localhost:5432/stms_dev"

AUTH_SECRET="dev-secret"
NEXT_PUBLIC_BASE_URL="http://localhost:3000"

STORAGE_ENDPOINT="http://localhost:9000"   # MinIO
STORAGE_BUCKET="stms-dev"
STORAGE_ACCESS_KEY="minioadmin"
STORAGE_SECRET_KEY="minioadmin"
```

## Staging Environment
- Mirrors production configuration
- Uses separate Cloudinary account
- Database restored from production periodically
- No real user data

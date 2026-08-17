# Deployment Architecture

## Infrastructure
```
Vercel (Hosting)
  └── Next.js 15 Application (Edge + Serverless Functions)
        └── PostgreSQL (Supabase / Neon / Render)
              └── Object Storage (Cloudinary / R2 / S3 / MinIO)
```

## Environment
| Environment | URL | Database | Storage |
|-------------|-----|----------|---------|
| Development | localhost:3000 | SQLite | Local / Dev |
| Staging | stg.safiqtour.com | PostgreSQL (Staging) | Cloudinary Staging |
| Production | safiqtour.com | PostgreSQL (Production) | Cloudinary Production |

## Deployment Flow
```
Push ke main branch → GitHub Actions → Lint & Type Check → Build → Run Migration → Deploy ke Vercel
```

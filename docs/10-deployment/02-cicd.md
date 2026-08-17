# Deployment — CI/CD

## Platform
- Hosting: Vercel
- CI/CD: GitHub Actions + Vercel Git Integration

## Pipeline

### On Push to Feature/Fix Branch
```
Push → GitHub Actions
  ├── Lint (ESLint)
  ├── Type Check (tsc --noEmit)
  ├── Unit Tests (vitest)
  └── Build (next build)
```

### On Merge to main
```
Merge → GitHub Actions
  ├── Lint + Type Check + Tests
  ├── Build
  ├── Prisma Migrate (staging)
  ├── Deploy to Vercel Staging
  └── E2E Tests (if available)
```

### Production Deployment
```
Deploy Production
  ├── Prisma Migrate (production) - manual approval
  ├── Deploy to Vercel Production
  └── Health Check
```

## Vercel Configuration
- Framework Preset: Next.js
- Build Command: next build
- Output Directory: .next
- Node Version: 20.x

# Folder Structure

## Root Structure

`
stms/
├── .github/              # GitHub workflows & templates
├── .vscode/              # Editor settings
├── docs/                 # Project documentation
├── public/               # Static assets
├── content/              # MDX blog content
├── prisma/               # Prisma schema & migrations
├── scripts/              # Utility scripts
├── src/                  # Main application code
├── .env.example          # Environment template
├── next.config.ts        # Next.js configuration
├── tailwind.config.ts    # Tailwind configuration
├── tsconfig.json         # TypeScript configuration
└── package.json          # Dependencies
`

## src/ Structure

`
src/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public website routes
│   │   ├── about/
│   │   ├── blog/
│   │   ├── contact/
│   │   ├── gallery/
│   │   └── packages/
│   ├── admin/                    # Admin dashboard routes
│   │   ├── (dashboard)/
│   │   └── login/
│   ├── api/                      # API routes (if needed)
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
│
├── components/                   # Shared UI components
│   ├── ui/                       # Base UI (Shadcn)
│   └── shared/                   # Shared app components
│
├── features/                     # Feature modules
│   ├── auth/
│   ├── dashboard/
│   ├── packages/
│   ├── booking/
│   ├── pilgrims/
│   ├── payments/
│   ├── gallery/
│   ├── cms/
│   ├── marketing/
│   └── report/
│
├── services/                     # Business logic layer
├── repositories/                 # Database access layer
├── validations/                  # Zod schemas
├── lib/                          # Utilities & configs
│   ├── auth/
│   ├── prisma/
│   └── storage/
├── hooks/                        # Custom React hooks
├── constants/                    # App constants
└── types/                        # TypeScript types
`

## Feature Module Structure

Setiap fitur di eatures/ memiliki struktur sendiri:

`
features/packages/
├── components/          # Feature-specific components
├── actions/             # Server actions
├── services/            # Feature-specific services
├── repositories/        # Feature-specific repositories
├── validations/         # Feature-specific Zod schemas
├── types/               # Feature-specific types
└── hooks/               # Feature-specific hooks
`
"@ | Set-Content -Path "D:\test-safiq-iid\docs\03-system\06-folder-structure.md" -Encoding UTF8

@"
# Design Principles

## 1. Single Responsibility
Setiap modul, class, dan function memiliki satu tanggung jawab yang jelas.

## 2. Separation of Concerns
Layer dipisahkan secara ketat:
- UI Layer — hanya rendering & interaksi
- Service Layer — business logic murni
- Repository Layer — data access murni

## 3. Dependency Inversion
Bergantung pada abstraksi, bukan implementasi konkret. Repository interface dipisahkan dari Prisma.

## 4. Composition over Inheritance
Gunakan komposisi komponen React daripada inheritance class.

## 5. Convention over Configuration
Gunakan konvensi penamaan standar sehingga mengurangi konfigurasi manual.

## 6. Anti Vendor Lock-in
- Database menyimpan URL, bukan binary
- Storage provider harus replaceable
- Repository tidak bergantung pada storage SDK
- Business logic tidak bergantung pada provider

## 7. Security by Design
- Validasi di server (tidak hanya frontend)
- Setiap endpoint memeriksa otorisasi
- Input sanitization
- No sensitive data in client
- Password hashing

## 8. Build MVP First, Scale Later
- Fokus pada core value terlebih dahulu
- Hindari premature optimization
- Optimasi setelah validasi pasar

## 9. Defense in Depth
- Frontend validation (UX)
- Server validation (mandatory)
- Database constraints (last line)
- Audit logging (accountability)

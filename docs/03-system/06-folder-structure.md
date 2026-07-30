# Folder Structure

## Root Structure
```
stms/
├── .github/           # GitHub workflows
├── docs/              # Project documentation
├── public/            # Static assets
├── content/           # MDX blog content
├── prisma/            # Prisma schema & migrations
├── scripts/           # Utility scripts
└── src/               # Main application code
```

## src/ Structure
```
src/
├── app/               # Next.js App Router pages & layouts
│   ├── (public)/      # Public website routes
│   └── admin/         # Admin dashboard routes
├── components/        # Shared UI components
│   ├── ui/            # Shadcn base components
│   └── shared/        # Shared app components
├── features/          # Feature modules
│   ├── auth/
│   ├── booking/
│   ├── cms/
│   ├── dashboard/
│   ├── gallery/
│   ├── marketing/
│   ├── packages/
│   ├── payments/
│   ├── pilgrims/
│   └── report/
├── services/          # Business logic layer
├── repositories/      # Database access layer
├── validations/       # Zod schemas
├── lib/               # Utilities & configs
├── hooks/             # Custom React hooks
├── constants/         # App constants
└── types/             # TypeScript type definitions
```

## Feature Module Structure
```
features/packages/
├── components/        # Feature-specific components
├── actions/           # Server actions
├── services/          # Business logic
├── repositories/      # Data access
├── validations/       # Zod schemas
├── types/             # TypeScript types
└── hooks/             # Custom hooks
```

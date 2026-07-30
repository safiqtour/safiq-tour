# Coding Standard

## 1. TypeScript
- Strict mode enabled
- Explicit types for function parameters and return types
- Avoid ny. Use unknown if type is unknown
- Use interface for object types, 	ype for union/intersection
- Always const or let, never ar

## 2. Function Style
- Max ~40 lines per function
- Single responsibility
- Early return for error handling
- Avoid side effects in pure functions

## 3. Component Style
- Max ~200 lines per component
- Props typed with interface/type
- Server Component by default
- Client Component only when interactivity needed

## 4. Imports Order
`	ypescript
// 1. External libraries
import { useState } from "react"
// 2. Internal utilities
import { cn } from "@/lib/utils"
// 3. Components
import { Button } from "@/components/ui/button"
// 4. Types
import type { Package } from "@/types"
`

## 5. Export Style
- Named exports preferred (default export only for page/layout)

## 6. Error Handling
`	ypescript
async function createPackage(data: CreatePackageInput): Promise<ActionResult> {
  try {
    return { success: true, data: result }
  } catch (error) {
    return { success: false, message: "Failed to create package" }
  }
}
`
"@ | Set-Content -Path "D:\test-safiq-iid\docs\07-development\01-coding-standard.md" -Encoding UTF8

@"
# Folder Convention

## 1. Feature Module Structure
`
features/auth/
├── components/   # Feature-specific components
├── actions/      # Server actions
├── services/     # Business logic
├── repositories/ # Data access
├── validations/  # Zod schemas
└── types/        # TypeScript types
`

## 2. Shared vs Feature
- Shared components (used across features): src/components/shared/
- Feature components: src/features/{feature}/components/
- UI base components: src/components/ui/ (Shadcn)

## 3. File Naming
- Components: PascalCase (PackageCard.tsx)
- Hooks: camelCase with use prefix (usePackage.ts)
- Services: kebab-case (package.service.ts)
- Actions: kebab-case (create-package.ts)
- Validations: kebab-case (package.schema.ts)
- Types: kebab-case (package.types.ts)
- Repositories: kebab-case (package.repository.ts)

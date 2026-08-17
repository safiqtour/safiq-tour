# Validation Rules

## Library
Gunakan **Zod** untuk semua validasi.

## Where to Validate
| Layer | Validation | Mandatory |
|-------|-----------|-----------|
| Frontend | UX validation (optional) | No |
| Server Action | Input validation | Yes |
| Service | Business rule validation | Yes |
| Database | Constraints | Yes |

## Schema Structure
```
import { z } from "zod/v4"

export const createPackageSchema = z.object({
  title: z.string().min(3).max(200),
  excerpt: z.string().min(10).max(500),
  categoryId: z.string().uuid(),
  duration: z.number().int().min(1).max(90),
  price: z.number().int().min(0),
  currency: z.enum(["IDR", "USD", "SAR"]).default("IDR"),
  airline: z.string().min(2),
  quota: z.number().int().min(0),
  status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
})

export type CreatePackageInput = z.infer<typeof createPackageSchema>
```

## Common Patterns
```
const uuidSchema = z.string().uuid()
const phoneSchema = z.string().regex(/^62[0-9]{8,15}$/)
const emailSchema = z.string().email()
const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})
```

## Usage in Server Actions
```
export async function createPackage(formData: FormData) {
  const parsed = createPackageSchema.safeParse(Object.fromEntries(formData))
  if (!parsed.success) {
    return { success: false, errors: parsed.error.flatten() }
  }
}
```

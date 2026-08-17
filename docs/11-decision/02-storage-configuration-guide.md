# Storage Provider — Configuration Guide

**Sprint:** 2D.2.1 · **Layer:** Infrastructure (`src/providers/storage/`)

---

## 1. Environment Variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `STORAGE_PROVIDER` | No | `local` | `local` or `supabase` |
| `SUPABASE_STORAGE_BUCKET` | If `supabase` | — | Storage bucket name (no hardcoded values) |
| `NEXT_PUBLIC_SUPABASE_URL` | If `supabase` | — | Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | If `supabase` | — | Service role key (admin operations) |

```bash
# Development
STORAGE_PROVIDER="local"

# Production (Supabase)
STORAGE_PROVIDER="supabase"
SUPABASE_STORAGE_BUCKET="stms"
```

---

## 2. Provider Selection

The `StorageFactory` reads `STORAGE_PROVIDER`:

```ts
import { createStorageProvider } from "@/providers/storage"

const storage = createStorageProvider() // uses STORAGE_PROVIDER env
const storage = createStorageProvider({ provider: "supabase" }) // explicit
```

---

## 3. Local Provider

- Root: `public/uploads/`
- Public URLs: `/uploads/<path>`
- `createSignedUrl` returns the public URL (no signing — development only).
- Path traversal outside the root is rejected.

---

## 4. Supabase Provider

- Uses `@supabase/supabase-js` with the **service role key** (bypasses RLS for
  admin operations).
- Bucket name comes **only** from `SUPABASE_STORAGE_BUCKET`.
- Folder support uses the `.emptyFolderPlaceholder` convention.
- `deleteFolder` recursively removes all objects under the prefix.

### Provisioning the bucket

The bucket is NOT created automatically. Create it once (public for public
media, private for protected files):

```ts
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

await supabase.storage.createBucket(process.env.SUPABASE_STORAGE_BUCKET!, {
  public: true,
})
```

Or via the Supabase Dashboard → Storage → New bucket.

---

## 5. Health Check

```ts
import { runStorageHealthCheck, storage } from "@/providers/storage"

const result = await runStorageHealthCheck(storage)
// { provider, ok, checks: [{ name, ok, message }] }
```

Checks: provider loaded → bucket exists → upload → public/signed URL →
delete. `ok` is `true` only when every check passes.

---

## 6. Adding a New Provider

1. Implement `StorageProvider` from `src/providers/storage/types.ts`.
2. Add `createXxxStorageProvider()` in `src/providers/storage/`.
3. Register the name in `factory.ts`.
4. Run the health check to verify.
